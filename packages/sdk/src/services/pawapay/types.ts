import { MoMoCurrency, Correspondent } from "../../types";

export interface PaymentData {
	deposit_id: string;
	price: number;
	title: string;
	name?: string;
	currency: string;
	basePaymentCountryIso: string;
	reason: string;
	returnUrl: string;
}

export interface InitiatePaymentResponse {
	redirectUrl: string;
	error: boolean;
	message?: string;
}

export interface PayoutTransaction {
	amount: string;
	phoneNumber: string;
	payoutId: string;
	currency: MoMoCurrency;
	correspondent: Correspondent;
	statementDescription: string;
	country: string;
	customerTimestamp?: string;
}

export interface PawaPayPayoutTransaction {
	payoutId: string;
	status: PayoutStatus;
	created: string;
}

export enum PayoutStatus {
	ACCEPTED = "ACCEPTED",
	ENQUEUED = "ENQUEUED",
	REJECTED = "REJECTED",
	DUPLICATE_IGNORED = "DUPLICATE_IGNORED",
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

export type ResendCallbackResponseStatus = "ACCEPTED" | "REJECTED" | "FAILED";

export interface ResendCallbackResponse {
	payoutId: string;
	status: ResendCallbackResponseStatus;
	rejectionReason?: string;
}

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

/**
 * Wallet balance information for a specific country and MNO
 */
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

/**
 * Response from the wallet balances API
 */
export interface WalletBalancesResponse {
	balances: WalletBalance[];
}
