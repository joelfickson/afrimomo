export interface PayChanguRedirectAPIResponse {
	status: "success";
	message: string;
	data: {
		redirectUrl: string;
		[key: string]: string | number | boolean | null; 
	};
}

export interface PayChanguErrorResponse {
	status: "error";
	message: string;
}

export interface PayChanguVerificationResponse {
	status: "success";
	message: string;
	data: {
		status: string;
		amount: string;
		currency: string;
		tx_ref: string;
		[key: string]: string | number | boolean | null;
	};
}

export interface PayChanguDirectChargeResponse {
	status: "success";
	message: string;
	data: {
		payment_account_details: {
			bank_name: string;
			account_number: string;
			account_name: string;
			account_expiration_timestamp: number;
		};
		transaction: {
			charge_id: string;
			ref_id: string;
			trans_id: string | null;
			currency: string;
			amount: number;
			first_name: string | null;
			last_name: string | null;
			email: string | null;
			type: string;
			trace_id: string;
			status: string;
			mobile: string;
			attempts: number;
			mode: string;
			created_at: string;
			completed_at: string | null;
			event_type: string;
			transaction_charges: {
				currency: string;
				amount: string;
			};
			authorization: {
				channel: string;
				card_number: string | null;
				expiry: string | null;
				brand: string | null;
				provider: string | null;
				mobile_number: string | null;
				payer_bank: string | null;
				payer_account_number: string | null;
				payer_account_name: string | null;
				completed_at: string | null;
			};
			logs: Array<{
				type: string;
				message: string;
				created_at: string;
			}>;
		};
	};
}

export interface PayChanguDirectChargeErrorResponse {
	status: "failed";
	message: string;
	data: null;
}

export interface PayChanguTransactionResponse {
	HasError: boolean;
	StackTraceError?: unknown;
}

export interface PayChanguPaymentResponse {
	type: "success" | "error";
	payload: {
		InitialPaymentData?: import("./payment").PaymentDataInfo;
		SpecialPaymentData?: Record<string, unknown>; 
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguDirectChargePaymentResponse {
	type: "success" | "error";
	payload: {
		TransactionDetails?: PayChanguDirectChargeResponse["data"]["transaction"];
		PaymentAccountDetails?: PayChanguDirectChargeResponse["data"]["payment_account_details"];
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguSingleTransactionResponse {
	status: "success";
	message: string;
	data: {
		transaction: {
			charge_id: string;
			ref_id: string;
			trans_id: string | null;
			currency: string;
			amount: number;
			first_name: string | null;
			last_name: string | null;
			email: string | null;
			type: string;
			trace_id: string;
			status: string;
			mobile: string;
			attempts: number;
			mode: string;
			created_at: string;
			completed_at: string | null;
			event_type: string;
			transaction_charges: {
				currency: string;
				amount: string;
			};
			authorization: {
				channel: string;
				card_number: string | null;
				expiry: string | null;
				brand: string | null;
				provider: string | null;
				mobile_number: string | null;
				payer_bank_uuid?: string;
				payer_bank: string | null;
				payer_account_number: string | null;
				payer_account_name: string | null;
				completed_at: string | null;
			};
			logs: Array<{
				type: string;
				message: string;
				created_at: string;
			}>;
		};
	};
}

export interface PayChanguTransactionDetailsResponse {
	type: "success" | "error";
	payload: {
		TransactionDetails?: PayChanguSingleTransactionResponse["data"]["transaction"];
		HasError: boolean;
		StackTraceError?: unknown;
	};
}
