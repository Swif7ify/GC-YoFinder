import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import ConversationSchema from "@/server/models/ConversationSchema";
import MessageSchema from "@/server/models/MessageSchema";
import { connectToDatabase } from "@/server/lib/mongodb";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// GET: Get message notifications for the current user
export async function GET(request: NextRequest) {
	try {
		const user = await getUserFromRequest(request);
		if (!user)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);

		const userID = user.userID;
		if (!userID)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);

		await connectToDatabase();

		// Get all conversations for the user with unread messages
		const conversations = await ConversationSchema.find({
			participants: userID,
		})
			.populate("participants", "firstname lastname username photo")
			.populate("item_id", "name")
			.populate("last_message")
			.sort({ last_message_at: -1, updated_at: -1 })
			.lean();

		// Format notifications from conversations with unread messages
		const notifications: {
			id: string;
			title: string;
			message: string;
			time: string;
			isRead: boolean;
			conversationId?: string;
		}[] = [];

		for (const conv of conversations) {
			const unreadData = conv.unread_count.find(
				(u: any) => u.user_id.toString() === userID
			);
			const unreadCount = unreadData?.count || 0;

			if (unreadCount > 0 && conv.last_message) {
				const otherParticipant = conv.participants.find(
					(p: any) => p._id.toString() !== userID
				);
				const participantName = otherParticipant
					? `${otherParticipant.firstname} ${otherParticipant.lastname}`
					: "Someone";
				const itemName = conv.item_id
					? (conv.item_id as any).name
					: "an item";
				const lastMessageTime = (conv.last_message as any).created_at || conv.last_message_at;

				notifications.push({
					id: `msg-${conv._id.toString()}`,
					title: "New Message",
					message: `${participantName} sent you ${unreadCount} ${unreadCount === 1 ? "message" : "messages"} about ${itemName}`,
					time: lastMessageTime ? dayjs(lastMessageTime).fromNow() : "Recently",
					isRead: false,
					conversationId: conv._id.toString(),
				});
			}
		}

		// Sort by last_message_at (most recent first)
		notifications.sort((a, b) => {
			const convA = conversations.find((c: any) => c._id.toString() === a.conversationId?.replace("msg-", ""));
			const convB = conversations.find((c: any) => c._id.toString() === b.conversationId?.replace("msg-", ""));
			const timeA = convA?.last_message_at ? new Date(convA.last_message_at).getTime() : 0;
			const timeB = convB?.last_message_at ? new Date(convB.last_message_at).getTime() : 0;
			return timeB - timeA;
		});

		return NextResponse.json(
			{ notifications },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in GET /api/messages/notifications:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

