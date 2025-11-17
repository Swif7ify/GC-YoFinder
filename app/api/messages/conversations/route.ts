import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import {
	getOrCreateConversation,
	getUserConversations,
} from "@/server/handlers/MessageHandlers";

// GET: Get all conversations for the current user
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

		const response = await getUserConversations(userID);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ conversations: response.payload },
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in GET /api/messages/conversations:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// POST: Get or create a conversation with another user
export async function POST(request: NextRequest) {
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

		const { otherUserID, itemID } = await request.json();

		if (!otherUserID)
			return NextResponse.json(
				{ error: "otherUserID is required" },
				{ status: 400 }
			);

		const response = await getOrCreateConversation(
			userID,
			otherUserID,
			itemID
		);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200 && statusCode !== 201)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ conversation: response.payload },
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in POST /api/messages/conversations:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

