import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { AfromomoSDK } from 'afrimomo-sdk';

const router = Router();
const sdk = AfromomoSDK.getInstance();

// Initialize direct charge payment
router.post('/payments/initiate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, chargeId, currency, accountInfo } = req.body;
    const response = await sdk.paychangu.initializeDirectChargePayment(
      amount,
      chargeId || `TX_${Date.now()}`,
      currency || 'MWK',
      accountInfo
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get transaction details
router.get('/transactions/:chargeId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chargeId } = req.params;
    const response = await sdk.paychangu.getDirectChargeTransactionDetails(chargeId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Process bank transfer
router.post('/payments/bank-transfer', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      bankUuid, 
      accountName, 
      accountNumber, 
      amount, 
      chargeId, 
      currency, 
      email, 
      firstName, 
      lastName 
    } = req.body;
    
    const response = await sdk.paychangu.processBankTransfer(
      bankUuid,
      accountName,
      accountNumber,
      amount,
      chargeId || `TX_${Date.now()}`,
      currency || 'MWK',
      { email, firstName, lastName }
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get supported banks
router.get('/banks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currency } = req.query;
    const response = await sdk.paychangu.getSupportedBanks(currency as string);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export const paychanguRouter = router; 