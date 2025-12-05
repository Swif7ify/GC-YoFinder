/**
 * Dashboard Items API Route
 * =========================
 *
 * Endpoint: GET /api/dashboard/items
 *
 * DATA FETCHING STRATEGY: Dynamic (SSR)
 *
 * This endpoint returns paginated items for the dashboard.
 * It's always dynamic because:
 * - Results are filtered by user permissions
 * - Pagination requires request-time parameters
 * - Item status changes frequently
 *
 * CACHING STRATEGY:
 * - Server: No caching (dynamic route)
 * - Client: 30-second cache via api.config.ts
 * - Real-time: Pusher events invalidate client cache
 *
 * QUERY PARAMETERS:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - searchQuery: Text search filter
 * - type: "lost" | "found" | "all"
 * - status: "active" | "claimed" | "all"
 * - category: Item category filter
 * - location: Location filter
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllItems } from "@/server/handlers/DashboardHandlers";
import { getUserFromRequest } from "@/services/Access";

/**
 * Force dynamic rendering for this route
 * Items are user-specific and change frequently
 */
export const dynamic = "force-dynamic";

/**
 * Item filter interface for type safety
 */
interface ItemFilters {
	searchQuery?: string;
	type?: "all" | "lost" | "found";
	status?: "all" | "active" | "claimed";
	category?: string;
	location?: string;
}

/**
 * GET handler for fetching dashboard items
 *
 * Returns paginated list of items based on filters.
 * Requires authentication via cookies.
 *
 * @param request - Next.js request object with query params
 * @returns JSON response with items and pagination metadata
 */
export async function GET(request: NextRequest) {
	try {
		// Authenticate user from request cookies
		const user = await getUserFromRequest(request);
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userID = user.userID;
		if (!userID) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse query parameters
		const url = new URL(request.url);
		const page = url.searchParams.get("page");
		const limit = url.searchParams.get("limit");
		const searchQuery = url.searchParams.get("searchQuery");
		const type = url.searchParams.get("type");
		const status = url.searchParams.get("status");
		const category = url.searchParams.get("category");
		const location = url.searchParams.get("location");

		// Build filters object (only include non-null values)
		const filters: ItemFilters = {};
		if (searchQuery) filters.searchQuery = searchQuery;
		if (type) filters.type = type as ItemFilters["type"];
		if (status) filters.status = status as ItemFilters["status"];
		if (category) filters.category = category;
		if (location) filters.location = location;

		// Fetch items from database
		const response = await getAllItems(
			userID,
			Number(page) || 1,
			Number(limit) || 10,
			Object.keys(filters).length > 0 ? filters : undefined
		);

		const message = response.status.message;
		const statusCode = response.status_code;

		if (statusCode !== 200) {
			return NextResponse.json({ error: message }, { status: statusCode });
		}

		// Return items with cache headers for client-side caching
		return NextResponse.json(response.payload, {
			status: statusCode,
			headers: {
				// Allow client-side caching for 30 seconds
				"Cache-Control": "private, max-age=30, stale-while-revalidate=60",
			},
		});
	} catch (error) {
		console.error("Dashboard items API error:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
