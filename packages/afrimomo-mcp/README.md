# Afrimomo MCP Server

Model Context Protocol (MCP) server for the Afrimomo SDK, enabling AI assistants like Claude to interact with African payment providers.

## Supported Providers

- **PayChangu** - Payment services in Malawi (11 tools)
- **PawaPay** - Mobile money payments across Sub-Saharan Africa (12 tools)

## Features

- 23 comprehensive tools for payment operations
- Support for deposits, payouts, refunds, and transfers
- Balance checking and transaction verification
- Mobile money and bank account operations
- Sandbox and production environment support

## Installation

For detailed installation instructions, see **[INSTALLATION.md](./INSTALLATION.md)**

### Quick Install

```bash
# Global installation
npm install -g afrimomo-mcp

# Or use directly with npx (no installation required)
npx afrimomo-mcp
```

## Quick Start

### 1. Get API Credentials

- **PayChangu**: Sign up at https://in.paychangu.com/register
- **PawaPay**: Sign up at https://www.pawapay.io/

See **[INSTALLATION.md](./INSTALLATION.md#getting-api-credentials)** for detailed steps.

### 2. Configure Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "afrimomo": {
      "command": "npx",
      "args": ["-y", "afrimomo-mcp"],
      "env": {
        "PAYCHANGU_SECRET_KEY": "your-paychangu-secret-key",
        "PAWAPAY_JWT": "your-pawapay-jwt-token",
        "ENVIRONMENT": "DEVELOPMENT"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

Fully quit and restart Claude Desktop to load the MCP server.

### 4. Start Using

Try commands like:
- "Show me PayChangu mobile money operators"
- "What's my PawaPay wallet balance?"
- "Verify PayChangu transaction TX_12345"

📖 **Full setup guide**: [INSTALLATION.md](./INSTALLATION.md)

## Available Tools

### PayChangu Tools (11 total)

#### Payment & Transaction Tools
- `paychangu_initiate_payment` - Start hosted checkout payment
- `paychangu_verify_transaction` - Verify transaction status by tx_ref
- `paychangu_initiate_direct_charge` - Create virtual account for instant payment
- `paychangu_get_transaction_details` - Get direct charge transaction details

#### Bank Transfer Tools
- `paychangu_process_bank_transfer` - Process bank transfer payment
- `paychangu_get_supported_banks` - List supported banks by currency

#### Mobile Money & Payout Tools
- `paychangu_get_mobile_operators` - List mobile money operators
- `paychangu_mobile_money_payout` - Send payout to mobile money account
- `paychangu_get_mobile_payout_details` - Check mobile money payout status
- `paychangu_bank_payout` - Send payout to bank account
- `paychangu_get_bank_payout_details` - Check bank payout status
- `paychangu_list_bank_payouts` - List all bank payouts (paginated)

### PawaPay Tools (12 total)

#### Deposit Tools
- `pawapay_request_deposit` - Request mobile money deposit
- `pawapay_get_deposit` - Get deposit transaction details
- `pawapay_resend_deposit_callback` - Resend deposit callback

#### Payout Tools
- `pawapay_send_payout` - Send single payout
- `pawapay_send_bulk_payout` - Send multiple payouts
- `pawapay_get_payout` - Get payout details

#### Refund Tools
- `pawapay_create_refund` - Create refund request
- `pawapay_get_refund_status` - Get refund status

#### Wallet & Configuration Tools
- `pawapay_get_all_balances` - Get balances for all countries
- `pawapay_get_country_balance` - Get balance for specific country
- `pawapay_get_active_config` - Get active merchant configuration
- `pawapay_get_availability` - Get correspondent availability status

## Usage Examples

Once configured in Claude Desktop, you can interact with the payment providers through natural language:

### PayChangu Examples

**Verify a transaction:**
```
Can you verify PayChangu transaction TX_12345?
```

**Get mobile money operators:**
```
Show me all supported mobile money operators for PayChangu
```

**Initiate a direct charge:**
```
Create a PayChangu direct charge for 5000 MWK with charge ID CHARGE_001
```

**Send a bank payout:**
```
Send a PayChangu bank payout of 10000 MWK to account 123456 at bank [bank_uuid]
```

### PawaPay Examples

**Check wallet balances:**
```
What are my PawaPay wallet balances?
```

**Request a deposit:**
```
Request a PawaPay deposit of 100 ZMW from phone number 260971234567 using MTN Zambia
```

**Send a payout:**
```
Send a PawaPay payout of 50 UGX to phone number 256701234567
```

**Check correspondent availability:**
```
Which PawaPay correspondents are currently available?
```

## Getting API Credentials

### PayChangu
1. Sign up at [PayChangu](https://in.paychangu.com/register)
2. Complete business verification
3. Get your secret key from the merchant dashboard
4. Use test credentials for sandbox environment

### PawaPay
1. Create an account at [PawaPay](https://www.pawapay.io/)
2. Complete onboarding and verification
3. Generate an API token from the dashboard
4. Use sandbox tokens for testing

## Development

To build from source:

```bash
# Clone the repository
git clone https://github.com/yourusername/afrimomo.git
cd afrimomo/packages/afrimomo-mcp

# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js
```

## Security Notes

- Never commit API keys to version control
- Use environment variables or secure configuration management
- Always use sandbox credentials during development
- Keep production credentials secure

## Troubleshooting

### Tools not appearing in Claude

1. Check that your `claude_desktop_config.json` is valid JSON
2. Verify the file path to the config is correct
3. Restart Claude Desktop after configuration changes
4. Check the Claude Desktop logs for errors

### Authentication errors

1. Verify your API credentials are correct
2. Check that environment variables are properly set
3. Ensure you're using the correct environment (sandbox vs production)
4. Check that your account has the necessary permissions

### Connection issues

1. Check your internet connection
2. Verify the payment provider services are operational
3. Check for any API rate limiting

## Support

- [GitHub Issues](https://github.com/joelfickson/afrimomo/issues)
- [PayChangu Documentation](https://developer.paychangu.com/)
- [PawaPay Documentation](https://docs.pawapay.io/)

## License

MIT License - see LICENSE file for details
