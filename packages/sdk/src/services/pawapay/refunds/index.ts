import type { NetworkManager } from "@afrimomo-sdk/utils/network";
import { BaseService } from "@afrimomo-sdk/utils/baseService";
import { logger } from "@afrimomo-sdk/utils/logger";
import type { NetworkResponse } from "@afrimomo-sdk/types";
import type { RefundResponse, RefundTransaction } from "@afrimomo-sdk/services/pawapay/types/refund";

export class PawapayRefunds extends BaseService {
	private readonly baseEndpoint = "/refunds";

	constructor(private readonly networkHandler: NetworkManager) {
		super();
	}

	/**
	 * Creates a refund request for a specific transaction
	 * @param refundData - Object containing refundId and depositId
	 * @returns Promise resolving to the refund response or error
	 */
	async createRefundRequest(refundData: {
		refundId: string;
		depositId: string;
	}): Promise<RefundResponse | NetworkResponse> {
		try {
			const response = await this.networkHandler
				.getInstance()
				.post(this.baseEndpoint, {
					refundId: refundData.refundId,
					depositId: refundData.depositId,
				});

			logger.info(
				"Sending refund request for deposit:",
				refundData.depositId,
				"with refundId:",
				refundData.refundId,
			);
			return response.data as RefundResponse;
		} catch (error: unknown) {
			logger.error("Refund request failed:", error);
			return this.networkHandler.handleErrors(error);
		}
	}

	/**
	 * Retrieves the status of a specific refund transaction
	 * @param refundId - The unique identifier for the refund transaction
	 * @returns Promise resolving to the refund transaction details or error
	 */
	async getRefundStatus(
		refundId: string,
	): Promise<RefundTransaction | NetworkResponse> {
		try {
			const endPoint = `${this.baseEndpoint}/${refundId}`;
			const response = await this.networkHandler.getInstance().get(endPoint);

			logger.info("Refund details retrieved successfully:", response.data);
			return response.data as RefundTransaction;
		} catch (error: unknown) {
			logger.error("Get refund status failed:", error);
			return this.networkHandler.handleErrors(error);
		}
	}
}
