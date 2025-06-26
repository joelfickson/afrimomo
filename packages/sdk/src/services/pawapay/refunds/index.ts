import { BaseService } from "../../../utils/baseService";
import { logger } from "../../../utils/logger";
import type { PawaPayNetworkResponse } from "../../../types";
import type { PawaPayTypes } from "../types";
import { PawapayNetwork } from "../network";
export class PawapayRefunds extends BaseService {
	private readonly baseEndpoint = "/refunds";

	constructor(private readonly networkHandler: PawapayNetwork) {
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
	}): Promise<PawaPayTypes.RefundResponse | PawaPayNetworkResponse> {
		try {
			const response = await this.networkHandler.post(this.baseEndpoint, {
				refundId: refundData.refundId,
				depositId: refundData.depositId,
			});

			logger.info(
				"Sending refund request for deposit:",
				refundData.depositId,
				"with refundId:",
				refundData.refundId,
			);
			return response as PawaPayTypes.RefundResponse;
		} catch (error: unknown) {
			logger.error("Refund request failed:", error);
			return this.networkHandler.handleApiError(error, "createRefundRequest");
		}
	}

	/**
	 * Retrieves the status of a specific refund transaction
	 * @param refundId - The unique identifier for the refund transaction
	 * @returns Promise resolving to the refund transaction details or error
	 */
	async getRefundStatus(
		refundId: string,
	): Promise<PawaPayTypes.RefundTransaction | PawaPayNetworkResponse> {
		try {
			const endPoint = `${this.baseEndpoint}/${refundId}`;
			const response = await this.networkHandler.get(endPoint);

			logger.info("Refund details retrieved successfully:", response);
			return response as PawaPayTypes.RefundTransaction;
		} catch (error: unknown) {
			logger.error("Get refund status failed:", error);
			return this.networkHandler.handleApiError(error, "getRefundStatus");
		}
	}
}
