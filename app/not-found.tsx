/**
 * 404 Not Found Page
 * ==================
 *
 * DATA FETCHING STRATEGY: Static (SSG)
 *
 * This page is statically generated and handles all 404 errors.
 * Instead of showing a 404 page, it redirects users to login.
 *
 * WHY REDIRECT TO LOGIN:
 * - Most 404s are from unauthenticated users trying invalid URLs
 * - Login page is the natural entry point for the application
 * - Reduces confusion for users who land on invalid routes
 * - Authenticated users will be redirected to their dashboard
 *
 * USING SERVER REDIRECT:
 * - Faster than client-side redirect
 * - Works without JavaScript
 * - Better for SEO (proper 404 status then redirect)
 */

import { redirect } from "next/navigation";

/**
 * Not Found Page Component
 *
 * Handles all 404 errors by redirecting to the login page.
 * The middleware will then handle routing based on auth state.
 *
 * @returns Never (always redirects)
 */
export default function NotFound() {
	// Server-side redirect to login page
	// Middleware will redirect authenticated users to their dashboard
	redirect("/login");
}
