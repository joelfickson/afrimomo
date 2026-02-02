---
sidebar_position: 10
title: Type Definitions
description: TypeScript types exported from the SDK
---

# Type Definitions

All types are exported from the main package. No deep imports needed.

## Import Types

```typescript
// Correct way - import from main package
import type {
  ActiveConfigResponse,
  PayChanguOperatorsResponse,
  PayChanguTypes,
  PawaPayTypes,
  OneKhusaTypes
} from "afrimomo-sdk";

// Avoid deep imports
// import type { ... } from "afrimomo-sdk/dist/..."; // Don't do this
```

## Provider-Specific Types

### PawaPay Types

```typescript
import type { PawaPayTypes } from "afrimomo-sdk";

// Access nested types
type DepositRequest = PawaPayTypes.DepositRequest;
type DepositResponse = PawaPayTypes.DepositResponse;
type PayoutRequest = PawaPayTypes.PayoutRequest;
type WalletBalance = PawaPayTypes.WalletBalance;
```

### PayChangu Types

```typescript
import type { PayChanguTypes } from "afrimomo-sdk";

type PaymentRequest = PayChanguTypes.PaymentRequest;
type PaymentResponse = PayChanguTypes.PaymentResponse;
type BankTransferRequest = PayChanguTypes.BankTransferRequest;
```

### OneKhusa Types

```typescript
import type { OneKhusaTypes } from "afrimomo-sdk";

type CollectionRequest = OneKhusaTypes.CollectionRequest;
type DisbursementRequest = OneKhusaTypes.DisbursementRequest;
type BatchRequest = OneKhusaTypes.BatchRequest;
type Recipient = OneKhusaTypes.Recipient;
```

## Common Types

### Environment

```typescript
import { Environment } from "afrimomo-sdk";

// Use enum values
const env = Environment.SANDBOX; // or Environment.PRODUCTION
```

### SDK Configuration

```typescript
import type { SDKConfig } from "afrimomo-sdk";

const config: SDKConfig = {
  environment: "sandbox",
  pawapay: { apiToken: "..." },
  paychangu: { secretKey: "..." },
  onekhusa: {
    apiKey: "...",
    apiSecret: "...",
    organisationId: "..."
  }
};
```

## Type Safety

The SDK provides full type safety:

```typescript
import { AfromomoSDK } from "afrimomo-sdk";

const sdk = new AfromomoSDK({...});

// TypeScript will catch errors
const deposit = await sdk.pawapay.payments.initiate({
  depositId: "123",
  amount: "100.00",
  msisdn: "260971234567",
  country: "ZMB",
  // TypeScript error if required fields are missing
});

// Response is fully typed
console.log(deposit.status); // Autocomplete available
```
