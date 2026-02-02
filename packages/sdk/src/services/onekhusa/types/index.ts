export * from "./common";
export * from "./auth";
export * from "./collection";
export * from "./disbursement";

export namespace OneKhusaTypes {
	export type Environment = "DEVELOPMENT" | "PRODUCTION";

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

	export interface ErrorResponse {
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

	export interface TokenRequest {
		grant_type: "client_credentials";
		client_id: string;
		client_secret: string;
	}

	export interface TokenResponse {
		access_token: string;
		token_type: string;
		expires_in: number;
		scope?: string;
	}

	export interface CachedToken {
		accessToken: string;
		expiresAt: number;
	}

	export interface InitiateCollectionRequest {
		amount: number;
		currency: Currency;
		phone: string;
		paymentMethod: PaymentMethod;
		reference?: string;
		description?: string;
		callbackUrl?: string;
		metadata?: Record<string, string>;
	}

	export interface CollectionResponse {
		id: string;
		tan: string;
		amount: number;
		currency: Currency;
		status: CollectionStatus;
		phone: string;
		paymentMethod: PaymentMethod;
		reference?: string;
		description?: string;
		createdAt: string;
		updatedAt: string;
		expiresAt?: string;
		metadata?: Record<string, string>;
	}

	export interface CollectionTransaction {
		id: string;
		collectionId: string;
		tan: string;
		amount: number;
		fee?: number;
		currency: Currency;
		status: CollectionStatus;
		phone: string;
		paymentMethod: PaymentMethod;
		reference?: string;
		description?: string;
		providerReference?: string;
		failureReason?: string;
		createdAt: string;
		updatedAt: string;
		completedAt?: string;
		metadata?: Record<string, string>;
	}

	export interface GetCollectionTransactionsParams {
		page?: number;
		size?: number;
		status?: CollectionStatus;
		startDate?: string;
		endDate?: string;
	}

	export type CollectionTransactionsResponse =
		PaginatedResponse<CollectionTransaction>;

	export interface SingleDisbursementRequest {
		amount: number;
		currency: Currency;
		recipient: Recipient;
		paymentMethod: PaymentMethod;
		reference?: string;
		description?: string;
		callbackUrl?: string;
		metadata?: Record<string, string>;
	}

	export interface SingleDisbursementResponse {
		id: string;
		amount: number;
		fee?: number;
		currency: Currency;
		status: DisbursementStatus;
		recipient: Recipient;
		paymentMethod: PaymentMethod;
		reference?: string;
		description?: string;
		providerReference?: string;
		failureReason?: string;
		createdAt: string;
		updatedAt: string;
		approvedAt?: string;
		reviewedAt?: string;
		completedAt?: string;
		metadata?: Record<string, string>;
	}

	export interface BatchDisbursementItem {
		amount: number;
		currency: Currency;
		recipient: Recipient;
		paymentMethod: PaymentMethod;
		reference?: string;
		description?: string;
		metadata?: Record<string, string>;
	}

	export interface AddBatchDisbursementRequest {
		name: string;
		description?: string;
		items: BatchDisbursementItem[];
		callbackUrl?: string;
	}

	export interface BatchDisbursementResponse {
		id: string;
		name: string;
		description?: string;
		status: DisbursementStatus;
		totalAmount: number;
		totalFee?: number;
		currency: Currency;
		itemCount: number;
		successCount?: number;
		failedCount?: number;
		createdAt: string;
		updatedAt: string;
		approvedAt?: string;
		reviewedAt?: string;
		completedAt?: string;
	}

	export interface BatchTransaction {
		id: string;
		batchId: string;
		amount: number;
		fee?: number;
		currency: Currency;
		status: DisbursementStatus;
		recipient: Recipient;
		paymentMethod: PaymentMethod;
		reference?: string;
		description?: string;
		providerReference?: string;
		failureReason?: string;
		createdAt: string;
		updatedAt: string;
		completedAt?: string;
		metadata?: Record<string, string>;
	}

	export interface GetBatchesParams {
		page?: number;
		size?: number;
		status?: DisbursementStatus;
		startDate?: string;
		endDate?: string;
	}

	export interface GetBatchTransactionsParams {
		page?: number;
		size?: number;
		status?: DisbursementStatus;
	}

	export type BatchesResponse = PaginatedResponse<BatchDisbursementResponse>;
	export type BatchTransactionsResponse = PaginatedResponse<BatchTransaction>;

	export interface ApprovalRequest {
		comment?: string;
	}

	export interface ReviewRequest {
		comment?: string;
	}

	export interface RejectionRequest {
		reason: string;
	}

	export interface CancellationRequest {
		reason?: string;
	}

	export interface TransferFundsRequest {
		sourceAccount?: string;
	}

	export interface TransferFundsResponse {
		success: boolean;
		message: string;
		transactionId?: string;
	}
}

export default OneKhusaTypes;
