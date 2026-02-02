/**
 * Generic Payment Provider
 *
 * A generic adapter for any payment provider using the unified API Network Manager.
 * This allows for easy integration of new payment providers with minimal code changes.
 */

import {
	ApiNetworkManager,
	ApiConfig,
	AuthConfig,
} from "../../utils/apiNetworkManager";
import { logger } from "../../utils/logger";
import type { PawaPayNetworkResponse } from "../../types";

// Generic transaction interface that can be extended by specific providers
export interface GenericTransaction {
	id: string;
	amount: string;
	status: string;
	timestamp: string;
	[key: string]: unknown;
}

// Generic payment request interface
export interface GenericPaymentRequest {
	amount: string | number;
	currency: string;
	reference: string;
	description?: string;
	customerInfo?: {
		email?: string;
		name?: string;
		phone?: string;
		[key: string]: unknown;
	};
	metadata?: Record<string, unknown>;
	[key: string]: unknown;
}

// Generic payment response interface
export interface GenericPaymentResponse {
	success: boolean;
	transactionId?: string;
	redirectUrl?: string;
	message?: string;
	[key: string]: unknown;
}

/**
 * Configuration for a payment provider adapter
 */
export interface PaymentProviderConfig {
	name: string;
	baseUrl: string;
	authType: "bearer" | "basic" | "none";
	authToken?: string;
	username?: string;
	password?: string;
	defaultHeaders?: Record<string, string>;
	endpoints: {
		createPayment: string;
		getTransaction: string;
		getBalance?: string;
		[key: string]: string | undefined;
	};
	requestTransformer?: (
		request: GenericPaymentRequest,
	) => Record<string, unknown>;
	responseTransformer?: <T>(response: unknown) => T;
}

/**
 * Generic Payment Provider Adapter
 *
 * Can be configured for any payment provider with minimal code changes.
 */
export class PaymentProviderAdapter {
	private readonly network: ApiNetworkManager;
	private readonly config: PaymentProviderConfig;

	/**
	 * Creates a new payment provider adapter
	 *
	 * @param config - The configuration for this payment provider
	 */
	constructor(config: PaymentProviderConfig) {
		this.config = config;

		// Configure API settings
		const apiConfig: ApiConfig = {
			baseUrl: config.baseUrl,
			serviceName: config.name,
			headers: config.defaultHeaders,
		};

		// Configure authentication
		const authConfig: AuthConfig = {
			type: config.authType,
			token: config.authToken,
			username: config.username,
			password: config.password,
		};

		// Create the network manager
		this.network = new ApiNetworkManager(apiConfig, authConfig);
	}

	/**
	 * Creates a new payment
	 *
	 * @param request - The payment request data
	 * @returns The payment response
	 */
	async createPayment(
		request: GenericPaymentRequest,
	): Promise<GenericPaymentResponse> {
		try {
			// Transform the request if a transformer is provided
			const requestData = this.config.requestTransformer
				? this.config.requestTransformer(request)
				: request;

			logger.info(`${this.config.name}: Creating payment`, {
				amount: request.amount,
				currency: request.currency,
			});

			// Make the API request
			const response = await this.network.post(
				this.config.endpoints.createPayment,
				requestData,
				{},
				`creating payment for ${request.amount} ${request.currency}`,
			);

			// Transform the response if a transformer is provided
			return this.config.responseTransformer
				? this.config.responseTransformer<GenericPaymentResponse>(response)
				: (response as GenericPaymentResponse);
		} catch (error) {
			logger.error(`${this.config.name}: Failed to create payment`, error);

			if ((error as PawaPayNetworkResponse).errorMessage) {
				return {
					success: false,
					message: (error as PawaPayNetworkResponse).errorMessage,
				};
			}

			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	/**
	 * Gets a transaction by ID
	 *
	 * @param transactionId - The transaction ID to look up
	 * @returns The transaction details
	 */
	async getTransaction(
		transactionId: string,
	): Promise<GenericTransaction | null> {
		try {
			logger.info(`${this.config.name}: Getting transaction`, {
				transactionId,
			});

			// Replace any placeholders in the endpoint
			const endpoint = this.config.endpoints.getTransaction.replace(
				"{id}",
				transactionId,
			);

			// Make the API request
			const response = await this.network.get(
				endpoint,
				{},
				`getting transaction ${transactionId}`,
			);

			// Transform the response if a transformer is provided
			return this.config.responseTransformer
				? this.config.responseTransformer<GenericTransaction>(response)
				: (response as GenericTransaction);
		} catch (error) {
			logger.error(`${this.config.name}: Failed to get transaction`, error);
			return null;
		}
	}

	/**
	 * Gets the wallet balance (if supported by the provider)
	 *
	 * @returns The wallet balance
	 */
	async getBalance(): Promise<{ balance: string; currency: string } | null> {
		// Check if this provider supports balance checking
		if (!this.config.endpoints.getBalance) {
			logger.warn(`${this.config.name}: Balance checking not supported`);
			return null;
		}

		try {
			logger.info(`${this.config.name}: Getting balance`);

			// Make the API request
			const response = await this.network.get(
				this.config.endpoints.getBalance,
				{},
				"getting wallet balance",
			);

			// Transform the response if a transformer is provided
			return this.config.responseTransformer
				? this.config.responseTransformer<{
						balance: string;
						currency: string;
				  }>(response)
				: (response as { balance: string; currency: string });
		} catch (error) {
			logger.error(`${this.config.name}: Failed to get balance`, error);
			return null;
		}
	}

	/**
	 * Makes a custom API request to this provider
	 *
	 * @param method - The HTTP method
	 * @param endpoint - The API endpoint
	 * @param data - The request data (for POST, PUT)
	 * @param config - Additional Axios configuration
	 * @returns The API response
	 */
	async request<T>(
		method: "get" | "post" | "put" | "delete",
		endpoint: string,
		data?: unknown,
		config?: Record<string, unknown>,
	): Promise<T | null> {
		try {
			logger.info(
				`${
					this.config.name
				}: Making custom ${method.toUpperCase()} request to ${endpoint}`,
			);

			let response: T | null = null;

			switch (method) {
				case "get":
					response = await this.network.get<T>(
						endpoint,
						config || {},
						`custom ${method} request`,
					);
					break;
				case "post":
					response = await this.network.post<T>(
						endpoint,
						data || {},
						config || {},
						`custom ${method} request`,
					);
					break;
				case "put":
					response = await this.network.put<T>(
						endpoint,
						data || {},
						config || {},
						`custom ${method} request`,
					);
					break;
				case "delete":
					response = await this.network.delete<T>(
						endpoint,
						config || {},
						`custom ${method} request`,
					);
					break;
			}

			return response;
		} catch (error) {
			logger.error(`${this.config.name}: Custom request failed`, error);
			return null;
		}
	}
}
