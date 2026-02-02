import { logger } from "../../../utils/logger";
import type { HttpClient } from "../../../utils/httpClient";
import {
	wrapServiceCall,
	type ServiceResult,
} from "../../../utils/serviceWrapper";
import { appendQueryString } from "../../../utils/queryBuilder";
import type {
	SingleDisbursementRequest,
	SingleDisbursementResponse,
	AddBatchDisbursementRequest,
	BatchDisbursementResponse,
	GetBatchesParams,
	GetBatchTransactionsParams,
	BatchesResponse,
	BatchTransactionsResponse,
	ApprovalRequest,
	ReviewRequest,
	RejectionRequest,
	CancellationRequest,
	TransferFundsRequest,
	TransferFundsResponse,
} from "../types/disbursement";

export class OneKhusaDisbursements {
	constructor(private readonly network: HttpClient) {}

	private wrap<T>(
		operation: () => Promise<T>,
		context: string,
	): Promise<ServiceResult<T>> {
		return wrapServiceCall(
			operation,
			this.network.handleApiError.bind(this.network),
			context,
		);
	}

	async addSingle(
		request: SingleDisbursementRequest,
	): Promise<ServiceResult<SingleDisbursementResponse>> {
		logger.info("OneKhusa: Adding single disbursement", {
			amount: request.amount,
			currency: request.currency,
			recipient: request.recipient.name,
		});

		return this.wrap(
			() =>
				this.network.post<SingleDisbursementResponse>(
					"/disbursements/single",
					request,
					"adding single disbursement",
				),
			"adding single disbursement",
		);
	}

	async approveSingle(
		disbursementId: string,
		request?: ApprovalRequest,
	): Promise<ServiceResult<SingleDisbursementResponse>> {
		logger.info("OneKhusa: Approving single disbursement", { disbursementId });

		return this.wrap(
			() =>
				this.network.patch<SingleDisbursementResponse>(
					`/disbursements/single/${disbursementId}/approve`,
					request || {},
					"approving single disbursement",
				),
			"approving single disbursement",
		);
	}

	async reviewSingle(
		disbursementId: string,
		request?: ReviewRequest,
	): Promise<ServiceResult<SingleDisbursementResponse>> {
		logger.info("OneKhusa: Reviewing single disbursement", { disbursementId });

		return this.wrap(
			() =>
				this.network.patch<SingleDisbursementResponse>(
					`/disbursements/single/${disbursementId}/review`,
					request || {},
					"reviewing single disbursement",
				),
			"reviewing single disbursement",
		);
	}

	async rejectSingle(
		disbursementId: string,
		request: RejectionRequest,
	): Promise<ServiceResult<SingleDisbursementResponse>> {
		logger.info("OneKhusa: Rejecting single disbursement", { disbursementId });

		return this.wrap(
			() =>
				this.network.patch<SingleDisbursementResponse>(
					`/disbursements/single/${disbursementId}/reject`,
					request,
					"rejecting single disbursement",
				),
			"rejecting single disbursement",
		);
	}

	async getSingle(
		disbursementId: string,
	): Promise<ServiceResult<SingleDisbursementResponse>> {
		logger.info("OneKhusa: Getting single disbursement", { disbursementId });

		return this.wrap(
			() =>
				this.network.get<SingleDisbursementResponse>(
					`/disbursements/single/${disbursementId}`,
					"getting single disbursement",
				),
			"getting single disbursement",
		);
	}

	async addBatch(
		request: AddBatchDisbursementRequest,
	): Promise<ServiceResult<BatchDisbursementResponse>> {
		logger.info("OneKhusa: Adding batch disbursement", {
			name: request.name,
			itemCount: request.items.length,
		});

		return this.wrap(
			() =>
				this.network.post<BatchDisbursementResponse>(
					"/disbursements/batches",
					request,
					"adding batch disbursement",
				),
			"adding batch disbursement",
		);
	}

	async approveBatch(
		batchId: string,
		request?: ApprovalRequest,
	): Promise<ServiceResult<BatchDisbursementResponse>> {
		logger.info("OneKhusa: Approving batch", { batchId });

		return this.wrap(
			() =>
				this.network.patch<BatchDisbursementResponse>(
					`/disbursements/batches/${batchId}/approve`,
					request || {},
					"approving batch",
				),
			"approving batch",
		);
	}

	async reviewBatch(
		batchId: string,
		request?: ReviewRequest,
	): Promise<ServiceResult<BatchDisbursementResponse>> {
		logger.info("OneKhusa: Reviewing batch", { batchId });

		return this.wrap(
			() =>
				this.network.patch<BatchDisbursementResponse>(
					`/disbursements/batches/${batchId}/review`,
					request || {},
					"reviewing batch",
				),
			"reviewing batch",
		);
	}

	async rejectBatch(
		batchId: string,
		request: RejectionRequest,
	): Promise<ServiceResult<BatchDisbursementResponse>> {
		logger.info("OneKhusa: Rejecting batch", { batchId });

		return this.wrap(
			() =>
				this.network.patch<BatchDisbursementResponse>(
					`/disbursements/batches/${batchId}/reject`,
					request,
					"rejecting batch",
				),
			"rejecting batch",
		);
	}

	async cancelBatch(
		batchId: string,
		request?: CancellationRequest,
	): Promise<ServiceResult<BatchDisbursementResponse>> {
		logger.info("OneKhusa: Cancelling batch", { batchId });

		return this.wrap(
			() =>
				this.network.patch<BatchDisbursementResponse>(
					`/disbursements/batches/${batchId}/cancel`,
					request || {},
					"cancelling batch",
				),
			"cancelling batch",
		);
	}

	async transferBatchFunds(
		batchId: string,
		request?: TransferFundsRequest,
	): Promise<ServiceResult<TransferFundsResponse>> {
		logger.info("OneKhusa: Transferring batch funds", { batchId });

		return this.wrap(
			() =>
				this.network.post<TransferFundsResponse>(
					`/disbursements/batches/${batchId}/transfer`,
					request || {},
					"transferring batch funds",
				),
			"transferring batch funds",
		);
	}

	async getBatches(
		params?: GetBatchesParams,
	): Promise<ServiceResult<BatchesResponse>> {
		logger.info("OneKhusa: Getting batches");

		const endpoint = appendQueryString("/disbursements/batches", params);

		return this.wrap(
			() => this.network.get<BatchesResponse>(endpoint, "getting batches"),
			"getting batches",
		);
	}

	async getBatch(
		batchId: string,
	): Promise<ServiceResult<BatchDisbursementResponse>> {
		logger.info("OneKhusa: Getting batch", { batchId });

		return this.wrap(
			() =>
				this.network.get<BatchDisbursementResponse>(
					`/disbursements/batches/${batchId}`,
					"getting batch",
				),
			"getting batch",
		);
	}

	async getBatchTransactions(
		batchId: string,
		params?: GetBatchTransactionsParams,
	): Promise<ServiceResult<BatchTransactionsResponse>> {
		logger.info("OneKhusa: Getting batch transactions", { batchId });

		const endpoint = appendQueryString(
			`/disbursements/batches/${batchId}/transactions`,
			params,
		);

		return this.wrap(
			() =>
				this.network.get<BatchTransactionsResponse>(
					endpoint,
					"getting batch transactions",
				),
			"getting batch transactions",
		);
	}
}
