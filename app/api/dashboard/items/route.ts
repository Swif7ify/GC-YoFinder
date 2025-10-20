import { NextRequest, NextResponse } from "next/server";
import { getAllItems } from "@/server/handlers/DashboardHandlers";
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
		const page = url.searchParams.get("page");
		const limit = url.searchParams.get("limit");
		const searchQuery = url.searchParams.get("searchQuery");
		const type = url.searchParams.get("type");
		const status = url.searchParams.get("status");
		const category = url.searchParams.get("category");
		const location = url.searchParams.get("location");

		const filters: any = {};
		if (searchQuery) filters.searchQuery = searchQuery;
		if (type) filters.type = type;
		if (status) filters.status = status;
		if (category) filters.category = category;
		if (location) filters.location = location;

		const response = await getAllItems(
			userID,
			Number(page) || 1,
			Number(limit) || 10,
			Object.keys(filters).length > 0 ? filters : undefined
		);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(response.payload, { status: statusCode });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
