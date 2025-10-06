import type { Route } from "./+types/sdk";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SDK Documentation - Afrimomo" },
    { name: "description", content: "Complete guide to the Afrimomo SDK. Learn how to integrate PayChangu and PawaPay into your applications." },
  ];
}

export default function SDK() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              Afri<span className="text-lime-400">momo</span>
            </Link>
            <div className="flex gap-6">
              <Link to="/docs" className="hover:text-lime-400 transition-colors">Docs</Link>
              <Link to="/sdk" className="text-lime-400">SDK</Link>
              <Link to="/mcp" className="hover:text-lime-400 transition-colors">MCP</Link>
              <a href="https://github.com/joelfickson/afrimomo" target="_blank" rel="noopener noreferrer" className="hover:text-lime-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-5xl font-bold">
            Afrimomo <span className="text-lime-400">SDK</span>
          </h1>
          <span className="bg-lime-400/10 text-lime-400 px-4 py-1 rounded-full text-sm font-semibold border border-lime-400/20">
            v0.0.1-beta.13
          </span>
        </div>
        <p className="text-xl text-gray-400 max-w-3xl">
          A unified TypeScript SDK for seamless integration with African payment providers.
          Type-safe, reliable, and built for production.
        </p>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-20 max-w-5xl">
        {/* Installation */}
        <div id="installation" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-3">Installation</h2>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto mb-4">
            <pre className="text-sm">
              <code className="text-gray-300">
{`npm install afrimomo-sdk
# or
pnpm add afrimomo-sdk
# or
yarn add afrimomo-sdk`}
              </code>
            </pre>
          </div>
          <p className="text-gray-400">
            The SDK requires Node.js 18.0.0 or higher and includes full TypeScript type definitions.
          </p>
        </div>

        {/* Quick Start */}
        <div id="quick-start" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-3">Quick Start</h2>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto mb-4">
            <pre className="text-sm">
              <code className="text-gray-300">
{`import { AfromomoSDK } from "afrimomo-sdk";

// Initialize the SDK
const sdk = new AfromomoSDK({
  environment: "sandbox", // or "production"
  pawapay: {
    apiToken: "your-pawapay-token"
  },
  paychangu: {
    secretKey: "your-paychangu-secret"
  }
});

// Use PawaPay
const payment = await sdk.pawapay.payments.initiate({
  depositId: "order-123",
  amount: "50.00",
  msisdn: "260971234567",
  country: "ZMB",
  returnUrl: "https://your-app.com/callback",
  statementDescription: "Payment for services",
  language: "EN",
  reason: "Service payment"
});

// Use PayChangu
const operators = await sdk.paychangu.getMobileMoneyOperators();`}
              </code>
            </pre>
          </div>
        </div>

        {/* Configuration */}
        <div id="configuration" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-3">Configuration</h2>
          <p className="text-gray-400 mb-6">
            The SDK supports both sandbox and production environments. Use sandbox credentials during development and switch to production when ready to process real payments.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm">
              <code className="text-gray-300">
{`import { AfromomoSDK, Environment } from "afrimomo-sdk";

const sdk = new AfromomoSDK({
  environment: Environment.SANDBOX, // or Environment.PRODUCTION
  pawapay: {
    apiToken: process.env.PAWAPAY_TOKEN
  },
  paychangu: {
    secretKey: process.env.PAYCHANGU_SECRET
  }
});`}
              </code>
            </pre>
          </div>
          <div className="mt-6 border-l-4 border-lime-400 bg-lime-400/10 p-4 rounded">
            <p className="text-sm">
              <strong className="text-lime-400">Security Tip:</strong> Never commit API keys to version control. Use environment variables or secure configuration management.
            </p>
          </div>
        </div>

        {/* PawaPay API */}
        <div id="pawapay" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-3">PawaPay API</h2>

          <div className="space-y-8">
            {/* Deposits */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-lime-400">Deposits</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">
{`// Request a deposit
const deposit = await sdk.pawapay.payments.initiate({
  depositId: "unique-deposit-id",
  amount: "100.00",
  msisdn: "260971234567",
  country: "ZMB",
  returnUrl: "https://your-app.com/callback",
  statementDescription: "Online purchase",
  language: "EN",
  reason: "Payment for goods"
});

// Get deposit details
const details = await sdk.pawapay.payments.getDeposit(depositId);

// Resend callback
await sdk.pawapay.payments.resendCallback(depositId);`}
                  </code>
                </pre>
              </div>
            </div>

            {/* Payouts */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-lime-400">Payouts</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">
{`// Send a payout
const payout = await sdk.pawapay.payouts.send({
  payoutId: "payout-123",
  amount: "50.00",
  msisdn: "260701234567",
  country: "ZMB",
  statementDescription: "Withdrawal"
});

// Send bulk payouts
const bulkPayout = await sdk.pawapay.payouts.sendBulk([
  {
    payoutId: "payout-001",
    amount: "25.00",
    msisdn: "260701234567",
    country: "ZMB"
  },
  {
    payoutId: "payout-002",
    amount: "30.00",
    msisdn: "260709876543",
    country: "ZMB"
  }
]);

// Get payout status
const status = await sdk.pawapay.payouts.getStatus(payoutId);`}
                  </code>
                </pre>
              </div>
            </div>

            {/* Wallet Management */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-lime-400">Wallet Management</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">
{`// Get all wallet balances
const balances = await sdk.pawapay.wallets.getBalances();

// Get balance for specific country
const zambiaBalance = await sdk.pawapay.wallets.getCountryBalance("ZMB");`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* PayChangu API */}
        <div id="paychangu" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-3">PayChangu API</h2>

          <div className="space-y-8">
            {/* Payments */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-lime-400">Payments</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">
{`// Initiate hosted checkout
const payment = await sdk.paychangu.initiatePayment({
  amount: 1000,
  currency: "MWK",
  tx_ref: "order-456",
  email: "customer@example.com",
  first_name: "John",
  last_name: "Doe",
  callback_url: "https://your-app.com/webhook",
  return_url: "https://your-app.com/success"
});

// Verify transaction
const verification = await sdk.paychangu.verifyTransaction(tx_ref);

// Initiate direct charge
const directCharge = await sdk.paychangu.initiateDirectChargePayment({
  amount: 5000,
  currency: "MWK",
  chargeId: "charge-789",
  accountInfo: {
    email: "customer@example.com",
    first_name: "John",
    last_name: "Doe"
  }
});`}
                  </code>
                </pre>
              </div>
            </div>

            {/* Mobile Money */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-lime-400">Mobile Money</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">
{`// Get mobile money operators
const operators = await sdk.paychangu.getMobileMoneyOperators();

// Send mobile money payout
const payout = await sdk.paychangu.mobileMoneyPayout({
  amount: 2000,
  currency: "MWK",
  recipient_phone: "265991234567",
  operator_id: "operator-uuid",
  reference: "payout-123"
});

// Get payout details
const details = await sdk.paychangu.getMobilePayoutDetails(reference);`}
                  </code>
                </pre>
              </div>
            </div>

            {/* Bank Transfers */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-lime-400">Bank Transfers</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">
{`// Get supported banks
const banks = await sdk.paychangu.getSupportedBanks("MWK");

// Process bank transfer
const transfer = await sdk.paychangu.processBankTransfer({
  amount: 10000,
  currency: "MWK",
  bank_id: "bank-uuid",
  account_number: "123456789",
  account_name: "John Doe"
});

// Send bank payout
const bankPayout = await sdk.paychangu.bankPayout({
  amount: 5000,
  currency: "MWK",
  account_number: "987654321",
  bank_uuid: "bank-uuid",
  reference: "bank-payout-456"
});`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Type Imports */}
        <div id="types" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-3">Type Definitions</h2>
          <p className="text-gray-400 mb-6">
            All types are exported from the main package. No deep imports needed:
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm">
              <code className="text-gray-300">
{`// ✅ Correct way
import type {
  ActiveConfigResponse,
  PayChanguOperatorsResponse,
  PayChanguTypes,
  PawaPayTypes
} from "afrimomo-sdk";

// ❌ Avoid deep imports
import type { ActiveConfigResponse } from "afrimomo-sdk/dist/...";`}
              </code>
            </pre>
          </div>
        </div>

        {/* Getting API Credentials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-3">Getting API Credentials</h2>
          <div className="space-y-6">
            <div className="border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-lime-400">PawaPay</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Visit <a href="https://www.pawapay.io/" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">PawaPay</a> and create a developer account</li>
                <li>Complete the onboarding process and verification</li>
                <li>Get your API token from the PawaPay dashboard</li>
                <li>Use sandbox tokens for testing</li>
              </ol>
            </div>
            <div className="border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-lime-400">PayChangu</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Sign up at <a href="https://in.paychangu.com/register" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">PayChangu</a></li>
                <li>Complete business verification</li>
                <li>Get your secret key from the merchant dashboard</li>
                <li>Use test credentials for sandbox environment</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="border border-lime-400/50 rounded-lg p-8 bg-lime-400/5">
          <h3 className="text-2xl font-bold mb-4">Additional Resources</h3>
          <ul className="space-y-3 text-gray-300">
            <li>
              <a href="https://developer.paychangu.com/" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">
                PayChangu Developer Documentation →
              </a>
            </li>
            <li>
              <a href="https://docs.pawapay.io/" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">
                PawaPay API Documentation →
              </a>
            </li>
            <li>
              <a href="https://github.com/joelfickson/afrimomo" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">
                GitHub Repository →
              </a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/afrimomo-sdk" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">
                npm Package →
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>MIT License • Built with ❤️ for African developers</p>
        </div>
      </footer>
    </div>
  );
}
