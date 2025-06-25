# Afrimomo SDK

A unified SDK for African payment providers, making it easy to integrate multiple payment services with a consistent interface.

## Features

- 🌍 Support for multiple African payment providers
- 🔒 Type-safe API with full TypeScript support
- 📚 Comprehensive documentation
- 🛠️ Easy to configure and use
- 🔄 Consistent error handling
- � Clean imports - no deep imports required

## Currently Supported Providers

- **PayChangu** - Payment services in Malawi
- **PawaPay** - Mobile money payments across Africa

## Prerequisites

Before using the Afrimomo SDK, you'll need to create accounts with the payment providers:

### PawaPay Account Setup
1. Visit [PawaPay](https://www.pawapay.io/) and create a developer account
2. Complete the onboarding process and verification
3. Get your API token from the PawaPay dashboard
4. Note your environment (sandbox for testing, production for live transactions)

### PayChangu Account Setup
1. Visit [PayChangu](https://paychangu.com/) and create a merchant account
2. Complete the business verification process
3. Get your secret key from the PayChangu merchant dashboard
4. Configure your webhook URLs for payment notifications

## Installation

```bash
npm install afrimomo-sdk
# or
pnpm add afrimomo-sdk
# or
yarn add afrimomo-sdk
```

## Quick Start

```typescript
import { AfromomoSDK } from "afrimomo-sdk";

const sdk = new AfromomoSDK({
  environment: "sandbox", // Use "sandbox" for testing, "production" for live
  pawapay: {
    apiToken: "your-pawapay-api-token" // Get this from PawaPay dashboard
  },
  paychangu: {
    secretKey: "your-paychangu-secret-key" // Get this from PayChangu dashboard
  }
});

// Use PawaPay
const paymentResponse = await sdk.pawapay.payments.initiate({
  depositId: "unique-deposit-id",
  amount: "100.00",
  msisdn: "260123456789", // Customer's phone number
  returnUrl: "https://your-app.com/callback",
  statementDescription: "Payment for services",
  language: "EN",
  country: "ZMB", // ISO country code
  reason: "Service payment"
});

// Use PayChangu
const operatorsResponse = await sdk.paychangu.getMobileMoneyOperators();
```

> **Note**: Always use sandbox/test credentials during development. Switch to production credentials only when you're ready to process real payments.

## Type Imports

All types are available from the main package import - no deep imports needed:

```typescript
// ✅ Correct way
import type { 
  ActiveConfigResponse, 
  PayChanguOperatorsResponse,
  PayChanguTypes 
} from "afrimomo-sdk";

// ❌ Avoid deep imports (old way)
import type { ActiveConfigResponse } from "afrimomo-sdk/dist/services/pawapay/types/network";
```

For a comprehensive guide on importing types, see [TYPE_IMPORTS.md](./packages/sdk/TYPE_IMPORTS.md).

## API Examples

### PawaPay Integration

```typescript
import { AfromomoSDK } from "afrimomo-sdk";
import type { 
  ActiveConfigResponse, 
  PaymentTransaction,
  WalletBalance 
} from "afrimomo-sdk";

const sdk = new AfromomoSDK({
  environment: "sandbox",
  pawapay: {
    apiToken: "your-pawapay-token"
  }
});

// Initiate a payment
const payment = await sdk.pawapay.payments.initiate({
  depositId: "order-123",
  returnUrl: "https://your-app.com/success",
  statementDescription: "Online purchase",
  amount: "50.00",
  msisdn: "260971234567",
  language: "EN",
  country: "ZMB",
  reason: "Payment for goods"
});

// Check network configuration
const config: ActiveConfigResponse = await sdk.pawapay.network.getActiveConfig();

// Get wallet balances
const balances: WalletBalance[] = await sdk.pawapay.wallets.getBalances();
```

### PayChangu Integration

```typescript
import type { 
  PayChanguOperatorsResponse,
  PayChanguDirectChargePaymentResponse,
  PayChanguTypes 
} from "afrimomo-sdk";

const sdk = new AfromomoSDK({
  environment: "sandbox",
  paychangu: {
    secretKey: "your-paychangu-secret"
  }
});

// Get mobile money operators
const operators: PayChanguOperatorsResponse = await sdk.paychangu.getMobileMoneyOperators();

// Initiate direct charge payment
const payment: PayChanguDirectChargePaymentResponse = await sdk.paychangu.initiateDirectChargePayment({
  amount: 1000,
  currency: "MWK",
  chargeId: "order-456",
  accountInfo: {
    email: "customer@example.com",
    first_name: "John",
    last_name: "Doe"
  }
});

// Process transaction with namespace types
function processTransaction(transaction: PayChanguTypes.BaseTransaction) {
  console.log(`Processing ${transaction.charge_id}: ${transaction.status}`);
}
```

### Getting Started with Test Credentials

Both providers offer sandbox environments for testing:

**PawaPay Sandbox:**
- Use sandbox API tokens for testing
- Test with sandbox phone numbers provided in their documentation
- No real money is processed in sandbox mode

**PayChangu Testing:**
- Use test secret keys for development
- Test transactions won't affect real accounts
- Webhook URLs can point to local development servers (use ngrok for testing)

## Environment Configuration

The SDK supports both sandbox and production environments:

```typescript
import { Environment } from "afrimomo-sdk";

const sdk = new AfromomoSDK({
  environment: Environment.SANDBOX, // or Environment.PRODUCTION
  // ... provider configurations
});
```

> **Security Tip**: Never commit your production API keys to version control. Use environment variables or secure configuration management.

## Features

### PawaPay Integration
- Payment initiation and status tracking
- Payout processing with status monitoring
- Refund handling
- Wallet balance queries
- Network configuration and availability checks
- Full TypeScript support with comprehensive types

### PayChangu Integration
- Direct charge payments
- Mobile money payments
- Bank transfers and payouts
- Transaction verification
- Operator information retrieval
- Comprehensive error handling

## Project Structure

This is a monorepo containing:

- `packages/sdk/` - The main Afrimomo SDK package
- `examples/` - Usage examples and demos
- `tests/` - Test suites

## Development

To work with this project:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint

# Format code
pnpm format
```

## Release

The project uses automated releases via GitHub Actions:

- `patch` - Bug fixes and small improvements
- `minor` - New features
- `major` - Breaking changes
- `beta` - Pre-release versions

## Documentation

- [Type Imports Guide](./packages/sdk/TYPE_IMPORTS.md) - Complete guide for importing types
- [API Documentation](./DOCS.md) - Detailed API documentation
- [Examples](./examples/) - Usage examples and demos

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
