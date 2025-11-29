import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { connectToDatabase } from "@/server/lib/mongodb";
import UserSchema from "@/server/models/UserSchema";
import ExportHistorySchema from "@/server/models/ExportHistorySchema";

export async function GET(request: NextRequest) {
	try {
		const user = await getUserFromRequest(request);
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const userID = user.userID;
		if (!userID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		await connectToDatabase();

		// Verify admin role
		const adminUser = await UserSchema.findById(userID);
		if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "superadmin")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Get recent export history
		const history = await ExportHistorySchema.find()
			.populate("admin_id", "firstname lastname username")
			.sort({ created_at: -1 })
			.limit(20)
			.lean();

		const formattedHistory = history.map((item: any) => ({
			id: item._id.toString(),
			type: item.type,
			format: item.format,
			record_count: item.record_count,
			status: item.status,
			error_message: item.error_message,
			admin_name: item.admin_id ? `${item.admin_id.firstname} ${item.admin_id.lastname}` : "Unknown",
			created_at: item.created_at,
		}));

		return NextResponse.json({ history: formattedHistory }, { status: 200 });
	} catch (error) {
		console.error("Error in GET /api/admin/export/history:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
