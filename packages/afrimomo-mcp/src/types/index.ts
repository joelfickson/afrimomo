/**
 * Type definitions for Afrimomo MCP Server
 */

import type { PayChangu as PayChanguSDK, PawaPayTypes } from "afrimomo-sdk";

/**
 * JSON Schema type for tool input validation
 */
export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  items?: JSONSchema;
  enum?: string[];
  [key: string]: unknown;
}

export interface JSONSchemaProperty {
  type: string | string[];
  description?: string;
  default?: unknown;
  enum?: string[];
  items?: JSONSchema;
  [key: string]: unknown;
}

/**
 * Tool registration function type
 */
export type ToolRegistrationFunction = (
  name: string,
  description: string,
  inputSchema: JSONSchema,
  handler: ToolHandler
) => void;

/**
 * Generic tool handler type
 */
export type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

/**
 * PayChangu tool argument types
 */
export namespace PayChanguToolArgs {
  export interface InitiatePayment {
    amount: string;
    currency?: string;
    tx_ref: string;
    callback_url: string;
    return_url: string;
    first_name?: string;
    last_name?: string;
    email: string;
    meta?: Record<string, unknown>;
    uuid?: string;
    customization?: Record<string, unknown>;
  }

  export interface VerifyTransaction {
    tx_ref: string;
  }

  export interface InitiateDirectCharge {
    amount: string | number;
    charge_id: string;
    currency?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  }

  export interface GetTransactionDetails {
    charge_id: string;
  }

  export interface ProcessBankTransfer {
    bank_uuid: string;
    account_name: string;
    account_number: string;
    amount: string | number;
    charge_id: string;
    currency?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  }

  export interface GetSupportedBanks {
    currency?: string;
  }

  export interface MobileMoneyPayout {
    mobile: string;
    mobile_money_operator_ref_id: string;
    amount: string | number;
    charge_id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    transaction_status?: "failed" | "successful";
  }

  export interface GetMobilePayoutDetails {
    charge_id: string;
  }

  export interface BankPayout {
    bank_uuid: string;
    account_name: string;
    account_number: string;
    amount: string | number;
    charge_id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  }

  export interface GetBankPayoutDetails {
    charge_id: string;
  }

  export interface ListBankPayouts {
    page?: number;
    per_page?: number;
  }
}

/**
 * PawaPay tool argument types
 */
export namespace PawapayToolArgs {
  export interface RequestDeposit {
    depositId: string;
    amount: string;
    currency: string;
    correspondent: string;
    msisdn: string;
    statementDescription: string;
  }

  export interface GetDeposit {
    depositId: string;
  }

  export interface ResendDepositCallback {
    depositId: string;
  }

  export interface SendPayout {
    payoutId: string;
    amount: string;
    currency: string;
    correspondent: string;
    msisdn: string;
    statementDescription: string;
  }

  export interface PayoutItem {
    payoutId: string;
    amount: string;
    currency: string;
    correspondent: string;
    msisdn: string;
    statementDescription: string;
  }

  export interface SendBulkPayout {
    payouts: PayoutItem[];
  }

  export interface GetPayout {
    payoutId: string;
  }

  export interface CreateRefund {
    refundId: string;
    depositId: string;
  }

  export interface GetRefundStatus {
    refundId: string;
  }

  export interface GetCountryBalance {
    country: string;
  }
}

/**
 * Re-export SDK types for convenience
 */
export type { PayChanguSDK, PawaPayTypes };
