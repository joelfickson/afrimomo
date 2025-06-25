/**
 * Afromomo SDK - A unified interface for African payment providers
 * @module afrimomo
 */

// Export the main SDK class and its configuration
export { AfromomoSDK } from "./sdk";
export type { SDKConfig } from "./sdk";

// Export PayChangu types
export type { AccountInfo } from "./services/paychangu/types/account";
export type {
	PaymentDataInfo,
	PayChanguInitialPayment,
	PayChanguDirectChargePayment,
	PayChanguMobileMoneyPayout,
	PayChanguBankPayout,
	PayChanguDirectChargeBankTransfer,
	PayChanguCustomization,
} from "./services/paychangu/types/payment";

// Export PayChangu response types
export type {
	PayChanguErrorResponse,
	PayChanguDirectChargePaymentResponse,
	PayChanguTransactionDetailsResponse,
	PayChanguOperatorsResponse,
	PayChanguPayoutResponse,
	PayChanguPayoutDetailsResponse,
	PayChanguBanksResponse,
	PayChanguBankTransferResponse,
	PayChanguBankPayoutDetailsResponse,
	PayChanguBankPayoutsListResponse,
	PayChanguBankTransferPaymentResponse,
	PayChanguDirectChargeResponse,
	PayChanguDirectChargeErrorResponse,
	PayChanguSingleTransactionResponse,
	PayChanguMobileMoneyOperatorsResponse,
	PayChanguMobileMoneyPayoutResponse,
	PayChanguSinglePayoutResponse,
	PayChanguSupportedBanksResponse,
	PayChanguBankPayoutResponse,
	PayChanguSingleBankPayoutResponse,
	PayChanguAllBankPayoutsResponse,
	PayChanguDirectChargeBankTransferResponse,
	PayChanguVerifyTransactionResponse,
	PayChanguPaymentInitiationResponse,
	PayChanguPaymentInitiationErrorResponse,
} from "./services/paychangu/types/response";

// Export PawaPay types
export type {
	PaymentData as PawapayPaymentData,
	InitiatePaymentResponse as PawapayInitiatePaymentResponse,
	PaymentStatus,
	PaymentTransaction,
	Payer,
	SuspiciousActivityReport,
} from "./services/pawapay/types/payment";

export type {
	PayoutTransaction,
	PawaPayPayoutTransaction,
	BulkPayoutResponse,
	PayoutStatus,
	ResendCallbackResponseStatus,
	ResendCallbackResponse,
} from "./services/pawapay/types/payout";

export type {
	RefundResponse,
	RefundRejectionCode,
	RefundTransaction,
	RefundFailureCode,
} from "./services/pawapay/types/refund";

export type {
	WalletBalance,
	WalletBalancesResponse,
} from "./services/pawapay/types/wallet";

// Export PawaPay network types
export type {
	OperationStatus,
	OperationType,
	CorrespondentOperation,
	Correspondent as PawapayCorrespondent,
	CountryCorrespondents,
	AvailabilityResponse,
	OperationConfig,
	CorrespondentConfig,
	CountryConfig,
	ActiveConfigResponse,
} from "./services/pawapay/types/network";

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

// Export PayChangu namespace types
export type { PayChangu as PayChanguTypes } from "./services/paychangu/types";

// Export primary types (these take precedence)
export type {
	MoMoCurrency,
	Correspondent,
} from "./types/shared";

// Export utilities
export { NetworkManager } from "./utils/network";
export { BaseService } from "./utils/baseService";
export { logger } from "./utils/logger";
