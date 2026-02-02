import { logger } from "../../../utils/logger";
import type { HttpClient } from "../../../utils/httpClient";
import {
	wrapServiceCall,
	type ServiceResult,
} from "../../../utils/serviceWrapper";
import { appendQueryString } from "../../../utils/queryBuilder";
import type {
	InitiateCollectionRequest,
	CollectionResponse,
	CollectionTransaction,
	GetCollectionTransactionsParams,
	CollectionTransactionsResponse,
} from "../types/collection";

export class OneKhusaCollections {
	constructor(private readonly network: HttpClient) {}

	async initiateRequestToPay(
		request: InitiateCollectionRequest,
	): Promise<ServiceResult<CollectionResponse>> {
		logger.info("OneKhusa: Initiating request to pay", {
			amount: request.amount,
			currency: request.currency,
			phone: request.phone,
		});

		return wrapServiceCall(
			() =>
				this.network.post<CollectionResponse>(
					"/collections/request-to-pay",
					request,
					"initiating request to pay",
				),
			this.network.handleApiError.bind(this.network),
			"initiating request to pay",
		);
	}

	async getTransactions(
		params?: GetCollectionTransactionsParams,
	): Promise<ServiceResult<CollectionTransactionsResponse>> {
		logger.info("OneKhusa: Getting collection transactions");

		const endpoint = appendQueryString("/collections/transactions", params);

		return wrapServiceCall(
			() =>
				this.network.get<CollectionTransactionsResponse>(
					endpoint,
					"getting collection transactions",
				),
			this.network.handleApiError.bind(this.network),
			"getting collection transactions",
		);
	}

	async getTransaction(
		transactionId: string,
	): Promise<ServiceResult<CollectionTransaction>> {
		logger.info("OneKhusa: Getting collection transaction", { transactionId });

		return wrapServiceCall(
			() =>
				this.network.get<CollectionTransaction>(
					`/collections/transactions/${transactionId}`,
					"getting collection transaction",
				),
			this.network.handleApiError.bind(this.network),
			"getting collection transaction",
		);
	}
}
