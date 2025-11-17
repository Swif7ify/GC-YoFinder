import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
	user_id: mongoose.Schema.Types.ObjectId; // User who receives the notification
	type: "message" | "match" | "claim" | "item_update"; // Type of notification
	title: string;
	message: string;
	related_item_id?: mongoose.Schema.Types.ObjectId; // Optional reference to the item
	related_conversation_id?: mongoose.Schema.Types.ObjectId; // Optional reference to the conversation
	related_user_id?: mongoose.Schema.Types.ObjectId; // Optional reference to another user (e.g., sender)
	is_read: boolean;
	read_at?: Date;
	created_at: Date;
}

const NotificationSchema = new Schema<INotification>(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["message", "match", "claim", "item_update"],
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		related_item_id: {
			type: Schema.Types.ObjectId,
			ref: "Items",
			default: null,
		},
		related_conversation_id: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			default: null,
		},
		related_user_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		is_read: {
			type: Boolean,
			default: false,
		},
		read_at: {
			type: Date,
			default: null,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: "notifications",
		timestamps: false,
	}
);

// Indexes for faster queries
NotificationSchema.index({ user_id: 1, is_read: 1 });
NotificationSchema.index({ user_id: 1, created_at: -1 });
NotificationSchema.index({ related_conversation_id: 1 });

export default mongoose.models.Notification ||
	mongoose.model<INotification>("Notification", NotificationSchema);

