import { PayChangu } from "./services/paychangu";
import { PawaPay } from "./services/pawapay";
import { PaymentProviderAdapter, PaymentProviderConfig } from "./services/generic/paymentProvider";
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
	
	/**
	 * Custom payment providers configuration
	 */
	providers?: Record<string, PaymentProviderConfig>;
}

/**
 * Main SDK class for interacting with African payment providers
 */
export class AfromomoSDK {
	private static instance?: AfromomoSDK;
	private _paychangu?: PayChangu;
	private _pawapay?: PawaPay;
	private readonly envConfig?: EnvConfig;
	private _providers: Record<string, PaymentProviderAdapter> = {};

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
			const providers = Object.keys(AfromomoSDK.instance._providers);
			
			if (services.length === 0 && providers.length === 0) {
				console.warn("⚠️ No payment services were configured");
				console.log("Available built-in services:");
				console.log("- PayChangu (requires PAYCHANGU_SECRET_KEY)");
				console.log("- PawaPay (requires PAWAPAY_JWT)");
				console.log("- Custom providers (configure via providers option)");
			} else {
				console.log("✓ Initialized Afromomo SDK with services:");
				for (const service of services) {
					console.log(
						`- ${service.charAt(0).toUpperCase() + service.slice(1)}`,
					);
				}
				
				if (providers.length > 0) {
					console.log("✓ Custom payment providers:");
					for (const provider of providers) {
						console.log(`- ${provider}`);
					}
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
	 * Access a custom payment provider
	 * @param providerName - The name of the custom provider
	 * @throws Error if the provider is not configured
	 */
	getProvider(providerName: string): PaymentProviderAdapter {
		if (!this._providers[providerName]) {
			throw new Error(
				`Provider '${providerName}' is not configured. Please add it to the providers configuration.`
			);
		}
		return this._providers[providerName];
	}
	
	/**
	 * Add a new payment provider to the SDK
	 * @param name - A unique name for the provider
	 * @param config - The provider configuration
	 * @returns The created provider instance
	 */
	addProvider(name: string, config: PaymentProviderConfig): PaymentProviderAdapter {
		// Override name in config to ensure consistency
		const providerConfig = { ...config, name };
		const provider = new PaymentProviderAdapter(providerConfig);
		this._providers[name] = provider;
		return provider;
	}

	/**
	 * Checks if a specific payment service is configured
	 * @param service - The name of the service to check
	 * @returns boolean indicating if the service is configured
	 */
	isServiceConfigured(service: "paychangu" | "pawapay" | string): boolean {
		switch (service) {
			case "paychangu":
				return !!this._paychangu;
			case "pawapay":
				return !!this._pawapay;
			default:
				return !!this._providers[service];
		}
	}

	/**
	 * Gets a list of configured built-in payment services
	 * @returns Array of configured service names
	 */
	getConfiguredServices(): ("paychangu" | "pawapay")[] {
		const services: ("paychangu" | "pawapay")[] = [];
		if (this._paychangu) services.push("paychangu");
		if (this._pawapay) services.push("pawapay");
		return services;
	}
	
	/**
	 * Gets a list of all custom providers
	 * @returns Array of provider names
	 */
	getCustomProviders(): string[] {
		return Object.keys(this._providers);
	}

	private initializeServices(): void {
		this.initializeFromEnv();
		this.initializeFromConfig();
		this.initializeCustomProviders();
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
	
	private initializeCustomProviders(): void {
		// Initialize custom providers if configured
		if (this.config.providers) {
			for (const [name, config] of Object.entries(this.config.providers)) {
				this.addProvider(name, config);
			}
		}
	}
}
