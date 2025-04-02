export interface PayChanguCustomization {
	title: string;
	description: string;
}

export interface PayChanguMeta {
	response: string;
	uuid: string;
}

export interface PayChanguInitialPayment {
	meta: PayChanguMeta;
	currency: string;
	amount: string;
	tx_ref: string;
	email: string;
	first_name: string;
	last_name: string;
	callback_url: string;
	return_url: string;
	customization: PayChanguCustomization;
}

export interface PayChanguRedirectAPIResponse {
	status: "success";
	message: string;
	data: {
		redirectUrl: string;
		[key: string]: any;
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
		[key: string]: any;
	};
}

export interface PayChanguTransactionResponse {
	HasError: boolean;
	StackTraceError?: unknown;
}

export interface PayChanguPaymentResponse {
	type: "success" | "error";
	payload: {
		InitialPaymentData?: PaymentDataInfo;
		SpecialPaymentData?: any;
		HasError: boolean;
		StackTraceError?: unknown;
	};
}

export interface PaymentDataInfo {
	account_id: string;
	purchase_amount: string;
	purchase_currency: string;
	item_title: string;
	description: string;
	[key: string]: any;
}

export interface AccountInfo {
	email: string;
	first_name: string;
	last_name: string;
}
