/**
 * PayChangu Network Manager
 * 
 * Handles all API communication with the PayChangu payment gateway.
 * Provides low-level methods that map directly to API endpoints.
 */

import axios, { type AxiosInstance, type AxiosRequestHeaders } from "axios";
import { logger } from "../../utils/logger";
import type { 
	PayChanguInitialPayment, 
	PayChanguDirectChargePayment, 
	PayChanguMobileMoneyPayout,
	PayChanguBankPayout,
	PayChanguDirectChargeBankTransfer
} from "./types/payment";
import type {
	PayChanguErrorResponse,
	PayChanguDirectChargeResponse,
	PayChanguDirectChargeErrorResponse,
	PayChanguSingleTransactionResponse,
	PayChanguMobileMoneyOperatorsResponse,
	PayChanguMobileMoneyPayoutResponse,
	PayChanguSinglePayoutResponse,
	PayChanguSupportedBanksResponse,
	PayChanguBankPayoutResponse,
	PayChanguSingleBankPayoutResponse,
	PayChanguAllBankPayoutsResponse,
	PayChanguDirectChargeBankTransferResponse,
} from "./types/response";

/**
 * Manages network communication with the PayChangu API
 * 
 * This class handles direct API calls to PayChangu endpoints, providing
 * a clean interface for the main service class to use.
 */
export class PayChanguNetworkManager {
	private readonly axiosInstance: AxiosInstance;

	/**
	 * Creates a new instance of the PayChangu network manager
	 * 
	 * @param secretKey - The API secret key for authentication with PayChangu
	 */
	constructor(secretKey: string) {
		const headers = {} as AxiosRequestHeaders;

		if (secretKey) {
			headers.Authorization = `Bearer ${secretKey}`;
		}

		this.axiosInstance = axios.create({
			baseURL: "https://api.paychangu.com",
			headers,
		});

		this.setupInterceptors();
	}

	// #region Direct Charge Methods

	/**
	 * Initiates a payment using the standard PayChangu flow
	 * 
	 * @param data - The payment data
	 * @returns Promise resolving to the payment response
	 */
	public async initiatePayment(
		data: PayChanguInitialPayment,
	): Promise<PayChanguDirectChargeResponse | PayChanguErrorResponse> {
		try {
			logger.info("Initiating PayChangu payment:", data);

			const response = await this.axiosInstance.post("/payment", data, {
				headers: {
					Accept: "application/json",
				},
			});

			return response.data;
		} catch (error) {
			logger.error("Error initiating PayChangu payment:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while processing the payment",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	/**
	 * Initializes a direct charge payment through bank transfer
	 * 
	 * @param data - The direct charge payment data
	 * @returns Promise resolving to the direct charge response
	 */
	public async initializeDirectCharge(
		data: PayChanguDirectChargePayment,
	): Promise<PayChanguDirectChargeResponse | PayChanguDirectChargeErrorResponse | PayChanguErrorResponse> {
		try {
			logger.info("Initializing PayChangu direct charge payment:", data);

			const response = await this.axiosInstance.post(
				"/direct-charge/payments/initialize", 
				data, 
				{
					headers: {
						Accept: "application/json",
					},
				}
			);

			return response.data;
		} catch (error) {
			logger.error("Error initializing PayChangu direct charge payment:", error);

			if (axios.isAxiosError(error)) {
				if (error.response?.data?.status === "failed") {
					return error.response.data as PayChanguDirectChargeErrorResponse;
				}

				return {
					message:
						error.response?.data?.message ||
						"An error occurred while processing the direct charge payment",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	/**
	 * Gets details for a specific direct charge transaction
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the transaction details
	 */
	public async getTransactionDetails(
		chargeId: string,
	): Promise<PayChanguSingleTransactionResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu transaction details:", chargeId);

			const response = await this.axiosInstance.get(
				`/direct-charge/transactions/${chargeId}/details`,
				{
					headers: {
						Accept: "application/json",
					},
				},
			);

			return response.data;
		} catch (error) {
			logger.error("Error getting PayChangu transaction details:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while retrieving transaction details",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	/**
	 * Processes a bank transfer payment
	 * 
	 * @param data - The bank transfer data
	 * @returns Promise resolving to the bank transfer response
	 */
	public async processBankTransfer(
		data: PayChanguDirectChargeBankTransfer,
	): Promise<PayChanguDirectChargeBankTransferResponse | PayChanguErrorResponse> {
		try {
			logger.info("Processing PayChangu bank transfer:", data);

			const response = await this.axiosInstance.post(
				"/direct-charge/payments/bank-transfer", 
				data, 
				{
					headers: {
						Accept: "application/json",
					},
				}
			);

			return response.data;
		} catch (error) {
			logger.error("Error processing PayChangu bank transfer:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while processing the bank transfer",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	// #endregion

	// #region Mobile Money Methods

	/**
	 * Gets all supported mobile money operators
	 * 
	 * @returns Promise resolving to the list of operators
	 */
	public async getMobileMoneyOperators(): Promise<PayChanguMobileMoneyOperatorsResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu mobile money operators");

			const response = await this.axiosInstance.get(
				"/mobile-money",
				{
					headers: {
						Accept: "application/json",
					},
				},
			);

			return response.data;
		} catch (error) {
			logger.error("Error getting PayChangu mobile money operators:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while retrieving mobile money operators",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	/**
	 * Initializes a mobile money payout
	 * 
	 * @param data - The mobile money payout data
	 * @returns Promise resolving to the payout response
	 */
	public async initializeMobileMoneyPayout(
		data: PayChanguMobileMoneyPayout,
	): Promise<PayChanguMobileMoneyPayoutResponse | PayChanguErrorResponse> {
		try {
			logger.info("Initializing PayChangu mobile money payout:", data);

			const response = await this.axiosInstance.post(
				"/mobile-money/payouts/initialize", 
				data, 
				{
					headers: {
						Accept: "application/json",
					},
				}
			);

			return response.data;
		} catch (error) {
			logger.error("Error initializing PayChangu mobile money payout:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while processing the mobile money payout",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	/**
	 * Gets details of a specific mobile money payout
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the payout details
	 */
	public async getPayoutDetails(
		chargeId: string,
	): Promise<PayChanguSinglePayoutResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu payout details:", chargeId);

			const response = await this.axiosInstance.get(
				`/mobile-money/payments/${chargeId}/details`,
				{
					headers: {
						Accept: "application/json",
					},
				},
			);

			return response.data;
		} catch (error) {
			logger.error("Error getting PayChangu payout details:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while retrieving payout details",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	// #endregion

	// #region Bank Methods

	/**
	 * Gets all supported banks for a specific currency
	 * 
	 * @param currency - The currency to filter banks by
	 * @returns Promise resolving to the list of banks
	 */
	public async getSupportedBanks(
		currency = "MWK",
	): Promise<PayChanguSupportedBanksResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu supported banks for currency:", currency);

			const response = await this.axiosInstance.get(
				"/direct-charge/payouts/supported-banks",
				{
					headers: {
						Accept: "application/json",
					},
					params: {
						currency,
					},
				},
			);

			return response.data;
		} catch (error) {
			logger.error("Error getting PayChangu supported banks:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while retrieving supported banks",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	/**
	 * Initializes a bank payout
	 * 
	 * @param data - The bank payout data
	 * @returns Promise resolving to the bank payout response
	 */
	public async initializeBankPayout(
		data: PayChanguBankPayout,
	): Promise<PayChanguBankPayoutResponse | PayChanguErrorResponse> {
		try {
			logger.info("Initializing PayChangu bank payout:", data);

			const response = await this.axiosInstance.post(
				"/direct-charge/payouts/initialize", 
				data, 
				{
					headers: {
						Accept: "application/json",
					},
				}
			);

			return response.data;
		} catch (error) {
			logger.error("Error initializing PayChangu bank payout:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while processing the bank payout",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	/**
	 * Gets details of a specific bank payout
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the bank payout details
	 */
	public async getBankPayoutDetails(
		chargeId: string,
	): Promise<PayChanguSingleBankPayoutResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu bank payout details:", chargeId);

			const response = await this.axiosInstance.get(
				`/direct-charge/payouts/${chargeId}/details`,
				{
					headers: {
						Accept: "application/json",
					},
				},
			);

			return response.data;
		} catch (error) {
			logger.error("Error getting PayChangu bank payout details:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while retrieving bank payout details",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	/**
	 * Gets a paginated list of all bank payouts
	 * 
	 * @param page - The page number to fetch (optional)
	 * @param perPage - The number of records per page (optional)
	 * @returns Promise resolving to the bank payouts list
	 */
	public async getAllBankPayouts(
		page?: number,
		perPage?: number,
	): Promise<PayChanguAllBankPayoutsResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting all PayChangu bank payouts");

			const response = await this.axiosInstance.get(
				"/direct-charge/payouts",
				{
					headers: {
						Accept: "application/json",
					},
					params: {
						...(page && { page }),
						...(perPage && { per_page: perPage }),
					},
				},
			);

			return response.data;
		} catch (error) {
			logger.error("Error getting all PayChangu bank payouts:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while retrieving bank payouts",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

	// #endregion

	/**
	 * Sets up the request/response interceptors for the Axios instance
	 * @private
	 */
	private setupInterceptors(): void {
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => Promise.reject(error),
		);
	}
}
