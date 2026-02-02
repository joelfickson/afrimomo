export interface TokenRequest {
	grant_type: "client_credentials";
	client_id: string;
	client_secret: string;
}

export interface TokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope?: string;
}

export interface CachedToken {
	accessToken: string;
	expiresAt: number;
}
