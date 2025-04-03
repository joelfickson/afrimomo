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
	PayChanguDirectChargeBankTransfer
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

			const response = await this.network.axiosInstance.post("/payment", data, {
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
	private async initializeDirectCharge(
		data: PayChanguDirectChargePayment,
	): Promise<PayChanguDirectChargeResponse | PayChanguDirectChargeErrorResponse | PayChanguErrorResponse> {
		try {
			logger.info("Initializing PayChangu direct charge payment:", data);

			const response = await this.network.axiosInstance.post(
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
	private async getTransactionDetails(
		chargeId: string,
	): Promise<PayChanguSingleTransactionResponse | PayChanguErrorResponse> {
		try {
			logger.info("Getting PayChangu transaction details:", chargeId);

			const response = await this.network.axiosInstance.get(
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
	private async processBankTransferDirect(
		data: PayChanguDirectChargeBankTransfer,
	): Promise<PayChanguDirectChargeBankTransferResponse | PayChanguErrorResponse> {
		try {
			logger.info("Processing PayChangu bank transfer:", data);

			const response = await this.network.axiosInstance.post(
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
						TransactionDetails: {} as PayChanguTypes.BaseTransaction,
						PaymentAccountDetails: {
							account_name: "",
							account_number: "",
							code: "",
							name: "",
						},
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
					TransactionDetails: {} as PayChanguTypes.BaseTransaction,
					PaymentAccountDetails: {
						account_name: "",
						account_number: "",
						code: "",
						name: "",
					},
				},
			};
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
						TransactionDetails: {} as PayChanguTypes.BaseTransaction,
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
					TransactionDetails: {} as PayChanguTypes.BaseTransaction,
				},
			};
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
						TransactionDetails: {} as PayChanguTypes.BaseTransaction,
						PaymentAccountDetails: {
							account_name: "",
							account_number: "",
							code: "",
							name: "",
						},
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
					TransactionDetails: {} as PayChanguTypes.BaseTransaction,
					PaymentAccountDetails: {
						account_name: "",
						account_number: "",
						code: "",
						name: "",
					},
				},
			};
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

			const response = await this.network.axiosInstance.get(
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

			const response = await this.network.axiosInstance.post(
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

			const response = await this.network.axiosInstance.get(
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
						Operators: [],
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
					Operators: [],
				},
			};
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
						PayoutDetails: {
							charge_id: "",
							mobile: "",
							amount: "",
							status: "",
							created_at: "",
							completed_at: null,
						},
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
					PayoutDetails: {
						charge_id: "",
						mobile: "",
						amount: "",
						status: "",
						created_at: "",
						completed_at: null,
					},
				},
			};
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
						PayoutDetails: {
							charge_id: "",
							mobile: "",
							amount: "",
							status: "",
							created_at: "",
							completed_at: null,
						},
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
					PayoutDetails: {
						charge_id: "",
						mobile: "",
						amount: "",
						status: "",
						created_at: "",
						completed_at: null,
					},
				},
			};
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

			const response = await this.network.axiosInstance.get(
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

			const response = await this.network.axiosInstance.post(
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

			const response = await this.network.axiosInstance.get(
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

			const response = await this.network.axiosInstance.get(
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
						Banks: [],
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
					Banks: [],
				},
			};
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
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
				},
			};
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
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
				},
			};
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
				return {
					type: "error",
					payload: {
						HasError: true,
						StackTraceError: response,
						// Provide default values for required properties
						Payouts: [],
						Pagination: {
							CurrentPage: 0,
							TotalPages: 0,
							PerPage: 0,
							NextPageUrl: null,
						},
					},
				};
			}

			// The response structure from the API includes pagination metadata and a data array
			return {
				type: "success",
				payload: {
					Payouts: response.data,
					Pagination: {
						CurrentPage: response.current_page,
						TotalPages: response.total_pages,
						PerPage: response.per_page,
						NextPageUrl: response.next_page_url,
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
					// Provide default values for required properties
					Payouts: [],
					Pagination: {
						CurrentPage: 0,
						TotalPages: 0,
						PerPage: 0,
						NextPageUrl: null,
					},
				},
			};
		}
	}

	// #endregion
}
