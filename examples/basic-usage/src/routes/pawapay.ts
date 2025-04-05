import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { AfromomoSDK, logger } from 'afrimomo-sdk';

const router = Router();
const sdk = AfromomoSDK.getInstance();

// Get wallet balances
router.get('/wallets/balances', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await sdk.pawapay.wallets.getAllBalances();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get country-specific wallet balance
router.get('/wallets/balances/:country', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { country } = req.params;
    const response = await sdk.pawapay.wallets.getCountryBalance(country);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Initiate payment
router.post('/payments/initiate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Transform request data to match SDK's PaymentData interface
    const paymentData = {
      depositId: req.body.depositId,
      returnUrl: req.body.returnUrl,
      statementDescription: req.body.statementDescription,
      amount: req.body.amount,
      msisdn: req.body.msisdn,
      language: req.body.language || "EN",
      country: req.body.country,
      reason: req.body.reason,
      metadata: req.body.metadata
    };
    
  

    const response = await sdk.pawapay.payments.initiatePayment(paymentData);

    logger.info(`##INITIATE PAYMENT RESPONSE## ${JSON.stringify(response, null, 2)}`);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Send payout
router.post('/payouts/send', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      payoutId,
      amount,
      currency,
      correspondent,
      recipient,
      customerTimestamp,
      statementDescription,
      country,
      metadata
    } = req.body;

    // Validate required fields
    if (!payoutId || !amount || !currency || !correspondent || !recipient || !customerTimestamp || !statementDescription) {
      return res.status(400).json({
        errorId: Date.now().toString(),
        errorCode: 400,
        errorMessage: "Missing required fields"
      });
    }

    const response = await sdk.pawapay.payouts.sendPayout({
      payoutId,
      amount,
      currency,
      correspondent,
      recipient,
      customerTimestamp,
      statementDescription,
      country,
      metadata
    });

    res.json(response);
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 401) {
      return res.status(401).json({
        errorId: Date.now().toString(),
        errorCode: 401,
        errorMessage: "Authorization Failure. Please check your authentication token"
      });
    }
    next(error);
  }
});

// Get payout status
router.get('/payouts/:depositId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { depositId } = req.params;
    const response = await sdk.pawapay.deposits.getDeposit(depositId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create refund
router.post('/refunds', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refundData } = req.body;
    const response = await sdk.pawapay.refunds.createRefundRequest(refundData);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get refund status
router.get('/refunds/:refundId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refundId } = req.params;
    const response = await sdk.pawapay.refunds.getRefundStatus(refundId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get correspondent availability
router.get('/availability', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await sdk.pawapay.getAvailability();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get active configuration
router.get('/active-conf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await sdk.pawapay.getActiveConfiguration();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get transaction details
router.get('/payments/:depositId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { depositId } = req.params;
    const response = await sdk.pawapay.deposits.getDeposit(depositId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get payout details
router.get('/payouts/details/:depositId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { depositId } = req.params;
    const response = await sdk.pawapay.payouts.getPayout(depositId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export const pawapayRouter = router; 