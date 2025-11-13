import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { trackItemView } from "@/server/handlers/ItemsHandlers";

// POST: Track an item view
export async function POST(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
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

		const params = await context.params;
		const itemID = params.id;

		const response = await trackItemView(userID, itemID);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		// Return the updated item with the new view count
		return NextResponse.json(
			{ 
				message: "View tracked successfully",
				item: response.payload 
			},
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in POST /api/items/[id]/view:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

