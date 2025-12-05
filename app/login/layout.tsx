/**
 * Login Layout
 * ============
 *
 * This layout wraps the student login page and provides:
 * - SEO-optimized metadata for the login page
 * - Consistent branding
 * - Public route configuration
 *
 * DATA FETCHING STRATEGY: Static (SSG)
 *
 * The login page is statically generated because:
 * - No user-specific data is needed
 * - Content is the same for all visitors
 * - Faster initial load improves user experience
 * - Better SEO for the entry point
 *
 * AUTHENTICATION FLOW:
 * - Middleware checks if user is already logged in
 * - If logged in, redirects to dashboard
 * - If not, shows login form
 * - Form submission is client-side (API call)
 */

import { Metadata } from "next";

/**
 * Login page metadata
 *
 * Optimized for SEO and social sharing since this is
 * often the first page users encounter.
 */
export const metadata: Metadata = {
	title: {
		template: "%s | Sign In",
		default: "GCYofinder | Sign In",
	},
	description: "Sign in to GC YoFinder - Lost and Found System for Gordon College students",
	openGraph: {
		title: "Sign In | GC YoFinder",
		description: "Access your Gordon College lost and found account",
	},
};

/**
 * Login Layout Component
 *
 * Simple pass-through layout for the login page.
 * Could be extended to add login-specific UI elements.
 *
 * @param children - Login page content
 * @returns Layout wrapper for login page
 */
export default function SignInLayout({ children }: { children: React.ReactNode }) {
	return children;
}
