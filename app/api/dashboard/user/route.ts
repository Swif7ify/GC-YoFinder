import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import {
	getUserDataByID,
	updateUserDataByID,
} from "@/server/handlers/DashboardHandlers";

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

		const response = await getUserDataByID(userID);
		console.log("Dashboard User Data Response:", response);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (response.status.remarks !== "success")
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ data: response.payload, message },
			{ status: statusCode }
		);
	} catch (error) {
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}

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

		const { username, phone } = await request.json();
		if (!username && !phone) {
			return NextResponse.json(
				{ error: "No data provided to update" },
				{ status: 400 }
			);
		}

		const response = await updateUserDataByID(userID, { username, phone });
		const message = response.status.message;
		const statusCode = response.status_code;
		if (response.status.remarks !== "success")
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json(
			{ data: response.payload, message },
			{ status: statusCode }
		);
	} catch (error) {
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
