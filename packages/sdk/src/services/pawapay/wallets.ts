import type { WalletBalancesResponse } from "./types/wallet";
import type { PawapayNetwork } from "./network";
import type { NetworkResponse } from "../../types";
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
	async getAllBalances(): Promise<WalletBalancesResponse | NetworkResponse> {
		try {
			logger.info("Getting all PawaPay wallet balances");
			return await this.network.get<WalletBalancesResponse>(
				"/wallet-balances",
				"retrieving all wallet balances"
			);
		} catch (error: unknown) {
			// The error is already handled by the network layer and properly formatted
			if ((error as NetworkResponse).errorMessage) {
				return error as NetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				"retrieving all wallet balances"
			);
		}
	}

	/**
	 * Get wallet balances for a specific country
	 * @param country - ISO country code (e.g., 'ZMB', 'UGA')
	 * @returns Promise resolving to wallet balances for the specified country
	 */
	async getCountryBalance(country: string): Promise<WalletBalancesResponse | NetworkResponse> {
		try {
			logger.info(`Getting PawaPay wallet balances for country: ${country}`);
			return await this.network.get<WalletBalancesResponse>(
				`/wallet-balances/${country}`,
				`retrieving wallet balance for ${country}`
			);
		} catch (error: unknown) {
			// The error is already handled by the network layer and properly formatted
			if ((error as NetworkResponse).errorMessage) {
				return error as NetworkResponse;
			}

			// Fallback for unexpected errors
			return this.network.handleApiError(
				error,
				`retrieving wallet balance for ${country}`
			);
		}
	}
}
