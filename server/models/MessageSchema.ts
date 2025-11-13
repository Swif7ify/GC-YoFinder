import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
	conversation_id: mongoose.Schema.Types.ObjectId;
	sender_id: mongoose.Schema.Types.ObjectId;
	content: string;
	read_by: mongoose.Schema.Types.ObjectId[]; // Array of user IDs who have read this message
	created_at: Date;
	updated_at: Date;
}

const MessageSchema = new Schema<IMessage>(
	{
		conversation_id: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		sender_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		read_by: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now },
	},
	{
		collection: "messages",
		timestamps: false,
	}
);

// Index for faster queries
MessageSchema.index({ conversation_id: 1, created_at: -1 });
MessageSchema.index({ sender_id: 1 });
MessageSchema.index({ created_at: -1 });

export default mongoose.models.Message ||
	mongoose.model<IMessage>("Message", MessageSchema);

