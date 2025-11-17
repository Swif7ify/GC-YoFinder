import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import {
	getConversationMessages,
	markMessagesAsRead,
} from "@/server/handlers/MessageHandlers";

// GET: Get messages for a conversation
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
		const conversationID = params.id;

		const url = new URL(request.url);
		const page = url.searchParams.get("page");
		const limit = url.searchParams.get("limit");

		const response = await getConversationMessages(
			userID,
			conversationID,
			Number(page) || 1,
			Number(limit) || 50
		);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ messages: response.payload },
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in GET /api/messages/conversations/[id]:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// PUT: Mark messages as read
export async function PUT(
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
		const conversationID = params.id;

		const response = await markMessagesAsRead(userID, conversationID);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ message: "Messages marked as read" },
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in PUT /api/messages/conversations/[id]:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

