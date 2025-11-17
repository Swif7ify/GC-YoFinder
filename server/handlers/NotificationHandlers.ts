import NotificationSchema from "@/server/models/NotificationSchema";
import { connectToDatabase } from "@/server/lib/mongodb";
import {
	responsePayload,
	serverResponseError,
	userNotFoundError,
} from "@/server/utils/responsePayload";
import { ValidateStringField } from "@/server/utils/DataValitdation";
import UserSchema from "@/server/models/UserSchema";
import pusher from "@/server/config/pusher.config";

class NotificationHandlers {
	// Create a notification
	static async createNotification(
		userID: string,
		type: "message" | "match" | "claim" | "item_update",
		title: string,
		message: string,
		relatedItemID?: string,
		relatedConversationID?: string,
		relatedUserID?: string
	) {
		await connectToDatabase();
		try {
			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const notification = new NotificationSchema({
				user_id: userID,
				type,
				title,
				message,
				related_item_id: relatedItemID || null,
				related_conversation_id: relatedConversationID || null,
				related_user_id: relatedUserID || null,
				is_read: false,
			});

			await notification.save();

			// Trigger Pusher event for real-time notification
			const notificationData = {
				id: notification._id.toString(),
				type: notification.type,
				title: notification.title,
				message: notification.message,
				time: new Date(notification.created_at).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}),
				relativeTime: new Date(notification.created_at).toLocaleString(),
				isRead: notification.is_read,
				conversationId: relatedConversationID || null,
			};
			
			await pusher.trigger(`private-user-${userID}`, "new-notification", {
				notification: notificationData,
			});

			return responsePayload(
				notification,
				"success",
				"Notification created successfully",
				201
			);
		} catch (error) {
			console.error("Error creating notification:", error);
			return serverResponseError();
		}
	}

	// Get all notifications for a user
	static async getUserNotifications(userID: string) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID);
			if (!validateUserID)
				return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const notifications = await NotificationSchema.find({
				user_id: userID,
			})
				.populate("related_item_id", "name")
				.populate("related_user_id", "firstname lastname username photo")
				.sort({ created_at: -1 })
				.limit(50)
				.lean();

			// Format notifications for frontend
			const formattedNotifications = notifications.map((notif: any) => ({
				id: notif._id.toString(),
				title: notif.title,
				message: notif.message,
				time: new Date(notif.created_at).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}),
				relativeTime: new Date(notif.created_at).toLocaleString(),
				isRead: notif.is_read,
				type: notif.type,
				conversationId: notif.related_conversation_id
					? notif.related_conversation_id.toString()
					: null,
				itemId: notif.related_item_id
					? (notif.related_item_id as any)._id?.toString()
					: null,
			}));

			return responsePayload(
				formattedNotifications,
				"success",
				"Notifications retrieved successfully",
				200
			);
		} catch (error) {
			console.error("Error getting user notifications:", error);
			return serverResponseError();
		}
	}

	// Mark notification as read
	static async markNotificationAsRead(userID: string, notificationID: string) {
		await connectToDatabase();
		try {
			const validateFields = ValidateStringField(userID, notificationID);
			if (!validateFields)
				return responsePayload(
					null,
					"error",
					"Invalid user ID or notification ID",
					400
				);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const notification = await NotificationSchema.findOne({
				_id: notificationID,
				user_id: userID,
			});

			if (!notification)
				return responsePayload(
					null,
					"error",
					"Notification not found",
					404
				);

			notification.is_read = true;
			notification.read_at = new Date();
			await notification.save();

			return responsePayload(
				null,
				"success",
				"Notification marked as read",
				200
			);
		} catch (error) {
			console.error("Error marking notification as read:", error);
			return serverResponseError();
		}
	}

	// Mark all notifications as read
	static async markAllNotificationsAsRead(userID: string) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID);
			if (!validateUserID)
				return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			await NotificationSchema.updateMany(
				{ user_id: userID, is_read: false },
				{ is_read: true, read_at: new Date() }
			);

			return responsePayload(
				null,
				"success",
				"All notifications marked as read",
				200
			);
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
			return serverResponseError();
		}
	}

	// Get unread notification count
	static async getUnreadNotificationCount(userID: string) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID);
			if (!validateUserID)
				return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const count = await NotificationSchema.countDocuments({
				user_id: userID,
				is_read: false,
			});

			return responsePayload(
				{ count },
				"success",
				"Unread count retrieved successfully",
				200
			);
		} catch (error) {
			console.error("Error getting unread notification count:", error);
			return serverResponseError();
		}
	}
}

export const {
	createNotification,
	getUserNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	getUnreadNotificationCount,
} = NotificationHandlers;

