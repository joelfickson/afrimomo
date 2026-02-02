---
sidebar_position: 4
title: Configuration
description: Configure the Afrimomo SDK
---

# Configuration

The SDK supports flexible configuration for multiple payment providers.

## Environment Configuration

Use environment variables to securely store your API credentials:

```typescript
import { AfromomoSDK, Environment } from "afrimomo-sdk";

const sdk = new AfromomoSDK({
  environment: Environment.SANDBOX, // or Environment.PRODUCTION
  pawapay: {
    apiToken: process.env.PAWAPAY_TOKEN
  },
  paychangu: {
    secretKey: process.env.PAYCHANGU_SECRET
  },
  onekhusa: {
    apiKey: process.env.ONEKHUSA_API_KEY,
    apiSecret: process.env.ONEKHUSA_API_SECRET,
    organisationId: process.env.ONEKHUSA_ORGANISATION_ID
  }
});
```

## Provider-Specific Configuration

### PawaPay

```typescript
const sdk = new AfromomoSDK({
  environment: "sandbox",
  pawapay: {
    apiToken: "your-jwt-token" // JWT token from PawaPay dashboard
  }
});
```

### PayChangu

```typescript
const sdk = new AfromomoSDK({
  environment: "sandbox",
  paychangu: {
    secretKey: "your-secret-key" // Secret key from PayChangu dashboard
  }
});
```

### OneKhusa

```typescript
const sdk = new AfromomoSDK({
  environment: "sandbox",
  onekhusa: {
    apiKey: "your-api-key",
    apiSecret: "your-api-secret",
    organisationId: "your-organisation-id"
  }
});
```

## Selective Provider Configuration

Only configure the providers you need:

```typescript
// Only PawaPay
const sdk = new AfromomoSDK({
  environment: "production",
  pawapay: {
    apiToken: process.env.PAWAPAY_TOKEN
  }
});

// Only PayChangu and OneKhusa
const sdk = new AfromomoSDK({
  environment: "production",
  paychangu: {
    secretKey: process.env.PAYCHANGU_SECRET
  },
  onekhusa: {
    apiKey: process.env.ONEKHUSA_API_KEY,
    apiSecret: process.env.ONEKHUSA_API_SECRET,
    organisationId: process.env.ONEKHUSA_ORGANISATION_ID
  }
});
```

## Check Provider Availability

```typescript
if (sdk.isServiceConfigured("pawapay")) {
  // PawaPay is configured and ready to use
  const balances = await sdk.pawapay.wallets.getBalances();
}

if (sdk.isServiceConfigured("onekhusa")) {
  // OneKhusa is configured
  const status = await sdk.onekhusa.checkStatus();
}
```

:::caution Security Tip
Never commit API keys to version control. Use environment variables or a secure configuration management system.
:::

## Getting API Credentials

### PawaPay

1. Visit [PawaPay](https://www.pawapay.io/) and create a developer account
2. Complete the onboarding process and verification
3. Get your API token (JWT) from the PawaPay dashboard
4. Use sandbox tokens for testing

### PayChangu

1. Sign up at [PayChangu](https://in.paychangu.com/register)
2. Complete business verification
3. Get your secret key from the merchant dashboard
4. Use test credentials for sandbox environment

### OneKhusa

1. Contact [OneKhusa](https://onekhusa.com/) to create a business account
2. Complete the KYC verification process
3. Get your API Key, API Secret, and Organisation ID from the dashboard
4. Use sandbox environment for testing
