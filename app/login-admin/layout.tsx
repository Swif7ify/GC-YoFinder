/**
 * Admin Login Layout
 * ==================
 *
 * This layout wraps the admin login page and provides:
 * - Admin-specific metadata
 * - Security-focused configuration
 * - Separate branding from student login
 *
 * DATA FETCHING STRATEGY: Static (SSG)
 *
 * Like the student login, this page is statically generated:
 * - No dynamic data needed for the login form
 * - Fast initial load for admin access
 * - Middleware handles redirect if already authenticated
 *
 * SECURITY CONSIDERATIONS:
 * - Page is not indexed by search engines
 * - Separate from student login for security isolation
 * - Admin credentials have different validation rules
 */

import { Metadata } from "next";

/**
 * Admin login page metadata
 *
 * Configured to prevent search engine indexing
 * for security purposes.
 */
export const metadata: Metadata = {
	title: {
		template: "%s | Admin Sign In",
		default: "GCYofinder | Admin Sign In",
	},
	description: "Admin portal login for GC YoFinder system administrators",
	// Prevent indexing of admin login page
	robots: {
		index: false,
		follow: false,
	},
};

/**
 * Admin Login Layout Component
 *
 * Simple pass-through layout for admin login.
 * Keeps admin authentication separate from student flow.
 *
 * @param children - Admin login page content
 * @returns Layout wrapper for admin login page
 */
export default function AdminSignInLayout({ children }: { children: React.ReactNode }) {
	return children;
}
