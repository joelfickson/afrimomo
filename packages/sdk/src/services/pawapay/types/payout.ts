import type { MoMoCurrency, Correspondent } from "@afrimomo-sdk/types";

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

export type ResendCallbackResponseStatus = "ACCEPTED" | "REJECTED" | "FAILED";

export interface ResendCallbackResponse {
	payoutId: string;
	status: ResendCallbackResponseStatus;
	rejectionReason?: string;
}
