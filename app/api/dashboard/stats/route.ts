import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { getUserStats } from "@/server/handlers/DashboardHandlers";

export async function GET(request: NextRequest) {
	try {
		const user = await getUserFromRequest(request);
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const userID = user.userID;
		if (!userID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const response = await getUserStats(userID);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (response.status.remarks !== "success") return NextResponse.json({ error: message }, { status: statusCode });

		return NextResponse.json({ data: response.payload, message }, { status: statusCode });
	} catch (error) {
		console.error("Error in GET /api/dashboard/stats:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
