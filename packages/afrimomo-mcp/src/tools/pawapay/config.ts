/**
 * PawaPay Configuration Tools
 *
 * Tools for getting merchant configuration and correspondent availability
 */

import type { PawaPay } from "afrimomo-sdk";

export function registerPawapayConfigTools(
  registerTool: (
    name: string,
    description: string,
    inputSchema: any,
    handler: (args: any) => Promise<any>
  ) => void,
  pawapay: PawaPay
) {
  // Get Active Configuration
  registerTool(
    "pawapay_get_active_config",
    "Get the active merchant configuration including supported correspondents and countries.",
    {
      type: "object",
      properties: {},
    },
    async () => {
      return await pawapay.getActiveConfiguration();
    }
  );

  // Get Availability
  registerTool(
    "pawapay_get_availability",
    "Get the current availability status of all correspondents (mobile money operators).",
    {
      type: "object",
      properties: {},
    },
    async () => {
      return await pawapay.getAvailability();
    }
  );
}
