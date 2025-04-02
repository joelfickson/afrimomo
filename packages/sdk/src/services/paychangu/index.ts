import { BaseService } from "@afrimomo-sdk/utils/baseService";
import { logger } from "@afrimomo-sdk/utils/logger";
import { PayChanguNetworkManager } from "@afrimomo-sdk/services/paychangu/network";
import type { AccountInfo } from "@afrimomo-sdk/services/paychangu/types/account";
import type { PaymentDataInfo, PayChanguInitialPayment } from "@afrimomo-sdk/services/paychangu/types/payment";
import type {
	PayChanguPaymentResponse,
	PayChanguTransactionResponse,
} from "./types/response";

export * from "./types";

export class PayChangu extends BaseService {
	private readonly networkManager: PayChanguNetworkManager;

	constructor(secretKey: string) {
		super();
		this.networkManager = new PayChanguNetworkManager(secretKey);
	}

	/**
	 * Initiates a payment process
	 * @param paymentData - Payment data information
	 * @param accountInfo - Account information for the payment
	 * @returns Promise resolving to the payment response
	 */
	async initiatePayment(
		paymentData: PaymentDataInfo,
		accountInfo: AccountInfo,
	): Promise<PayChanguPaymentResponse> {
		try {
			const { currency, price } = this.convertToPreferredCurrency(
				Number(paymentData.purchase_amount),
				paymentData.purchase_currency,
				"MWK",
			);

			const paychanguPurchaseData: PayChanguInitialPayment = {
				meta: {
					response: "Response",
					uuid: paymentData.account_id,
				},
				currency: currency.toString(),
				amount: price.toString(),
				tx_ref: this.generateTransactionId(),
				email: accountInfo.email,
				first_name: accountInfo.first_name,
				last_name: accountInfo.last_name,
				callback_url: process.env.PAYCHANGU_RETURN_URL || "",
				return_url: process.env.PAYCHANGU_RETURN_URL || "",
				customization: {
					title: paymentData.item_title,
					description: paymentData.description,
				},
			};

			logger.info("PayChangu: initiating payment", { paychanguPurchaseData });

			const response = await this.networkManager.initiatePayment(
				paychanguPurchaseData,
			);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			const finalPaymentData: PaymentDataInfo = {
				...paymentData,
				purchase_amount: price.toString(),
				purchase_currency: currency.toString(),
			};

			return {
				type: "success",
				payload: {
					InitialPaymentData: finalPaymentData,
					SpecialPaymentData: response.data,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: payment initiation failed", error);
			return {
				type: "error",
				payload: {
					HasError: true,
					StackTraceError: error,
				},
			};
		}
	}

	/**
	 * Gets transaction details by ID
	 * @param transactionId - The transaction ID to look up
	 * @returns Promise resolving to the transaction response
	 */
	async getTransactionById(
		transactionId: string,
	): Promise<PayChanguTransactionResponse> {
		try {
			logger.info("PayChangu: getting transaction by ID", { transactionId });

			const verificationResponse =
				await this.networkManager.verifyPayment(transactionId);

			if (!verificationResponse || verificationResponse.status !== "success") {
				return {
					HasError: true,
					StackTraceError: verificationResponse,
				};
			}

			return {
				HasError: false,
				...verificationResponse,
			};
		} catch (error: unknown) {
			logger.error("PayChangu: transaction verification failed", error);
			return {
				HasError: true,
				StackTraceError: error,
			};
		}
	}

	/**
	 * Refreshes a payment session
	 * @param paymentData - Payment data information
	 * @param accountInfo - Account information for the payment
	 * @returns Promise resolving to the payment response
	 */
	async refreshPaymentSession(
		paymentData: PaymentDataInfo,
		accountInfo: AccountInfo,
	): Promise<PayChanguPaymentResponse> {
		return this.initiatePayment(paymentData, accountInfo);
	}

	private generateTransactionId(): string {
		return `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private convertToPreferredCurrency(
		amount: number,
		fromCurrency: string,
		toCurrency: string,
	): { currency: string; price: number } {
		// TODO: Implement actual currency conversion logic
		// For now, just return the amount in the target currency
		return {
			currency: toCurrency,
			price: amount,
		};
	}
}
