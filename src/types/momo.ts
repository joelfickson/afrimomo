/**
 * Mobile money specific types
 */

/**
 * Supported mobile money currencies
 */
export type MoMoCurrency =
  | "XOF"
  | "XAF"
  | "CDF"
  | "GHS"
  | "KES"
  | "MWK"
  | "MZN"
  | "NGN"
  | "RWF"
  | "SLE"
  | "TZS"
  | "UGX"
  | "ZMW";

/**
 * Mobile money operators/correspondents
 */
export type Correspondent =
  | "MTN_MOMO_BEN"
  | "MOOV_BEN"
  | "MTN_MOMO_CMR"
  | "ORANGE_CMR"
  | "MTN_MOMO_CIV"
  | "ORANGE_CIV"
  | "VODACOM_MPESA_COD"
  | "AIRTEL_COD"
  | "ORANGE_COD"
  | "MTN_MOMO_GHA"
  | "AIRTELTIGO_GHA"
  | "VODAFONE_GHA"
  | "MPESA_KEN"
  | "AIRTEL_MWI"
  | "TNM_MWI"
  | "VODACOM_MOZ"
  | "AIRTEL_NGA"
  | "MTN_MOMO_NGA"
  | "AIRTEL_RWA"
  | "MTN_MOMO_RWA"
  | "FREE_SEN"
  | "ORANGE_SEN"
  | "ORANGE_SLE"
  | "AIRTEL_TZA"
  | "VODACOM_TZA"
  | "TIGO_TZA"
  | "HALOTEL_TZA"
  | "AIRTEL_OAPI_UGA"
  | "MTN_MOMO_UGA"
  | "AIRTEL_OAPI_ZMB"
  | "MTN_MOMO_ZMB"
  | "ZAMTEL_ZMB";

/**
 * Common payment transaction types
 */

export interface Payer {
  type: string;
  address: {
    value: string;
  };
}

export interface PaymentTransaction {
  depositId: string;
  status: PaymentStatus;
  requestedAmount: string;
  depositedAmount: string;
  currency: MoMoCurrency;
  country: string;
  payer: Payer;
  correspondent: Correspondent;
  statementDescription: string;
  customerTimestamp: string;
  created: string;
  respondedByPayer: string;
  correspondentIds: { [key: string]: string };
  suspiciousActivityReport?: SuspiciousActivityReport[];
}

export interface SuspiciousActivityReport {
  activityType: string;
  comment: string;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export enum PayoutStatus {
  ACCEPTED = "ACCEPTED",
  ENQUEUED = "ENQUEUED",
  REJECTED = "REJECTED",
  DUPLICATE_IGNORED = "DUPLICATE_IGNORED",
}

export type ResendCallbackResponseStatus = "ACCEPTED" | "REJECTED" | "FAILED";

export interface PayoutTransaction {
  amount: string;
  phoneNumber: string;
  payoutId: string;
  currency: MoMoCurrency;
  correspondent: Correspondent;
  statementDescription: string;
  country: string;
  customerTimestamp?: string;
}

export interface RefundResponse {
  refundId: string;
  status: "ACCEPTED" | "REJECTED" | "DUPLICATE_IGNORED";
  created?: Date;
  rejectionReason?: {
    rejectionCode: "DEPOSIT_NOT_FOUND" | "DEPOSIT_NOT_COMPLETED" | "ALREADY_REFUNDED" | "IN_PROGRESS" | "INVALID_AMOUNT" | "AMOUNT_TOO_SMALL" | "AMOUNT_TOO_LARGE" | "PARAMETER_INVALID" | "INVALID_INPUT" | "REFUNDS_NOT_ALLOWED" | "CORRESPONDENT_TEMPORARILY_UNAVAILABLE";
    rejectionMessage: string;
  };
}

export interface RefundTransaction {
  refundId: string;
  status: "ACCEPTED" | "SUBMITTED" | "ENQUEUED" | "COMPLETED" | "FAILED";
  amount: string;
  currency: MoMoCurrency;
  country: string;
  correspondent: Correspondent;
  recipient: Payer;
  customerTimestamp: string;
  statementDescription?: string;
  created: string;
  receivedByRecipient?: string;
  correspondentIds?: { [key: string]: string };
  failureReason?: {
    failureCode: "BALANCE_INSUFFICIENT" | "RECIPIENT_NOT_FOUND" | "RECIPIENT_NOT_ALLOWED_TO_RECEIVE" | "OTHER_ERROR";
    failureMessage: string;
  };
}

export type MoMoOperatorType = {
  MNO: string;
  Correspondent: Correspondent;
  Country: string;
  Currency: MoMoCurrency;
}; 