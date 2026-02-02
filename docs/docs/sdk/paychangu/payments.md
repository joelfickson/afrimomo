---
sidebar_position: 1
title: Payments
description: PayChangu payment operations
---

# PayChangu Payments

Accept payments through hosted checkout and direct charge.

## Hosted Checkout

Redirect customers to PayChangu's hosted payment page:

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

// Redirect customer to checkout
console.log("Checkout URL:", payment.data.checkout_url);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | number | Yes | Amount to charge |
| `currency` | string | Yes | Currency code (MWK) |
| `tx_ref` | string | Yes | Your unique transaction reference |
| `email` | string | Yes | Customer email |
| `first_name` | string | Yes | Customer first name |
| `last_name` | string | Yes | Customer last name |
| `callback_url` | string | Yes | Webhook URL for notifications |
| `return_url` | string | Yes | URL after payment completion |

## Direct Charge

Charge customers directly without redirect:

```typescript
const directCharge = await sdk.paychangu.initiateDirectChargePayment({
  amount: 5000,
  currency: "MWK",
  chargeId: "charge-789",
  accountInfo: {
    email: "customer@example.com",
    first_name: "John",
    last_name: "Doe"
  }
});
```

## Verify Transaction

```typescript
const verification = await sdk.paychangu.verifyTransaction(tx_ref);

console.log("Status:", verification.data.status);
console.log("Amount:", verification.data.amount);
```

## Get Transaction Details

```typescript
const details = await sdk.paychangu.getTransactionDetails(tx_ref);
```

## Transaction Statuses

| Status | Description |
|--------|-------------|
| `successful` | Payment completed |
| `pending` | Payment in progress |
| `failed` | Payment failed |

## Response Types

```typescript
import type { PayChanguTypes } from "afrimomo-sdk";

type PaymentResponse = PayChanguTypes.PaymentResponse;
type VerificationResponse = PayChanguTypes.VerificationResponse;
```
