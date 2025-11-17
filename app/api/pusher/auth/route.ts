import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import pusher from "@/server/config/pusher.config";

// POST: Authenticate Pusher channel subscription
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

		// Pusher sends form-encoded data by default
		// Read the request body and parse based on content type
		const contentType = request.headers.get("content-type") || "";
		let socket_id: string | null = null;
		let channel_name: string | null = null;

		if (contentType.includes("application/json")) {
			// Handle JSON request
			const body = await request.json();
			socket_id = body.socket_id;
			channel_name = body.channel_name;
		} else {
			// Handle form-encoded request (Pusher's default)
			// Pusher sends as application/x-www-form-urlencoded
			const text = await request.text();
			const params = new URLSearchParams(text);
			socket_id = params.get("socket_id");
			channel_name = params.get("channel_name");
		}

		if (!socket_id || !channel_name)
			return NextResponse.json(
				{ error: "socket_id and channel_name are required" },
				{ status: 400 }
			);

		// Only allow private channels for user-specific channels
		if (channel_name.startsWith("private-")) {
			const auth = pusher.authorizeChannel(socket_id, channel_name, {
				user_id: userID,
				user_info: {
					name: user.email || userID,
				},
			});

			return NextResponse.json(auth);
		}

		// For presence channels (if needed in the future)
		if (channel_name.startsWith("presence-")) {
			const auth = pusher.authorizeChannel(socket_id, channel_name, {
				user_id: userID,
				user_info: {
					name: user.email || userID,
				},
			});

			return NextResponse.json(auth);
		}

		// For public channels (conversation channels)
		if (channel_name.startsWith("conversation-")) {
			// Verify user has access to this conversation
			// This is a simplified check - you might want to verify in the database
			// For now, we'll allow public subscription to conversation channels
			const auth = pusher.authorizeChannel(socket_id, channel_name);

			return NextResponse.json(auth);
		}

		return NextResponse.json(
			{ error: "Invalid channel name" },
			{ status: 400 }
		);
	} catch (error) {
		console.error("Error in POST /api/pusher/auth:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

