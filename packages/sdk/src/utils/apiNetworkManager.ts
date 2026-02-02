import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { logger } from "./logger";
import type { PawaPayNetworkResponse } from "../types";

export interface ApiConfig {
	baseUrl: string;
	headers?: Record<string, string>;
	serviceName: string;
	timeoutMs?: number;
}

export interface AuthConfig {
	type: "bearer" | "basic" | "none";
	token?: string;
	username?: string;
	password?: string;
}

/**
 * Unified API Network Manager for handling API requests across different services
 *
 * This class provides a consistent interface for making API requests and handling errors
 * for different payment providers and services.
 */
export class ApiNetworkManager {
	protected readonly axiosInstance: AxiosInstance;
	private readonly serviceName: string;

	/**
	 * Creates a new API Network Manager
	 *
	 * @param apiConfig - Configuration for the API service
	 * @param authConfig - Authentication configuration
	 */
	constructor(apiConfig: ApiConfig, authConfig: AuthConfig) {
		this.serviceName = apiConfig.serviceName;

		// Build headers with authentication
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			Accept: "application/json",
			...(apiConfig.headers || {}),
		};

		// Add authentication headers based on type
		if (authConfig.type === "bearer" && authConfig.token) {
			headers.Authorization = `Bearer ${authConfig.token}`;
		} else if (
			authConfig.type === "basic" &&
			authConfig.username &&
			authConfig.password
		) {
			const basicAuth = Buffer.from(
				`${authConfig.username}:${authConfig.password}`,
			).toString("base64");
			headers.Authorization = `Basic ${basicAuth}`;
		}

		// Create Axios instance
		this.axiosInstance = axios.create({
			baseURL: apiConfig.baseUrl,
			headers,
			timeout: apiConfig.timeoutMs || 30000,
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
	handleApiError(error: unknown, context: string): PawaPayNetworkResponse {
		logger.error(`${this.serviceName} API Error - ${context}:`, error);

		let errorMessage = `An error occurred during ${context}`;
		let statusCode = 500;
		let errorObject = "{}";

		if (axios.isAxiosError(error) && error.response) {
			statusCode = error.response.status;

			try {
				const data = error.response.data as {
					message?: string;
					error?: string;
					status?: string;
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
	 * Make a GET request to the API
	 * @param endpoint - API endpoint
	 * @param config - Optional Axios request config
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async get<T>(
		endpoint: string,
		config: AxiosRequestConfig = {},
		context = "GET request",
	): Promise<T> {
		try {
			const response = await this.axiosInstance.get<T>(endpoint, config);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a POST request to the API
	 * @param endpoint - API endpoint
	 * @param data - Request payload
	 * @param config - Optional Axios request config
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async post<T>(
		endpoint: string,
		data: unknown,
		config: AxiosRequestConfig = {},
		context = "POST request",
	): Promise<T> {
		try {
			const response = await this.axiosInstance.post<T>(endpoint, data, config);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a PUT request to the API
	 * @param endpoint - API endpoint
	 * @param data - Request payload
	 * @param config - Optional Axios request config
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async put<T>(
		endpoint: string,
		data: unknown,
		config: AxiosRequestConfig = {},
		context = "PUT request",
	): Promise<T> {
		try {
			const response = await this.axiosInstance.put<T>(endpoint, data, config);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Make a DELETE request to the API
	 * @param endpoint - API endpoint
	 * @param config - Optional Axios request config
	 * @param context - Context for error handling
	 * @returns Promise resolving to the response data
	 */
	async delete<T>(
		endpoint: string,
		config: AxiosRequestConfig = {},
		context = "DELETE request",
	): Promise<T> {
		try {
			const response = await this.axiosInstance.delete<T>(endpoint, config);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	/**
	 * Gets the underlying Axios instance for more complex requests
	 * @returns The Axios instance
	 */
	getInstance(): AxiosInstance {
		return this.axiosInstance;
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
				logger.debug(`${this.serviceName} API Request:`, {
					method: config.method,
					url: config.url,
					params: config.params,
				});
				return config;
			},
			(error) => {
				logger.error(`${this.serviceName} API Request Error:`, error);
				return Promise.reject(error);
			},
		);

		// Response interceptor
		this.axiosInstance.interceptors.response.use(
			(response) => {
				logger.debug(`${this.serviceName} API Response:`, {
					status: response.status,
					statusText: response.statusText,
					data: response.data,
				});
				return response;
			},
			(error) => {
				logger.error(`${this.serviceName} API Response Error:`, {
					message: error.message,
					response: error.response?.data,
				});
				return Promise.reject(error);
			},
		);
	}
}
