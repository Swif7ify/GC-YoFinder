/**
 * Admin Dashboard Page
 * ====================
 *
 * DATA FETCHING STRATEGY: Hybrid (SSR + Client-Side)
 *
 * Similar to the student dashboard, this page uses a hybrid approach
 * optimized for admin-specific workflows:
 *
 * 1. SERVER-SIDE (SSR):
 *    - Admin role validation via middleware
 *    - Initial page shell with loading state
 *    - Protected route enforcement
 *
 * 2. CLIENT-SIDE:
 *    - Dashboard statistics and charts
 *    - Item management (approve/reject/archive)
 *    - User management
 *    - Real-time notifications via Pusher
 *
 * WHY HYBRID FOR ADMIN:
 * - Admin data requires strict authentication
 * - Statistics and reports update frequently
 * - Bulk operations need client-side state management
 * - Real-time item status updates via Pusher
 *
 * SECURITY CONSIDERATIONS:
 * - Middleware validates admin role before page loads
 * - API routes double-check admin permissions
 * - Sensitive operations require fresh authentication
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Suspense for immediate loading feedback
 * - Dynamic imports for admin-specific components
 * - ISR-like caching for aggregate statistics
 * - Pusher for real-time updates (no polling)
 */

import React, { Suspense } from "react";
import AdminClient from "@/clients/AdminClient";
import { HashLoader } from "react-spinners";

/**
 * Force dynamic rendering for admin dashboard
 *
 * Admin pages must always be server-rendered because:
 * - Role-based access control must be enforced
 * - Admin actions affect system-wide data
 * - Audit logging requires accurate timestamps
 */
export const dynamic = "force-dynamic";

/**
 * Disable caching for admin routes
 *
 * Admin data should never be cached at the page level
 * to ensure admins always see the latest system state.
 */
export const revalidate = 0;

/**
 * Admin loading fallback component
 *
 * Provides visual feedback while the admin dashboard loads.
 * Matches the student dashboard style for consistency.
 */
function AdminDashboardFallback() {
	return (
		<div
			className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center"
			role="status"
			aria-label="Loading admin dashboard"
		>
			<div className="text-center flex items-center flex-col">
				<HashLoader color="#4ade80" aria-hidden="true" />
				<p className="mt-4 text-gray-800 dark:text-gray-300">Loading admin dashboard...</p>
			</div>
		</div>
	);
}

/**
 * Admin Dashboard Page Component
 *
 * Entry point for the admin interface. Wraps AdminClient
 * in Suspense for streaming SSR support.
 *
 * @returns Admin dashboard with Suspense boundary
 */
export default function AdminDashboardPage() {
	return (
		<Suspense fallback={<AdminDashboardFallback />}>
			{/*
				AdminClient handles all admin functionality:
				- Dashboard statistics and charts
				- Item management (pending, active, claimed, archived)
				- User management
				- Activity logs and reports
				- Data export
				- Real-time updates via Pusher
			*/}
			<AdminClient />
		</Suspense>
	);
}
