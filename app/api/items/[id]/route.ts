import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import {
	deleteItemByID,
	updateItemByID,
} from "@/server/handlers/ItemsHandlers";

export async function DELETE(request: NextRequest, context: any) {
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

		const params = await (context?.params ?? {});
		const { id } = params as { id: string };

		const response = await deleteItemByID(userID, id);
		console.log("Delete Item Response:", response);
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

export async function PUT(request: NextRequest, context: any) {
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
		const params = await (context?.params ?? {});
		const { id } = params as { id: string };

		const formData = await request.formData();
		const extractedFields = {
			type: formData.get("type") as string,
			status: formData.get("status") as string,
			title: formData.get("title") as string,
			description: formData.get("description") as string,
			category: formData.get("category") as string,
			location: formData.get("location") as string,
			date_lost_or_found: formData.get("date_lost_or_found") as string,
			photos: formData.getAll("photos") as File[],
			existing_images: formData.getAll("existing_images") as string[],
		};

		const response = await updateItemByID(userID, id, extractedFields);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (response.status.remarks !== "success")
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
