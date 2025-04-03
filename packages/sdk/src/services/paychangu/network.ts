import axios, { type AxiosInstance, type AxiosRequestHeaders } from "axios";
import { logger } from "../../utils/logger";
import type { PayChanguInitialPayment, PayChanguDirectChargePayment } from "./types/payment";
import type {
	PayChanguRedirectAPIResponse,
	PayChanguErrorResponse,
	PayChanguVerificationResponse,
	PayChanguDirectChargeResponse,
	PayChanguDirectChargeErrorResponse,
	PayChanguSingleTransactionResponse,
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

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => Promise.reject(error),
		);
	}
}
