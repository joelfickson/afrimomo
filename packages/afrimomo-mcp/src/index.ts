#!/usr/bin/env node

/**
 * Afrimomo MCP Server
 *
 * Model Context Protocol server for African payment providers
 * Supports PayChangu and PawaPay integrations
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { AfromomoSDK } from "afrimomo-sdk";

// Import tool handlers
import { registerPayChanguTools } from "./tools/paychangu/payments.js";
import { registerPayChanguTransferTools } from "./tools/paychangu/transfers.js";
import { registerPayChanguPayoutTools } from "./tools/paychangu/payouts.js";
import { registerPayChanguOperatorTools } from "./tools/paychangu/operators.js";
import { registerPawapayDepositTools } from "./tools/pawapay/deposits.js";
import { registerPawapayPayoutTools } from "./tools/pawapay/payouts.js";
import { registerPawapayRefundTools } from "./tools/pawapay/refunds.js";
import { registerPawapayWalletTools } from "./tools/pawapay/wallets.js";
import { registerPawapayConfigTools } from "./tools/pawapay/config.js";

// Environment configuration
const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY;
const PAWAPAY_JWT = process.env.PAWAPAY_JWT;
const ENVIRONMENT = process.env.ENVIRONMENT || "DEVELOPMENT";

// Initialize SDK
let sdk: AfromomoSDK | null = null;

try {
	sdk = AfromomoSDK.initialize({
		paychangu: PAYCHANGU_SECRET_KEY
			? {
					secretKey: PAYCHANGU_SECRET_KEY,
					environment: ENVIRONMENT as any,
			  }
			: undefined,
		pawapay: PAWAPAY_JWT
			? {
					jwt: PAWAPAY_JWT,
					environment: ENVIRONMENT as any,
			  }
			: undefined,
	});
} catch (error) {
	console.error("Failed to initialize Afrimomo SDK:", error);
	process.exit(1);
}

// Create MCP server
const server = new Server(
	{
		name: "afrimomo-mcp",
		version: "0.0.1",
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

import type { JSONSchema, ToolHandler } from "./types/index.js";

// Storage for tool definitions and handlers
interface ToolDefinition {
	name: string;
	description: string;
	inputSchema: JSONSchema;
}

const tools: ToolDefinition[] = [];
const toolHandlers = new Map<string, ToolHandler>();

/**
 * Register a tool with the MCP server
 */
function registerTool(
	name: string,
	description: string,
	inputSchema: JSONSchema,
	handler: ToolHandler,
) {
	tools.push({
		name,
		description,
		inputSchema,
	});
	toolHandlers.set(name, handler);
}

// Register all tools
if (sdk) {
	// PayChangu tools
	if (sdk.isServiceConfigured("paychangu")) {
		registerPayChanguTools(registerTool, sdk.paychangu);
		registerPayChanguTransferTools(registerTool, sdk.paychangu);
		registerPayChanguPayoutTools(registerTool, sdk.paychangu);
		registerPayChanguOperatorTools(registerTool, sdk.paychangu);
	}

	// PawaPay tools
	if (sdk.isServiceConfigured("pawapay")) {
		registerPawapayDepositTools(registerTool, sdk.pawapay);
		registerPawapayPayoutTools(registerTool, sdk.pawapay);
		registerPawapayRefundTools(registerTool, sdk.pawapay);
		registerPawapayWalletTools(registerTool, sdk.pawapay);
		registerPawapayConfigTools(registerTool, sdk.pawapay);
	}
}

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;

	const handler = toolHandlers.get(name);
	if (!handler) {
		throw new Error(`Unknown tool: ${name}`);
	}

	try {
		const result = await handler(args || {});
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							error: errorMessage,
							tool: name,
						},
						null,
						2,
					),
				},
			],
			isError: true,
		};
	}
});

// Start server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Afrimomo MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
