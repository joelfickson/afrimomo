import type { NetworkResponse } from "../../../types";
import { BaseService } from "../../../utils/baseService";
import { logger } from "../../../utils/logger";
import type { NetworkManager } from "../../../utils/network";
import { PawapayNetwork } from "../network";
import type {
	PayoutTransaction,
	PawaPayPayoutTransaction,
	BulkPayoutResponse,
} from "../types/payout";

export class PawapayPayouts extends BaseService {
	private readonly baseEndpoint = "/payouts";

	constructor(private readonly networkHandler: PawapayNetwork) {
		super();
	}

	/**
	 * Sends a payout transaction to the specified endpoint
	 * @param transaction - The payout transaction details
	 * @returns Promise resolving to the payout transaction response or error
	 */
	async sendPayout(
		transaction: PayoutTransaction,
	): Promise<PawaPayPayoutTransaction | NetworkResponse> {
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

			const response = await this.networkHandler
				.post(this.baseEndpoint, transaction);

			logger.info("Payout transaction successful:", response);
			return response as PawaPayPayoutTransaction;
		} catch (error) {
			logger.error("Payout transaction failed:", error);
			return this.networkHandler.handleApiError(error, "sendPayout");
		}
	}

	/**
	 * Processes multiple payout transactions in bulk
	 * @param transactions - Array of payout transactions to process
	 * @returns Promise resolving to array of payout transaction responses or error
	 */
	async sendBulkPayout(
		transactions: PayoutTransaction[],
	): Promise<BulkPayoutResponse | NetworkResponse> {
		try {
			const response = await this.networkHandler
				.post<BulkPayoutResponse>(`${this.baseEndpoint}/bulk`,  transactions );

			logger.info("Bulk payout transaction successful:", response);
			return response;
		} catch (error) {
			logger.error("Bulk payout transaction failed:", error);
			return this.networkHandler.handleApiError(error, "sendBulkPayout");
		}
	}

	/**
	 * Retrieves details of a specific payout transaction
	 * @param depositId - The unique identifier for the payout transaction
	 * @returns Promise resolving to the payout transaction details or error
	 */
	async getPayout(
		depositId: string,
	): Promise<PawaPayPayoutTransaction | NetworkResponse> {
		try {
			const response = await this.networkHandler
				.get(`${this.baseEndpoint}/${depositId}`);

			logger.info("Payout details retrieved successfully:", response);
			return response as PawaPayPayoutTransaction;
		} catch (error) {
			logger.error("Get payout failed:", error);
			return this.networkHandler.handleApiError(error, "getPayout");
		}
	}
}
