// Types for PawaPay Network Service

export type OperationStatus = 'OPERATIONAL' | 'DELAYED' | 'CLOSED';

export type OperationType = 'DEPOSIT' | 'PAYOUT' | 'REFUND';

export interface CorrespondentOperation {
  operationType: OperationType;
  status: OperationStatus;
}

export interface Correspondent {
  correspondent: string;
  operationTypes: CorrespondentOperation[];
}

export interface CountryCorrespondents {
  country: string;
  correspondents: Correspondent[];
}

export type AvailabilityResponse = CountryCorrespondents[];

export interface OperationConfig {
  operationType: OperationType;
  minTransactionLimit: string;
  maxTransactionLimit: string;
}

export interface CorrespondentConfig {
  correspondent: string;
  currency: string;
  ownerName: string;
  operationTypes: OperationConfig[];
}

export interface CountryConfig {
  country: string;
  correspondents: CorrespondentConfig[];
}

export interface ActiveConfigResponse {
  merchantId: string;
  merchantName: string;
  countries: CountryConfig[];
} 