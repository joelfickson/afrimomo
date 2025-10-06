/**
 * PayChangu Bank Transfer Tools
 *
 * Tools for processing bank transfers and getting supported banks
 */

import type { PayChangu } from "afrimomo-sdk";

export function registerPayChanguTransferTools(
  registerTool: (
    name: string,
    description: string,
    inputSchema: any,
    handler: (args: any) => Promise<any>
  ) => void,
  paychangu: PayChangu
) {
  // Process Bank Transfer
  registerTool(
    "paychangu_process_bank_transfer",
    "Process a bank transfer payment through PayChangu direct charge.",
    {
      type: "object",
      properties: {
        bank_uuid: {
          type: "string",
          description: "UUID of the bank from the supported banks list",
        },
        account_name: {
          type: "string",
          description: "Bank account holder name",
        },
        account_number: {
          type: "string",
          description: "Bank account number",
        },
        amount: {
          type: ["string", "number"],
          description: "Transfer amount",
        },
        charge_id: {
          type: "string",
          description: "Unique charge identifier",
        },
        currency: {
          type: "string",
          description: "Currency code",
          default: "MWK",
        },
        email: {
          type: "string",
          description: "Customer email address (optional)",
        },
        first_name: {
          type: "string",
          description: "Customer first name (optional)",
        },
        last_name: {
          type: "string",
          description: "Customer last name (optional)",
        },
      },
      required: [
        "bank_uuid",
        "account_name",
        "account_number",
        "amount",
        "charge_id",
      ],
    },
    async (args) => {
      return await paychangu.processBankTransfer(
        args.bank_uuid,
        args.account_name,
        args.account_number,
        args.amount,
        args.charge_id,
        args.currency || "MWK",
        {
          email: args.email,
          firstName: args.first_name,
          lastName: args.last_name,
        }
      );
    }
  );

  // Get Supported Banks
  registerTool(
    "paychangu_get_supported_banks",
    "Get a list of all supported banks for direct charge payouts in a specific currency.",
    {
      type: "object",
      properties: {
        currency: {
          type: "string",
          description: "Currency code to filter banks",
          default: "MWK",
        },
      },
    },
    async (args) => {
      return await paychangu.getSupportedBanks(args.currency || "MWK");
    }
  );
}
