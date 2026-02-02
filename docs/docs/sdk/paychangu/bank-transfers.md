---
sidebar_position: 3
title: Bank Transfers
description: PayChangu bank transfer operations
---

# PayChangu Bank Transfers

Process bank transfers and payouts in Malawi.

## Get Supported Banks

```typescript
const banks = await sdk.paychangu.getSupportedBanks("MWK");

banks.data.forEach(bank => {
  console.log(`${bank.name}: ${bank.uuid}`);
});
```

## Process Bank Transfer

```typescript
const transfer = await sdk.paychangu.processBankTransfer({
  amount: 10000,
  currency: "MWK",
  bank_id: "bank-uuid",
  account_number: "123456789",
  account_name: "John Doe"
});
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | number | Yes | Amount to transfer |
| `currency` | string | Yes | Currency code (MWK) |
| `bank_id` | string | Yes | Bank UUID from supported banks |
| `account_number` | string | Yes | Recipient account number |
| `account_name` | string | Yes | Recipient account name |

## Bank Payout

```typescript
const bankPayout = await sdk.paychangu.bankPayout({
  amount: 5000,
  currency: "MWK",
  account_number: "987654321",
  bank_uuid: "bank-uuid",
  reference: "bank-payout-456"
});
```

## Supported Banks

Common banks in Malawi:

- National Bank of Malawi
- Standard Bank Malawi
- FDH Bank
- NBS Bank
- First Capital Bank
- CDH Investment Bank

Use `getSupportedBanks()` to get the current list with UUIDs.

## Response Types

```typescript
import type { PayChanguTypes } from "afrimomo-sdk";

type BanksResponse = PayChanguTypes.BanksResponse;
type BankTransferResponse = PayChanguTypes.BankTransferResponse;
```
