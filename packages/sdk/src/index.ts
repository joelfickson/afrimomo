/**
 * Afromomo SDK - A unified interface for African payment providers
 * @module afromomo
 */

// Export the main SDK class and its configuration
export { AfromomoSDK } from "@afrimomo/sdk";
export type { SDKConfig } from "@afrimomo/sdk";

// Export services
export { PawaPay } from "./services/pawapay";
export { PayChangu } from "./services/paychangu";

// Export primary types (these take precedence)
export type {
	MoMoCurrency,
	Correspondent,
	NetworkResponse,
} from "./types";

// Export environment constants
export { Environment } from "./config/constants";

// Export SDK
export * from "./sdk";

// Export config
export * from "./config/constants";

// Export utilities
export * from "./utils/network";
export * from "./utils/baseService";
export { logger } from "./utils/logger";
