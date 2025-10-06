/**
 * PawaPay Wallet Tools
 *
 * Tools for checking wallet balances
 */

import type { PawaPay } from "afrimomo-sdk";
import type { ToolRegistrationFunction, PawapayToolArgs } from "../../types/index.js";

export function registerPawapayWalletTools(
  registerTool: ToolRegistrationFunction,
  pawapay: PawaPay
) {
  // Get All Balances
  registerTool(
    "pawapay_get_all_balances",
    "Get wallet balances for all countries.",
    {
      type: "object",
      properties: {},
    },
    async () => {
      return await pawapay.wallets.getAllBalances();
    }
  );

  // Get Country Balance
  registerTool(
    "pawapay_get_country_balance",
    "Get wallet balance for a specific country.",
    {
      type: "object",
      properties: {
        country: {
          type: "string",
          description: "ISO country code (e.g., ZMB, UGA, KEN)",
        },
      },
      required: ["country"],
    },
    async (args) => {
      const { country } = args as unknown as PawapayToolArgs.GetCountryBalance;
      return await pawapay.wallets.getCountryBalance(country);
    }
  );
}
