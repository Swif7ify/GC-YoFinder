/**
 * Admin Dashboard Layout
 * ======================
 *
 * This layout wraps all admin dashboard pages and provides:
 * - Admin-specific metadata template
 * - Consistent branding for admin portal
 * - Route segment configuration for admin routes
 *
 * SECURITY NOTE:
 * - This layout does NOT handle authentication
 * - Authentication is handled by middleware.ts
 * - API routes double-check admin permissions
 *
 * METADATA STRATEGY:
 * - Template pattern for dynamic admin page titles
 * - Clearly identifies pages as admin portal
 * - Helps admins distinguish from student dashboard
 */

import { Metadata } from "next";

/**
 * Admin dashboard metadata configuration
 *
 * Uses template pattern for consistent admin branding:
 * - Child sets title: "Users" → Renders as "Users | Admin Dashboard"
 * - No child title → Renders as "GCYofinder | Admin Dashboard"
 */
export const metadata: Metadata = {
	title: {
		template: "%s | Admin Dashboard",
		default: "GCYofinder | Admin Dashboard",
	},
	description: "Admin portal for managing the GC YoFinder lost and found system",
	// Prevent search engines from indexing admin pages
	robots: {
		index: false,
		follow: false,
	},
};

/**
 * Admin Dashboard Layout Component
 *
 * Minimal layout that passes children through.
 * Admin-specific providers could be added here if needed.
 *
 * @param children - Page content to render
 * @returns Layout wrapper for admin dashboard pages
 */
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
	return children;
}
