import { OneKhusaCollections } from "./collections";
import { OneKhusaDisbursements } from "./disbursements";
import { OneKhusaTokenManager } from "./auth";
import { createOnekhusaClient } from "../../utils/providerClients";
import type { HttpClient } from "../../utils/httpClient";
import type {
	OneKhusaEnvironment,
	OneKhusaErrorResponse,
} from "./types/common";
import { logger } from "../../utils/logger";

export * from "./types";

export class OneKhusa {
	private readonly network: HttpClient;
	private readonly tokenManager: OneKhusaTokenManager;
	private readonly _collections: OneKhusaCollections;
	private readonly _disbursements: OneKhusaDisbursements;
	private readonly environment: OneKhusaEnvironment;

	constructor(
		apiKey: string,
		apiSecret: string,
		organisationId: string,
		environment: OneKhusaEnvironment = "DEVELOPMENT",
	) {
		this.environment = environment;
		this.tokenManager = new OneKhusaTokenManager(
			apiKey,
			apiSecret,
			environment,
		);
		this.network = createOnekhusaClient(
			this.tokenManager,
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
				environment: this.environment,
			};
		} catch (error) {
			if ((error as OneKhusaErrorResponse).errorMessage) {
				return error as OneKhusaErrorResponse;
			}
			return this.network.handleApiError(error, "checking service status");
		}
	}

	clearTokenCache(): void {
		this.tokenManager.clearToken();
	}
}
