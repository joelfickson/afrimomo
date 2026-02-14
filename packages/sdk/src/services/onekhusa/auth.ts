import axios from "axios";
import { logger } from "../../utils/logger";
import type { CachedToken, TokenResponse } from "./types/auth";
import type { OneKhusaEnvironment } from "./types/common";

const REFRESH_BUFFER_MS = 30 * 1000;

export class OneKhusaTokenManager {
	private cachedToken: CachedToken | null = null;
	private refreshPromise: Promise<string> | null = null;
	private readonly tokenUrl: string;

	constructor(
		private readonly apiKey: string,
		private readonly apiSecret: string,
		environment: OneKhusaEnvironment = "DEVELOPMENT",
		sandboxUrl?: string,
		productionUrl?: string,
	) {
		// For token URL, if custom URL is provided, append /oauth/token
		if (environment === "PRODUCTION") {
			this.tokenUrl = productionUrl
				? `${productionUrl}/oauth/token`
				: "https://api.onekhusa.com/oauth/token";
		} else {
			this.tokenUrl = sandboxUrl
				? `${sandboxUrl}/oauth/token`
				: "https://sandbox.api.onekhusa.com/oauth/token";
		}
	}

	async getToken(): Promise<string> {
		if (this.isTokenValid()) {
			return this.cachedToken!.accessToken;
		}

		if (this.refreshPromise) {
			return this.refreshPromise;
		}

		this.refreshPromise = this.fetchNewToken();

		try {
			const token = await this.refreshPromise;
			return token;
		} finally {
			this.refreshPromise = null;
		}
	}

	private isTokenValid(): boolean {
		if (!this.cachedToken) {
			return false;
		}

		const now = Date.now();
		const expiresAt = this.cachedToken.expiresAt - REFRESH_BUFFER_MS;
		return now < expiresAt;
	}

	private async fetchNewToken(): Promise<string> {
		logger.debug("OneKhusa: Fetching new access token");

		try {
			const response = await axios.post<TokenResponse>(
				this.tokenUrl,
				new URLSearchParams({
					grant_type: "client_credentials",
					client_id: this.apiKey,
					client_secret: this.apiSecret,
				}),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);

			const { access_token, expires_in } = response.data;

			const expiresAt = this.parseTokenExpiration(access_token, expires_in);

			this.cachedToken = {
				accessToken: access_token,
				expiresAt,
			};

			logger.debug("OneKhusa: Token obtained successfully");
			return access_token;
		} catch (error) {
			logger.error("OneKhusa: Failed to obtain access token", error);
			throw error;
		}
	}

	private parseTokenExpiration(
		token: string,
		defaultExpiresIn: number,
	): number {
		try {
			const parts = token.split(".");
			if (parts.length === 3) {
				const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
				if (payload.exp) {
					return payload.exp * 1000;
				}
			}
		} catch {
			logger.debug(
				"OneKhusa: Could not parse JWT expiration, using expires_in",
			);
		}

		return Date.now() + defaultExpiresIn * 1000;
	}

	clearToken(): void {
		this.cachedToken = null;
	}
}
