export function buildQueryString(params?: object): string {
	if (!params) return "";

	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== "") {
			searchParams.append(key, String(value));
		}
	}

	return searchParams.toString();
}

export function appendQueryString(endpoint: string, params?: object): string {
	const queryString = buildQueryString(params);
	if (!queryString) return endpoint;
	return `${endpoint}?${queryString}`;
}
