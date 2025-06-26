import { BaseService } from "../../../utils/baseService";
import { logger } from "../../../utils/logger";
import type { PawaPayTypes } from "../types";
import type { PawaPayNetworkResponse } from "../../../types";
import { PawapayNetwork } from "../network";

export class PawapayDeposits extends BaseService {
	private readonly baseEndpoint = "/deposits";

	constructor(private readonly networkHandler: PawapayNetwork) {
		super();
	}

	/**
	 * Asynchronously sends a payout transaction to a specified recipient using the PawaPay service.
	 * @param transaction - Details of the payout transaction
	 * @returns Promise resolving to the transaction result or error response
	 */
	async sendDeposit(
		transaction: PawaPayTypes.PayoutTransaction,
	): Promise<PawaPayTypes.PayoutTransaction | PawaPayNetworkResponse> {
		try {
			const phoneNumber = transaction.recipient.address.value;

			logger.info(
				"Sending payout to",
				phoneNumber,
				"the amount of",
				transaction.amount,
				"with payoutId",
				transaction.payoutId,
				"and currency",
				transaction.currency,
			);

			const response = await this.networkHandler.post(
				this.baseEndpoint,
				transaction,
			);

			logger.info("Payout transaction successful:", response);
			return response as PawaPayTypes.PayoutTransaction;
		} catch (error: unknown) {
			logger.error("Payout transaction failed:", error);
			return this.networkHandler.handleApiError(error, "sendDeposit");
		}
	}

	/**
	 * Retrieves details of a specific deposit transaction
	 * @param depositId - The unique identifier for the deposit transaction
	 * @returns Promise resolving to the transaction details or error response
	 */
	async getDeposit(
		depositId: string,
	): Promise<PawaPayTypes.PaymentTransaction[] | PawaPayNetworkResponse> {
		try {
			const endPoint = `${this.baseEndpoint}/${depositId}`;
			const response = await this.networkHandler.get(endPoint);

			logger.info("Deposit details retrieved successfully:", response);
			return response as PawaPayTypes.PaymentTransaction[];
		} catch (error) {
			logger.error("Get deposit failed:", error);
			return this.networkHandler.handleApiError(error, "getDeposit");
		}
	}

	/**
	 * Requests a resend of a callback for a specific deposit transaction
	 * @param depositId - The unique identifier of the deposit transaction
	 * @returns Promise resolving to the resend response or error
	 */
	async resendCallback(
		depositId: string,
	): Promise<PawaPayTypes.ResendCallbackResponse | PawaPayNetworkResponse> {
		try {
			const response = await this.networkHandler.post(
				`${this.baseEndpoint}/resend-callback`,
				{ depositId },
			);

			logger.info("Callback resend successful:", response);
			return response as PawaPayTypes.ResendCallbackResponse;
		} catch (error: unknown) {
			logger.error("Callback resend failed:", error);
			return this.networkHandler.handleApiError(error, "resendCallback");
		}
	}
}
