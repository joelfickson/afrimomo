import axios, { AxiosInstance } from "axios";
import type { Environment } from "../../config/constants";
import { logger } from "../../utils/logger";
import type { PawaPayNetworkResponse } from "../../types";

/**
 * Network manager for PawaPay API calls
 */
export class PawapayNetwork {
	public readonly axiosInstance: AxiosInstance;

	constructor(jwt: string, environment: Environment = "DEVELOPMENT") {
		const baseUrl =
			environment === "PRODUCTION"
				? "https://api.pawapay.io/v1"
				: "https://api.sandbox.pawapay.io/v1";

		this.axiosInstance = axios.create({
			baseURL: baseUrl,
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
				Accept: "application/json"
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.request.use(
			(config) => {
				logger.debug("PawaPay API Request:", {
					method: config.method,
					url: config.url,
					headers: config.headers,
					data: config.data
				});
				return config;
			},
			(error) => {
				logger.error("PawaPay API Request Error:", error);
				return Promise.reject(error);
			}
		);

		this.axiosInstance.interceptors.response.use(
			(response) => {
				logger.debug("PawaPay API Response:", {
					status: response.status,
					statusText: response.statusText,
					data: response.data,
				});
				return response;
			},
			(error) => {
				logger.error("PawaPay API Response Error:", {
					message: error.message,
					response: error.response?.data,
				});
				return Promise.reject(error);
			}
		);
	}

	/**
	 * Handles API errors in a consistent way
	 * 
	 * @param error - The error thrown during API request
	 * @param context - Context about the operation for better error messages
	 * @returns A standardized error response
	 */
	handleApiError(error: unknown, context: string): PawaPayNetworkResponse {
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
			const response = await this.axiosInstance.get<T>(endpoint);
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
			const response = await this.axiosInstance.post<T>(endpoint, data);
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
			const response = await this.axiosInstance.put<T>(endpoint, data);
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
			const response = await this.axiosInstance.delete<T>(endpoint);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}
}
