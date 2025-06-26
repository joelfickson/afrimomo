import type { PawaPayTypes } from "./types";
import type { PawapayNetwork } from "./network";
import type { PawaPayNetworkResponse } from "../../types";
import { logger } from "../../utils/logger";

/**
 * Service for managing PawaPay wallet operations
 */
export class PawapayWallets {
	constructor(private readonly network: PawapayNetwork) {}

	/**
	 * Get wallet balances for all countries
	 * @returns Promise resolving to wallet balances across all countries
	 */
	async getAllBalances(): Promise<
		PawaPayTypes.WalletBalancesResponse | PawaPayNetworkResponse
	> {
		try {
			logger.info("Getting all PawaPay wallet balances");
			return await this.network.get<PawaPayTypes.WalletBalancesResponse>(
				"/wallet-balances",
				"retrieving all wallet balances",
			);
		} catch (error: unknown) {
			if ((error as PawaPayNetworkResponse).errorMessage) {
				return error as PawaPayNetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				"retrieving all wallet balances",
			);
		}
	}

	/**
	 * Get wallet balances for a specific country
	 * @param country - ISO country code (e.g., 'ZMB', 'UGA')
	 * @returns Promise resolving to wallet balances for the specified country
	 */
	async getCountryBalance(
		country: string,
	): Promise<PawaPayTypes.WalletBalancesResponse | PawaPayNetworkResponse> {
		try {
			logger.info(`Getting PawaPay wallet balances for country: ${country}`);
			return await this.network.get<PawaPayTypes.WalletBalancesResponse>(
				`/wallet-balances/${country}`,
				`retrieving wallet balance for ${country}`,
			);
		} catch (error: unknown) {
			// The error is already handled by the network layer and properly formatted
			if ((error as PawaPayNetworkResponse).errorMessage) {
				return error as PawaPayNetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				`retrieving wallet balance for ${country}`,
			);
		}
	}
}
