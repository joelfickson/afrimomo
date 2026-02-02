import type {
	Currency,
	DisbursementStatus,
	PaginatedResponse,
	PaymentMethod,
	Recipient,
} from "./common";

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
