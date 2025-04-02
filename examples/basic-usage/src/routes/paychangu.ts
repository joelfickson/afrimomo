import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { AfromomoSDK } from '@afrimomo/sdk';

const router = Router();
const sdk = AfromomoSDK.getInstance();

// Initiate payment
router.post('/payments/initiate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentData, accountInfo } = req.body;
    const response = await sdk.paychangu.initiatePayment(paymentData, accountInfo);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get transaction status
router.get('/transactions/:transactionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId } = req.params;
    const response = await sdk.paychangu.getTransactionById(transactionId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Refresh payment session
router.post('/payments/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentData, accountInfo } = req.body;
    const response = await sdk.paychangu.refreshPaymentSession(paymentData, accountInfo);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export const paychanguRouter = router; 