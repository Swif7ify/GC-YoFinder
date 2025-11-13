import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import {
	getUserNotifications,
	markAllNotificationsAsRead,
} from "@/server/handlers/NotificationHandlers";

// GET: Get all notifications for the current user
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

		const response = await getUserNotifications(userID);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ notifications: response.payload },
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in GET /api/notifications:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// PUT: Mark all notifications as read
export async function PUT(request: NextRequest) {
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

		const response = await markAllNotificationsAsRead(userID);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ message: "All notifications marked as read" },
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in PUT /api/notifications:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

