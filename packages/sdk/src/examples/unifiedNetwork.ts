/**
 * Example of using the unified network manager for different payment providers
 * 
 * This file demonstrates how to use the ApiNetworkManager with different configurations
 * to handle API requests for different payment providers.
 */

import { PayChanguNetworkV2 } from "../services/paychangu/networkImpl";
import { PawapayNetworkV2 } from "../services/pawapay/networkImpl";
import { logger } from "../utils/logger";

// Sample response types
interface PayChanguTransaction {
  id: string;
  amount: string;
  status: string;
}

interface PawapayBalance {
  balance: string;
  currency: string;
}

/**
 * Example class showing how to use both payment providers with the unified network manager
 */
class PaymentExample {
  private readonly paychangu: PayChanguNetworkV2;
  private readonly pawapay: PawapayNetworkV2;
  
  constructor(paychanguKey: string, pawapayJwt: string) {
    // Initialize both network managers with their respective configurations
    this.paychangu = new PayChanguNetworkV2(paychanguKey);
    this.pawapay = new PawapayNetworkV2(pawapayJwt);
  }
  
  /**
   * Example of getting transaction details from PayChangu
   * 
   * @param chargeId - The transaction ID to look up
   */
  async getPayChanguTransactionDetails(chargeId: string): Promise<PayChanguTransaction> {
    try {
      // Use the unified API methods with typed responses
      return await this.paychangu.get<PayChanguTransaction>(
        `/direct-charge/transactions/${chargeId}/details`,
        {
          headers: {
            // Any additional headers can be added here
          }
        },
        `getting transaction details for ${chargeId}`
      );
    } catch (error) {
      // The error is already handled by the network layer
      logger.error("Failed to get PayChangu transaction details", error);
      throw error;
    }
  }
  
  /**
   * Example of getting wallet balance from PawaPay
   * 
   * @param country - Optional country code to filter balances
   */
  async getPawapayBalance(country?: string): Promise<PawapayBalance> {
    try {
      // Use the unified API methods with typed responses
      const endpoint = country 
        ? `/wallet-balances/${country}`
        : '/wallet-balances';
        
      return await this.pawapay.get<PawapayBalance>(
        endpoint,
        {},
        `getting wallet balance${country ? ` for ${country}` : ''}`
      );
    } catch (error) {
      // The error is already handled by the network layer
      logger.error("Failed to get PawaPay balance", error);
      throw error;
    }
  }
  
  /**
   * Example showing how the same code pattern works for both providers
   */
  async runComparisonExample(): Promise<void> {
    try {
      // Make similar requests to both providers using the same pattern
      const paychanguData = await this.paychangu.post<{ success: boolean }>(
        '/some-endpoint',
        { data: 'example' },
        {},
        'test operation'
      );
      
      const pawapayData = await this.pawapay.post<{ success: boolean }>(
        '/some-endpoint',
        { data: 'example' },
        {},
        'test operation'
      );
      
      logger.info("Both API calls succeeded", { paychanguData, pawapayData });
    } catch (error) {
      logger.error("Comparison example failed", error);
    }
  }
}

// Usage example (would be in actual application code)
/*
const example = new PaymentExample(
  'paychangu-secret-key-123',
  'pawapay-jwt-token-456'
);

// Get transaction details from PayChangu
example.getPayChanguTransactionDetails('charge-123')
  .then(transaction => console.log('Transaction:', transaction))
  .catch(error => console.error('Error:', error));

// Get wallet balance from PawaPay
example.getPawapayBalance('ZMB')
  .then(balance => console.log('Balance:', balance))
  .catch(error => console.error('Error:', error));
*/ 