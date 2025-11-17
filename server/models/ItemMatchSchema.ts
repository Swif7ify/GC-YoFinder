import mongoose, { Schema, Document } from "mongoose";

export interface IItemMatch extends Document {
	item_id: mongoose.Schema.Types.ObjectId;
	user_id: mongoose.Schema.Types.ObjectId;
	matched_at: Date;
}

const ItemMatchSchema = new Schema<IItemMatch>(
	{
		item_id: {
			type: Schema.Types.ObjectId,
			ref: "Items",
			required: true,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		matched_at: { type: Date, default: Date.now },
	},
	{
		collection: "item_matches",
		timestamps: false,
	}
);

// Compound index to ensure one match per user per item
ItemMatchSchema.index({ item_id: 1, user_id: 1 }, { unique: true });
ItemMatchSchema.index({ item_id: 1 });
ItemMatchSchema.index({ user_id: 1 });

export default mongoose.models.ItemMatch ||
	mongoose.model<IItemMatch>("ItemMatch", ItemMatchSchema);

