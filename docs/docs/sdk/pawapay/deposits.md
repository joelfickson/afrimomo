---
sidebar_position: 1
title: Deposits
description: PawaPay deposit operations
---

# PawaPay Deposits

Request mobile money deposits from customers across Sub-Saharan Africa.

## Request a Deposit

```typescript
const deposit = await sdk.pawapay.payments.initiate({
  depositId: "unique-deposit-id",
  amount: "100.00",
  msisdn: "260971234567",
  country: "ZMB",
  returnUrl: "https://your-app.com/callback",
  statementDescription: "Online purchase",
  language: "EN",
  reason: "Payment for goods"
});
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositId` | string | Yes | Unique identifier for the deposit |
| `amount` | string | Yes | Amount to charge |
| `msisdn` | string | Yes | Customer phone number (with country code) |
| `country` | string | Yes | ISO 3166-1 alpha-3 country code |
| `returnUrl` | string | Yes | URL to redirect after payment |
| `statementDescription` | string | Yes | Description shown on customer statement |
| `language` | string | No | Language for payment UI (EN, FR, etc.) |
| `reason` | string | No | Reason for the payment |

## Get Deposit Details

```typescript
const details = await sdk.pawapay.payments.getDeposit(depositId);

console.log("Status:", details.status);
console.log("Amount:", details.amount);
```

## Resend Callback

If your webhook didn't receive the callback:

```typescript
await sdk.pawapay.payments.resendCallback(depositId);
```

## Supported Countries

| Country | Code | Currency |
|---------|------|----------|
| Zambia | ZMB | ZMW |
| Tanzania | TZA | TZS |
| Uganda | UGA | UGX |
| Kenya | KEN | KES |
| Ghana | GHA | GHS |
| Cameroon | CMR | XAF |
| Senegal | SEN | XOF |
| Ivory Coast | CIV | XOF |
| Mozambique | MOZ | MZN |
| Rwanda | RWA | RWF |
| Malawi | MWI | MWK |
| DRC | COD | CDF |
| Benin | BEN | XOF |
| Burkina Faso | BFA | XOF |

## Response Types

```typescript
import type { PawaPayTypes } from "afrimomo-sdk";

// Deposit response type
type DepositResponse = PawaPayTypes.DepositResponse;
```
