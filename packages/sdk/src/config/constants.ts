export const URLS = {
	PRODUCTION: "https://api.pawapay.cloud",
	SANDBOX: "https://api.sandbox.pawapay.cloud",
} as const;

export const ENVIRONMENTS = {
	PRODUCTION: "PRODUCTION",
	DEVELOPMENT: "DEVELOPMENT",
} as const;

export type Environment = keyof typeof ENVIRONMENTS;
export type ApiUrl = (typeof URLS)[keyof typeof URLS];
