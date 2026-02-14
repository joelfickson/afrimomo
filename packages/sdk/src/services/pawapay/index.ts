import { PawapayDeposits } from "./deposits";
import { PawapayPayments } from "./payments";
import { PawapayPayouts } from "./payouts";
import { PawapayRefunds } from "./refunds";
import { PawapayWallets } from "./wallets";
import type { Environment } from "../../config/constants";
import { createPawapayClient } from "../../utils/providerClients";
import { HttpClient } from "../../utils/httpClient";
import type { PawaPayTypes } from "./types";
import type { PawaPayNetworkResponse } from "../../types";
import { logger } from "../../utils/logger";

export * from "./types";

export class PawaPay {
	private readonly network: HttpClient;
	private readonly _deposits: PawapayDeposits;
	private readonly _payments: PawapayPayments;
	private readonly _payouts: PawapayPayouts;
	private readonly _refunds: PawapayRefunds;
	private readonly _wallets: PawapayWallets;

	constructor(
		jwt: string,
		environment: Environment = "DEVELOPMENT",
		sandboxUrl?: string,
		productionUrl?: string,
	) {
		this.network = createPawapayClient(
			jwt,
			environment,
			sandboxUrl,
			productionUrl,
		);
		this._deposits = new PawapayDeposits(this.network);
		this._payments = new PawapayPayments(this.network);
		this._payouts = new PawapayPayouts(this.network);
		this._refunds = new PawapayRefunds(this.network);
		this._wallets = new PawapayWallets(this.network);
	}

	/**
	 * Access deposit-related operations
	 */
	get deposits(): PawapayDeposits {
		return this._deposits;
	}

	/**
	 * Access payment-related operations
	 */
	get payments(): PawapayPayments {
		return this._payments;
	}

	/**
	 * Access payout-related operations
	 */
	get payouts(): PawapayPayouts {
		return this._payouts;
	}

	/**
	 * Access refund-related operations
	 */
	get refunds(): PawapayRefunds {
		return this._refunds;
	}

	/**
	 * Access wallet-related operations
	 */
	get wallets(): PawapayWallets {
		return this._wallets;
	}

	/**
	 * Get the availability status of all correspondents
	 * @returns Promise resolving to the availability status of all correspondents
	 */
	async getAvailability(): Promise<
		PawaPayTypes.AvailabilityResponse | PawaPayNetworkResponse
	> {
		try {
			logger.info("Getting PawaPay correspondent availability");
			return await this.network.get<PawaPayTypes.AvailabilityResponse>(
				"/availability",
				"retrieving correspondent availability",
			);
		} catch (error: unknown) {
			// The error is already handled by the network layer and properly formatted
			if ((error as PawaPayNetworkResponse).errorMessage) {
				return error as PawaPayNetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				"retrieving correspondent availability",
			);
		}
	}

	/**
	 * Get the active configuration for the merchant
	 * @returns Promise resolving to the active configuration
	 */
	async getActiveConfiguration(): Promise<
		PawaPayTypes.ActiveConfigResponse | PawaPayNetworkResponse
	> {
		try {
			logger.info("Getting PawaPay active configuration");
			return await this.network.get<PawaPayTypes.ActiveConfigResponse>(
				"/active-conf",
				"retrieving active configuration",
			);
		} catch (error: unknown) {
			if ((error as PawaPayNetworkResponse).errorMessage) {
				return error as PawaPayNetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				"retrieving active configuration",
			);
		}
	}
}
