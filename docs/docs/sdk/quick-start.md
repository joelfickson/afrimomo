---
sidebar_position: 3
title: Quick Start
description: Get started with the Afrimomo SDK
---

# Quick Start

Get up and running with Afrimomo SDK in minutes.

## Initialize the SDK

```typescript
import { AfromomoSDK } from "afrimomo-sdk";

const sdk = new AfromomoSDK({
  environment: "sandbox", // or "production"
  pawapay: {
    apiToken: "your-pawapay-token"
  },
  paychangu: {
    secretKey: "your-paychangu-secret"
  },
  onekhusa: {
    apiKey: "your-onekhusa-api-key",
    apiSecret: "your-onekhusa-api-secret",
    organisationId: "your-organisation-id"
  }
});
```

:::tip
You only need to configure the providers you plan to use. Each provider is optional.
:::

## PawaPay Example

Request a mobile money deposit:

```typescript
const deposit = await sdk.pawapay.payments.initiate({
  depositId: "order-123",
  amount: "50.00",
  msisdn: "260971234567",
  country: "ZMB",
  returnUrl: "https://your-app.com/callback",
  statementDescription: "Payment for services",
  language: "EN",
  reason: "Service payment"
});

console.log("Deposit initiated:", deposit);
```

## PayChangu Example

Get mobile money operators:

```typescript
const operators = await sdk.paychangu.getMobileMoneyOperators();
console.log("Available operators:", operators);
```

Initiate a payment:

```typescript
const payment = await sdk.paychangu.initiatePayment({
  amount: 1000,
  currency: "MWK",
  tx_ref: "order-456",
  email: "customer@example.com",
  first_name: "John",
  last_name: "Doe",
  callback_url: "https://your-app.com/webhook",
  return_url: "https://your-app.com/success"
});

console.log("Payment URL:", payment.data.checkout_url);
```

## OneKhusa Example

Initiate a collection (request-to-pay):

```typescript
const collection = await sdk.onekhusa.collections.initiateRequestToPay({
  amount: 5000,
  currency: "MWK",
  phoneNumber: "265991234567",
  reference: "order-789",
  narration: "Payment for goods"
});

console.log("Collection TAN:", collection.tan);
```

Create a disbursement:

```typescript
const disbursement = await sdk.onekhusa.disbursements.addSingle({
  amount: 10000,
  currency: "MWK",
  paymentMethod: "MOBILE_MONEY",
  recipient: {
    name: "John Doe",
    phone: "265991234567"
  },
  reference: "payout-001",
  narration: "Salary payment"
});

console.log("Disbursement created:", disbursement.id);
```

## Next Steps

- [Configuration](/docs/sdk/configuration) - Advanced configuration options
- [PawaPay](/docs/sdk/pawapay/deposits) - PawaPay API reference
- [PayChangu](/docs/sdk/paychangu/payments) - PayChangu API reference
- [OneKhusa](/docs/sdk/onekhusa/collections) - OneKhusa API reference
