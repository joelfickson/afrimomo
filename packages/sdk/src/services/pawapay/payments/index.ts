import { logger } from "../../../utils/logger";
import type { PawaPayNetworkResponse } from "../../../types";
import type { PawapayNetwork } from "../network";
import PawaPayTypes from "../types";

export class PawapayPayments {
	private readonly baseEndpoint = "widget/sessions";

	constructor(private readonly network: PawapayNetwork) {}

	/**
	 * Initiates a payment process by sending payment data to widget/sessions.
	 * @param paymentData - Data required for initiating the payment
	 * @returns Promise resolving to the payment initiation response or error
	 */
	public async initiatePayment(
		paymentData: PawaPayTypes.PaymentData,
	): Promise<PawaPayTypes.InitiatePaymentResponse | PawaPayNetworkResponse> {
		try {
			logger.info(`Payment Data: ${JSON.stringify(paymentData, null, 2)}`);

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

			const response = await this.network.post<PawaPayTypes.PaymentApiResponse>(
				this.baseEndpoint,
				requestData,
				`payment initiation for deposit ${paymentData.depositId}`,
			);

			logger.info(`Payment Response: ${JSON.stringify(response, null, 2)}`);

			return {
				redirectUrl: response.redirectUrl,
				error: false,
			} as PawaPayTypes.InitiatePaymentResponse;
		} catch (error: unknown) {
			// log the whole stack trace
			logger.error(
				`##INITIATE PAYMENT ERROR## ${JSON.stringify(error, null, 2)}`,
			);

			// The error is already handled by the network layer and properly formatted
			if ((error as PawaPayNetworkResponse).errorMessage) {
				return error as PawaPayNetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				`payment initiation for deposit ${paymentData.depositId}`,
			);
		}
	}
}
