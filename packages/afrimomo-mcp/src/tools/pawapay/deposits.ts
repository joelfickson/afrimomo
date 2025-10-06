/**
 * PawaPay Deposit Tools
 *
 * Tools for requesting and managing deposit transactions
 */

import type { PawaPay } from "afrimomo-sdk";

export function registerPawapayDepositTools(
  registerTool: (
    name: string,
    description: string,
    inputSchema: any,
    handler: (args: any) => Promise<any>
  ) => void,
  pawapay: PawaPay
) {
  // Request Deposit
  registerTool(
    "pawapay_request_deposit",
    "Request a mobile money deposit from a customer. Creates a deposit transaction that the customer will complete on their mobile phone.",
    {
      type: "object",
      properties: {
        depositId: {
          type: "string",
          description: "Unique deposit identifier (UUID recommended)",
        },
        amount: {
          type: "string",
          description: "Deposit amount",
        },
        currency: {
          type: "string",
          description: "Currency code (e.g., ZMW, UGX, KES)",
        },
        correspondent: {
          type: "string",
          description: "Mobile money operator code (e.g., MTN_MOMO_ZMB)",
        },
        msisdn: {
          type: "string",
          description: "Customer phone number in international format",
        },
        statementDescription: {
          type: "string",
          description: "Description that appears on customer's mobile money statement",
        },
      },
      required: [
        "depositId",
        "amount",
        "currency",
        "correspondent",
        "msisdn",
        "statementDescription",
      ],
    },
    async (args) => {
      const transaction = {
        payoutId: args.depositId,
        amount: args.amount,
        currency: args.currency,
        correspondent: args.correspondent,
        recipient: {
          type: "MSISDN" as const,
          address: {
            value: args.msisdn,
          },
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription: args.statementDescription,
      };
      return await pawapay.deposits.sendDeposit(transaction as any);
    }
  );

  // Get Deposit Details
  registerTool(
    "pawapay_get_deposit",
    "Get details of a deposit transaction using the deposit ID.",
    {
      type: "object",
      properties: {
        depositId: {
          type: "string",
          description: "Deposit ID to look up",
        },
      },
      required: ["depositId"],
    },
    async (args) => {
      return await pawapay.deposits.getDeposit(args.depositId);
    }
  );

  // Resend Deposit Callback
  registerTool(
    "pawapay_resend_deposit_callback",
    "Request a resend of the callback for a specific deposit transaction.",
    {
      type: "object",
      properties: {
        depositId: {
          type: "string",
          description: "Deposit ID for callback resend",
        },
      },
      required: ["depositId"],
    },
    async (args) => {
      return await pawapay.deposits.resendCallback(args.depositId);
    }
  );
}
