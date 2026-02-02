---
sidebar_position: 2
title: Payouts
description: PawaPay payout operations
---

# PawaPay Payouts

Send money to customers via mobile money.

## Send a Single Payout

```typescript
const payout = await sdk.pawapay.payouts.send({
  payoutId: "payout-123",
  amount: "50.00",
  msisdn: "260701234567",
  country: "ZMB",
  statementDescription: "Withdrawal"
});
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `payoutId` | string | Yes | Unique identifier for the payout |
| `amount` | string | Yes | Amount to send |
| `msisdn` | string | Yes | Recipient phone number |
| `country` | string | Yes | ISO 3166-1 alpha-3 country code |
| `statementDescription` | string | No | Description on recipient statement |

## Send Bulk Payouts

Process multiple payouts in a single request:

```typescript
const bulkPayout = await sdk.pawapay.payouts.sendBulk([
  {
    payoutId: "payout-001",
    amount: "25.00",
    msisdn: "260701234567",
    country: "ZMB"
  },
  {
    payoutId: "payout-002",
    amount: "30.00",
    msisdn: "260709876543",
    country: "ZMB"
  }
]);
```

## Get Payout Status

```typescript
const status = await sdk.pawapay.payouts.getStatus(payoutId);

console.log("Status:", status.status);
console.log("Completed at:", status.completedAt);
```

## Payout Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Payout is being processed |
| `COMPLETED` | Successfully sent to recipient |
| `FAILED` | Payout failed |
| `CANCELLED` | Payout was cancelled |

## Response Types

```typescript
import type { PawaPayTypes } from "afrimomo-sdk";

type PayoutResponse = PawaPayTypes.PayoutResponse;
type BulkPayoutResponse = PawaPayTypes.BulkPayoutResponse;
```
