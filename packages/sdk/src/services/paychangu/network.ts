/**
 * PayChangu Network
 * 
 * Manages network connections for the PayChangu payment service.
 */

import axios, { AxiosInstance } from "axios";
import { logger } from "../../utils/logger";

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
