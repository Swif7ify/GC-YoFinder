let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

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
