import axios from "axios";
import type { Environment } from "../../config/constants";
import { NetworkManager } from "../../utils/network";
import { logger } from "../../utils/logger";
import type { NetworkResponse } from "../../types";

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
	 * Handles API errors in a consistent way
	 * 
	 * @param error - The error thrown during API request
	 * @param context - Context about the operation for better error messages
	 * @returns A standardized error response
	 */
	handleApiError(error: unknown, context: string): NetworkResponse {
		logger.error(`PawaPay API Error - ${context}:`, error);

		let errorMessage = `An error occurred during ${context}`;
		let statusCode = 500;
		let errorObject = "{}";

		if (axios.isAxiosError(error) && error.response) {
			statusCode = error.response.status;

			try {
				const data = error.response.data as {
					message?: string;
					error?: string;
				};
				
				errorMessage = data.message || data.error || errorMessage;
				errorObject = JSON.stringify(data);
			} catch {
				errorMessage = `Failed to parse error response during ${context}`;
			}
		} else if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			errorMessage,
			statusCode,
			errorObject,
		};
	}

	/**
	 * Make a GET request to the PawaPay API
	 * @param endpoint - API endpoint
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async get<T>(endpoint: string, context = "GET request"): Promise<T> {
		try {
			const response = await this.getInstance().get<T>(endpoint);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a POST request to the PawaPay API
	 * @param endpoint - API endpoint
	 * @param data - Request payload
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async post<T>(endpoint: string, data: unknown, context = "POST request"): Promise<T> {
		try {
			const response = await this.getInstance().post<T>(endpoint, data);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a PUT request to the PawaPay API
	 * @param endpoint - API endpoint
	 * @param data - Request payload
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async put<T>(endpoint: string, data: unknown, context = "PUT request"): Promise<T> {
		try {
			const response = await this.getInstance().put<T>(endpoint, data);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a DELETE request to the PawaPay API
	 * @param endpoint - API endpoint
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async delete<T>(endpoint: string, context = "DELETE request"): Promise<T> {
		try {
			const response = await this.getInstance().delete<T>(endpoint);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}
}
