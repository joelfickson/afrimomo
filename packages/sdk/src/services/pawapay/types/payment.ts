import type { MoMoCurrency, Correspondent } from "../../../types/shared";

export interface PaymentData {
	depositId: string;  // UUIDv4 based ID that uniquely identifies the deposit
	returnUrl: string;  // URL for redirection after completion
	statementDescription: string;  // 4-22 chars description for transaction
	amount: string;  // Amount with 0-2 decimal places
	msisdn: string;  // Phone number in international format without + or spaces
	language: "EN" | "FR";  // Language for payment page
	country: string;  // ISO 3166-1 alpha-3 country code
	reason: string;  // 1-50 chars reason shown to customer
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
