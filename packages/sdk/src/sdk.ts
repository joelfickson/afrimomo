import { PayChangu } from "@afrimomo/services/paychangu";
import { PawaPay } from "@afrimomo/services/pawapay";
import type { Environment } from "./config/constants";
import {
	type EnvConfig,
	loadEnvConfig,
	validatePSPConfig,
	loadEnvFile,
	type EnvLoadOptions,
} from "./config/env";

/**
 * Configuration interface for the Afromomo SDK
 */
export interface SDKConfig {
	/**
	 * Environment configuration options
	 */
	env?: EnvLoadOptions;

	/**
	 * PayChangu configuration (overrides environment variables)
	 */
	paychangu?: {
		/** PayChangu secret key for authentication */
		secretKey: string;
		/** Optional return URL */
		returnUrl?: string;
		/** Optional environment setting (defaults to DEVELOPMENT) */
		environment?: Environment;
	};

	/**
	 * PawaPay configuration (overrides environment variables)
	 */
	pawapay?: {
		/** PawaPay JWT token for authentication */
		jwt: string;
		/** Optional environment setting (defaults to DEVELOPMENT) */
		environment?: Environment;
	};
}

/**
 * Main SDK class for interacting with African payment providers
 */
export class AfromomoSDK {
	private static instance?: AfromomoSDK;
	private _paychangu?: PayChangu;
	private _pawapay?: PawaPay;
	private readonly envConfig?: EnvConfig;

	private constructor(private readonly config: SDKConfig = {}) {
		// Private constructor to enforce singleton pattern
		if (config.env) {
			loadEnvFile(config.env);
		} else {
			loadEnvFile();
		}
		this.envConfig = loadEnvConfig();
		this.initializeServices();
	}

	/**
	 * Initialize the SDK with configuration
	 * @param config - SDK configuration options
	 * @returns The SDK instance
	 */
	public static initialize(config: SDKConfig = {}): AfromomoSDK {
		if (!AfromomoSDK.instance) {
			AfromomoSDK.instance = new AfromomoSDK(config);

			// Log initialization status
			const services = AfromomoSDK.instance.getConfiguredServices();
			if (services.length === 0) {
				console.warn("⚠️ No payment services were configured");
				console.log("Available services:");
				console.log("- PayChangu (requires PAYCHANGU_SECRET_KEY)");
				console.log("- PawaPay (requires PAWAPAY_JWT)");
			} else {
				console.log("✓ Initialized Afromomo SDK with services:");
				for (const service of services) {
					console.log(
						`- ${service.charAt(0).toUpperCase() + service.slice(1)}`,
					);
				}
			}
		}
		return AfromomoSDK.instance;
	}

	/**
	 * Get the SDK instance
	 * @throws Error if SDK is not initialized
	 */
	public static getInstance(): AfromomoSDK {
		if (!AfromomoSDK.instance) {
			throw new Error(
				"SDK not initialized. Call AfromomoSDK.initialize() first",
			);
		}
		return AfromomoSDK.instance;
	}

	/**
	 * Access the PayChangu payment service
	 * @throws Error if PayChangu is not configured
	 */
	get paychangu(): PayChangu {
		if (!this._paychangu) {
			throw new Error(
				"PayChangu service is not configured. Please provide PayChangu credentials in the SDK config or environment variables.",
			);
		}
		return this._paychangu;
	}

	/**
	 * Access the PawaPay payment service
	 * @throws Error if PawaPay is not configured
	 */
	get pawapay(): PawaPay {
		if (!this._pawapay) {
			throw new Error(
				"PawaPay service is not configured. Please provide PawaPay credentials in the SDK config or environment variables.",
			);
		}
		return this._pawapay;
	}

	/**
	 * Checks if a specific payment service is configured
	 * @param service - The name of the service to check
	 * @returns boolean indicating if the service is configured
	 */
	isServiceConfigured(service: "paychangu" | "pawapay"): boolean {
		switch (service) {
			case "paychangu":
				return !!this._paychangu;
			case "pawapay":
				return !!this._pawapay;
			default:
				return false;
		}
	}

	/**
	 * Gets a list of configured payment services
	 * @returns Array of configured service names
	 */
	getConfiguredServices(): ("paychangu" | "pawapay")[] {
		const services: ("paychangu" | "pawapay")[] = [];
		if (this._paychangu) services.push("paychangu");
		if (this._pawapay) services.push("pawapay");
		return services;
	}

	private initializeServices(): void {
		this.initializeFromEnv();
		this.initializeFromConfig();
	}

	private initializeFromEnv(): void {
		if (!this.envConfig) return;

		// Initialize PayChangu if configured
		const paychanguValidation = validatePSPConfig(this.envConfig, "paychangu");
		if (paychanguValidation.isValid) {
			this._paychangu = new PayChangu(this.envConfig.PAYCHANGU_SECRET_KEY);
		}

		// Initialize PawaPay if configured
		const pawapayValidation = validatePSPConfig(this.envConfig, "pawapay");
		if (pawapayValidation.isValid) {
			this._pawapay = new PawaPay(this.envConfig.PAWAPAY_JWT);
		}
	}

	private initializeFromConfig(): void {
		// Override with direct configuration if provided
		if (this.config.paychangu?.secretKey) {
			this._paychangu = new PayChangu(this.config.paychangu.secretKey);
		}

		if (this.config.pawapay?.jwt) {
			this._pawapay = new PawaPay(this.config.pawapay.jwt);
		}
	}
}
