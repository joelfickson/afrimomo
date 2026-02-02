import { logger } from "../../../utils/logger";
import type { PawaPayTypes } from "../types";
import type { HttpClient } from "../../../utils/httpClient";
import {
	wrapServiceCall,
	type ServiceResult,
} from "../../../utils/serviceWrapper";

export class PawapayDeposits {
	private readonly baseEndpoint = "/deposits";

	constructor(private readonly networkHandler: HttpClient) {}

	async sendDeposit(
		transaction: PawaPayTypes.PayoutTransaction,
	): Promise<ServiceResult<PawaPayTypes.PayoutTransaction>> {
		logger.info("PawaPay: Sending deposit", {
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
					"sending deposit",
				),
			this.networkHandler.handleApiError.bind(this.networkHandler),
			"sending deposit",
		);
	}

	async getDeposit(
		depositId: string,
	): Promise<ServiceResult<PawaPayTypes.PaymentTransaction[]>> {
		logger.info("PawaPay: Getting deposit", { depositId });

		return wrapServiceCall(
			() =>
				this.networkHandler.get<PawaPayTypes.PaymentTransaction[]>(
					`${this.baseEndpoint}/${depositId}`,
					"getting deposit",
				),
			this.networkHandler.handleApiError.bind(this.networkHandler),
			"getting deposit",
		);
	}

	async resendCallback(
		depositId: string,
	): Promise<ServiceResult<PawaPayTypes.ResendCallbackResponse>> {
		logger.info("PawaPay: Resending callback", { depositId });

		return wrapServiceCall(
			() =>
				this.networkHandler.post<PawaPayTypes.ResendCallbackResponse>(
					`${this.baseEndpoint}/resend-callback`,
					{ depositId },
					"resending callback",
				),
			this.networkHandler.handleApiError.bind(this.networkHandler),
			"resending callback",
		);
	}
}
