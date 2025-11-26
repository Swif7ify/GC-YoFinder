import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { getAllUsers } from "@/server/handlers/AdminHandlers";

export async function GET(request: NextRequest) {
	try {
		const user = await getUserFromRequest(request);
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const userID = user.userID;
		if (!userID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "20");
		const search = url.searchParams.get("search") || undefined;

		const response = await getAllUsers(page, limit, search);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (response.status.remarks !== "success") return NextResponse.json({ error: message }, { status: statusCode });

		return NextResponse.json(
			{
				users: response.payload.users,
				pagination: response.payload.pagination,
				message,
			},
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in GET /api/admin/users:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
