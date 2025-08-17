export async function api(url: string, options: RequestInit = {}) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000);

	const defaultOptions: RequestInit = {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			...(options.headers || {}),
		},
		signal: controller.signal,
		...options,
	};

	try {
		const response = await fetch(url, defaultOptions);
		clearTimeout(timeout);
		return response;
	} catch (error) {
		clearTimeout(timeout);
		throw error;
	}
}
