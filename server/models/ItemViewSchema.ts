import mongoose, { Schema, Document } from "mongoose";

export interface IItemView extends Document {
	item_id: mongoose.Schema.Types.ObjectId;
	user_id: mongoose.Schema.Types.ObjectId;
	viewed_at: Date;
}

const ItemViewSchema = new Schema<IItemView>(
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
		viewed_at: { type: Date, default: Date.now },
	},
	{
		collection: "item_views",
		timestamps: false,
	}
);

// Compound index to ensure one view per user per item
ItemViewSchema.index({ item_id: 1, user_id: 1 }, { unique: true });
ItemViewSchema.index({ item_id: 1 });
ItemViewSchema.index({ user_id: 1 });

export default mongoose.models.ItemView ||
	mongoose.model<IItemView>("ItemView", ItemViewSchema);

