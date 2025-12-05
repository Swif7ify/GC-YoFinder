/**
 * Dashboard Layout
 * ================
 *
 * This layout wraps all student dashboard pages and provides:
 * - Consistent metadata template for SEO
 * - Shared layout structure (if needed in future)
 * - Route segment configuration
 *
 * METADATA STRATEGY:
 * - Uses template pattern for dynamic page titles
 * - Child pages can override with their own metadata
 * - Default title shown when no child metadata exists
 *
 * LAYOUT CONSIDERATIONS:
 * - Currently passes children through directly
 * - Can be extended to add shared UI elements (breadcrumbs, etc.)
 * - Providers are in root layout to avoid re-mounting
 */

import { Metadata } from "next";

/**
 * Dashboard metadata configuration
 *
 * The template pattern allows child pages to set their own title
 * while maintaining consistent branding. For example:
 * - Child sets title: "My Items" → Renders as "My Items | Dashboard"
 * - No child title → Renders as "GCYofinder | Dashboard"
 */
export const metadata: Metadata = {
	title: {
		template: "%s | Dashboard",
		default: "GCYofinder | Dashboard",
	},
	description: "Student dashboard for managing lost and found items at Gordon College",
};

/**
 * Dashboard Layout Component
 *
 * Minimal layout that passes children through.
 * Shared providers (Theme, Loading, Pusher) are in root layout.
 *
 * @param children - Page content to render
 * @returns Layout wrapper for dashboard pages
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return children;
}
