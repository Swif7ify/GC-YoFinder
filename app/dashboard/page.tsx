/**
 * Student Dashboard Page
 * ======================
 *
 * DATA FETCHING STRATEGY: Hybrid (SSR + Client-Side)
 *
 * This page uses a hybrid approach:
 *
 * 1. SERVER-SIDE (SSR):
 *    - Authentication validation via middleware
 *    - Initial page shell rendering
 *    - SEO metadata generation
 *
 * 2. CLIENT-SIDE:
 *    - User-specific data (items, messages, notifications)
 *    - Real-time updates via Pusher
 *    - Interactive features (forms, modals)
 *
 * WHY HYBRID APPROACH:
 * - Dashboard data is highly personalized and changes frequently
 * - Real-time features (Pusher) require client-side JavaScript
 * - Authentication tokens are httpOnly cookies (accessible server-side)
 * - Suspense boundary provides instant loading feedback
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Suspense boundary for streaming HTML
 * - Dynamic imports in DashboardClient for code splitting
 * - Client-side caching via api.config.ts
 * - Pusher for real-time updates (no polling)
 *
 * CACHING STRATEGY:
 * - Page itself is not cached (dynamic: 'force-dynamic')
 * - API responses cached client-side with 30s TTL
 * - Pusher events invalidate cache for real-time updates
 */

import React, { Suspense } from "react";
import DashboardClient from "@/clients/DashboardClient";
import { HashLoader } from "react-spinners";

/**
 * Force dynamic rendering for this page
 *
 * Dashboard pages should always be rendered fresh because:
 * - User authentication state must be current
 * - Data is personalized per user
 * - Real-time updates require fresh initial state
 */
export const dynamic = "force-dynamic";

/**
 * Disable static generation for this route
 *
 * This ensures the page is always server-rendered on request,
 * which is necessary for authenticated routes.
 */
export const revalidate = 0;

/**
 * Loading fallback component
 *
 * Displayed while the DashboardClient component is loading.
 * Uses a simple spinner to indicate loading state without
 * causing layout shift when content loads.
 */
function DashboardFallback() {
	return (
		<div
			className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center"
			role="status"
			aria-label="Loading dashboard"
		>
			<div className="text-center flex items-center flex-col">
				{/* HashLoader provides visual feedback during load */}
				<HashLoader color="#4ade80" aria-hidden="true" />
				<p className="mt-4 text-gray-800 dark:text-gray-300">Loading dashboard...</p>
			</div>
		</div>
	);
}

/**
 * Dashboard Page Component
 *
 * Wraps the client component in Suspense for streaming SSR.
 * The fallback is shown immediately while DashboardClient loads.
 *
 * @returns Dashboard page with Suspense boundary
 */
export default function DashboardPage() {
	return (
		<Suspense fallback={<DashboardFallback />}>
			{/* 
				DashboardClient handles all client-side logic:
				- Data fetching with caching
				- Real-time updates via Pusher
				- Tab navigation and state management
				- User interactions
			*/}
			<DashboardClient />
		</Suspense>
	);
}
