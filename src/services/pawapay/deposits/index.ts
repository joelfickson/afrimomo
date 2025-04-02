import { NetworkManager } from "../../../utils/network";
import { BaseService } from "../../../utils/baseService";
import { logger } from "../../../utils/logger";
import { 
  PayoutTransaction, 
  PaymentTransaction,
  PawaPayPayoutTransaction,
  ResendCallbackResponse
} from "../types";
import { NetworkResponse } from "../../../types";

export class PawapayDeposits extends BaseService {
  private readonly baseEndpoint = "/deposits";

  constructor(
    private readonly networkHandler: NetworkManager
  ) {
    super();
  }

  /**
   * Asynchronously sends a payout transaction to a specified recipient using the PawaPay service.
   * @param transaction - Details of the payout transaction
   * @returns Promise resolving to the transaction result or error response
   */
  async sendDeposit(transaction: PayoutTransaction): Promise<PawaPayPayoutTransaction | NetworkResponse> {
    try {
      const phoneNumber = this.formatPhoneNumber(transaction.phoneNumber);

      logger.info("Sending payout to", phoneNumber, "the amount of", transaction.amount, "with payoutId", transaction.payoutId, "and currency", transaction.currency);

      const response = await this.networkHandler.getInstance().post(
        this.baseEndpoint,
        {
          payoutId: transaction.payoutId,
          amount: transaction.amount.toString(),
          currency: transaction.currency,
          correspondent: transaction.correspondent,
          recipient: {
            type: "MSISDN",
            address: { value: phoneNumber }
          },
          customerTimestamp: transaction.customerTimestamp || new Date().toISOString(),
          statementDescription: transaction.statementDescription
        }
      );

      logger.info("Payout transaction successful:", response.data);
      return response.data as PawaPayPayoutTransaction;
    } catch (error: unknown) {
      logger.error("Payout transaction failed:", error);
      return this.networkHandler.handleErrors(error);
    }
  }

  /**
   * Retrieves details of a specific deposit transaction
   * @param depositId - The unique identifier for the deposit transaction
   * @returns Promise resolving to the transaction details or error response
   */
  async getDeposit(depositId: string): Promise<PaymentTransaction[] | NetworkResponse> {
    try {
      const endPoint = `${this.baseEndpoint}/${depositId}`;
      const response = await this.networkHandler.getInstance().get(endPoint);

      logger.info("Deposit details retrieved successfully:", response.data);
      return response.data as PaymentTransaction[];
    } catch (error) {
      logger.error("Get deposit failed:", error);
      return this.networkHandler.handleErrors(error);
    }
  }

  /**
   * Requests a resend of a callback for a specific deposit transaction
   * @param depositId - The unique identifier of the deposit transaction
   * @returns Promise resolving to the resend response or error
   */
  async resendCallback(depositId: string): Promise<ResendCallbackResponse | NetworkResponse> {
    try {
      const { data } = await this.networkHandler.getInstance().post(
        `${this.baseEndpoint}/resend-callback`,
        { depositId }
      );

      logger.info("Callback resend successful:", data);
      return data as ResendCallbackResponse;
    } catch (error: unknown) {
      logger.error("Callback resend failed:", error);
      return this.networkHandler.handleErrors(error);
    }
  }
} 