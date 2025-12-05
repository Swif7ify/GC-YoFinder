/**
 * Admin Dashboard Statistics API Route
 * =====================================
 *
 * Endpoint: GET /api/admin/dashboard/stats
 *
 * DATA FETCHING STRATEGY: Dynamic with Client Caching
 *
 * This endpoint returns aggregate statistics for the admin dashboard.
 * While the data changes frequently, we use client-side caching to
 * reduce database load while keeping data reasonably fresh.
 *
 * CACHING STRATEGY:
 * - Server: Dynamic (no server cache due to auth requirement)
 * - Client: 60-second cache via Cache-Control header
 * - Real-time: Pusher events can trigger manual refresh
 *
 * STATISTICS INCLUDED:
 * - User counts (total, active, new)
 * - Item counts by status (pending, active, claimed, rejected)
 * - Item counts by type (lost, found)
 * - Engagement metrics (conversations, messages, views)
 * - Category and location breakdowns
 * - Recent activity items
 *
 * PERFORMANCE NOTES:
 * - Uses MongoDB aggregation for efficient counting
 * - Parallel queries for independent statistics
 * - Results cached client-side to reduce API calls
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { getDashboardStats } from "@/server/handlers/AdminHandlers";

/**
 * Force dynamic rendering - stats require authentication
 */
export const dynamic = "force-dynamic";

/**
 * GET handler for admin dashboard statistics
 *
 * Returns comprehensive statistics for the admin dashboard.
 * Requires admin authentication via cookies.
 *
 * @param request - Next.js request object
 * @returns JSON response with dashboard statistics
 */
export async function GET(request: NextRequest) {
	try {
		// Authenticate admin user
		const user = await getUserFromRequest(request);
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userID = user.userID;
		if (!userID) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Fetch dashboard statistics from database
		const response = await getDashboardStats();
		const message = response.status.message;
		const statusCode = response.status_code;

		if (response.status.remarks !== "success") {
			return NextResponse.json({ error: message }, { status: statusCode });
		}

		// Return stats with cache headers
		// Client can cache for 60 seconds to reduce API calls
		// Admin can manually refresh for real-time data
		return NextResponse.json(
			{ data: response.payload, message },
			{
				status: statusCode,
				headers: {
					// Private cache (admin-specific data)
					// 60 second max-age with stale-while-revalidate
					"Cache-Control": "private, max-age=60, stale-while-revalidate=120",
				},
			}
		);
	} catch (error) {
		console.error("Error in GET /api/admin/dashboard/stats:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
