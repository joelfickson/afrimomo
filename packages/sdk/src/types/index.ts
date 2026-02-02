export interface ServiceError {
	errorMessage: string;
	statusCode: number;
	errorObject: string;
}

export type PawaPayNetworkResponse = ServiceError;

/**
 * Response type for network errors
 */
export interface NetworkResponse {
	HasError: boolean;
	ErrorMessage: string;
	ErrorCode?: string | number;
	Data?: unknown;
}

/**
 * Supported mobile money currencies
 */
export type MoMoCurrency =
	| "GHS" // Ghana Cedis
	| "KES" // Kenyan Shilling
	| "UGX" // Ugandan Shilling
	| "TZS" // Tanzanian Shilling
	| "ZMW" // Zambian Kwacha
	| "XAF" // Central African CFA franc
	| "XOF" // West African CFA franc
	| "RWF" // Rwandan Franc
	| "MWK" // Malawian Kwacha
	| "USD"; // US Dollar

/**
 * Mobile money operators/correspondents
 */
export type Correspondent =
	| "MTN_MOMO_GHA"
	| "VODAFONE_GHA"
	| "AIRTEL_TIGO_GHA"
	| "MTN_MOMO_UGA"
	| "AIRTEL_UGA"
	| "MTN_MOMO_ZMB"
	| "AIRTEL_ZMB"
	| "ZAMTEL_ZMB"
	| "MTN_MOMO_RWA"
	| "AIRTEL_RWA"
	| "TNM_MWI"
	| "AIRTEL_MWI";
