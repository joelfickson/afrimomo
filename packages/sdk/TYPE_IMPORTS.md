# Type Imports Guide

This guide shows you how to properly import types from the `afrimomo-sdk` package.

## Main SDK and Configuration

```typescript
import { AfromomoSDK } from "afrimomo-sdk";
import type { SDKConfig } from "afrimomo-sdk";
```

## PayChangu Types

### Payment Types
```typescript
import type {
  AccountInfo,
  PaymentDataInfo,
  PayChanguInitialPayment,
  PayChanguDirectChargePayment,
  PayChanguMobileMoneyPayout,
  PayChanguBankPayout,
  PayChanguDirectChargeBankTransfer,
  PayChanguCustomization,
} from "afrimomo-sdk";
```

### Response Types
```typescript
import type {
  PayChanguErrorResponse,
  PayChanguOperatorsResponse,
  PayChanguTransactionDetailsResponse,
  PayChanguPayoutResponse,
  PayChanguBanksResponse,
  // ... and many more response types
} from "afrimomo-sdk";
```

### PayChangu Namespace Types
```typescript
import type { PayChanguTypes } from "afrimomo-sdk";

// Usage
const transaction: PayChanguTypes.BaseTransaction = {
  // transaction data
};

const verifiedTransaction: PayChanguTypes.VerifiedTransaction = {
  // verified transaction data
};
```

## PawaPay Types

### Payment Types
```typescript
import type {
  PawapayPaymentData,
  PawapayInitiatePaymentResponse,
  PaymentStatus,
  PaymentTransaction,
  Payer,
  SuspiciousActivityReport,
} from "afrimomo-sdk";
```

### Payout Types
```typescript
import type {
  PayoutTransaction,
  PawaPayPayoutTransaction,
  BulkPayoutResponse,
  PayoutStatus,
  ResendCallbackResponseStatus,
  ResendCallbackResponse,
} from "afrimomo-sdk";
```

### Refund Types
```typescript
import type {
  RefundResponse,
  RefundRejectionCode,
  RefundTransaction,
  RefundFailureCode,
} from "afrimomo-sdk";
```

### Wallet Types
```typescript
import type {
  WalletBalance,
  WalletBalancesResponse,
} from "afrimomo-sdk";
```

### Network Types
```typescript
import type {
  OperationStatus,
  OperationType,
  CorrespondentOperation,
  PawapayCorrespondent,
  CountryCorrespondents,
  AvailabilityResponse,
  OperationConfig,
  CorrespondentConfig,
  CountryConfig,
  ActiveConfigResponse,
} from "afrimomo-sdk";
```

## Environment and Configuration Types

```typescript
import type {
  Environment,
  ApiUrl,
  EnvConfig,
  EnvLoadOptions,
} from "afrimomo-sdk";
```

## Shared Types

```typescript
import type {
  NetworkResponse,
  MoMoCurrency,
  Correspondent,
} from "afrimomo-sdk";
```

## Services

```typescript
import { PawaPay, PayChangu } from "afrimomo-sdk";
```

## Utilities

```typescript
import { NetworkManager, BaseService, logger } from "afrimomo-sdk";
```

## Constants

```typescript
import { Environment, ENVIRONMENTS, URLS } from "afrimomo-sdk";
```

## Example Usage

```typescript
import { AfromomoSDK } from "afrimomo-sdk";
import type { 
  ActiveConfigResponse, 
  PayChanguOperatorsResponse,
  PayChanguTypes 
} from "afrimomo-sdk";

// Initialize SDK
const sdk = new AfromomoSDK({
  environment: "sandbox",
  pawapay: {
    apiToken: "your-pawapay-token"
  },
  paychangu: {
    secretKey: "your-paychangu-secret"
  }
});

// Use types for API responses
async function getNetworkConfig(): Promise<ActiveConfigResponse> {
  return sdk.pawapay.network.getActiveConfig();
}

async function getOperators(): Promise<PayChanguOperatorsResponse> {
  return sdk.paychangu.getMobileMoneyOperators();
}

// Use namespace types
function processTransaction(transaction: PayChanguTypes.BaseTransaction) {
  console.log(`Processing transaction ${transaction.charge_id}`);
}
```

## Migration from Deep Imports

If you were previously importing from deep paths, you can now import directly from the main package:

```typescript
// ❌ Old way (deep imports)
import type { ActiveConfigResponse } from "afrimomo-sdk/dist/services/pawapay/types/network";
import type { PayChanguOperatorsResponse } from "afrimomo-sdk/dist/services/paychangu/types/response";

// ✅ New way (main package imports)
import type { ActiveConfigResponse, PayChanguOperatorsResponse } from "afrimomo-sdk";
```

This approach provides better maintainability and follows standard npm package practices.
