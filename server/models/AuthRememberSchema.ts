import mongoose, { Schema, Document } from "mongoose";

export interface IAuthRemember extends Document {
	userID: mongoose.Types.ObjectId;
	selector: string;
	token_hash: string;
	expiry: Date;
	created_at: Date;
	updated_at: Date;
}

const AuthRememberSchema = new Schema<IAuthRemember>({
	userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	selector: { type: String, required: true },
	token_hash: { type: String, required: true },
	expiry: { type: Date, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

AuthRememberSchema.index({ selector: 1 });
AuthRememberSchema.index({ userID: 1, expiry: 1 });
AuthRememberSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.AuthRemember || mongoose.model<IAuthRemember>("AuthRemember", AuthRememberSchema);
