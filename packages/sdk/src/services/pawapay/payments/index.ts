import { logger } from "../../../utils/logger";
import type { HttpClient } from "../../../utils/httpClient";
import {
	wrapServiceCall,
	type ServiceResult,
} from "../../../utils/serviceWrapper";
import PawaPayTypes from "../types";

export class PawapayPayments {
	private readonly baseEndpoint = "widget/sessions";

	constructor(private readonly network: HttpClient) {}

	async initiatePayment(
		paymentData: PawaPayTypes.PaymentData,
	): Promise<ServiceResult<PawaPayTypes.InitiatePaymentResponse>> {
		logger.info("PawaPay: Initiating payment", {
			depositId: paymentData.depositId,
			amount: paymentData.amount,
			country: paymentData.country,
		});

		const requestData = {
			depositId: paymentData.depositId,
			returnUrl: paymentData.returnUrl,
			statementDescription: paymentData.statementDescription,
			amount: paymentData.amount,
			msisdn: paymentData.msisdn,
			language: paymentData.language || "EN",
			country: paymentData.country,
			reason: paymentData.reason,
			metadata: paymentData.metadata || [],
		};

		return wrapServiceCall(
			async () => {
				const response =
					await this.network.post<PawaPayTypes.PaymentApiResponse>(
						this.baseEndpoint,
						requestData,
						`payment initiation for deposit ${paymentData.depositId}`,
					);
				return {
					redirectUrl: response.redirectUrl,
					error: false,
				} as PawaPayTypes.InitiatePaymentResponse;
			},
			this.network.handleApiError.bind(this.network),
			`payment initiation for deposit ${paymentData.depositId}`,
		);
	}
}
