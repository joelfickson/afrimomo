import { PawapayDeposits } from "./deposits";
import { PawapayPayments } from "./payments";
import { PawapayPayouts } from "./payouts";
import { PawapayRefunds } from "./refunds";
import { PawapayWallets } from "./wallets";
import type { Environment } from "../../config/constants";
import { PawapayNetwork } from "./network";

export * from "./types";

export class PawaPay {
	private readonly network: PawapayNetwork;
	private readonly _deposits: PawapayDeposits;
	private readonly _payments: PawapayPayments;
	private readonly _payouts: PawapayPayouts;
	private readonly _refunds: PawapayRefunds;
	private readonly _wallets: PawapayWallets;

	constructor(jwt: string, environment: Environment = "DEVELOPMENT") {
		this.network = new PawapayNetwork(jwt, environment);
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
}
