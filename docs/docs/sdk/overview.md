---
sidebar_position: 1
title: SDK Overview
description: A unified TypeScript SDK for African payment providers
---

# Afrimomo SDK

<span className="version-badge">v0.1.0</span>

A unified TypeScript SDK for seamless integration with African payment providers. Type-safe, reliable, and built for production.

## Features

- **Multi-Provider Support** - PayChangu, PawaPay, and OneKhusa in one SDK
- **Full TypeScript Support** - Comprehensive type definitions for all APIs
- **Sandbox & Production** - Easy environment switching for development and production
- **Comprehensive Error Handling** - Detailed error messages and types

## Supported Providers

| Provider | Region | Capabilities |
|----------|--------|--------------|
| PayChangu | Malawi | Payments, Mobile Money, Bank Transfers |
| PawaPay | Sub-Saharan Africa | Deposits, Payouts, Refunds, Wallets |
| OneKhusa | Malawi & Southern Africa | Collections, Disbursements, Batch Payouts |

## Quick Example

```typescript
import { AfromomoSDK } from "afrimomo-sdk";

const sdk = new AfromomoSDK({
  environment: "sandbox",
  pawapay: { apiToken: "your-token" },
  paychangu: { secretKey: "your-secret" },
  onekhusa: {
    apiKey: "your-api-key",
    apiSecret: "your-api-secret",
    organisationId: "your-org-id"
  }
});

// Now use sdk.pawapay, sdk.paychangu, or sdk.onekhusa
```

## Next Steps

- [Installation](/docs/sdk/installation) - Install the SDK
- [Quick Start](/docs/sdk/quick-start) - Get up and running
- [Configuration](/docs/sdk/configuration) - Configure providers
