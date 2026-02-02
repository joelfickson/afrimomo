import axios, { AxiosInstance } from "axios";
import { logger } from "../../utils/logger";
import { OneKhusaTokenManager } from "./auth";
import type {
	OneKhusaEnvironment,
	OneKhusaErrorResponse,
} from "./types/common";

export class OneKhusaNetwork {
	public readonly axiosInstance: AxiosInstance;
	private readonly tokenManager: OneKhusaTokenManager;

	constructor(
		apiKey: string,
		apiSecret: string,
		private readonly organisationId: string,
		environment: OneKhusaEnvironment = "DEVELOPMENT",
	) {
		const baseUrl =
			environment === "PRODUCTION"
				? "https://api.onekhusa.com/v1"
				: "https://sandbox.api.onekhusa.com/v1";

		this.tokenManager = new OneKhusaTokenManager(
			apiKey,
			apiSecret,
			environment,
		);

		this.axiosInstance = axios.create({
			baseURL: baseUrl,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.request.use(
			async (config) => {
				const token = await this.tokenManager.getToken();
				config.headers.Authorization = `Bearer ${token}`;
				config.headers["Organisation-Id"] = this.organisationId;

				logger.debug("OneKhusa API Request:", {
					method: config.method,
					url: config.url,
					headers: {
						...config.headers,
						Authorization: "Bearer [REDACTED]",
					},
					data: config.data,
				});

				return config;
			},
			(error) => {
				logger.error("OneKhusa API Request Error:", error);
				return Promise.reject(error);
			},
		);

		this.axiosInstance.interceptors.response.use(
			(response) => {
				logger.debug("OneKhusa API Response:", {
					status: response.status,
					statusText: response.statusText,
					data: response.data,
				});
				return response;
			},
			(error) => {
				logger.error("OneKhusa API Response Error:", {
					message: error.message,
					response: error.response?.data,
				});
				return Promise.reject(error);
			},
		);
	}

	handleApiError(error: unknown, context: string): OneKhusaErrorResponse {
		logger.error(`OneKhusa API Error - ${context}:`, error);

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

	async get<T>(endpoint: string, context = "GET request"): Promise<T> {
		try {
			const response = await this.axiosInstance.get<T>(endpoint);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	async post<T>(
		endpoint: string,
		data: unknown,
		context = "POST request",
	): Promise<T> {
		try {
			const response = await this.axiosInstance.post<T>(endpoint, data);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	async put<T>(
		endpoint: string,
		data: unknown,
		context = "PUT request",
	): Promise<T> {
		try {
			const response = await this.axiosInstance.put<T>(endpoint, data);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	async patch<T>(
		endpoint: string,
		data?: unknown,
		context = "PATCH request",
	): Promise<T> {
		try {
			const response = await this.axiosInstance.patch<T>(endpoint, data);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	async delete<T>(endpoint: string, context = "DELETE request"): Promise<T> {
		try {
			const response = await this.axiosInstance.delete<T>(endpoint);
			return response.data;
		} catch (error) {
			throw this.handleApiError(error, context);
		}
	}

	clearTokenCache(): void {
		this.tokenManager.clearToken();
	}
}
