import { AfromomoSDK, type Environment } from '@afrimomo/sdk';

async function main() {
  // Initialize the SDK
  const sdk = new AfromomoSDK({
    paychangu: {
      secretKey: process.env.PAYCHANGU_SECRET_KEY || 'your-secret-key',
    },
    pawapay: {
      jwt: process.env.PAWAPAY_JWT || 'your-jwt',
    },
    environment: "DEVELOPMENT" as Environment

  });

  try {
    // Example: Initiate a payment with PayChangu
    const paymentResult = await sdk.paychangu.initiatePayment({
      amount: 1000,
      currency: 'MWK',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+265888123456',
      reference: 'ORDER-123',
    });

    console.log('Payment initiated:', paymentResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 