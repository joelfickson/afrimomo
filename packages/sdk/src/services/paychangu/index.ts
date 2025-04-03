/**
 * PayChangu Payment Service
 * 
 * Provides a unified interface for interacting with the PayChangu payment gateway.
 * Supports multiple payment methods including direct charge, bank transfers, and mobile money.
 * 
 * @module PayChangu
 */

import { BaseService } from "../../utils/baseService";
import { logger } from "../../utils/logger";
import { PayChanguNetworkManager } from "./network";
import type { AccountInfo } from "./types/account";
import { PayChangu as PayChanguTypes } from "./types";
import type { 
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
	private readonly networkManager: PayChanguNetworkManager;

	/**
	 * Creates a new instance of the PayChangu service
	 * 
	 * @param secretKey - The API secret key for authentication with PayChangu
	 */
	constructor(secretKey: string) {
		super();
		this.networkManager = new PayChanguNetworkManager(secretKey);
	}

	// #region Direct Charge Methods

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

			const response = await this.networkManager.initializeDirectCharge(directChargeData);

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

			const response = await this.networkManager.getTransactionDetails(chargeId);

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

			const response = await this.networkManager.processBankTransfer(bankTransferData);

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
	 * Gets all supported mobile money operators
	 * 
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

			const response = await this.networkManager.initializeMobileMoneyPayout(payoutData);

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

			const response = await this.networkManager.getPayoutDetails(chargeId);

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

			const response = await this.networkManager.getSupportedBanks(currency);

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

			const response = await this.networkManager.initializeBankPayout(payoutData);

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

			const response = await this.networkManager.getBankPayoutDetails(chargeId);

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

			const response = await this.networkManager.getAllBankPayouts(page, perPage);

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
