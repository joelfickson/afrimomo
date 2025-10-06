/**
 * PawaPay Refund Tools
 *
 * Tools for creating and checking refund transactions
 */

import type { PawaPay } from "afrimomo-sdk";
import type { ToolRegistrationFunction, PawapayToolArgs } from "../../types/index.js";

export function registerPawapayRefundTools(
  registerTool: ToolRegistrationFunction,
  pawapay: PawaPay
) {
  // Create Refund
  registerTool(
    "pawapay_create_refund",
    "Create a refund request for a deposit transaction.",
    {
      type: "object",
      properties: {
        refundId: {
          type: "string",
          description: "Unique refund identifier (UUID recommended)",
        },
        depositId: {
          type: "string",
          description: "Deposit ID to refund",
        },
      },
      required: ["refundId", "depositId"],
    },
    async (args) => {
      const { refundId, depositId } = args as PawapayToolArgs.CreateRefund;
      return await pawapay.refunds.createRefundRequest({
        refundId,
        depositId,
      });
    }
  );

  // Get Refund Status
  registerTool(
    "pawapay_get_refund_status",
    "Get the status of a refund transaction using the refund ID.",
    {
      type: "object",
      properties: {
        refundId: {
          type: "string",
          description: "Refund ID to look up",
        },
      },
      required: ["refundId"],
    },
    async (args) => {
      const { refundId } = args as PawapayToolArgs.GetRefundStatus;
      return await pawapay.refunds.getRefundStatus(refundId);
    }
  );
}
