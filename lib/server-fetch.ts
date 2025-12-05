/**
 * Server-Side Data Fetching Utilities
 * ====================================
 *
 * This module provides utilities for server-side data fetching in Next.js App Router.
 * It centralizes fetch logic with proper error handling, caching strategies, and
 * type safety for use in Server Components and Route Handlers.
 *
 * DATA FETCHING STRATEGIES:
 *
 * 1. SSR (Server-Side Rendering) - Dynamic data fetched on every request
 *    - Use: { cache: 'no-store' } or { next: { revalidate: 0 } }
 *    - Best for: User-specific data, real-time data, authenticated content
 *
 * 2. SSG (Static Site Generation) - Data fetched at build time
 *    - Use: Default fetch behavior (cached indefinitely)
 *    - Best for: Static content that rarely changes
 *
 * 3. ISR (Incremental Static Regeneration) - Cached with timed revalidation
 *    - Use: { next: { revalidate: seconds } }
 *    - Best for: Semi-static content that updates periodically
 *
 * @module lib/server-fetch
 */

import { cookies } from "next/headers";

/**
 * Base URL for internal API calls
 * In production, this should be the full URL; in development, relative paths work
 */
const getBaseUrl = (): string => {
	// Server-side: use environment variable or construct from headers
	if (process.env.NEXT_PUBLIC_APP_URL) {
		return process.env.NEXT_PUBLIC_APP_URL;
	}
	// Fallback for development
	return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
};

/**
 * Fetch configuration options for different caching strategies
 */
export const FetchStrategy = {
	/**
	 * SSR: Fetch fresh data on every request
	 * Use for: User-specific data, real-time updates, authenticated content
	 */
	SSR: { cache: "no-store" as const },

	/**
	 * SSG: Cache indefinitely (until next build)
	 * Use for: Static content like site configuration, rarely changing data
	 */
	SSG: { cache: "force-cache" as const },

	/**
	 * ISR with 60 second revalidation
	 * Use for: Dashboard stats, activity feeds, semi-dynamic content
	 */
	ISR_60: { next: { revalidate: 60 } },

	/**
	 * ISR with 5 minute revalidation
	 * Use for: Item listings, user counts, aggregate data
	 */
	ISR_300: { next: { revalidate: 300 } },

	/**
	 * ISR with 1 hour revalidation
	 * Use for: Category lists, location data, configuration
	 */
	ISR_3600: { next: { revalidate: 3600 } },
} as const;

/**
 * Response type for server fetch operations
 */
export interface ServerFetchResult<T> {
	data: T | null;
	error: string | null;
	status: number;
}

/**
 * Server-side authenticated fetch
 *
 * Performs a fetch request with authentication cookies attached.
 * This is used for protected API routes that require user authentication.
 *
 * @param endpoint - API endpoint path (e.g., "/api/dashboard/user")
 * @param options - Fetch options including caching strategy
 * @returns Promise with typed data, error message, and status code
 *
 * @example
 * // SSR fetch for user data (fresh on every request)
 * const { data, error } = await serverFetch<UserData>(
 *   "/api/dashboard/user",
 *   { ...FetchStrategy.SSR }
 * );
 *
 * @example
 * // ISR fetch for dashboard stats (revalidate every 60 seconds)
 * const { data, error } = await serverFetch<DashboardStats>(
 *   "/api/admin/dashboard",
 *   { ...FetchStrategy.ISR_60 }
 * );
 */
export async function serverFetch<T>(
	endpoint: string,
	options: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {}
): Promise<ServerFetchResult<T>> {
	try {
		// Get cookies for authentication
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;
		const refreshToken = cookieStore.get("refreshToken")?.value;

		// Build cookie header for authenticated requests
		const cookieHeader = [
			accessToken ? `accessToken=${accessToken}` : "",
			refreshToken ? `refreshToken=${refreshToken}` : "",
		]
			.filter(Boolean)
			.join("; ");

		const baseUrl = getBaseUrl();
		const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieHeader,
				...options.headers,
			},
		});

		if (!response.ok) {
			return {
				data: null,
				error: `Request failed with status ${response.status}`,
				status: response.status,
			};
		}

		const data = await response.json();
		return {
			data: data as T,
			error: null,
			status: response.status,
		};
	} catch (error) {
		console.error(`Server fetch error for ${endpoint}:`, error);
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			status: 500,
		};
	}
}

/**
 * Public server fetch (no authentication required)
 *
 * Performs a fetch request without authentication.
 * Use for public API endpoints that don't require user login.
 *
 * @param endpoint - API endpoint path
 * @param options - Fetch options including caching strategy
 * @returns Promise with typed data, error message, and status code
 *
 * @example
 * // SSG fetch for static configuration
 * const { data } = await publicServerFetch<Config>(
 *   "/api/config",
 *   { ...FetchStrategy.SSG }
 * );
 */
export async function publicServerFetch<T>(
	endpoint: string,
	options: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {}
): Promise<ServerFetchResult<T>> {
	try {
		const baseUrl = getBaseUrl();
		const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		if (!response.ok) {
			return {
				data: null,
				error: `Request failed with status ${response.status}`,
				status: response.status,
			};
		}

		const data = await response.json();
		return {
			data: data as T,
			error: null,
			status: response.status,
		};
	} catch (error) {
		console.error(`Public fetch error for ${endpoint}:`, error);
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			status: 500,
		};
	}
}

/**
 * Revalidate cached data by tag
 *
 * Use this to manually invalidate ISR cached data when content changes.
 * Call from API routes after mutations (create, update, delete).
 *
 * @param tag - Cache tag to revalidate
 *
 * @example
 * // In an API route after creating an item:
 * await revalidateTag("items");
 */
export { revalidateTag, revalidatePath } from "next/cache";
