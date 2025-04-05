import type { MoMoCurrency, Correspondent } from "../../../types/shared";

export interface PayoutTransaction {
	payoutId: string;
	amount: string;
	currency: string;
	correspondent: string;
	recipient: {
		type: 'MSISDN';
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
