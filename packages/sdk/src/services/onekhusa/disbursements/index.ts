import { logger } from "../../../utils/logger";
import type { OneKhusaNetwork } from "../network";
import type { OneKhusaErrorResponse } from "../types/common";
import type {
	SingleDisbursementRequest,
	SingleDisbursementResponse,
	AddBatchDisbursementRequest,
	BatchDisbursementResponse,
	BatchTransaction,
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

type DisbursementResult<T> = T | OneKhusaErrorResponse;

export class OneKhusaDisbursements {
	constructor(private readonly network: OneKhusaNetwork) {}

	async addSingle(
		request: SingleDisbursementRequest,
	): Promise<DisbursementResult<SingleDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Adding single disbursement", {
				amount: request.amount,
				currency: request.currency,
				recipient: request.recipient.name,
			});

			return await this.network.post<SingleDisbursementResponse>(
				"/disbursements/single",
				request,
				"adding single disbursement",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "adding single disbursement");
		}
	}

	async approveSingle(
		disbursementId: string,
		request?: ApprovalRequest,
	): Promise<DisbursementResult<SingleDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Approving single disbursement", {
				disbursementId,
			});

			return await this.network.patch<SingleDisbursementResponse>(
				`/disbursements/single/${disbursementId}/approve`,
				request || {},
				"approving single disbursement",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(
				error,
				"approving single disbursement",
			);
		}
	}

	async reviewSingle(
		disbursementId: string,
		request?: ReviewRequest,
	): Promise<DisbursementResult<SingleDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Reviewing single disbursement", {
				disbursementId,
			});

			return await this.network.patch<SingleDisbursementResponse>(
				`/disbursements/single/${disbursementId}/review`,
				request || {},
				"reviewing single disbursement",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(
				error,
				"reviewing single disbursement",
			);
		}
	}

	async rejectSingle(
		disbursementId: string,
		request: RejectionRequest,
	): Promise<DisbursementResult<SingleDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Rejecting single disbursement", {
				disbursementId,
			});

			return await this.network.patch<SingleDisbursementResponse>(
				`/disbursements/single/${disbursementId}/reject`,
				request,
				"rejecting single disbursement",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(
				error,
				"rejecting single disbursement",
			);
		}
	}

	async getSingle(
		disbursementId: string,
	): Promise<DisbursementResult<SingleDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Getting single disbursement", { disbursementId });

			return await this.network.get<SingleDisbursementResponse>(
				`/disbursements/single/${disbursementId}`,
				"getting single disbursement",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "getting single disbursement");
		}
	}

	async addBatch(
		request: AddBatchDisbursementRequest,
	): Promise<DisbursementResult<BatchDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Adding batch disbursement", {
				name: request.name,
				itemCount: request.items.length,
			});

			return await this.network.post<BatchDisbursementResponse>(
				"/disbursements/batches",
				request,
				"adding batch disbursement",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "adding batch disbursement");
		}
	}

	async approveBatch(
		batchId: string,
		request?: ApprovalRequest,
	): Promise<DisbursementResult<BatchDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Approving batch", { batchId });

			return await this.network.patch<BatchDisbursementResponse>(
				`/disbursements/batches/${batchId}/approve`,
				request || {},
				"approving batch",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "approving batch");
		}
	}

	async reviewBatch(
		batchId: string,
		request?: ReviewRequest,
	): Promise<DisbursementResult<BatchDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Reviewing batch", { batchId });

			return await this.network.patch<BatchDisbursementResponse>(
				`/disbursements/batches/${batchId}/review`,
				request || {},
				"reviewing batch",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "reviewing batch");
		}
	}

	async rejectBatch(
		batchId: string,
		request: RejectionRequest,
	): Promise<DisbursementResult<BatchDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Rejecting batch", { batchId });

			return await this.network.patch<BatchDisbursementResponse>(
				`/disbursements/batches/${batchId}/reject`,
				request,
				"rejecting batch",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "rejecting batch");
		}
	}

	async cancelBatch(
		batchId: string,
		request?: CancellationRequest,
	): Promise<DisbursementResult<BatchDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Cancelling batch", { batchId });

			return await this.network.patch<BatchDisbursementResponse>(
				`/disbursements/batches/${batchId}/cancel`,
				request || {},
				"cancelling batch",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "cancelling batch");
		}
	}

	async transferBatchFunds(
		batchId: string,
		request?: TransferFundsRequest,
	): Promise<DisbursementResult<TransferFundsResponse>> {
		try {
			logger.info("OneKhusa: Transferring batch funds", { batchId });

			return await this.network.post<TransferFundsResponse>(
				`/disbursements/batches/${batchId}/transfer`,
				request || {},
				"transferring batch funds",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "transferring batch funds");
		}
	}

	async getBatches(
		params?: GetBatchesParams,
	): Promise<DisbursementResult<BatchesResponse>> {
		try {
			logger.info("OneKhusa: Getting batches");

			const queryParams = new URLSearchParams();
			if (params?.page !== undefined)
				queryParams.append("page", String(params.page));
			if (params?.size !== undefined)
				queryParams.append("size", String(params.size));
			if (params?.status) queryParams.append("status", params.status);
			if (params?.startDate) queryParams.append("startDate", params.startDate);
			if (params?.endDate) queryParams.append("endDate", params.endDate);

			const queryString = queryParams.toString();
			const endpoint = `/disbursements/batches${
				queryString ? `?${queryString}` : ""
			}`;

			return await this.network.get<BatchesResponse>(
				endpoint,
				"getting batches",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "getting batches");
		}
	}

	async getBatch(
		batchId: string,
	): Promise<DisbursementResult<BatchDisbursementResponse>> {
		try {
			logger.info("OneKhusa: Getting batch", { batchId });

			return await this.network.get<BatchDisbursementResponse>(
				`/disbursements/batches/${batchId}`,
				"getting batch",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "getting batch");
		}
	}

	async getBatchTransactions(
		batchId: string,
		params?: GetBatchTransactionsParams,
	): Promise<DisbursementResult<BatchTransactionsResponse>> {
		try {
			logger.info("OneKhusa: Getting batch transactions", { batchId });

			const queryParams = new URLSearchParams();
			if (params?.page !== undefined)
				queryParams.append("page", String(params.page));
			if (params?.size !== undefined)
				queryParams.append("size", String(params.size));
			if (params?.status) queryParams.append("status", params.status);

			const queryString = queryParams.toString();
			const endpoint = `/disbursements/batches/${batchId}/transactions${
				queryString ? `?${queryString}` : ""
			}`;

			return await this.network.get<BatchTransactionsResponse>(
				endpoint,
				"getting batch transactions",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "getting batch transactions");
		}
	}
}
