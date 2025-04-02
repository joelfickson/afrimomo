import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { logger } from "../../utils/logger";
import {
	PayChanguInitialPayment,
	PayChanguRedirectAPIResponse,
	PayChanguErrorResponse,
	PayChanguVerificationResponse,
} from "./types";

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

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => Promise.reject(error),
		);
	}
}
