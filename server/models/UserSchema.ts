import mongoose, { Schema, Document } from "mongoose";

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

export interface IUser extends Document {
	username: string;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	phone: string;
	photo: IPhotoMetadata;
	is_online: boolean;
	role: string;
	session_id?: string;
	created_at: Date;
	updated_at: Date;
}

const UserSchema = new Schema<IUser>(
	{
		username: { type: String, unique: true, sparse: true },
		firstname: { type: String, default: null },
		lastname: { type: String, default: null },
		email: {
			type: String,
			unique: true,
			sparse: true,
		},
		password: { type: String, default: null, select: false },
		phone: { type: String, default: null },
		photo: {
			type: Object,
			default: {
				url: "",
				publicId: "",
				cloudinaryId: "",
				format: "",
				size: 0,
				width: 0,
				height: 0,
				uploaded_at: new Date(),
				resourceType: "image",
			},
		},
		session_id: { type: String, default: null },
		is_online: { type: Boolean, default: false },
		role: {
			type: String,
			default: "student",
			enum: ["student", "admin"],
		},

		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now },
	},
	{
		discriminatorKey: "role", // use role as discriminator
		collection: "users",
		timestamps: false,
	}
);

UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User ||
	mongoose.model<IUser>("User", UserSchema);
