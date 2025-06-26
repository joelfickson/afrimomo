import type { MoMoCurrency, Correspondent } from "../../../types";

// Consolidated PawaPay Types Namespace
export namespace PawaPayTypes {
	// =====================
	// PAYMENT TYPES
	// =====================

	export interface PaymentData {
		depositId: string; // UUIDv4 based ID that uniquely identifies the deposit
		returnUrl: string; // URL for redirection after completion
		statementDescription: string; // 4-22 chars description for transaction
		amount: string; // Amount with 0-2 decimal places
		msisdn: string; // Phone number in international format without + or spaces
		language: "EN" | "FR"; // Language for payment page
		country: string; // ISO 3166-1 alpha-3 country code
		reason: string; // 1-50 chars reason shown to customer
		metadata?: Array<{
			fieldName: string;
			fieldValue: string;
			isPII?: boolean;
		}>;
	}

	export interface InitiatePaymentResponse {
		redirectUrl: string;
		error: boolean;
		message?: string;
	}

	export interface PaymentTransaction {
		depositId: string;
		status: PaymentStatus;
		requestedAmount: string;
		depositedAmount: string;
		currency: MoMoCurrency;
		country: string;
		payer: Payer;
		correspondent: Correspondent;
		statementDescription: string;
		customerTimestamp: string;
		created: string;
		respondedByPayer: string;
		correspondentIds: { [key: string]: string };
		suspiciousActivityReport?: SuspiciousActivityReport[];
	}

	export interface Payer {
		type: string;
		address: {
			value: string;
		};
	}

	export interface SuspiciousActivityReport {
		activityType: string;
		comment: string;
	}

	export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

	// =====================
	// PAYOUT TYPES
	// =====================

	export interface PayoutTransaction {
		payoutId: string;
		amount: string;
		currency: string;
		correspondent: string;
		recipient: {
			type: "MSISDN";
			address: {
				value: string;
			};
		};
		customerTimestamp: string;
		statementDescription: string;
		country?: string;
		metadata?: Array<{
			fieldName: string;
			fieldValue: string;
			isPII?: boolean;
		}>;
	}

	export interface PayoutStatusTransaction {
		payoutId: string;
		status: PayoutStatus;
		created: string;
	}

	export interface BulkPayoutResponse {
		transactions: Array<{
			payoutId: string;
			status: PayoutStatus;
			created: string;
			rejectionReason?: {
				rejectionCode: string;
				rejectionMessage: string;
			};
		}>;
	}

	export enum PayoutStatus {
		ACCEPTED = "ACCEPTED",
		ENQUEUED = "ENQUEUED",
		REJECTED = "REJECTED",
		DUPLICATE_IGNORED = "DUPLICATE_IGNORED",
	}

	export type ResendCallbackResponseStatus = "ACCEPTED" | "REJECTED" | "FAILED";

	export interface ResendCallbackResponse {
		payoutId: string;
		status: ResendCallbackResponseStatus;
		rejectionReason?: string;
	}

	// =====================
	// REFUND TYPES
	// =====================

	export interface RefundResponse {
		refundId: string;
		status: "ACCEPTED" | "REJECTED" | "DUPLICATE_IGNORED";
		created?: Date;
		rejectionReason?: {
			rejectionCode: RefundRejectionCode;
			rejectionMessage: string;
		};
	}

	export type RefundRejectionCode =
		| "DEPOSIT_NOT_FOUND"
		| "DEPOSIT_NOT_COMPLETED"
		| "ALREADY_REFUNDED"
		| "IN_PROGRESS"
		| "INVALID_AMOUNT"
		| "AMOUNT_TOO_SMALL"
		| "AMOUNT_TOO_LARGE"
		| "PARAMETER_INVALID"
		| "INVALID_INPUT"
		| "REFUNDS_NOT_ALLOWED"
		| "CORRESPONDENT_TEMPORARILY_UNAVAILABLE";

	export interface RefundTransaction {
		refundId: string;
		status: "ACCEPTED" | "SUBMITTED" | "ENQUEUED" | "COMPLETED" | "FAILED";
		amount: string;
		currency: MoMoCurrency;
		country: string;
		correspondent: Correspondent;
		recipient: Payer;
		customerTimestamp: string;
		statementDescription?: string;
		created: string;
		receivedByRecipient?: string;
		correspondentIds?: { [key: string]: string };
		failureReason?: {
			failureCode: RefundFailureCode;
			failureMessage: string;
		};
	}

	export type RefundFailureCode =
		| "BALANCE_INSUFFICIENT"
		| "RECIPIENT_NOT_FOUND"
		| "RECIPIENT_NOT_ALLOWED_TO_RECEIVE"
		| "OTHER_ERROR";

	// =====================
	// WALLET TYPES
	// =====================

	export interface WalletBalance {
		/** ISO country code (e.g., 'ZMB', 'UGA') */
		country: string;
		/** Balance amount as string to preserve decimal precision */
		balance: string;
		/** Currency code (e.g., 'ZMW', 'UGX') */
		currency: string;
		/** Mobile Network Operator (if applicable) */
		mno: string;
	}

	export interface WalletBalancesResponse {
		balances: WalletBalance[];
	}

	// =====================
	// NETWORK TYPES
	// =====================

	export type OperationStatus = "OPERATIONAL" | "DELAYED" | "CLOSED";
	export type OperationType = "DEPOSIT" | "PAYOUT" | "REFUND";

	export interface CorrespondentOperation {
		operationType: OperationType;
		status: OperationStatus;
	}

	export interface NetworkCorrespondent {
		correspondent: string;
		operationTypes: CorrespondentOperation[];
	}

	export interface CountryCorrespondents {
		country: string;
		correspondents: NetworkCorrespondent[];
	}

	export type AvailabilityResponse = CountryCorrespondents[];

	export interface OperationConfig {
		operationType: OperationType;
		minTransactionLimit: string;
		maxTransactionLimit: string;
	}

	export interface CorrespondentConfig {
		correspondent: string;
		currency: string;
		ownerName: string;
		operationTypes: OperationConfig[];
	}

	export interface CountryConfig {
		country: string;
		correspondents: CorrespondentConfig[];
	}

	export interface ActiveConfigResponse {
		merchantId: string;
		merchantName: string;
		countries: CountryConfig[];
	}

	export interface PaymentApiResponse {
		redirectUrl: string;
		[key: string]: unknown;
	}
}

// Export the namespace as default
export default PawaPayTypes;
