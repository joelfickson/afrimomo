---
sidebar_position: 2
title: Mobile Money
description: PayChangu mobile money operations
---

# PayChangu Mobile Money

Send payouts via mobile money operators in Malawi.

## Get Mobile Operators

```typescript
const operators = await sdk.paychangu.getMobileMoneyOperators();

operators.data.forEach(operator => {
  console.log(`${operator.name}: ${operator.id}`);
});
```

## Mobile Money Payout

```typescript
const payout = await sdk.paychangu.mobileMoneyPayout({
  amount: 2000,
  currency: "MWK",
  recipient_phone: "265991234567",
  operator_id: "operator-uuid",
  reference: "payout-123"
});

console.log("Payout ID:", payout.data.id);
console.log("Status:", payout.data.status);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | number | Yes | Amount to send |
| `currency` | string | Yes | Currency code (MWK) |
| `recipient_phone` | string | Yes | Recipient phone number |
| `operator_id` | string | Yes | Mobile operator ID |
| `reference` | string | Yes | Your unique reference |

## Get Payout Details

```typescript
const details = await sdk.paychangu.getMobilePayoutDetails(reference);

console.log("Status:", details.data.status);
console.log("Completed:", details.data.completed_at);
```

## List All Payouts

```typescript
const payouts = await sdk.paychangu.listPayouts();

payouts.data.forEach(payout => {
  console.log(`${payout.reference}: ${payout.status}`);
});
```

## Supported Operators

The available mobile money operators can be retrieved using `getMobileMoneyOperators()`. Common operators in Malawi include:

- Airtel Money
- TNM Mpamba

## Response Types

```typescript
import type { PayChanguTypes } from "afrimomo-sdk";

type OperatorsResponse = PayChanguTypes.OperatorsResponse;
type PayoutResponse = PayChanguTypes.PayoutResponse;
```
