/**
 * PayChangu Payment Service
 * 
 * Provides a unified interface for interacting with the PayChangu payment gateway.
 * Supports multiple payment methods including direct charge, bank transfers, and mobile money.
 * 
 * @module PayChangu
 */

import axios from "axios";
import { BaseService } from "../../utils/baseService";
import { logger } from "../../utils/logger";
import { PayChanguNetwork } from "./network";
import type { AccountInfo } from "./types/account";
import { PayChangu as PayChanguTypes } from "./types";
import type { 
	PayChanguInitialPayment,
	PayChanguDirectChargePayment,
	PayChanguMobileMoneyPayout,
	PayChanguBankPayout,
	PayChanguDirectChargeBankTransfer,
	PayChanguCustomization,
} from "./types/payment";
import type {
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
	PayChanguVerifyTransactionResponse,
	PayChanguPaymentInitiationResponse,
	PayChanguPaymentInitiationErrorResponse,
} from "./types/response";

export * from "./types";

/**
 * PayChangu Service - Main class for interacting with the PayChangu payment gateway
 * 
 * This service provides methods for:
 * - Direct charge payments (virtual accounts)
 * - Bank transfers
 * - Mobile money operations
 * - Bank payouts
 */
export class PayChangu extends BaseService {
	private readonly network: PayChanguNetwork;

	/**
	 * Creates a new instance of the PayChangu service
	 * 
	 * @param secretKey - The API secret key for authentication with PayChangu
	 */
	constructor(secretKey: string) {
		super();
		this.network = new PayChanguNetwork(secretKey);
	}

	/**
	 * Handles API errors in a consistent way
	 * 
	 * @param error - The error thrown during API request
	 * @param context - Context about the operation for better error messages
	 * @returns A standardized error response
	 * @private
	 */
	private handleApiError(error: unknown, context: string): PayChanguErrorResponse {
		console.log(error);
		logger.error(`PayChangu API Error - ${context}: ${JSON.stringify(error, null, 2)}`);

		if (axios.isAxiosError(error) && error.response?.data) {
			if (error.response.data.status === "error" || error.response.data.status === "failed") {
				return error.response.data as PayChanguErrorResponse;
			}

			return {
				message: error.response.data.message || `An error occurred during ${context}`,
				status: "error"
			};
		}
		
		// Handle unexpected errors
		return {
			message: error instanceof Error ? error.message : `An unexpected error occurred during ${context}`,
			status: "error"
		};
	}

	/**
	 * Creates a standardized error response for higher-level methods
	 * 
	 * @param error - The error or error response from lower-level methods
	 * @param context - Context about the operation for better error messages
	 * @param defaultPayload - Default payload object for the error response
	 * @returns A standardized error response with the specified payload type
	 * @private
	 */
	private createStandardErrorResponse<T>(
		error: unknown, 
		context: string, 
		defaultPayload: T
	): { type: "error", payload: T & { HasError: true, StackTraceError: unknown } } {
		logger.error(`PayChangu Service Error - ${context}:`, error);
		
		return {
			type: "error",
			payload: {
				...defaultPayload,
				HasError: true,
				StackTraceError: error,
			},
		};
	}

	/**
	 * Creates a standardized success response for higher-level methods
	 * 
	 * @param payload - The payload to include in the success response
	 * @returns A standardized success response with the specified payload type
	 * @private
	 */
	private createStandardSuccessResponse<T>(
		payload: T
	): { type: "success", payload: T & { HasError: false } } {
		return {
			type: "success",
			payload: {
				...payload,
				HasError: false,
			},
		};
	}

	// #region Direct Charge Methods

	/**
	 * Initiates a payment using the standard PayChangu flow
	 * 
	 * @param data - The payment data
	 * @returns Promise resolving to the payment response
	 */
	public async initiatePayment(
		data: PayChanguInitialPayment
	): Promise<PayChanguPaymentInitiationResponse | PayChanguPaymentInitiationErrorResponse> {
		try {
			logger.info("Initiating PayChangu payment:", data);

			const response = await this.network.post<PayChanguPaymentInitiationResponse>(
				"/payment", 
				data,
				{
					headers: {
						Accept: "application/json",
					},
				},
				"payment initiation"
			);

			return response;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.data) {
				return error.response.data as PayChanguPaymentInitiationErrorResponse;
			}
			
			return {
				status: "failed",
				message: error instanceof Error ? error.message : "An unexpected error occurred",
				data: null,
			};
		}
	}

	/**
	 * Initializes a direct charge payment through bank transfer
	 * 
	 * @param data - The direct charge payment data
	 * @returns Promise resolving to the direct charge response
	 */
	private async initializeDirectCharge(
		data: PayChanguDirectChargePayment,
	): Promise<PayChanguDirectChargeResponse | PayChanguDirectChargeErrorResponse | PayChanguErrorResponse> {
		try {
			logger.info("Initializing PayChangu direct charge payment:", data);

			return await this.network.post<PayChanguDirectChargeResponse | PayChanguDirectChargeErrorResponse>(
				"/direct-charge/payments/initialize", 
				data, 
				{
					headers: {
						Accept: "application/json",
					},
				},
				"direct charge initialization"
			);
		} catch (error) {
			// Special handling for direct charge errors that have a "failed" status
			if (axios.isAxiosError(error) && error.response?.data?.status === "failed") {
				return error.response.data as PayChanguDirectChargeErrorResponse;
			}
			
			return this.handleApiError(error, "direct charge initialization");
		}
	}

	/**
	 * Gets details for a specific direct charge transaction
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the transaction details
	 */
	private async getTransactionDetails(
		chargeId: string,
	): Promise<PayChanguSingleTransactionResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu transaction details:", chargeId);

			return await this.network.get<PayChanguSingleTransactionResponse>(
				`/direct-charge/transactions/${chargeId}/details`,
				{
					headers: {
						Accept: "application/json",
					},
				},
				`transaction details retrieval for ${chargeId}`
			);
		} catch (error) {
			return this.handleApiError(error, "transaction details retrieval");
		}
	}

	/**
	 * Processes a bank transfer payment
	 * 
	 * @param data - The bank transfer data
	 * @returns Promise resolving to the bank transfer response
	 */
	private async processBankTransferDirect(
		data: PayChanguDirectChargeBankTransfer,
	): Promise<PayChanguDirectChargeBankTransferResponse | PayChanguErrorResponse> {
		try {
			logger.info("Processing PayChangu bank transfer:", data);

			return await this.network.post<PayChanguDirectChargeBankTransferResponse>(
				"/direct-charge/payments/bank-transfer", 
				data, 
				{
					headers: {
						Accept: "application/json",
					},
				},
				"bank transfer processing"
			);
		} catch (error) {
			return this.handleApiError(error, "bank transfer processing");
		}
	}

	/**
	 * Initiates a direct charge payment via virtual account
	 * 
	 * Creates a dynamic virtual account to facilitate instant payments through bank transfers.
	 * 
	 * @param amount - The amount to charge
	 * @param chargeId - Unique identifier for this transaction
	 * @param currency - The currency (defaults to MWK)
	 * @param accountInfo - Optional account information for the customer
	 * @returns Promise resolving to the direct charge payment response
	 */
	async initializeDirectChargePayment(
		amount: string | number,
		chargeId: string,
		currency = "MWK",
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

			const response = await this.initializeDirectCharge(directChargeData);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"direct charge payment initialization",
					{
						TransactionDetails: {} as PayChanguTypes.BaseTransaction,
						PaymentAccountDetails: {
							account_name: "",
							account_number: "",
							code: "",
							name: "",
						},
					}
				);
			}

			return this.createStandardSuccessResponse({
				TransactionDetails: response.data.transaction,
				PaymentAccountDetails: response.data.payment_account_details,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"direct charge payment initialization",
				{
					TransactionDetails: {} as PayChanguTypes.BaseTransaction,
					PaymentAccountDetails: {
						account_name: "",
						account_number: "",
						code: "",
						name: "",
					},
				}
			);
		}
	}

	/**
	 * Gets transaction details for a direct charge payment
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the transaction details response
	 */
	async getDirectChargeTransactionDetails(
		chargeId: string,
	): Promise<PayChanguTransactionDetailsResponse> {
		try {
			logger.info("PayChangu: getting direct charge transaction details", { chargeId });

			const response = await this.getTransactionDetails(chargeId);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"direct charge transaction details retrieval",
					{
						TransactionDetails: {} as PayChanguTypes.BaseTransaction,
					}
				);
			}

			return this.createStandardSuccessResponse({
				TransactionDetails: response.data.transaction,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"direct charge transaction details retrieval",
				{
					TransactionDetails: {} as PayChanguTypes.BaseTransaction,
				}
			);
		}
	}

	/**
	 * Process a bank transfer payment
	 * 
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

			const response = await this.processBankTransferDirect(bankTransferData);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"bank transfer processing",
					{
						TransactionDetails: {} as PayChanguTypes.BaseTransaction,
						PaymentAccountDetails: {
							account_name: "",
							account_number: "",
							code: "",
							name: "",
						},
					}
				);
			}

			return this.createStandardSuccessResponse({
				TransactionDetails: response.data.transaction,
				PaymentAccountDetails: response.data.payment_account_details,
				RedirectUrl: response.data.redirectUrl,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"bank transfer processing",
				{
					TransactionDetails: {} as PayChanguTypes.BaseTransaction,
					PaymentAccountDetails: {
						account_name: "",
						account_number: "",
						code: "",
						name: "",
					},
				}
			);
		}
	}

	// #endregion

	// #region Mobile Money Methods

	/**
	 * Gets all supported mobile money operators directly
	 * 
	 * @returns Promise resolving to the list of operators
	 */
	private async getMobileMoneyOperatorsDirect(): Promise<PayChanguMobileMoneyOperatorsResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu mobile money operators");

			return await this.network.get<PayChanguMobileMoneyOperatorsResponse>(
				"/mobile-money",
				{
					headers: {
						Accept: "application/json",
					},
				},
				"mobile money operators retrieval"
			);
		} catch (error) {
			return this.handleApiError(error, "mobile money operators retrieval");
		}
	}

	/**
	 * Initializes a mobile money payout directly
	 * 
	 * @param data - The mobile money payout data
	 * @returns Promise resolving to the payout response
	 */
	private async initializeMobileMoneyPayoutDirect(
		data: PayChanguMobileMoneyPayout,
	): Promise<PayChanguMobileMoneyPayoutResponse | PayChanguErrorResponse> {
		try {
			logger.info("Initializing PayChangu mobile money payout:", data);

			return await this.network.post<PayChanguMobileMoneyPayoutResponse>(
				"/mobile-money/payouts/initialize", 
				data, 
				{
					headers: {
						Accept: "application/json",
					},
				},
				"mobile money payout initialization"
			);
		} catch (error) {
			return this.handleApiError(error, "mobile money payout initialization");
		}
	}

	/**
	 * Gets details of a specific mobile money payout directly
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the payout details
	 */
	private async getPayoutDetailsDirect(
		chargeId: string,
	): Promise<PayChanguSinglePayoutResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu payout details:", chargeId);

			return await this.network.get<PayChanguSinglePayoutResponse>(
				`/mobile-money/payments/${chargeId}/details`,
				{
					headers: {
						Accept: "application/json",
					},
				},
				`payout details retrieval for ${chargeId}`
			);
		} catch (error) {
			return this.handleApiError(error, "payout details retrieval");
		}
	}

	/**
	 * Gets all supported mobile money operators
	 * 
	 * @returns Promise resolving to the supported operators response
	 */
	async getMobileMoneyOperators(): Promise<PayChanguOperatorsResponse> {
		try {
			logger.info("PayChangu: getting mobile money operators");

			const response = await this.getMobileMoneyOperatorsDirect();

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"mobile money operators retrieval",
					{ Operators: [] }
				);
			}

			return this.createStandardSuccessResponse({
				Operators: response.data,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"mobile money operators retrieval",
				{ Operators: [] }
			);
		}
	}

	/**
	 * Initializes a mobile money payout to send funds to a mobile money account
	 * 
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

			const response = await this.initializeMobileMoneyPayoutDirect(payoutData);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"mobile money payout initialization",
					{
						PayoutDetails: {
							charge_id: "",
							mobile: "",
							amount: "",
							status: "",
							created_at: "",
							completed_at: null,
						},
					}
				);
			}

			return this.createStandardSuccessResponse({
				PayoutDetails: response.data,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"mobile money payout initialization",
				{
					PayoutDetails: {
						charge_id: "",
						mobile: "",
						amount: "",
						status: "",
						created_at: "",
						completed_at: null,
					},
				}
			);
		}
	}

	/**
	 * Gets mobile money payout details by charge ID
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the payout details response
	 */
	async getMobileMoneyPayoutDetails(
		chargeId: string,
	): Promise<PayChanguPayoutDetailsResponse> {
		try {
			logger.info("PayChangu: getting mobile money payout details", { chargeId });

			const response = await this.getPayoutDetailsDirect(chargeId);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"mobile money payout details retrieval",
					{
						PayoutDetails: {
							charge_id: "",
							mobile: "",
							amount: "",
							status: "",
							created_at: "",
							completed_at: null,
						},
					}
				);
			}

			return this.createStandardSuccessResponse({
				PayoutDetails: response.data,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"mobile money payout details retrieval",
				{
					PayoutDetails: {
						charge_id: "",
						mobile: "",
						amount: "",
						status: "",
						created_at: "",
						completed_at: null,
					},
				}
			);
		}
	}

	// #endregion

	// #region Bank Payout Methods

	/**
	 * Gets all supported banks for a specific currency directly
	 * 
	 * @param currency - The currency to filter banks by
	 * @returns Promise resolving to the list of banks
	 */
	private async getSupportedBanksDirect(
		currency = "MWK",
	): Promise<PayChanguSupportedBanksResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu supported banks for currency:", currency);

			return await this.network.get<PayChanguSupportedBanksResponse>(
				"/direct-charge/payouts/supported-banks",
				{
					headers: {
						Accept: "application/json",
					},
					params: {
						currency,
					},
				},
				`supported banks retrieval for ${currency}`
			);
		} catch (error) {
			return this.handleApiError(error, "supported banks retrieval");
		}
	}

	/**
	 * Initializes a bank payout directly
	 * 
	 * @param data - The bank payout data
	 * @returns Promise resolving to the bank payout response
	 */
	private async initializeBankPayoutDirect(
		data: PayChanguBankPayout,
	): Promise<PayChanguBankPayoutResponse | PayChanguErrorResponse> {
		try {
			logger.info("Initializing PayChangu bank payout:", data);

			return await this.network.post<PayChanguBankPayoutResponse>(
				"/direct-charge/payouts/initialize", 
				data, 
				{
					headers: {
						Accept: "application/json",
					},
				},
				"bank payout initialization"
			);
		} catch (error) {
			return this.handleApiError(error, "bank payout initialization");
		}
	}

	/**
	 * Gets details of a specific bank payout directly
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the bank payout details
	 */
	private async getBankPayoutDetailsDirect(
		chargeId: string,
	): Promise<PayChanguSingleBankPayoutResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu bank payout details:", chargeId);

			return await this.network.get<PayChanguSingleBankPayoutResponse>(
				`/direct-charge/payouts/${chargeId}/details`,
				{
					headers: {
						Accept: "application/json",
					},
				},
				`bank payout details retrieval for ${chargeId}`
			);
		} catch (error) {
			return this.handleApiError(error, "bank payout details retrieval");
		}
	}

	/**
	 * Gets a paginated list of all bank payouts directly
	 * 
	 * @param page - The page number to fetch (optional)
	 * @param perPage - The number of records per page (optional)
	 * @returns Promise resolving to the bank payouts list
	 */
	private async getAllBankPayoutsDirect(
		page?: number,
		perPage?: number,
	): Promise<PayChanguAllBankPayoutsResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting all PayChangu bank payouts");

			return await this.network.get<PayChanguAllBankPayoutsResponse>(
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
				`all bank payouts retrieval (page ${page || 1})`
			);
		} catch (error) {
			return this.handleApiError(error, "bank payouts retrieval");
		}
	}

	/**
	 * Gets all supported banks for direct charge payouts
	 * 
	 * @param currency - The currency to filter banks by (defaults to MWK)
	 * @returns Promise resolving to the supported banks response
	 */
	async getSupportedBanks(
		currency = "MWK",
	): Promise<PayChanguBanksResponse> {
		try {
			logger.info("PayChangu: getting supported banks", { currency });

			const response = await this.getSupportedBanksDirect(currency);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"supported banks retrieval",
					{ Banks: [] }
				);
			}

			return this.createStandardSuccessResponse({
				Banks: response.data,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"supported banks retrieval",
				{ Banks: [] }
			);
		}
	}

	/**
	 * Initializes a bank payout to send funds to a bank account
	 * 
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

			const response = await this.initializeBankPayoutDirect(payoutData);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"bank payout initialization",
					{
						TransactionDetails: {
							id: "",
							charge_id: "",
							bank_uuid: "",
							bank_name: "",
							bank_code: "",
							bank_account_name: "",
							bank_account_number: "",
							amount: "",
							currency: "",
							status: "",
							email: null,
							first_name: null,
							last_name: null,
							created_at: "",
							completed_at: null,
						},
					}
				);
			}

			return this.createStandardSuccessResponse({
				TransactionDetails: response.data.transaction,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"bank payout initialization",
				{
					TransactionDetails: {
						id: "",
						charge_id: "",
						bank_uuid: "",
						bank_name: "",
						bank_code: "",
						bank_account_name: "",
						bank_account_number: "",
						amount: "",
						currency: "",
						status: "",
						email: null,
						first_name: null,
						last_name: null,
						created_at: "",
						completed_at: null,
					},
				}
			);
		}
	}

	/**
	 * Gets bank payout details by charge ID
	 * 
	 * @param chargeId - The charge ID to look up
	 * @returns Promise resolving to the bank payout details response
	 */
	async getBankPayoutDetails(
		chargeId: string,
	): Promise<PayChanguBankPayoutDetailsResponse> {
		try {
			logger.info("PayChangu: getting bank payout details", { chargeId });

			const response = await this.getBankPayoutDetailsDirect(chargeId);

			// Accept both "successful" (as in the API docs) and "success" (to be safe)
			if (!response || (response.status !== "successful" && response.status !== "success")) {
				return this.createStandardErrorResponse(
					response,
					"bank payout details retrieval",
					{
						PayoutDetails: {
							id: "",
							charge_id: "",
							bank_uuid: "",
							bank_name: "",
							bank_code: "",
							bank_account_name: "",
							bank_account_number: "",
							amount: "",
							currency: "",
							status: "",
							email: null,
							first_name: null,
							last_name: null,
							created_at: "",
							completed_at: null,
						},
					}
				);
			}

			return this.createStandardSuccessResponse({
				PayoutDetails: response.data,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"bank payout details retrieval",
				{
					PayoutDetails: {
						id: "",
						charge_id: "",
						bank_uuid: "",
						bank_name: "",
						bank_code: "",
						bank_account_name: "",
						bank_account_number: "",
						amount: "",
						currency: "",
						status: "",
						email: null,
						first_name: null,
						last_name: null,
						created_at: "",
						completed_at: null,
					},
				}
			);
		}
	}

	/**
	 * Gets all bank payouts with pagination
	 * 
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

			const response = await this.getAllBankPayoutsDirect(page, perPage);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"bank payouts list retrieval",
					{
						Payouts: [],
						Pagination: {
							CurrentPage: 0,
							TotalPages: 0,
							PerPage: 0,
							NextPageUrl: null,
						},
					}
				);
			}

			// The response structure from the API includes pagination metadata and a data array
			return this.createStandardSuccessResponse({
				Payouts: response.data,
				Pagination: {
					CurrentPage: response.current_page,
					TotalPages: response.total_pages,
					PerPage: response.per_page,
					NextPageUrl: response.next_page_url,
				},
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"bank payouts list retrieval",
				{
					Payouts: [],
					Pagination: {
						CurrentPage: 0,
						TotalPages: 0,
						PerPage: 0,
						NextPageUrl: null,
					},
				}
			);
		}
	}

	// #endregion

	// #region Transaction Verification

	/**
	 * Verifies a transaction status directly
	 * 
	 * @param txRef - The transaction reference to verify
	 * @returns Promise resolving to the transaction verification response
	 */
	private async verifyTransactionDirect(
		txRef: string,
	): Promise<PayChanguVerifyTransactionResponse | PayChanguErrorResponse> {
		try {
			logger.info("Verifying PayChangu transaction:", txRef);

			return await this.network.get<PayChanguVerifyTransactionResponse>(
				`/verify-payment/${txRef}`,
				{
					headers: {
						Accept: "application/json",
					},
				},
				`transaction verification for ${txRef}`
			);
		} catch (error) {
			return this.handleApiError(error, "transaction verification");
		}
	}

	/**
	 * Verifies the status of a transaction
	 * 
	 * This method can be used to check the final status of transactions of all payment types
	 * after they have been attempted (except MoMo Direct MoMo Charge).
	 * 
	 * @param txRef - The transaction reference to verify
	 * @returns Promise resolving to the transaction verification response
	 */
	async verifyTransaction(
		txRef: string,
	): Promise<{ 
		type: "success" | "error", 
		payload: {
			HasError: boolean,
			TransactionDetails?: PayChanguTypes.VerifiedTransaction,
			StackTraceError?: unknown
		} 
	}> {
		try {
			logger.info("PayChangu: verifying transaction", { txRef });

			const response = await this.verifyTransactionDirect(txRef);

			if (!response || response.status !== "success") {
				return this.createStandardErrorResponse(
					response,
					"transaction verification",
					{
						TransactionDetails: undefined,
					}
				);
			}

			return this.createStandardSuccessResponse({
				TransactionDetails: response.data,
			});
		} catch (error: unknown) {
			return this.createStandardErrorResponse(
				error,
				"transaction verification",
				{
					TransactionDetails: undefined,
				}
			);
		}
	}

	// #endregion
}
