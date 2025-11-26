import mongoose, { Schema, Document } from "mongoose";
import { ItemCategory, ITEM_CATEGORIES } from "@/types/types";

interface IPhotoMetadata {
	url: string;
	publicId: string;
	cloudinaryId: string;
	format: string;
	size: number;
	width: number;
	height: number;
	uploaded_at: Date;
	version?: number;
	signature?: string;
	etag?: string;
	resourceType: "image" | "video" | "raw" | "auto";
}

export interface IItems extends Document {
	user_id: mongoose.Schema.Types.ObjectId; // User who posted this item
	name: string;
	description: string;
	category: ItemCategory; // Electronics, Personal Items, etc.
	type: "lost" | "found"; // Whether this is a lost or found item
	status: "pending" | "active" | "claimed" | "rejected" | "removed"; // Item status
	location: string;
	date_lost_or_found: Date; // When the item was lost or found
	matched: number;
	views: number; // Number of times item has been viewed
	photos: IPhotoMetadata[]; // Multiple photos support
	contact_info?: {
		phone?: string;
		email?: string;
		show_email?: boolean;
		show_phone?: boolean;
	};
	claimed_by?: mongoose.Schema.Types.ObjectId; // User who claimed the item
	claimed_at?: Date; // When the item was claimed
	created_at: Date;
	updated_at: Date;
}

const ItemsSchema = new Schema<IItems>({
	name: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	category: {
		type: String,
		required: true,
		enum: ITEM_CATEGORIES,
	},
	type: {
		type: String,
		required: true,
		enum: ["lost", "found"],
	},
	status: {
		type: String,
		required: true,
		enum: ["pending", "active", "claimed", "rejected", "removed"],
		default: "pending",
	},
	location: { type: String, required: true, trim: true },
	date_lost_or_found: { type: Date, required: true },
	matched: { type: Number, default: 0 },
	views: { type: Number, default: 0 },
	photos: {
		type: [
			{
				url: String,
				publicId: String,
				cloudinaryId: String,
				format: String,
				size: Number,
				width: Number,
				height: Number,
				uploaded_at: Date,
				resourceType: {
					type: String,
					enum: ["image", "video", "raw", "auto"],
				},
			},
		],
		default: [],
		validate: [(val: any[]) => val.length <= 5, "Cannot upload more than 5 photos"],
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	contact_info: {
		phone: { type: String, trim: true },
		email: { type: String, trim: true, lowercase: true },
		show_email: { type: Boolean, default: false },
		show_phone: { type: Boolean, default: false },
	},
	claimed_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},
	claimed_at: { type: Date, default: null },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

ItemsSchema.index({ user_id: 1, created_at: -1 });
ItemsSchema.index({ type: 1, status: 1, created_at: -1 });
ItemsSchema.index({ category: 1, status: 1 });
ItemsSchema.index({ location: 1, status: 1 });
ItemsSchema.index({ status: 1, date_lost_or_found: -1 });

ItemsSchema.index({ name: "text", description: "text", location: "text" });

export default mongoose.models.Items || mongoose.model<IItems>("Items", ItemsSchema);
