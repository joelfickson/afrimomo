/**
 * PayChangu Service Types
 * 
 * This file exports all type definitions used by the PayChangu payment service.
 * Types are organized in namespaces for better organization:
 * - Account: Customer account information
 * - Payment: Payment request parameters
 * - Response: API responses
 * - Common: Shared types
 */

export * from "./account";
export * from "./payment";
export * from "./response";

/**
 * Common interfaces and types used across multiple PayChangu features
 */
export namespace PayChangu {
  export type Currency = "MWK";
  
  export interface TransactionCharges {
    currency: string;
    amount: string | number;
  }
  
  export interface BaseTransaction {
    charge_id: string;
    ref_id: string;
    trans_id: string | null;
    currency: string;
    amount: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    type: string;
    trace_id: string | null;
    status: string;
    mobile: string;
    attempts: number;
    mode: string;
    created_at: string;
    completed_at: string | null;
    event_type: string;
    transaction_charges: TransactionCharges;
  }
  
  export interface Pagination {
    current_page: number;
    total_pages: number;
    per_page: number;
    next_page_url: string | null;
  }
  
  export interface RequestOptions {
    email?: string;
    firstName?: string;
    lastName?: string;
  }
  
  export type PaymentMethod = "mobile_bank_transfer" | "bank_transfer";
  
  export type ServiceResponseType = "success" | "error";
  
  export interface ServiceResponsePayload {
    HasError: boolean;
    StackTraceError?: unknown;
  }
  
  export interface ServiceResponse<T extends ServiceResponsePayload> {
    type: ServiceResponseType;
    payload: T;
  }
}
