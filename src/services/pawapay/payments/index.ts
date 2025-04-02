import { NetworkManager } from "../../../utils/network";
import { logger } from "../../../utils/logger";
import { PaymentData, InitiatePaymentResponse } from "../types";
import { NetworkResponse } from "../../../types";

export class PawapayPayments {
  private readonly baseEndpoint = "v1/widget/sessions";

  constructor(
    private readonly networkHandler: NetworkManager
  ) {}

  /**
   * Initiates a payment process by sending payment data to v1/widget/sessions.
   * @param paymentData - Data required for initiating the payment
   * @returns Promise resolving to the payment initiation response or error
   */
  public async initiatePayment(paymentData: PaymentData): Promise<InitiatePaymentResponse | NetworkResponse> {
    try {
      const response = await this.networkHandler.getInstance()
        .post(this.baseEndpoint, {
          depositId: paymentData.deposit_id,
          amount: paymentData.price.toString(),
          returnUrl: paymentData.returnUrl,
          country: paymentData.basePaymentCountryIso,
          reason: paymentData.reason
        });

      logger.info("Sending payment initiation request for deposit:", paymentData.deposit_id, "with amount:", paymentData.price);

      return {
        redirectUrl: response.data.redirectUrl,
        error: false
      } as InitiatePaymentResponse;
    } catch (error: unknown) {
      logger.error("Payment initiation failed:", error);
      return this.networkHandler.handleErrors(error);
    }
  }
} 