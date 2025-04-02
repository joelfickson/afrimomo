/**
 * Afromomo SDK - A unified interface for African payment providers
 * @module afromomo
 */

// Export the main SDK class and its configuration
export { AfromomoSDK } from "@afrimomo/sdk";
export type { SDKConfig } from "@afrimomo/sdk";

// Export provider-specific types
export * from "@afrimomo/services/pawapay/types";
export * from "@afrimomo/services/paychangu/types";

// Export shared types
export * from "@afrimomo/types";

// Export environment constants
export { Environment } from "@afrimomo/config/constants";

// Export SDK
export * from "./sdk";
export * from "./types";

// Export config
export * from "./config/constants";

// Export utilities
export * from "./utils/network";
export * from "./utils/baseService";
export { logger } from "./utils/logger";

// Export services
export * from "./services/pawapay";
