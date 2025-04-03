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
	PayChanguRedirectAPIResponse,
	PayChanguErrorResponse,
	PayChanguVerificationResponse,
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

export class PayChanguNetworkManager {
	private readonly axiosInstance: AxiosInstance;

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

	public async initiatePayment(
		data: PayChanguInitialPayment,
	): Promise<PayChanguRedirectAPIResponse | PayChanguErrorResponse> {
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

	public async verifyPayment(
		txRef: string,
	): Promise<PayChanguVerificationResponse | PayChanguErrorResponse> {
		try {
			logger.info("Verifying PayChangu payment:", txRef);

			const response = await this.axiosInstance.get(
				`/verify-payment/${txRef}`,
				{
					headers: {
						Accept: "application/json",
					},
				},
			);

			return response.data;
		} catch (error) {
			logger.error("Error verifying PayChangu payment:", error);

			if (axios.isAxiosError(error)) {
				return {
					message:
						error.response?.data?.message ||
						"An error occurred while verifying the payment",
					status: "error",
				};
			}

			return {
				message: "An unexpected error occurred",
				status: "error",
			};
		}
	}

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

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => Promise.reject(error),
		);
	}
}
