import { logger } from "../../../utils/logger";
import type { PawaPayTypes } from "../types";
import type { HttpClient } from "../../../utils/httpClient";
import {
	wrapServiceCall,
	type ServiceResult,
} from "../../../utils/serviceWrapper";

export class PawapayRefunds {
	private readonly baseEndpoint = "/refunds";

	constructor(private readonly networkHandler: HttpClient) {}

	async createRefundRequest(refundData: {
		refundId: string;
		depositId: string;
	}): Promise<ServiceResult<PawaPayTypes.RefundResponse>> {
		logger.info("PawaPay: Creating refund request", refundData);

		return wrapServiceCall(
			() =>
				this.networkHandler.post<PawaPayTypes.RefundResponse>(
					this.baseEndpoint,
					refundData,
					"creating refund request",
				),
			this.networkHandler.handleApiError.bind(this.networkHandler),
			"creating refund request",
		);
	}

	async getRefundStatus(
		refundId: string,
	): Promise<ServiceResult<PawaPayTypes.RefundTransaction>> {
		logger.info("PawaPay: Getting refund status", { refundId });

		return wrapServiceCall(
			() =>
				this.networkHandler.get<PawaPayTypes.RefundTransaction>(
					`${this.baseEndpoint}/${refundId}`,
					"getting refund status",
				),
			this.networkHandler.handleApiError.bind(this.networkHandler),
			"getting refund status",
		);
	}
}
