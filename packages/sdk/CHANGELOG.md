## [0.0.1-beta.13](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.12...v0.0.1-beta.13) (2025-06-26)



## [0.0.1-beta.12](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.11...v0.0.1-beta.12) (2025-06-26)



## [0.0.1-beta.11](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.10...v0.0.1-beta.11) (2025-06-25)



## [0.0.1-beta.10](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.9...v0.0.1-beta.10) (2025-04-05)


### Features

* add bulk payout endpoint to PawaPay router; implement transaction validation and response structure for bulk payouts ([384a088](https://github.com/yourusername/afrimomo/commit/384a088003c58d3c16bdca77d5dbf1e5f8b6f99a))
* add endpoint to retrieve transaction details by deposit ID in PawaPay router ([409adbd](https://github.com/yourusername/afrimomo/commit/409adbd5e071e0c18f5429a70062f7a2d9f7255e))
* enhance PawaPay service integration; add logging for payment initiation and refactor network handling for improved error management ([f47fdbb](https://github.com/yourusername/afrimomo/commit/f47fdbb032ea736ff954506373c1851426f39915))
* implement payout processing and validation in PawaPay router; add error handling for authorization failures and enhance payout transaction structure ([7803453](https://github.com/yourusername/afrimomo/commit/78034537f100c78c87079b41d5136e6d98d9f42b))



## [0.0.1-beta.9](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.8...v0.0.1-beta.9) (2025-04-04)


### Features

* add transaction verification endpoint to PayChangu router; implement logic to verify transaction status using transaction reference ([fa5bfd3](https://github.com/yourusername/afrimomo/commit/fa5bfd32b0e9d28d8d211d528f7721658d189cea))
* enhance PayChangu payment initiation process; refactor request structure and response handling for improved flexibility and error management ([72d5f37](https://github.com/yourusername/afrimomo/commit/72d5f37cab1c3a4f6131823d438fbae871968132))



## [0.0.1-beta.8](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.7...v0.0.1-beta.8) (2025-04-03)


### Features

* add transaction verification methods to PayChangu service; implement response types for verifying transaction status and details ([5c47c26](https://github.com/yourusername/afrimomo/commit/5c47c26d00c8f1db030d57048c96e2217fc3ceb4))



## [0.0.1-beta.7](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.6...v0.0.1-beta.7) (2025-04-03)


### Features

* add availability and active configuration endpoints to PawaPay service; implement corresponding methods in the SDK for improved merchant configuration management ([3857e96](https://github.com/yourusername/afrimomo/commit/3857e96cb681845578dcdb08985778e8efaa92a2))
* add mobile money and bank payout functionalities to PayChangu service; implement methods for retrieving operators, initializing payouts, and fetching payout details ([9123e76](https://github.com/yourusername/afrimomo/commit/9123e760a4af6ca36013d185f30a343728d927f1))
* add new '/services' route to retrieve configured services and update route paths in app.ts; change default port to 9999 in index.ts; add pino-pretty dependency in package.json; refactor SDK imports to use relative paths ([24b124e](https://github.com/yourusername/afrimomo/commit/24b124e0cfc4476f36d9e91109037ea506b2852d))
* enhance PayChangu service with direct charge payment initialization, bank transfer processing, and transaction detail retrieval; update route paths and request parameters for improved functionality ([7e84364](https://github.com/yourusername/afrimomo/commit/7e84364734528a2f43d5459ceba5c43c00ab7766))
* expand PayChangu service with new mobile money and bank payout routes; implement endpoints for retrieving operators, initializing payouts, and fetching payout details ([d7d53cb](https://github.com/yourusername/afrimomo/commit/d7d53cbed74c0ab91b339255c4920418615e247b))
* implement direct charge payment functionality in PayChangu service; add methods for initializing payments and retrieving transaction details ([b719d95](https://github.com/yourusername/afrimomo/commit/b719d9511d0736becf743470ee30cc4808715bdd))
* introduce generic adapter for custom payment providers in Afromomo SDK; enhance README with usage examples and update SDK to support custom provider configuration ([7c9594b](https://github.com/yourusername/afrimomo/commit/7c9594b7bdef1958703e6a6bea8292e484349c35))
* refactor PayChangu service to use a dedicated network class for API communication; implement new methods for initiating payments, handling direct charges, and retrieving transaction details ([0734cd8](https://github.com/yourusername/afrimomo/commit/0734cd88f9a621c69cab3370f619fb461c983a67))



## [0.0.1-beta.6](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.5...v0.0.1-beta.6) (2025-04-02)



## [0.0.1-beta.5](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.2...v0.0.1-beta.5) (2025-04-02)


### Bug Fixes

* update release workflow to retrieve current version from package.json instead of npm view ([94532ef](https://github.com/yourusername/afrimomo/commit/94532ef82f3cbe6c035ff4d636d0be2bd0d5e32c))


### Features

* add changelog generation step to release workflow ([630966c](https://github.com/yourusername/afrimomo/commit/630966c81383716cf03f11e39a1844c7452bda40))



## [0.0.1-beta.3](https://github.com/yourusername/afrimomo/compare/v0.0.1-beta.2...v0.0.1-beta.3) (2025-04-02)


### Bug Fixes

* update release workflow to retrieve current version from package.json instead of npm view ([94532ef](https://github.com/yourusername/afrimomo/commit/94532ef82f3cbe6c035ff4d636d0be2bd0d5e32c))


### Features

* add changelog generation step to release workflow ([630966c](https://github.com/yourusername/afrimomo/commit/630966c81383716cf03f11e39a1844c7452bda40))



