# Afromomo

A unified SDK for African payment providers, making it easy to integrate multiple payment services with a consistent interface.

## Features

- 🌍 Support for multiple African payment providers
- 🔒 Type-safe API with full TypeScript support
- 📚 Comprehensive documentation
- 🛠️ Easy to configure and use
- 🔄 Consistent error handling
- 🔌 Generic adapter for custom payment providers

## Currently Supported Providers

- **PayChangu** - Payment services in Malawi
- **PawaPay** - Mobile money payments across Africa
- **Custom Providers** - Add your own payment providers with the generic adapter

## Quick Start

1. Install the package:
```bash
npm install afromomo
```

2. Initialize the SDK:
```typescript
import { AfromomoSDK } from 'afromomo';

const sdk = new AfromomoSDK({
  paychangu: {
    secretKey: 'your-paychangu-secret-key'
  },
  pawapay: {
    jwt: 'your-pawapay-jwt-token',
    environment: 'DEVELOPMENT'
  },
  // Optional: custom payment providers
  providers: {
    'my-provider': {
      name: 'MyProvider',
      baseUrl: 'https://api.myprovider.com',
      authType: 'bearer',
      authToken: 'your-api-key',
      endpoints: {
        createPayment: '/payments',
        getTransaction: '/transactions/{id}'
      }
    }
  }
});
```

3. Use the services:
```typescript
// Using PayChangu
const paymentResponse = await sdk.paychangu.initiateDirectChargePayment({
  amount: 1000,
  currency: 'MWK',
  chargeId: 'order-123',
  accountInfo: {
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe'
  }
});

// Using PawaPay
const depositResponse = await sdk.pawapay.deposits.sendDeposit({
  phoneNumber: '+123456789',
  amount: '100',
  payoutId: 'unique-id',
  currency: 'USD',
  correspondent: 'MTN_MOMO_GHA',
  statementDescription: 'Payment for services',
  country: 'GHA'
});

// Using custom provider
const customPayment = await sdk.getProvider('my-provider').createPayment({
  amount: '2000',
  currency: 'NGN',
  reference: 'order-456',
  customerInfo: {
    email: 'customer@example.com',
    name: 'Jane Smith'
  }
});
```

## Using the Generic Payment Provider Adapter

You can easily add support for any payment provider with the generic adapter:

```typescript
import { AfromomoSDK, PaymentProviderConfig } from 'afromomo';

// Configure a new payment provider
const flutterwaveConfig: PaymentProviderConfig = {
  name: 'Flutterwave',
  baseUrl: 'https://api.flutterwave.com/v3',
  authType: 'bearer',
  authToken: 'your-flutterwave-secret-key',
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  endpoints: {
    createPayment: '/payments',
    getTransaction: '/transactions/{id}',
    getBalance: '/balances'
  },
  // Optional: Transform requests to match the provider's API
  requestTransformer: (request) => ({
    amount: request.amount,
    currency: request.currency,
    tx_ref: request.reference,
    customer: {
      email: request.customerInfo?.email
    }
  })
};

// Initialize the SDK and add your provider
const sdk = AfromomoSDK.initialize();
const flutterwave = sdk.addProvider('flutterwave', flutterwaveConfig);

// Use your provider
const payment = await flutterwave.createPayment({
  amount: '5000',
  currency: 'NGN',
  reference: 'order-789',
  customerInfo: {
    email: 'customer@example.com',
    name: 'Alex Johnson'
  }
});
```

## Documentation

For detailed documentation, see [DOCS.md](./DOCS.md).

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
