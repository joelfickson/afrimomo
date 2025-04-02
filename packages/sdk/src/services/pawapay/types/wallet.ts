/**
 * Wallet balance information for a specific country and MNO
 */
export interface WalletBalance {
	/** ISO country code (e.g., 'ZMB', 'UGA') */
	country: string;
	/** Balance amount as string to preserve decimal precision */
	balance: string;
	/** Currency code (e.g., 'ZMW', 'UGX') */
	currency: string;
	/** Mobile Network Operator (if applicable) */
	mno: string;
}

/**
 * Response from the wallet balances API
 */
export interface WalletBalancesResponse {
	balances: WalletBalance[];
}
