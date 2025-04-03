/**
 * Afromomo SDK - A unified interface for African payment providers
 * @module afrimomo
 */

// Export the main SDK class and its configuration
export { AfromomoSDK } from "./sdk";
export type { SDKConfig } from "./sdk";

// Export payment service types
export type {
	PaymentDataInfo,
} from "./services/paychangu/types/payment";
export type { AccountInfo } from "./services/paychangu/types/account";

export type {
	PaymentData as PawapayPaymentData,
	InitiatePaymentResponse as PawapayInitiatePaymentResponse,
} from "./services/pawapay/types/payment";

// Export response types
export type {
	PayChanguErrorResponse,
} from "./services/paychangu/types/response";

// Export environment constants
export { Environment, ENVIRONMENTS, URLS } from "./config/constants";
export type { ApiUrl } from "./config/constants";

// Export config types
export type { EnvConfig, EnvLoadOptions } from "./config/env";

// Export shared types
export type { NetworkResponse } from "./types/shared";

// Export services
export { PawaPay } from "./services/pawapay";
export { PayChangu } from "./services/paychangu";

// Export primary types (these take precedence)
export type {
	MoMoCurrency,
	Correspondent,
} from "./types/shared";

// Export utilities
export { NetworkManager } from "./utils/network";
export { BaseService } from "./utils/baseService";
export { logger } from "./utils/logger";
