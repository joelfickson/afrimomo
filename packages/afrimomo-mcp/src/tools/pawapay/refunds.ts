/**
 * PawaPay Refund Tools
 *
 * Tools for creating and checking refund transactions
 */

import type { PawaPay } from "afrimomo-sdk";

export function registerPawapayRefundTools(
  registerTool: (
    name: string,
    description: string,
    inputSchema: any,
    handler: (args: any) => Promise<any>
  ) => void,
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
      return await pawapay.refunds.createRefundRequest({
        refundId: args.refundId,
        depositId: args.depositId,
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
      return await pawapay.refunds.getRefundStatus(args.refundId);
    }
  );
}
