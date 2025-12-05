/**
 * Home Page - Root Route Handler
 * ===============================
 *
 * DATA FETCHING STRATEGY: None (Redirect Only)
 *
 * This page serves as the entry point and immediately redirects users
 * to the login page. Using Next.js server-side redirect for better
 * performance and SEO (no client-side JavaScript needed for redirect).
 *
 * WHY SERVER REDIRECT:
 * - Faster than client-side redirect (no JS execution needed)
 * - Better for SEO (search engines see the redirect immediately)
 * - Works even if JavaScript is disabled
 * - Reduces initial bundle size (no useRouter, useEffect imports)
 */

import { redirect } from "next/navigation";

/**
 * Root page component that redirects to login
 *
 * Using Next.js App Router's server-side redirect function
 * instead of client-side useRouter for optimal performance.
 */
export default function HomePage() {
	// Server-side redirect - executes before any HTML is sent to client
	redirect("/login");
}
