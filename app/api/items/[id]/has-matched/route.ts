import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { hasUserMatchedItem } from "@/server/handlers/ItemsHandlers";

// GET: Check if the current user has matched this item
export async function GET(
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

		const hasMatched = await hasUserMatchedItem(userID, itemID);

		return NextResponse.json(
			{ hasMatched },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in GET /api/items/[id]/has-matched:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

