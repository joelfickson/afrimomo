export type OneKhusaEnvironment = "DEVELOPMENT" | "PRODUCTION";

export interface PaginationParams {
	page?: number;
	size?: number;
}

export interface PaginatedResponse<T> {
	content: T[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			empty: boolean;
			sorted: boolean;
			unsorted: boolean;
		};
		offset: number;
		paged: boolean;
		unpaged: boolean;
	};
	last: boolean;
	totalPages: number;
	totalElements: number;
	first: boolean;
	size: number;
	number: number;
	sort: {
		empty: boolean;
		sorted: boolean;
		unsorted: boolean;
	};
	numberOfElements: number;
	empty: boolean;
}

export interface OneKhusaErrorResponse {
	errorMessage: string;
	statusCode: number;
	errorObject?: string;
}

export type DisbursementStatus =
	| "PENDING"
	| "APPROVED"
	| "REVIEWED"
	| "REJECTED"
	| "CANCELLED"
	| "PROCESSING"
	| "COMPLETED"
	| "FAILED";

export type CollectionStatus =
	| "PENDING"
	| "COMPLETED"
	| "FAILED"
	| "CANCELLED"
	| "EXPIRED";

export type PaymentMethod = "MOBILE_MONEY" | "BANK_TRANSFER";

export type Currency = "MWK" | "USD" | "ZAR" | "ZMW" | "TZS" | "KES" | "UGX";

export interface Recipient {
	name: string;
	phone: string;
	email?: string;
	accountNumber?: string;
	bankCode?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
}
