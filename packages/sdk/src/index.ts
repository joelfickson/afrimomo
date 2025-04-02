/**
 * Afromomo SDK - A unified interface for African payment providers
 * @module afromomo
 */

// Export the main SDK class and its configuration
export { AfromomoSDK } from "@afrimomo-sdk/sdk";
export type { SDKConfig } from "@afrimomo-sdk/sdk";

// Export services
export { PawaPay } from "./services/pawapay";
export { PayChangu } from "./services/paychangu";

// Export primary types (these take precedence)
export type {
	MoMoCurrency,
	Correspondent,
	NetworkResponse,
} from "@afrimomo-sdk/types";

// Export environment constants
export { Environment } from "@afrimomo-sdk/config/constants";

// Export SDK
export * from "@afrimomo-sdk/sdk";

// Export config
export * from "@afrimomo-sdk/config/constants";

// Export utilities
export * from "@afrimomo-sdk/utils/network";
export * from "@afrimomo-sdk/utils/baseService";
export { logger } from "@afrimomo-sdk/utils/logger";
