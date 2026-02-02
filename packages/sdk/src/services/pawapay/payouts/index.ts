import { logger } from "../../../utils/logger";
import type { HttpClient } from "../../../utils/httpClient";
import {
	wrapServiceCall,
	type ServiceResult,
} from "../../../utils/serviceWrapper";
import type { PawaPayTypes } from "../types";

export class PawapayPayouts {
	private readonly baseEndpoint = "/payouts";

	constructor(private readonly networkHandler: HttpClient) {}

	async sendPayout(
		transaction: PawaPayTypes.PayoutTransaction,
	): Promise<ServiceResult<PawaPayTypes.PayoutTransaction>> {
		logger.info("PawaPay: Sending payout", {
			phone: transaction.recipient.address.value,
			amount: transaction.amount,
			payoutId: transaction.payoutId,
			currency: transaction.currency,
		});

		return wrapServiceCall(
			() =>
				this.networkHandler.post<PawaPayTypes.PayoutTransaction>(
					this.baseEndpoint,
					transaction,
					"sending payout",
				),
			this.networkHandler.handleApiError.bind(this.networkHandler),
			"sending payout",
		);
	}

	async sendBulkPayout(
		transactions: PawaPayTypes.PayoutTransaction[],
	): Promise<ServiceResult<PawaPayTypes.BulkPayoutResponse>> {
		logger.info("PawaPay: Sending bulk payout", { count: transactions.length });

		return wrapServiceCall(
			() =>
				this.networkHandler.post<PawaPayTypes.BulkPayoutResponse>(
					`${this.baseEndpoint}/bulk`,
					transactions,
					"sending bulk payout",
				),
			this.networkHandler.handleApiError.bind(this.networkHandler),
			"sending bulk payout",
		);
	}

	async getPayout(
		payoutId: string,
	): Promise<ServiceResult<PawaPayTypes.PayoutTransaction>> {
		logger.info("PawaPay: Getting payout", { payoutId });

		return wrapServiceCall(
			() =>
				this.networkHandler.get<PawaPayTypes.PayoutTransaction>(
					`${this.baseEndpoint}/${payoutId}`,
					"getting payout",
				),
			this.networkHandler.handleApiError.bind(this.networkHandler),
			"getting payout",
		);
	}
}
