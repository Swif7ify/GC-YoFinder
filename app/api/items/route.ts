import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { createNewItem, getUserItems } from "@/server/handlers/ItemsHandlers";

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

		const response = await getUserItems(userID);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json({ items: response.payload }, { status: statusCode });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
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

		const formData = await request.formData();
		const extractedFields = {
			type: formData.get("type") as string,
			title: formData.get("title") as string,
			description: formData.get("description") as string,
			category: formData.get("category") as string,
			location: formData.get("location") as string,
			date_lost_or_found: formData.get("date_lost_or_found") as string,
			photos: formData.getAll("photos") as File[],
		};

		const response = await createNewItem(userID, extractedFields);
		console.log("Create New Item Response:", response);
		const message = response.status.message;
		const statusCode = response.status_code;
		if (statusCode !== 200)
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json({ message: message }, { status: statusCode });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
