import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { sendMessage } from "@/server/handlers/MessageHandlers";

// POST: Send a message
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

		const { conversationID, content } = await request.json();

		if (!conversationID || !content)
			return NextResponse.json(
				{ error: "conversationID and content are required" },
				{ status: 400 }
			);

		const response = await sendMessage(userID, conversationID, content);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 201)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ message: response.payload },
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in POST /api/messages/send:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

