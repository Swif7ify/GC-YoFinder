import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
	participants: mongoose.Schema.Types.ObjectId[]; // Array of user IDs
	item_id?: mongoose.Schema.Types.ObjectId; // Optional reference to the item being discussed
	last_message?: mongoose.Schema.Types.ObjectId; // Reference to the last message
	last_message_at?: Date;
	unread_count: {
		user_id: mongoose.Schema.Types.ObjectId;
		count: number;
	}[];
	created_at: Date;
	updated_at: Date;
}

const ConversationSchema = new Schema<IConversation>(
	{
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		item_id: {
			type: Schema.Types.ObjectId,
			ref: "Items",
			default: null,
		},
		last_message: {
			type: Schema.Types.ObjectId,
			ref: "Message",
			default: null,
		},
		last_message_at: {
			type: Date,
			default: null,
		},
		unread_count: [
			{
				user_id: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				count: {
					type: Number,
					default: 0,
				},
			},
		],
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now },
	},
	{
		collection: "conversations",
		timestamps: false,
	}
);

// Index for faster queries
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ item_id: 1 });
ConversationSchema.index({ last_message_at: -1 });

export default mongoose.models.Conversation ||
	mongoose.model<IConversation>("Conversation", ConversationSchema);

