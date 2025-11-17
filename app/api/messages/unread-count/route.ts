import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import ConversationSchema from "@/server/models/ConversationSchema";
import { connectToDatabase } from "@/server/lib/mongodb";

// GET: Get total unread message count for the current user
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

		await connectToDatabase();

		// Get all conversations for the user
		const conversations = await ConversationSchema.find({
			participants: userID,
		}).lean();

		// Calculate total unread count
		let totalUnread = 0;
		for (const conv of conversations) {
			if (conv.unread_count && Array.isArray(conv.unread_count)) {
				const unreadData = conv.unread_count.find(
					(u: any) => {
						if (!u || !u.user_id) return false;
						const userId = u.user_id.toString ? u.user_id.toString() : String(u.user_id);
						return userId === userID;
					}
				);
				if (unreadData && unreadData.count) {
					totalUnread += Number(unreadData.count) || 0;
				}
			}
		}

		return NextResponse.json(
			{ unreadCount: totalUnread },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in GET /api/messages/unread-count:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

