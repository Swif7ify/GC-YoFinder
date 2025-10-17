import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	phone: string;
	is_online: boolean;
	role: string;
	created_at: Date;
	updated_at: Date;
}

const UserSchema = new Schema<IUser>(
	{
		firstname: { type: String, default: null },
		lastname: { type: String, default: null },
		email: {
			type: String,
			unique: true,
			sparse: true,
		},
		password: { type: String, default: null, select: false },
		phone: { type: String, default: null },
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
