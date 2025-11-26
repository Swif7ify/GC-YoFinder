import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { updateItemStatus } from "@/server/handlers/AdminHandlers";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const user = await getUserFromRequest(request);
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const userID = user.userID;
		if (!userID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const params = await context.params;
		const itemID = params.id;

		const { status } = await request.json();

		if (!status || !["active", "rejected"].includes(status)) {
			return NextResponse.json({ error: "Invalid status. Must be 'active' or 'rejected'" }, { status: 400 });
		}

		const response = await updateItemStatus(itemID, status, userID);
		const message = response.status.message;
		const statusCode = response.status_code;

		if (response.status.remarks !== "success") return NextResponse.json({ error: message }, { status: statusCode });

		return NextResponse.json(
			{
				item: response.payload,
				message,
			},
			{ status: statusCode }
		);
	} catch (error) {
		console.error("Error in PUT /api/admin/items/[id]/status:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
