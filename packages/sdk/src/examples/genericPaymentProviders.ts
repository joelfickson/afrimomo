/**
 * Generic Payment Provider Example
 * 
 * This example demonstrates how to use the generic payment provider adapter
 * with different payment services like PayChangu and Pawapay.
 */

import { PaymentProviderAdapter, PaymentProviderConfig, GenericPaymentRequest, GenericTransaction } from '../services/generic/paymentProvider';
import { logger } from '../utils/logger';

/**
 * Example implementation for PayChangu using the generic adapter
 */
function createPayChanguProvider(apiKey: string, env: 'production' | 'sandbox' = 'sandbox'): PaymentProviderAdapter {
  const baseUrl = env === 'production' 
    ? 'https://api.paychangu.com/v1' 
    : 'https://sandbox.paychangu.com/v1';
  
  const config: PaymentProviderConfig = {
    name: 'PayChangu',
    baseUrl,
    authType: 'bearer',
    authToken: apiKey,
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    endpoints: {
      createPayment: '/payments/direct-charge',
      getTransaction: '/transactions/{id}',
      getBalance: '/account/balance'
    },
    // Optional: Transform generic payment request to PayChangu format
    requestTransformer: (request: GenericPaymentRequest) => ({
      amount: request.amount,
      currency: request.currency,
      chargeId: request.reference,
      accountInfo: {
        email: request.customerInfo?.email || '',
        first_name: request.customerInfo?.name?.split(' ')[0] || '',
        last_name: request.customerInfo?.name?.split(' ').slice(1).join(' ') || ''
      }
    }),
    // Optional: Transform PayChangu response to generic format
    responseTransformer: <T>(response: unknown): T => {
      // Handle payment creation response
      if (typeof response === 'object' && response !== null && 'id' in response) {
        const res = response as Record<string, unknown>;
        return {
          success: true,
          transactionId: res.id as string,
          redirectUrl: res.redirectUrl as string,
          ...res
        } as unknown as T;
      }
      
      // Handle transaction response
      if (typeof response === 'object' && response !== null && 'status' in response) {
        const res = response as Record<string, unknown>;
        return {
          id: res.id as string,
          amount: res.amount as string,
          status: res.status as string,
          timestamp: res.createdAt as string,
          ...res
        } as unknown as T;
      }
      
      return response as T;
    }
  };
  
  return new PaymentProviderAdapter(config);
}

/**
 * Example implementation for Pawapay using the generic adapter
 */
function createPawapayProvider(jwt: string, env: 'production' | 'sandbox' = 'sandbox'): PaymentProviderAdapter {
  const baseUrl = env === 'production' 
    ? 'https://api.pawapay.io/v1' 
    : 'https://sandbox.pawapay.io/v1';
  
  const config: PaymentProviderConfig = {
    name: 'Pawapay',
    baseUrl,
    authType: 'bearer',
    authToken: jwt,
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    endpoints: {
      createPayment: '/payments',
      getTransaction: '/payments/{id}',
      getBalance: '/wallet/balance'
    },
    // Optional: Transform generic payment request to Pawapay format
    requestTransformer: (request: GenericPaymentRequest) => ({
      amount: request.amount,
      currency: request.currency,
      reference: request.reference,
      description: request.description || 'Payment via Pawapay',
      customer: {
        email: request.customerInfo?.email,
        name: request.customerInfo?.name,
        phone: request.customerInfo?.phone
      },
      metadata: request.metadata
    }),
    // Optional: Transform Pawapay response to generic format
    responseTransformer: <T>(response: unknown): T => {
      // Handle payment response
      if (typeof response === 'object' && response !== null && 'payment_id' in response) {
        const res = response as Record<string, unknown>;
        return {
          success: true,
          transactionId: res.payment_id as string,
          ...res
        } as unknown as T;
      }
      
      // Handle transaction response
      if (typeof response === 'object' && response !== null && 'status' in response) {
        const res = response as Record<string, unknown>;
        return {
          id: res.payment_id as string,
          amount: res.amount as string,
          status: res.status as string,
          timestamp: res.created_at as string,
          ...res
        } as unknown as T;
      }
      
      return response as T;
    }
  };
  
  return new PaymentProviderAdapter(config);
}

/**
 * Example usage of the generic payment providers
 */
async function runPaymentExample() {
  try {
    // Create provider instances
    const payChangu = createPayChanguProvider('your-paychangu-api-key');
    const pawapay = createPawapayProvider('your-pawapay-jwt-token');
    
    // Create a payment with PayChangu
    const payChanguPayment = await payChangu.createPayment({
      amount: '1000',
      currency: 'KES',
      reference: 'ORDER-123',
      description: 'Purchase of widgets',
      customerInfo: {
        email: 'customer@example.com',
        name: 'John Doe',
        phone: '+2547XXXXXXXX'
      }
    });
    
    logger.info('PayChangu payment result:', payChanguPayment);
    
    if (payChanguPayment.success && payChanguPayment.transactionId) {
      // Get transaction details
      const transaction = await payChangu.getTransaction(payChanguPayment.transactionId);
      logger.info('PayChangu transaction:', transaction);
    }
    
    // Create a payment with Pawapay
    const pawapayPayment = await pawapay.createPayment({
      amount: '1000',
      currency: 'GHS',
      reference: 'ORDER-124',
      description: 'Mobile money payment',
      customerInfo: {
        email: 'customer@example.com',
        name: 'Jane Smith',
        phone: '+233XXXXXXXX'
      },
      metadata: {
        orderSource: 'web',
        productId: 'PROD-456'
      }
    });
    
    logger.info('Pawapay payment result:', pawapayPayment);
    
    if (pawapayPayment.success && pawapayPayment.transactionId) {
      // Get transaction details
      const transaction = await pawapay.getTransaction(pawapayPayment.transactionId);
      logger.info('Pawapay transaction:', transaction);
    }
    
    // Check balances (if supported)
    const payChanguBalance = await payChangu.getBalance();
    logger.info('PayChangu balance:', payChanguBalance);
    
    const pawapayBalance = await pawapay.getBalance();
    logger.info('Pawapay balance:', pawapayBalance);
    
  } catch (error) {
    logger.error('Payment example failed:', error);
  }
}

/**
 * Example of how to implement a new payment provider quickly
 */
function createCustomPaymentProvider(apiKey: string, baseUrl: string): PaymentProviderAdapter {
  const config: PaymentProviderConfig = {
    name: 'CustomProvider',
    baseUrl,
    authType: 'basic',
    username: apiKey,
    password: '',
    endpoints: {
      createPayment: '/api/payments',
      getTransaction: '/api/payments/{id}'
      // No balance endpoint for this provider
    }
  };
  
  return new PaymentProviderAdapter(config);
}

// Export for use in other examples
export {
  createPayChanguProvider,
  createPawapayProvider,
  createCustomPaymentProvider,
  runPaymentExample
};

// Run the example if this file is executed directly
if (require.main === module) {
  runPaymentExample()
    .then(() => console.log('Example completed'))
    .catch(err => console.error('Example failed:', err));
} 