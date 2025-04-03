import type { MoMoCurrency, Correspondent } from "../../../types/shared";

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
