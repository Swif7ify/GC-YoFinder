let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const simpleCache = new Map<string, { ts: number; data: any }>();
const CACHE_TTL = 30_000; // 30s
const MAX_CACHE_SIZE = 100; // Prevent memory leaks

// Stable cache key generation
function getCacheKey(url: string, options: any): string {
	const sortedOptions = options
		? JSON.stringify(options, Object.keys(options).sort())
		: "{}";
	return `${url}::${sortedOptions}`;
}

// Clean old entries when cache gets too large
function cleanCache() {
	if (simpleCache.size <= MAX_CACHE_SIZE) return;

	const entries = Array.from(simpleCache.entries());
	const sorted = entries.sort((a, b) => a[1].ts - b[1].ts);

	// Remove oldest 20% of entries
	const toRemove = Math.floor(MAX_CACHE_SIZE * 0.2);
	for (let i = 0; i < toRemove; i++) {
		simpleCache.delete(sorted[i][0]);
	}
}

// Cache invalidation helper
export function invalidateCache(pattern?: string | RegExp) {
	if (!pattern) {
		simpleCache.clear();
		return;
	}

	const keys = Array.from(simpleCache.keys());
	const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;

	keys.forEach((key) => {
		if (regex.test(key)) {
			simpleCache.delete(key);
		}
	});
}

export async function apiCached(url: string, options = {}, useCache = true) {
	const key = getCacheKey(url, options);

	if (useCache) {
		const hit = simpleCache.get(key);
		if (hit && Date.now() - hit.ts < CACHE_TTL) {
			return new Response(JSON.stringify(hit.data), { status: 200 });
		}
	}

	const res = await api(url, options);
	const payload = await res
		.clone()
		.json()
		.catch(() => null);

	if (useCache && payload) {
		simpleCache.set(key, { ts: Date.now(), data: payload });
		cleanCache(); // Prevent memory leaks
	}

	return res;
}

async function refreshAccessToken(): Promise<string> {
	if (isRefreshing && refreshPromise) {
		return refreshPromise;
	}

	isRefreshing = true;
	refreshPromise = (async () => {
		try {
			const response = await fetch("/api/auth/refresh", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				if (typeof window !== "undefined") {
					try {
						window.location.href = "/";
					} catch {}
				}
				throw new Error("Refresh token invalid or expired");
			}

			const data = await response.json();
			return data.payload.accessToken;
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	})();

	return refreshPromise;
}

export async function api(url: string, options: RequestInit = {}) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000);

	const makeRequest = async (accessToken?: string): Promise<Response> => {
		const headers: Record<string, string> = {
			Accept: "application/json",
			...((options.headers as Record<string, string>) || {}),
		};

		if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
			headers["Content-Type"] = "application/json";
		}

		const defaultOptions: RequestInit = {
			credentials: "include",
			headers,
			signal: controller.signal,
			...options,
		};

		return fetch(url, defaultOptions);
	};

	try {
		let response = await makeRequest();

		if (response.status === 401 && !url.includes("/auth/refresh")) {
			try {
				const newAccessToken = await refreshAccessToken();
				response = await makeRequest(newAccessToken);
			} catch (refreshError) {
				if (typeof window !== "undefined") {
					try {
						window.location.href = "/";
					} catch {}
				}
				clearTimeout(timeout);
				throw refreshError;
			}
		}

		clearTimeout(timeout);
		return response;
	} catch (error) {
		clearTimeout(timeout);
		throw error;
	}
}
