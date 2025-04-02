import type { MoMoCurrency, Correspondent } from "@afrimomo-sdk/types";
import type { Payer } from "@afrimomo-sdk/services/pawapay/types/payment";

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
