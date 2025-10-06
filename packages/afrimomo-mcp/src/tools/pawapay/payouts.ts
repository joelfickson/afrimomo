/**
 * PawaPay Payout Tools
 *
 * Tools for sending payouts to mobile money accounts
 */

import type { PawaPay, PawaPayTypes } from "afrimomo-sdk";
import type { ToolRegistrationFunction, PawapayToolArgs } from "../../types/index.js";

export function registerPawapayPayoutTools(
  registerTool: ToolRegistrationFunction,
  pawapay: PawaPay
) {
  // Send Payout
  registerTool(
    "pawapay_send_payout",
    "Send a single payout to a mobile money account.",
    {
      type: "object",
      properties: {
        payoutId: {
          type: "string",
          description: "Unique payout identifier (UUID recommended)",
        },
        amount: {
          type: "string",
          description: "Payout amount",
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
          description: "Recipient phone number in international format",
        },
        statementDescription: {
          type: "string",
          description:
            "Description that appears on recipient's mobile money statement",
        },
      },
      required: [
        "payoutId",
        "amount",
        "currency",
        "correspondent",
        "msisdn",
        "statementDescription",
      ],
    },
    async (args) => {
      const { payoutId, amount, currency, correspondent, msisdn, statementDescription } =
        args as PawapayToolArgs.SendPayout;

      const transaction: PawaPayTypes.PayoutTransaction = {
        payoutId,
        amount,
        currency,
        correspondent,
        recipient: {
          type: "MSISDN",
          address: {
            value: msisdn,
          },
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription,
      };
      return await pawapay.payouts.sendPayout(transaction);
    }
  );

  // Send Bulk Payout
  registerTool(
    "pawapay_send_bulk_payout",
    "Send multiple payouts in a single request.",
    {
      type: "object",
      properties: {
        payouts: {
          type: "array",
          description: "Array of payout transactions",
          items: {
            type: "object",
            properties: {
              payoutId: {
                type: "string",
                description: "Unique payout identifier",
              },
              amount: {
                type: "string",
                description: "Payout amount",
              },
              currency: {
                type: "string",
                description: "Currency code",
              },
              correspondent: {
                type: "string",
                description: "Mobile money operator code",
              },
              msisdn: {
                type: "string",
                description: "Recipient phone number",
              },
              statementDescription: {
                type: "string",
                description: "Statement description",
              },
            },
            required: [
              "payoutId",
              "amount",
              "currency",
              "correspondent",
              "msisdn",
              "statementDescription",
            ],
          },
        },
      },
      required: ["payouts"],
    },
    async (args) => {
      const { payouts } = args as PawapayToolArgs.SendBulkPayout;

      const transactions: PawaPayTypes.PayoutTransaction[] = payouts.map((payout) => ({
        payoutId: payout.payoutId,
        amount: payout.amount,
        currency: payout.currency,
        correspondent: payout.correspondent,
        recipient: {
          type: "MSISDN",
          address: {
            value: payout.msisdn,
          },
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription: payout.statementDescription,
      }));
      return await pawapay.payouts.sendBulkPayout(transactions);
    }
  );

  // Get Payout Details
  registerTool(
    "pawapay_get_payout",
    "Get details of a payout transaction using the payout ID.",
    {
      type: "object",
      properties: {
        payoutId: {
          type: "string",
          description: "Payout ID to look up",
        },
      },
      required: ["payoutId"],
    },
    async (args) => {
      const { payoutId } = args as PawapayToolArgs.GetPayout;
      return await pawapay.payouts.getPayout(payoutId);
    }
  );
}
