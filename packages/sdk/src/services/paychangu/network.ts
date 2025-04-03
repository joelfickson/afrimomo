/**
 * PayChangu Network
 * 
 * Manages network connections for the PayChangu payment service.
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { logger } from "../../utils/logger";
import type { NetworkResponse } from "../../types";

// Base URL for the PayChangu API
const BASE_PAYCHANGU_URL = "https://api.paychangu.com";

/**
 * PayChangu Network
 * 
 * Provides the Axios instance configured with the correct base URL and authentication
 * for making requests to the PayChangu API.
 */
export class PayChanguNetwork {
	/**
	 * The Axios instance for making API requests
	 */
	public readonly axiosInstance: AxiosInstance;

	/**
	 * Creates a new PayChangu Network instance
	 * 
	 * @param secretKey - The API secret key for authentication with PayChangu
	 */
	constructor(secretKey: string) {
		this.axiosInstance = axios.create({
			baseURL: BASE_PAYCHANGU_URL,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${secretKey}`
			},
		});

		this.setupInterceptors();
	}

	/**
	 * Handles API errors in a consistent way
	 * 
	 * @param error - The error thrown during API request
	 * @param context - Context about the operation for better error messages
	 * @returns A standardized error response
	 */
	handleApiError(error: unknown, context: string): NetworkResponse {
		logger.error(`PayChangu API Error - ${context}:`, error);

		let errorMessage = `An error occurred during ${context}`;
		let statusCode = 500;
		let errorObject = "{}";

		if (axios.isAxiosError(error) && error.response) {
			statusCode = error.response.status;

			try {
				const data = error.response.data as {
					message?: string;
					status?: string;
				};
				
				errorMessage = data.message || errorMessage;
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
	 * Make a GET request to the PayChangu API
	 * @param endpoint - API endpoint
	 * @param config - Optional Axios request config
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async get<T>(endpoint: string, config = {}, context = "GET request"): Promise<T> {
		try {
			const response = await this.axiosInstance.get<T>(endpoint, config);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a POST request to the PayChangu API
	 * @param endpoint - API endpoint
	 * @param data - Request payload
	 * @param config - Optional Axios request config
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async post<T>(endpoint: string, data: unknown, config = {}, context = "POST request"): Promise<T> {
		try {
			const response = await this.axiosInstance.post<T>(endpoint, data, config);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a PUT request to the PayChangu API
	 * @param endpoint - API endpoint
	 * @param data - Request payload
	 * @param config - Optional Axios request config
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async put<T>(endpoint: string, data: unknown, config = {}, context = "PUT request"): Promise<T> {
		try {
			const response = await this.axiosInstance.put<T>(endpoint, data, config);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a DELETE request to the PayChangu API
	 * @param endpoint - API endpoint
	 * @param config - Optional Axios request config
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async delete<T>(endpoint: string, config = {}, context = "DELETE request"): Promise<T> {
		try {
			const response = await this.axiosInstance.delete<T>(endpoint, config);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Sets up request and response interceptors for the Axios instance
	 * 
	 * @private
	 */
	private setupInterceptors(): void {
		// Request interceptor
		this.axiosInstance.interceptors.request.use(
			(config) => {
				logger.debug("PayChangu API Request:", {
					method: config.method,
					url: config.url,
					params: config.params,
				});
				return config;
			},
			(error) => {
				logger.error("PayChangu API Request Error:", error);
				return Promise.reject(error);
			}
		);

		// Response interceptor
		this.axiosInstance.interceptors.response.use(
			(response) => {
				logger.debug("PayChangu API Response:", {
					status: response.status,
					statusText: response.statusText,
					data: response.data,
				});
				return response;
			},
			(error) => {
				logger.error("PayChangu API Response Error:", {
					message: error.message,
					response: error.response?.data,
				});
				return Promise.reject(error);
			}
		);
	}
}
