import type { Environment } from "@afrimomo-sdk/config/constants";
import { NetworkManager } from "@afrimomo-sdk/utils/network";

/**
 * Network manager for PawaPay API calls
 */
export class PawapayNetwork extends NetworkManager {
	constructor(jwt: string, environment: Environment = "DEVELOPMENT") {
		// Call parent constructor
		super(jwt, environment);

		// Override base URL to use PawaPay-specific endpoints
		const baseUrl =
			environment === "PRODUCTION"
				? "https://api.pawapay.io/v1"
				: "https://api.sandbox.pawapay.io/v1";

		// Update axios instance base URL
		const instance = this.getInstance();
		instance.defaults.baseURL = baseUrl;
	}

	/**
	 * Make a GET request to the PawaPay API
	 * @param endpoint - API endpoint
	 * @returns Promise resolving to the response data
	 */
	async get<T>(endpoint: string): Promise<T> {
		const response = await this.getInstance().get<T>(endpoint);
		return response.data;
	}

	/**
	 * Make a POST request to the PawaPay API
	 * @param endpoint - API endpoint
	 * @param data - Request payload
	 * @returns Promise resolving to the response data
	 */
	async post<T>(endpoint: string, data: unknown): Promise<T> {
		const response = await this.getInstance().post<T>(endpoint, data);
		return response.data;
	}

	/**
	 * Make a PUT request to the PawaPay API
	 * @param endpoint - API endpoint
	 * @param data - Request payload
	 * @returns Promise resolving to the response data
	 */
	async put<T>(endpoint: string, data: unknown): Promise<T> {
		const response = await this.getInstance().put<T>(endpoint, data);
		return response.data;
	}

	/**
	 * Make a DELETE request to the PawaPay API
	 * @param endpoint - API endpoint
	 * @returns Promise resolving to the response data
	 */
	async delete<T>(endpoint: string): Promise<T> {
		const response = await this.getInstance().delete<T>(endpoint);
		return response.data;
	}
}
