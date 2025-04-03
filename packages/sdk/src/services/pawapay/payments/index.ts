import type { NetworkManager } from "../../../utils/network";
import { logger } from "../../../utils/logger";
import type { PaymentData, InitiatePaymentResponse } from "../types/payment";
import type { NetworkResponse } from "../../../types";
import type { PawapayNetwork } from "../network";

// Define a type for the API response
interface PaymentApiResponse {
	redirectUrl: string;
	[key: string]: unknown;
}

export class PawapayPayments {
	private readonly baseEndpoint = "v1/widget/sessions";

	constructor(private readonly network: PawapayNetwork) {}

	/**
	 * Initiates a payment process by sending payment data to v1/widget/sessions.
	 * @param paymentData - Data required for initiating the payment
	 * @returns Promise resolving to the payment initiation response or error
	 */
	public async initiatePayment(
		paymentData: PaymentData,
	): Promise<InitiatePaymentResponse | NetworkResponse> {
		try {
			logger.info(
				"Sending payment initiation request for deposit:",
				paymentData.deposit_id,
				"with amount:",
				paymentData.price,
			);

			const requestData = {
				depositId: paymentData.deposit_id,
				amount: paymentData.price.toString(),
				returnUrl: paymentData.returnUrl,
				country: paymentData.basePaymentCountryIso,
				reason: paymentData.reason,
			};

			// Use the enhanced network's post method with context
			const response = await this.network.post<PaymentApiResponse>(
				this.baseEndpoint, 
				requestData, 
				`payment initiation for deposit ${paymentData.deposit_id}`
			);

			return {
				redirectUrl: response.redirectUrl,
				error: false,
			} as InitiatePaymentResponse;
		} catch (error: unknown) {
			// The error is already handled by the network layer and properly formatted
			if ((error as NetworkResponse).errorMessage) {
				return error as NetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				`payment initiation for deposit ${paymentData.deposit_id}`
			);
		}
	}
}
