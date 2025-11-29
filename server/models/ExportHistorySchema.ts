import mongoose, { Schema, Document } from "mongoose";

export interface IExportHistory extends Document {
	admin_id: mongoose.Schema.Types.ObjectId;
	type: "items" | "users" | "activity";
	format: "csv" | "json";
	record_count: number;
	status: "success" | "failed";
	error_message?: string;
	created_at: Date;
}

const ExportHistorySchema = new Schema<IExportHistory>(
	{
		admin_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["items", "users", "activity"],
		},
		format: {
			type: String,
			required: true,
			enum: ["csv", "json"],
		},
		record_count: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			required: true,
			enum: ["success", "failed"],
		},
		error_message: {
			type: String,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: "export_history",
	}
);

ExportHistorySchema.index({ admin_id: 1, created_at: -1 });
ExportHistorySchema.index({ created_at: -1 });

export default mongoose.models.ExportHistory || mongoose.model<IExportHistory>("ExportHistory", ExportHistorySchema);
