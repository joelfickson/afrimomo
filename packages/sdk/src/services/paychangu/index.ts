import { BaseService } from "../../utils/baseService";
import { logger } from "../../utils/logger";
import { PayChanguNetworkManager } from "./network";
import type { AccountInfo } from "./types/account";
import type { PaymentDataInfo, PayChanguInitialPayment, PayChanguDirectChargePayment, PayChanguMobileMoneyPayout, PayChanguBankPayout, PayChanguDirectChargeBankTransfer } from "./types/payment";
import type {
	PayChanguPaymentResponse,
	PayChanguTransactionResponse,
	PayChanguDirectChargePaymentResponse,
	PayChanguTransactionDetailsResponse,
	PayChanguOperatorsResponse,
	PayChanguPayoutResponse,
	PayChanguPayoutDetailsResponse,
	PayChanguBanksResponse,
	PayChanguBankTransferResponse,
	PayChanguBankPayoutDetailsResponse,
	PayChanguBankPayoutsListResponse,
	PayChanguBankTransferPaymentResponse,
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
	 * Initializes a direct charge payment for bank transfers
	 * @param amount - The amount to charge
	 * @param chargeId - Unique identifier for this transaction
	 * @param currency - The currency (defaults to MWK)
	 * @param accountInfo - Optional account information for the customer
	 * @returns Promise resolving to the direct charge payment response
	 */
	async initializeDirectChargePayment(
		amount: string | number,
		chargeId: string,
		currency: string = "MWK",
		accountInfo?: Partial<AccountInfo>,
	): Promise<PayChanguDirectChargePaymentResponse> {
		try {
			const directChargeData = {
				amount: amount.toString(),
				currency,
				payment_method: "mobile_bank_transfer",
				charge_id: chargeId,
				...(accountInfo?.email && { email: accountInfo.email }),
				...(accountInfo?.first_name && { first_name: accountInfo.first_name }),
				...(accountInfo?.last_name && { last_name: accountInfo.last_name }),
			} as PayChanguDirectChargePayment;

			logger.info("PayChangu: initializing direct charge payment", { directChargeData });

			const response = await this.networkManager.initializeDirectCharge(directChargeData);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					TransactionDetails: response.data.transaction,
					PaymentAccountDetails: response.data.payment_account_details,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: direct charge payment initialization failed", error);
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
	 * Gets direct charge transaction details by charge ID
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the transaction details response
	 */
	async getDirectChargeTransactionDetails(
		chargeId: string,
	): Promise<PayChanguTransactionDetailsResponse> {
		try {
			logger.info("PayChangu: getting direct charge transaction details", { chargeId });

			const response = await this.networkManager.getTransactionDetails(chargeId);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					TransactionDetails: response.data.transaction,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: direct charge transaction details retrieval failed", error);
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
	 * Gets all supported mobile money operators
	 * @returns Promise resolving to the supported operators response
	 */
	async getMobileMoneyOperators(): Promise<PayChanguOperatorsResponse> {
		try {
			logger.info("PayChangu: getting mobile money operators");

			const response = await this.networkManager.getMobileMoneyOperators();

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					Operators: response.data,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: mobile money operators retrieval failed", error);
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
	 * Initializes a mobile money payout to send funds to a mobile money account
	 * @param mobile - The phone number of the recipient
	 * @param operatorRefId - The mobile money operator's reference ID
	 * @param amount - The amount to send
	 * @param chargeId - Unique identifier for this transaction
	 * @param options - Optional details for the transaction
	 * @returns Promise resolving to the payout response
	 */
	async initializeMobileMoneyPayout(
		mobile: string,
		operatorRefId: string,
		amount: string | number,
		chargeId: string,
		options?: {
			email?: string;
			firstName?: string;
			lastName?: string;
			transactionStatus?: "failed" | "successful";
		}
	): Promise<PayChanguPayoutResponse> {
		try {
			const payoutData: PayChanguMobileMoneyPayout = {
				mobile,
				mobile_money_operator_ref_id: operatorRefId,
				amount: amount.toString(),
				charge_id: chargeId,
				...(options?.email && { email: options.email }),
				...(options?.firstName && { first_name: options.firstName }),
				...(options?.lastName && { last_name: options.lastName }),
				...(options?.transactionStatus && { transaction_status: options.transactionStatus }),
			};

			logger.info("PayChangu: initializing mobile money payout", { payoutData });

			const response = await this.networkManager.initializeMobileMoneyPayout(payoutData);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					PayoutDetails: response.data,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: mobile money payout initialization failed", error);
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
	 * Gets mobile money payout details by charge ID
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the payout details response
	 */
	async getMobileMoneyPayoutDetails(
		chargeId: string,
	): Promise<PayChanguPayoutDetailsResponse> {
		try {
			logger.info("PayChangu: getting mobile money payout details", { chargeId });

			const response = await this.networkManager.getPayoutDetails(chargeId);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					PayoutDetails: response.data,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: mobile money payout details retrieval failed", error);
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
	 * Gets all supported banks for direct charge payouts
	 * @param currency - The currency to filter banks by (defaults to MWK)
	 * @returns Promise resolving to the supported banks response
	 */
	async getSupportedBanks(
		currency = "MWK",
	): Promise<PayChanguBanksResponse> {
		try {
			logger.info("PayChangu: getting supported banks", { currency });

			const response = await this.networkManager.getSupportedBanks(currency);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					Banks: response.data,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: supported banks retrieval failed", error);
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
	 * Initializes a bank payout to send funds to a bank account
	 * @param bankUuid - The UUID of the bank
	 * @param accountName - The recipient's account name
	 * @param accountNumber - The recipient's account number
	 * @param amount - The amount to send
	 * @param chargeId - Unique identifier for this transaction
	 * @param options - Optional details for the transaction
	 * @returns Promise resolving to the bank transfer response
	 */
	async initializeBankPayout(
		bankUuid: string,
		accountName: string,
		accountNumber: string,
		amount: string | number,
		chargeId: string,
		options?: {
			email?: string;
			firstName?: string;
			lastName?: string;
		}
	): Promise<PayChanguBankTransferResponse> {
		try {
			const payoutData: PayChanguBankPayout = {
				payout_method: "bank_transfer",
				bank_uuid: bankUuid,
				bank_account_name: accountName,
				bank_account_number: accountNumber,
				amount: amount.toString(),
				charge_id: chargeId,
				...(options?.email && { email: options.email }),
				...(options?.firstName && { first_name: options.firstName }),
				...(options?.lastName && { last_name: options.lastName }),
			};

			logger.info("PayChangu: initializing bank payout", { payoutData });

			const response = await this.networkManager.initializeBankPayout(payoutData);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					TransactionDetails: response.data.transaction,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: bank payout initialization failed", error);
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
	 * Gets bank payout details by charge ID
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the bank payout details response
	 */
	async getBankPayoutDetails(
		chargeId: string,
	): Promise<PayChanguBankPayoutDetailsResponse> {
		try {
			logger.info("PayChangu: getting bank payout details", { chargeId });

			const response = await this.networkManager.getBankPayoutDetails(chargeId);

			if (!response || (response.status !== "successful" && response.status !== "success")) {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					PayoutDetails: response.data,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: bank payout details retrieval failed", error);
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
	 * Gets all bank payouts with pagination
	 * @param page - The page number to fetch (optional)
	 * @param perPage - The number of records per page (optional)
	 * @returns Promise resolving to the bank payouts list response
	 */
	async getAllBankPayouts(
		page?: number,
		perPage?: number,
	): Promise<PayChanguBankPayoutsListResponse> {
		try {
			logger.info("PayChangu: getting all bank payouts", { page, perPage });

			const response = await this.networkManager.getAllBankPayouts(page, perPage);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					Payouts: response.data.data,
					Pagination: {
						CurrentPage: response.data.current_page,
						TotalPages: response.data.total_pages,
						PerPage: response.data.per_page,
						NextPageUrl: response.data.next_page_url,
					},
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: all bank payouts retrieval failed", error);
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
	 * Process a bank transfer payment
	 * @param bankUuid - The UUID of the bank
	 * @param accountName - The bank account name
	 * @param accountNumber - The bank account number
	 * @param amount - The amount to charge
	 * @param chargeId - Unique identifier for this transaction
	 * @param currency - The currency (defaults to MWK)
	 * @param options - Optional details for the transaction
	 * @returns Promise resolving to the bank transfer payment response
	 */
	async processBankTransfer(
		bankUuid: string,
		accountName: string,
		accountNumber: string,
		amount: string | number,
		chargeId: string,
		currency = "MWK",
		options?: {
			email?: string;
			firstName?: string;
			lastName?: string;
		}
	): Promise<PayChanguBankTransferPaymentResponse> {
		try {
			const bankTransferData: PayChanguDirectChargeBankTransfer = {
				bank_uuid: bankUuid,
				bank_account_name: accountName,
				bank_account_number: accountNumber,
				amount: amount.toString(),
				currency,
				charge_id: chargeId,
				payment_method: "bank_transfer",
				...(options?.email && { email: options.email }),
				...(options?.firstName && { first_name: options.firstName }),
				...(options?.lastName && { last_name: options.lastName }),
			};

			logger.info("PayChangu: processing bank transfer", { bankTransferData });

			const response = await this.networkManager.processBankTransfer(bankTransferData);

			if (!response || response.status !== "success") {
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
					},
				};
			}

			return {
				type: "success",
				payload: {
					TransactionDetails: response.data.transaction,
					PaymentAccountDetails: response.data.payment_account_details,
					RedirectUrl: response.data.redirectUrl,
					HasError: false,
				},
			};
		} catch (error: unknown) {
			logger.error("PayChangu: bank transfer processing failed", error);
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
