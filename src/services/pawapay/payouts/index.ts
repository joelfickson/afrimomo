import { NetworkManager } from "../../../utils/network";
import { BaseService } from "../../../utils/baseService";
import { logger } from "../../../utils/logger";
import { NetworkResponse } from "../../../types";
import { PayoutTransaction, PawaPayPayoutTransaction } from "../types";

export class PawapayPayouts extends BaseService {
	private readonly baseEndpoint = "/payouts";

	constructor(private readonly networkHandler: NetworkManager) {
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
			const phoneNumber = this.formatPhoneNumber(transaction.phoneNumber);

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
				.getInstance()
				.post(this.baseEndpoint, {
					payoutId: transaction.payoutId,
					amount: transaction.amount.toString(),
					currency: transaction.currency,
					correspondent: transaction.correspondent,
					recipient: {
						type: "MSISDN",
						address: { value: phoneNumber },
					},
					customerTimestamp:
						transaction.customerTimestamp || new Date().toISOString(),
					statementDescription: transaction.statementDescription,
				});

			logger.info("Payout transaction successful:", response.data);
			return response.data as PawaPayPayoutTransaction;
		} catch (error) {
			logger.error("Payout transaction failed:", error);
			return this.networkHandler.handleErrors(error);
		}
	}

	/**
	 * Processes multiple payout transactions in bulk
	 * @param transactions - Array of payout transactions to process
	 * @returns Promise resolving to array of payout transaction responses or error
	 */
	async sendBulkPayout(
		transactions: PayoutTransaction[],
	): Promise<PawaPayPayoutTransaction[] | NetworkResponse> {
		try {
			const formattedTransactions = transactions.map((transaction) => ({
				payoutId: transaction.payoutId,
				amount: transaction.amount.toString(),
				currency: transaction.currency,
				correspondent: transaction.correspondent,
				recipient: {
					type: "MSISDN",
					address: { value: this.formatPhoneNumber(transaction.phoneNumber) },
				},
				customerTimestamp:
					transaction.customerTimestamp || new Date().toISOString(),
				statementDescription: transaction.statementDescription,
			}));

			const response = await this.networkHandler
				.getInstance()
				.post(this.baseEndpoint, { formattedTransactions });

			logger.info("Bulk payout transaction successful:", response.data);
			return response.data as PawaPayPayoutTransaction[];
		} catch (error) {
			logger.error("Bulk payout transaction failed:", error);
			return this.networkHandler.handleErrors(error);
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
				.getInstance()
				.get(`${this.baseEndpoint}/${depositId}`);

			logger.info("Payout details retrieved successfully:", response.data);
			return response.data as PawaPayPayoutTransaction;
		} catch (error) {
			logger.error("Get payout failed:", error);
			return this.networkHandler.handleErrors(error);
		}
	}
}
