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
