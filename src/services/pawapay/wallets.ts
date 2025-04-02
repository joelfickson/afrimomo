import { PawapayNetwork } from './network';
import { WalletBalancesResponse } from './types';


/**
 * Service for managing PawaPay wallet operations
 */
export class PawapayWallets {
  constructor(private readonly network: PawapayNetwork) {}

  /**
   * Get wallet balances for all countries
   * @returns Promise resolving to wallet balances across all countries
   */
  async getAllBalances(): Promise<WalletBalancesResponse> {
    return this.network.get<WalletBalancesResponse>('/wallet-balances');
  }

  /**
   * Get wallet balances for a specific country
   * @param country - ISO country code (e.g., 'ZMB', 'UGA')
   * @returns Promise resolving to wallet balances for the specified country
   */
  async getCountryBalance(country: string): Promise<WalletBalancesResponse> {
    return this.network.get<WalletBalancesResponse>(`/wallet-balances/${country}`);
  }
} 