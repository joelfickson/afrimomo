import type { Environment } from "@afrimomo-sdk/config/constants";
import * as dotenv from "dotenv";

/**
 * Environment variable configuration interface
 */
export interface EnvConfig {
	// PayChangu Configuration
	PAYCHANGU_SECRET_KEY: string;
	PAYCHANGU_RETURN_URL?: string;
	PAYCHANGU_ENVIRONMENT?: Environment;

	// PawaPay Configuration
	PAWAPAY_JWT: string;
	PAWAPAY_ENVIRONMENT?: Environment;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Partial<EnvConfig> = {
	PAYCHANGU_ENVIRONMENT: "DEVELOPMENT",
	PAWAPAY_ENVIRONMENT: "DEVELOPMENT",
};

/**
 * Configuration for loading environment variables
 */
export interface EnvLoadOptions {
	/** Path to the environment file. Defaults to '.env' */
	envPath?: string;
	/** Whether to throw errors if required variables are missing. Defaults to false */
	strict?: boolean;
	/** Whether to show initialization logs. Defaults to true */
	silent?: boolean;
}

/**
 * Loads environment variables from a file and process.env
 * @param options - Configuration options for loading environment variables
 */
export function loadEnvFile(options: EnvLoadOptions = {}): void {
	const { envPath = ".env", strict = false, silent = false } = options;

	try {
		// Try to load from the specified env file
		const result = dotenv.config({ path: envPath });

		if (result.error) {
			if (!silent) {
				console.warn(
					`Warning: Could not load environment file from ${envPath}`,
				);
				console.warn("Falling back to process.env variables");
			}
		} else if (!silent) {
			console.log(`✓ Loaded environment variables from ${envPath}`);
		}
	} catch (error) {
		if (!silent) {
			console.warn(
				`Warning: Error loading environment file: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			);
			console.warn("Falling back to process.env variables");
		}
	}
}

/**
 * Validates and loads environment configuration
 * @returns Validated environment configuration
 */
export function loadEnvConfig(): EnvConfig {
	const config = { ...DEFAULT_CONFIG } as EnvConfig;

	// PayChangu Configuration
	config.PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY || "";
	config.PAYCHANGU_RETURN_URL = process.env.PAYCHANGU_RETURN_URL;
	config.PAYCHANGU_ENVIRONMENT =
		(process.env.PAYCHANGU_ENVIRONMENT as Environment) ||
		DEFAULT_CONFIG.PAYCHANGU_ENVIRONMENT;

	// PawaPay Configuration
	config.PAWAPAY_JWT = process.env.PAWAPAY_JWT || "";
	config.PAWAPAY_ENVIRONMENT =
		(process.env.PAWAPAY_ENVIRONMENT as Environment) ||
		DEFAULT_CONFIG.PAWAPAY_ENVIRONMENT;

	return config;
}

/**
 * Result of validating a PSP's configuration
 */
export interface PSPValidationResult {
	isValid: boolean;
	missingFields: string[];
	service: "paychangu" | "pawapay";
}

/**
 * Validates that all required configuration for a specific PSP is present
 * @param config - The environment configuration to validate
 * @param psp - The PSP to validate configuration for
 * @returns Validation result indicating if the configuration is valid and what fields are missing
 */
export function validatePSPConfig(
	config: EnvConfig,
	psp: "paychangu" | "pawapay",
): PSPValidationResult {
	const result: PSPValidationResult = {
		isValid: true,
		missingFields: [],
		service: psp,
	};

	switch (psp) {
		case "paychangu":
			if (!config.PAYCHANGU_SECRET_KEY) {
				result.missingFields.push("PAYCHANGU_SECRET_KEY");
			}
			break;
		case "pawapay":
			if (!config.PAWAPAY_JWT) {
				result.missingFields.push("PAWAPAY_JWT");
			}
			break;
		default:
			throw new Error(`Unknown PSP: ${psp}`);
	}

	result.isValid = result.missingFields.length === 0;
	return result;
}
