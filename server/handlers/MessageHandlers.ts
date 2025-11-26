import UserSchema from "@/server/models/UserSchema";
import ConversationSchema from "@/server/models/ConversationSchema";
import MessageSchema from "@/server/models/MessageSchema";
import ItemsSchema from "@/server/models/ItemsSchema";
import { responsePayload, serverResponseError, userNotFoundError } from "@/server/utils/responsePayload";
import { ValidateStringField } from "@/server/utils/DataValitdation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/server/lib/mongodb";
import pusher from "@/server/config/pusher.config";
import { createNotification } from "./NotificationHandlers";

class MessageHandlers {
	// Get or create a conversation between two users (optionally about an item)
	static async getOrCreateConversation(userID: string, otherUserID: string, itemID?: string) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID, otherUserID);
			if (!validateUserID) return responsePayload(null, "error", "Invalid user IDs", 400);

			const user = await UserSchema.findById(userID);
			const otherUser = await UserSchema.findById(otherUserID);
			if (!user || !otherUser) return userNotFoundError();

			// Check if conversation already exists
			const existingConversation = await ConversationSchema.findOne({
				participants: { $all: [userID, otherUserID] },
				...(itemID ? { item_id: itemID } : { item_id: null }),
			}).populate("last_message");

			if (existingConversation) {
				const populated = await ConversationSchema.findById(existingConversation._id)
					.populate("participants", "firstname lastname username photo")
					.populate("item_id", "name photos")
					.lean();

				return responsePayload(populated, "success", "Conversation retrieved successfully", 200);
			}

			// Create new conversation
			const newConversation = new ConversationSchema({
				participants: [userID, otherUserID],
				item_id: itemID || null,
				unread_count: [
					{ user_id: userID, count: 0 },
					{ user_id: otherUserID, count: 0 },
				],
			});

			await newConversation.save();

			const populated = await ConversationSchema.findById(newConversation._id)
				.populate("participants", "firstname lastname username photo")
				.populate("item_id", "name photos")
				.lean();

			// Create notification for the other user about the new conversation
			if (itemID) {
				const item = await ItemsSchema.findById(itemID).lean();
				const itemName = item ? (item as any).name : "an item";
				const initiatorName = `${user.firstname} ${user.lastname}`;

				await createNotification(
					otherUserID,
					"message",
					"New Message",
					`${initiatorName} started a conversation about your item: ${itemName}`,
					itemID,
					newConversation._id.toString(),
					userID
				);
			}

			return responsePayload(populated, "success", "Conversation created successfully", 201);
		} catch (error) {
			console.error("Error in getOrCreateConversation:", error);
			return serverResponseError();
		}
	}

	// Get all conversations for a user
	static async getUserConversations(userID: string) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID);
			if (!validateUserID) return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const conversations = await ConversationSchema.find({
				participants: userID,
			})
				.populate("participants", "firstname lastname username photo")
				.populate("item_id", "name photos")
				.populate("last_message")
				.sort({ last_message_at: -1, updated_at: -1 })
				.lean();

			// Format conversations for frontend
			const formattedConversations = conversations.map((conv: any) => {
				const otherParticipant = conv.participants.find((p: any) => p._id.toString() !== userID);
				const unreadData = conv.unread_count.find((u: any) => u.user_id.toString() === userID);
				const lastMessage = conv.last_message;

				return {
					id: conv._id.toString(),
					name: otherParticipant
						? `${otherParticipant.firstname} ${otherParticipant.lastname}`
						: "Unknown User",
					subject: conv.item_id ? `Re: ${conv.item_id.name}` : "General Conversation",
					lastMessage: lastMessage?.content || "",
					time: lastMessage?.created_at
						? new Date(lastMessage.created_at).toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
								hour12: false,
						  })
						: "",
					unreadCount: unreadData?.count || 0,
					otherParticipant: otherParticipant,
					item: conv.item_id,
				};
			});

			return responsePayload(formattedConversations, "success", "Conversations retrieved successfully", 200);
		} catch (error) {
			console.error("Error in getUserConversations:", error);
			return serverResponseError();
		}
	}

	// Get messages for a conversation
	static async getConversationMessages(userID: string, conversationID: string, page = 1, limit = 50) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID, conversationID);
			if (!validateUserID) return responsePayload(null, "error", "Invalid user ID or conversation ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const conversation = await ConversationSchema.findById(conversationID);
			if (!conversation) return responsePayload(null, "error", "Conversation not found", 404);

			// Check if user is a participant
			if (!conversation.participants.includes(userID as any))
				return responsePayload(null, "error", "Unauthorized access to conversation", 403);

			page = Math.max(1, Number(page) || 1);
			limit = Math.max(1, Math.min(100, Number(limit) || 50));

			const messages = await MessageSchema.find({
				conversation_id: conversationID,
			})
				.populate("sender_id", "firstname lastname username photo")
				.sort({ created_at: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean();

			// Format messages for frontend
			const formattedMessages = messages.reverse().map((msg: any) => ({
				id: msg._id.toString(),
				senderId: msg.sender_id._id.toString(),
				senderName:
					msg.sender_id._id.toString() === userID
						? "You"
						: `${msg.sender_id.firstname} ${msg.sender_id.lastname}`,
				content: msg.content,
				timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}),
				isOwn: msg.sender_id._id.toString() === userID,
			}));

			return responsePayload(formattedMessages, "success", "Messages retrieved successfully", 200);
		} catch (error) {
			console.error("Error in getConversationMessages:", error);
			return serverResponseError();
		}
	}

	// Send a message
	static async sendMessage(userID: string, conversationID: string, content: string) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateUserID = ValidateStringField(userID, conversationID, content);
			if (!validateUserID) return responsePayload(null, "error", "Invalid input data", 400);

			if (!content.trim()) return responsePayload(null, "error", "Message content cannot be empty", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const conversation = await ConversationSchema.findById(conversationID);
			if (!conversation) return responsePayload(null, "error", "Conversation not found", 404);

			// Check if user is a participant
			if (!conversation.participants.includes(userID as any))
				return responsePayload(null, "error", "Unauthorized access to conversation", 403);

			session.startTransaction();

			// Create message
			const newMessage = new MessageSchema({
				conversation_id: conversationID,
				sender_id: userID,
				content: content.trim(),
				read_by: [userID], // Sender has read their own message
			});

			await newMessage.save({ session });

			// Update conversation
			conversation.last_message = newMessage._id;
			conversation.last_message_at = new Date();
			conversation.updated_at = new Date();

			// Update unread count for other participants
			const otherParticipants = conversation.participants
				.filter((p: any) => p.toString() !== userID)
				.map((p: any) => p.toString());

			// Ensure unread_count entries exist for all participants
			for (const participant of conversation.participants) {
				const participantId = (participant as any).toString();
				const existingUnread = conversation.unread_count.find(
					(u: any) => u.user_id.toString() === participantId
				);
				if (!existingUnread) {
					conversation.unread_count.push({
						user_id: participant as any,
						count: 0,
					});
				}
			}

			// Update unread count: reset for sender (they're viewing/sending), increment for others
			conversation.unread_count = conversation.unread_count.map((u: any) => {
				const odUserId = u.user_id.toString();
				if (odUserId === userID) {
					// Reset unread count for sender (they're actively in the conversation)
					return { ...u, count: 0 };
				} else if (otherParticipants.includes(odUserId)) {
					// Increment unread count for other participants
					return { ...u, count: (u.count || 0) + 1 };
				}
				return u;
			});

			await conversation.save({ session });

			await session.commitTransaction();

			// Create notification for other participants if this is the first message
			const messageCount = await MessageSchema.countDocuments({
				conversation_id: conversationID,
			});

			if (messageCount === 1 && conversation.item_id) {
				// First message in conversation - notify the other participant
				const item = await ItemsSchema.findById(conversation.item_id).lean();
				const itemName = item ? (item as any).name : "an item";
				const senderName = `${user.firstname} ${user.lastname}`;

				for (const participantID of otherParticipants) {
					await createNotification(
						participantID.toString(),
						"message",
						"New Message",
						`${senderName} sent you a message about ${itemName}`,
						conversation.item_id.toString(),
						conversationID,
						userID
					);
				}
			}

			// Populate message for Pusher
			const populatedMessageDoc = await MessageSchema.findById(newMessage._id)
				.populate("sender_id", "firstname lastname username photo")
				.lean();

			const populatedMessage = populatedMessageDoc as any;

			// Trigger Pusher event for real-time updates
			// Only send to other participants, not the sender (they already have the message)
			const channelName = `conversation-${conversationID}`;
			const senderIdStr = populatedMessage.sender_id._id.toString();

			await pusher.trigger(channelName, "new-message", {
				message: {
					id: populatedMessage._id.toString(),
					senderId: senderIdStr,
					senderName: `${populatedMessage.sender_id.firstname} ${populatedMessage.sender_id.lastname}`,
					content: populatedMessage.content,
					timestamp: new Date(populatedMessage.created_at).toLocaleTimeString("en-US", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					}),
					isOwn: false, // This will be set correctly on the client side
				},
			});

			// Also trigger conversation update for both participants
			// This will update the unread count in real-time
			for (const participant of conversation.participants) {
				await pusher.trigger(`private-user-${participant}`, "conversation-updated", {
					conversationId: conversationID,
				});
				// Trigger unread count update for both sender and recipient
				// Sender's count should be 0 (they're viewing), recipient's should increment
				await pusher.trigger(`private-user-${participant}`, "unread-count-updated", {});
			}

			const formattedMessage = {
				id: populatedMessage._id.toString(),
				senderId: populatedMessage.sender_id._id.toString(),
				senderName: "You",
				content: populatedMessage.content,
				timestamp: new Date(populatedMessage.created_at).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}),
				isOwn: true,
			};

			return responsePayload(formattedMessage, "success", "Message sent successfully", 201);
		} catch (error) {
			await session.abortTransaction();
			console.error("Error in sendMessage:", error);
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	// Mark messages as read
	static async markMessagesAsRead(userID: string, conversationID: string) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateUserID = ValidateStringField(userID, conversationID);
			if (!validateUserID) return responsePayload(null, "error", "Invalid user ID or conversation ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const conversation = await ConversationSchema.findById(conversationID);
			if (!conversation) return responsePayload(null, "error", "Conversation not found", 404);

			// Check if user is a participant
			if (!conversation.participants.includes(userID as any))
				return responsePayload(null, "error", "Unauthorized access to conversation", 403);

			session.startTransaction();

			// Mark all unread messages as read
			await MessageSchema.updateMany(
				{
					conversation_id: conversationID,
					sender_id: { $ne: userID },
					read_by: { $ne: userID },
				},
				{
					$addToSet: { read_by: userID },
				},
				{ session }
			);

			// Reset unread count for this user
			conversation.unread_count = conversation.unread_count.map((u: any) => {
				if (u.user_id.toString() === userID) {
					return { ...u, count: 0 };
				}
				return u;
			});

			await conversation.save({ session });

			await session.commitTransaction();

			// Trigger conversation update for the user who marked messages as read
			await pusher.trigger(`private-user-${userID}`, "conversation-updated", {
				conversationId: conversationID,
			});
			// Also trigger unread count update
			await pusher.trigger(`private-user-${userID}`, "unread-count-updated", {});

			return responsePayload(null, "success", "Messages marked as read", 200);
		} catch (error) {
			await session.abortTransaction();
			console.error("Error in markMessagesAsRead:", error);
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}
}

export const {
	getOrCreateConversation,
	getUserConversations,
	getConversationMessages,
	sendMessage,
	markMessagesAsRead,
} = MessageHandlers;
