import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { connectToDatabase } from "@/server/lib/mongodb";
import ItemsSchema from "@/server/models/ItemsSchema";
import UserSchema from "@/server/models/UserSchema";

export async function GET(request: NextRequest) {
	try {
		const user = await getUserFromRequest(request);
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const userID = user.userID;
		if (!userID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		// Verify admin role
		await connectToDatabase();
		const adminUser = await UserSchema.findById(userID);
		if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "superadmin")) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const url = new URL(request.url);
		const type = url.searchParams.get("type") || "items";
		const format = url.searchParams.get("format") || "csv";

		let data: any[] = [];
		let filename = "";

		switch (type) {
			case "items":
				const items = await ItemsSchema.find()
					.populate("user_id", "firstname lastname email username")
					.populate("claimed_by", "firstname lastname email username")
					.sort({ created_at: -1 })
					.lean();

				data = items.map((item: any) => ({
					id: item._id.toString(),
					name: item.name,
					description: item.description,
					category: item.category,
					type: item.type,
					status: item.status,
					location: item.location,
					date_lost_or_found: item.date_lost_or_found?.toISOString() || "",
					views: item.views || 0,
					matched: item.matched || 0,
					posted_by: item.user_id ? `${item.user_id.firstname} ${item.user_id.lastname}` : "Unknown",
					posted_by_email: item.user_id?.email || "",
					claimed_by: item.claimed_by ? `${item.claimed_by.firstname} ${item.claimed_by.lastname}` : "",
					claimed_at: item.claimed_at?.toISOString() || "",
					created_at: item.created_at?.toISOString() || "",
					updated_at: item.updated_at?.toISOString() || "",
					photo_count: item.photos?.length || 0,
				}));
				filename = `items_export_${new Date().toISOString().split("T")[0]}`;
				break;

			case "users":
				const users = await UserSchema.find().select("-password -__v").sort({ created_at: -1 }).lean();

				data = users.map((u: any) => ({
					id: u._id.toString(),
					username: u.username,
					email: u.email,
					firstname: u.firstname,
					lastname: u.lastname,
					role: u.role,
					student_id: u.student_id || "",
					course: u.course || "",
					year_level: u.year_level || "",
					is_verified: u.is_verified || false,
					created_at: u.created_at?.toISOString() || "",
					updated_at: u.updated_at?.toISOString() || "",
				}));
				filename = `users_export_${new Date().toISOString().split("T")[0]}`;
				break;

			case "activity":
				// Get recent items activity
				const recentItems = await ItemsSchema.find()
					.populate("user_id", "firstname lastname username")
					.sort({ updated_at: -1 })
					.limit(500)
					.lean();

				data = recentItems.map((item: any) => ({
					id: item._id.toString(),
					action:
						item.status === "claimed"
							? "Item Claimed"
							: item.status === "active"
							? "Item Approved"
							: item.status === "rejected"
							? "Item Rejected"
							: item.status === "pending"
							? "Item Submitted"
							: "Item Updated",
					item_name: item.name,
					item_type: item.type,
					status: item.status,
					user: item.user_id ? `${item.user_id.firstname} ${item.user_id.lastname}` : "Unknown",
					username: item.user_id?.username || "",
					timestamp: item.updated_at?.toISOString() || item.created_at?.toISOString() || "",
				}));
				filename = `activity_export_${new Date().toISOString().split("T")[0]}`;
				break;

			default:
				return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
		}

		if (format === "json") {
			return new NextResponse(JSON.stringify(data, null, 2), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Content-Disposition": `attachment; filename="${filename}.json"`,
				},
			});
		}

		// CSV format
		if (data.length === 0) {
			return new NextResponse("No data to export", {
				status: 200,
				headers: {
					"Content-Type": "text/csv",
					"Content-Disposition": `attachment; filename="${filename}.csv"`,
				},
			});
		}

		const headers = Object.keys(data[0]);
		const csvRows = [
			headers.join(","),
			...data.map((row) =>
				headers
					.map((header) => {
						const value = row[header];
						// Escape quotes and wrap in quotes if contains comma or newline
						const stringValue = String(value ?? "");
						if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
							return `"${stringValue.replace(/"/g, '""')}"`;
						}
						return stringValue;
					})
					.join(",")
			),
		];

		return new NextResponse(csvRows.join("\n"), {
			status: 200,
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="${filename}.csv"`,
			},
		});
	} catch (error) {
		console.error("Error in GET /api/admin/export:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
