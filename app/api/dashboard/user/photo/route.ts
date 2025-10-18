import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { updateUserPhotoByID } from "@/server/handlers/DashboardHandlers";

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
		const image = {
			photo: formData.get("photo") as File,
		};

		const response = await updateUserPhotoByID(userID, image);
		console.log("Photo Update Response:", response);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (response.status.remarks !== "success")
			return NextResponse.json(
				{ error: message },
				{ status: statusCode }
			);

		return NextResponse.json({ message: message }, { status: statusCode });
	} catch (error) {
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
