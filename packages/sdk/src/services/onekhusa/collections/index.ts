import { logger } from "../../../utils/logger";
import type { OneKhusaNetwork } from "../network";
import type { OneKhusaErrorResponse } from "../types/common";
import type {
	InitiateCollectionRequest,
	CollectionResponse,
	CollectionTransaction,
	GetCollectionTransactionsParams,
	CollectionTransactionsResponse,
} from "../types/collection";

type CollectionResult<T> = T | OneKhusaErrorResponse;

export class OneKhusaCollections {
	constructor(private readonly network: OneKhusaNetwork) {}

	async initiateRequestToPay(
		request: InitiateCollectionRequest,
	): Promise<CollectionResult<CollectionResponse>> {
		try {
			logger.info("OneKhusa: Initiating request to pay", {
				amount: request.amount,
				currency: request.currency,
				phone: request.phone,
			});

			return await this.network.post<CollectionResponse>(
				"/collections/request-to-pay",
				request,
				"initiating request to pay",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "initiating request to pay");
		}
	}

	async getTransactions(
		params?: GetCollectionTransactionsParams,
	): Promise<CollectionResult<CollectionTransactionsResponse>> {
		try {
			logger.info("OneKhusa: Getting collection transactions");

			const queryParams = new URLSearchParams();
			if (params?.page !== undefined)
				queryParams.append("page", String(params.page));
			if (params?.size !== undefined)
				queryParams.append("size", String(params.size));
			if (params?.status) queryParams.append("status", params.status);
			if (params?.startDate) queryParams.append("startDate", params.startDate);
			if (params?.endDate) queryParams.append("endDate", params.endDate);

			const queryString = queryParams.toString();
			const endpoint = `/collections/transactions${
				queryString ? `?${queryString}` : ""
			}`;

			return await this.network.get<CollectionTransactionsResponse>(
				endpoint,
				"getting collection transactions",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(
				error,
				"getting collection transactions",
			);
		}
	}

	async getTransaction(
		transactionId: string,
	): Promise<CollectionResult<CollectionTransaction>> {
		try {
			logger.info("OneKhusa: Getting collection transaction", {
				transactionId,
			});

			return await this.network.get<CollectionTransaction>(
				`/collections/transactions/${transactionId}`,
				"getting collection transaction",
			);
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(
				error,
				"getting collection transaction",
			);
		}
	}
}
