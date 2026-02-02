import {
	HttpClient,
	HttpClientConfig,
	AuthStrategy,
	RequestHook,
} from "./httpClient";
import type { Environment } from "../config/constants";

const PROVIDER_URLS = {
	pawapay: {
		production: "https://api.pawapay.io/v1",
		sandbox: "https://api.sandbox.pawapay.io/v1",
	},
	paychangu: {
		production: "https://api.paychangu.com",
		sandbox: "https://api.paychangu.com",
	},
	onekhusa: {
		production: "https://api.onekhusa.com/v1",
		sandbox: "https://sandbox.api.onekhusa.com/v1",
	},
} as const;

function getBaseUrl(
	provider: keyof typeof PROVIDER_URLS,
	environment: Environment,
): string {
	return environment === "PRODUCTION"
		? PROVIDER_URLS[provider].production
		: PROVIDER_URLS[provider].sandbox;
}

export function createPawapayClient(
	jwt: string,
	environment: Environment = "DEVELOPMENT",
): HttpClient {
	const config: HttpClientConfig = {
		baseUrl: getBaseUrl("pawapay", environment),
		serviceName: "PawaPay",
		timeoutMs: 30000,
	};

	const auth: AuthStrategy = {
		type: "bearer",
		token: jwt,
	};

	return new HttpClient(config, auth);
}

export function createPaychanguClient(secretKey: string): HttpClient {
	const config: HttpClientConfig = {
		baseUrl: PROVIDER_URLS.paychangu.production,
		serviceName: "PayChangu",
		timeoutMs: 30000,
	};

	const auth: AuthStrategy = {
		type: "bearer",
		token: secretKey,
	};

	return new HttpClient(config, auth);
}

export interface OneKhusaTokenProvider {
	getToken(): Promise<string>;
	clearToken(): void;
}

export function createOnekhusaClient(
	tokenProvider: OneKhusaTokenProvider,
	organisationId: string,
	environment: Environment = "DEVELOPMENT",
): HttpClient {
	const config: HttpClientConfig = {
		baseUrl: getBaseUrl("onekhusa", environment),
		serviceName: "OneKhusa",
		timeoutMs: 30000,
	};

	const auth: AuthStrategy = {
		type: "custom",
		getAuthHeader: async () => {
			const token = await tokenProvider.getToken();
			return `Bearer ${token}`;
		},
	};

	const requestHook: RequestHook = {
		onRequest: (config) => {
			config.headers["Organisation-Id"] = organisationId;
			return config;
		},
	};

	return new HttpClient(config, auth, requestHook);
}
