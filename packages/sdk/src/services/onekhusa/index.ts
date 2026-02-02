import { OneKhusaCollections } from "./collections";
import { OneKhusaDisbursements } from "./disbursements";
import { OneKhusaNetwork } from "./network";
import type {
	OneKhusaEnvironment,
	OneKhusaErrorResponse,
} from "./types/common";
import { logger } from "../../utils/logger";

export * from "./types";

export class OneKhusa {
	private readonly network: OneKhusaNetwork;
	private readonly _collections: OneKhusaCollections;
	private readonly _disbursements: OneKhusaDisbursements;

	constructor(
		apiKey: string,
		apiSecret: string,
		organisationId: string,
		environment: OneKhusaEnvironment = "DEVELOPMENT",
	) {
		this.network = new OneKhusaNetwork(
			apiKey,
			apiSecret,
			organisationId,
			environment,
		);
		this._collections = new OneKhusaCollections(this.network);
		this._disbursements = new OneKhusaDisbursements(this.network);
	}

	get collections(): OneKhusaCollections {
		return this._collections;
	}

	get disbursements(): OneKhusaDisbursements {
		return this._disbursements;
	}

	async checkStatus(): Promise<
		{ available: boolean; environment: string } | OneKhusaErrorResponse
	> {
		try {
			logger.info("OneKhusa: Checking service status");

			const result = await this.network.get<{ status: string }>(
				"/health",
				"checking service status",
			);

			return {
				available: result.status === "UP" || result.status === "OK",
				environment: this.network.axiosInstance.defaults.baseURL?.includes(
					"sandbox",
				)
					? "DEVELOPMENT"
					: "PRODUCTION",
			};
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "checking service status");
		}
	}

	clearTokenCache(): void {
		this.network.clearTokenCache();
	}
}
