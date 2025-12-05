import { NextRequest, NextResponse } from "next/server";
import { getUserRecentActivity } from "@/server/handlers/DashboardHandlers";
import { getUserFromRequest } from "@/services/Access";

export async function GET(request: NextRequest) {
	try {
		const user = await getUserFromRequest(request);
		if (!user)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);

		const userID = user.userID;
		if (!userID)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);

		const url = new URL(request.url);
		const limit = url.searchParams.get("limit");

		const response = await getUserRecentActivity(
			userID,
			Number(limit) || 5
		);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ data: response.payload },
			{ status: statusCode }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
