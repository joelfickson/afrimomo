/**
 * PayChangu Operator Tools
 *
 * Tools for getting mobile money operator information
 */

import type { PayChangu } from "afrimomo-sdk";

export function registerPayChanguOperatorTools(
  registerTool: (
    name: string,
    description: string,
    inputSchema: any,
    handler: (args: any) => Promise<any>
  ) => void,
  paychangu: PayChangu
) {
  // Get Mobile Money Operators
  registerTool(
    "paychangu_get_mobile_operators",
    "Get a list of all supported mobile money operators.",
    {
      type: "object",
      properties: {},
    },
    async () => {
      return await paychangu.getMobileMoneyOperators();
    }
  );
}
