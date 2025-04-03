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

export interface PayChanguSupportedCountry {
	name: string;
	currency: string;
}

export interface PayChanguMobileMoneyOperator {
	id: number;
	name: string;
	ref_id: string;
	short_code: string;
	logo: string | null;
	supported_country: PayChanguSupportedCountry;
}

export interface PayChanguMobileMoneyOperatorsResponse {
	status: "success";
	message: string;
	data: PayChanguMobileMoneyOperator[];
}

export interface PayChanguOperatorsResponse {
	type: "success" | "error";
	payload: {
		Operators?: PayChanguMobileMoneyOperator[];
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguMobileMoneyPayoutResponse {
	status: "success";
	message: string;
	data: {
		amount: number;
		charge_id: string;
		ref_id: string;
		trans_id: string | null;
		first_name: string | null;
		last_name: string | null;
		email: string | null;
		type: string;
		trace_id: string | null;
		status: string;
		mobile: string;
		attempts: number;
		currency: string;
		mode: string;
		created_at: string;
		completed_at: string;
		event_type: string;
		mobile_money: {
			name: string;
			ref_id: string;
			country: string;
		};
		transaction_charges: {
			currency: string;
			amount: number | string;
		};
		authorization: {
			channel: string;
			card_number: string | null;
			expiry: string | null;
			brand: string | null;
			provider: string;
			mobile_number: string | null;
			completed_at: string;
		};
	};
}

export interface PayChanguPayoutResponse {
	type: "success" | "error";
	payload: {
		PayoutDetails?: PayChanguMobileMoneyPayoutResponse["data"];
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguSinglePayoutResponse {
	status: "success";
	message: string;
	data: {
		amount: number;
		charge_id: string;
		ref_id: string;
		trans_id: string | null;
		first_name: string | null;
		last_name: string | null;
		email: string | null;
		type: string;
		status: string;
		mobile: string;
		attempts: number;
		currency: string;
		mode: string;
		created_at: string;
		completed_at: string | null;
		event_type: string;
		mobile_money: {
			name: string;
			ref_id: string;
			country: string;
		};
		transaction_charges: {
			currency: string;
			amount: string;
		};
	};
}

export interface PayChanguPayoutDetailsResponse {
	type: "success" | "error";
	payload: {
		PayoutDetails?: PayChanguSinglePayoutResponse["data"];
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguBank {
	uuid: string;
	name: string;
}

export interface PayChanguSupportedBanksResponse {
	status: "success";
	message: string;
	data: PayChanguBank[];
}

export interface PayChanguBanksResponse {
	type: "success" | "error";
	payload: {
		Banks?: PayChanguBank[];
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguBankPayoutResponse {
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
			trace_id: string | null;
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
			recipient_account_details: {
				bank_uuid: string;
				bank_name: string;
				account_name: string;
				account_number: string;
			};
		};
	};
}

export interface PayChanguBankTransferResponse {
	type: "success" | "error";
	payload: {
		TransactionDetails?: PayChanguBankPayoutResponse["data"]["transaction"];
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguSingleBankPayoutResponse {
	status: "successful" | "success" | "failed";
	message: string;
	data: {
		charge_id: string;
		ref_id: string;
		trans_id: string | null;
		currency: string;
		amount: number;
		first_name: string | null;
		last_name: string | null;
		email: string | null;
		type: string;
		trace_id: string | null;
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
		recipient_account_details: {
			bank_uuid: string;
			bank_name: string;
			account_name: string;
			account_number: string;
		};
	};
}

export interface PayChanguBankPayoutDetailsResponse {
	type: "success" | "error";
	payload: {
		PayoutDetails?: PayChanguSingleBankPayoutResponse["data"];
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguAllBankPayoutsResponse {
	status: "success";
	message: string;
	data: {
		current_page: number;
		total_pages: number;
		per_page: number;
		next_page_url: string | null;
		data: Array<{
			charge_id: string;
			ref_id: string;
			trans_id: string | null;
			currency: string;
			amount: number;
			first_name: string | null;
			last_name: string | null;
			email: string | null;
			type: string;
			trace_id: string | null;
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
			recipient_account_details: {
				bank_uuid: string;
				bank_name: string;
				account_name: string;
				account_number: string;
			};
		}>;
	};
}

export interface PayChanguBankPayoutsListResponse {
	type: "success" | "error";
	payload: {
		Payouts?: PayChanguAllBankPayoutsResponse["data"]["data"];
		Pagination?: {
			CurrentPage: number;
			TotalPages: number;
			PerPage: number;
			NextPageUrl: string | null;
		};
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PayChanguDirectChargeBankTransferResponse {
	status: "success";
	message: string;
	data: {
		redirectUrl?: string;
		payment_account_details?: {
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
			authorization?: {
				channel: string;
				card_number: string | null;
				expiry: string | null;
				brand: string | null;
				provider: string | null;
				mobile_number: string | null;
				payer_bank_uuid?: string;
				payer_bank?: string | null;
				payer_account_number?: string | null;
				payer_account_name?: string | null;
				completed_at: string | null;
			};
		};
	};
}

export interface PayChanguBankTransferPaymentResponse {
	type: "success" | "error";
	payload: {
		TransactionDetails?: PayChanguDirectChargeBankTransferResponse["data"]["transaction"];
		PaymentAccountDetails?: PayChanguDirectChargeBankTransferResponse["data"]["payment_account_details"];
		RedirectUrl?: string;
		HasError: boolean;
		StackTraceError?: unknown;
	};
}