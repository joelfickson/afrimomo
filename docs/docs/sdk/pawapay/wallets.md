---
sidebar_position: 3
title: Wallets
description: PawaPay wallet management
---

# PawaPay Wallet Management

Query wallet balances and manage your funds.

## Get All Balances

```typescript
const balances = await sdk.pawapay.wallets.getBalances();

balances.forEach(balance => {
  console.log(`${balance.country}: ${balance.currency} ${balance.amount}`);
});
```

## Get Country Balance

```typescript
const zambiaBalance = await sdk.pawapay.wallets.getCountryBalance("ZMB");

console.log("Available:", zambiaBalance.available);
console.log("Currency:", zambiaBalance.currency);
```

## Balance Response

```typescript
interface WalletBalance {
  country: string;
  currency: string;
  amount: string;
  available: string;
  reserved: string;
}
```

## Response Types

```typescript
import type { PawaPayTypes } from "afrimomo-sdk";

type WalletBalanceResponse = PawaPayTypes.WalletBalanceResponse;
```
