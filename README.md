# Afromomo

A unified SDK for African payment providers, making it easy to integrate multiple payment services with a consistent interface.

## Features

- 🌍 Support for multiple African payment providers
- 🔒 Type-safe API with full TypeScript support
- 📚 Comprehensive documentation
- 🛠️ Easy to configure and use
- 🔄 Consistent error handling

## Currently Supported Providers

- **PayChangu** - Payment services in Malawi
- **PawaPay** - Mobile money payments across Africa

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
  }
});
```

3. Use the services:
```typescript
// Using PayChangu
const paymentResponse = await sdk.paychangu.initiatePayment({
  account_id: 'user123',
  purchase_amount: '1000',
  purchase_currency: 'MWK',
  item_title: 'Product Purchase',
  description: 'Purchase description'
}, {
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe'
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
```

## Documentation

For detailed documentation, see [DOCS.md](./DOCS.md).

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
