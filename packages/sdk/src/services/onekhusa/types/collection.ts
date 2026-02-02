import type {
	CollectionStatus,
	Currency,
	PaymentMethod,
	PaginatedResponse,
} from "./common";

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
