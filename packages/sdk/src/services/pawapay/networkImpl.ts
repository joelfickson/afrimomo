import {
	ApiNetworkManager,
	ApiConfig,
	AuthConfig,
} from "../../utils/apiNetworkManager";
import type { Environment } from "../../config/constants";
import type { PawaPayTypes } from "./types";
import type { PawapayNetwork } from "./network";
import type { PawaPayNetworkResponse } from "../../types";
import { logger } from "../../utils/logger";

/**
 * PawaPay Network implementation using the unified ApiNetworkManager
 */
export class PawapayNetworkV2 extends ApiNetworkManager {
	/**
	 * Creates a new PawaPay Network manager
	 *
	 * @param jwt - The JWT token for authentication with PawaPay
	 * @param environment - The environment to use (DEVELOPMENT or PRODUCTION)
	 */
	constructor(jwt: string, environment: Environment = "DEVELOPMENT") {
		// Determine the base URL based on environment
		const baseUrl =
			environment === "PRODUCTION"
				? "https://api.pawapay.io/v1"
				: "https://api.sandbox.pawapay.io/v1";

		// Configure API settings
		const apiConfig: ApiConfig = {
			baseUrl,
			serviceName: "PawaPay",
			timeoutMs: 30000,
		};

		// Configure authentication
		const authConfig: AuthConfig = {
			type: "bearer",
			token: jwt,
		};

		// Initialize the parent class with our configuration
		super(apiConfig, authConfig);
	}
}

/**
 * Service for managing PawaPay network operations
 */
export class PawapayNetworkService {
	constructor(private readonly network: PawapayNetwork) {}

	/**
	 * Get the availability status of all correspondents
	 * @returns Promise resolving to the availability status of all correspondents
	 */
	async getAvailability(): Promise<
		PawaPayTypes.AvailabilityResponse | PawaPayNetworkResponse
	> {
		try {
			logger.info("Getting PawaPay correspondent availability");
			return await this.network.get<PawaPayTypes.AvailabilityResponse>(
				"/availability",
				"retrieving correspondent availability",
			);
		} catch (error: unknown) {
			// The error is already handled by the network layer and properly formatted
			if ((error as PawaPayNetworkResponse).errorMessage) {
				return error as PawaPayNetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				"retrieving correspondent availability",
			);
		}
	}

	/**
	 * Get the active configuration for the merchant
	 * @returns Promise resolving to the active configuration
	 */
	async getActiveConfiguration(): Promise<
		PawaPayTypes.ActiveConfigResponse | PawaPayNetworkResponse
	> {
		try {
			logger.info("Getting PawaPay active configuration");
			return await this.network.get<PawaPayTypes.ActiveConfigResponse>(
				"/active-conf",
				"retrieving active configuration",
			);
		} catch (error: unknown) {
			// The error is already handled by the network layer and properly formatted
			if ((error as PawaPayNetworkResponse).errorMessage) {
				return error as PawaPayNetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				"retrieving active configuration",
			);
		}
	}
}
