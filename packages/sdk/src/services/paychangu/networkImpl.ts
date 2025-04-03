import { ApiNetworkManager, ApiConfig, AuthConfig } from "../../utils/apiNetworkManager";
import type { Environment } from "../../config/constants";

// Base URL for the PayChangu API
const BASE_PAYCHANGU_URL = "https://api.paychangu.com";

/**
 * PayChangu Network implementation using the unified ApiNetworkManager
 */
export class PayChanguNetworkV2 extends ApiNetworkManager {
  /**
   * Creates a new PayChangu Network manager
   * 
   * @param secretKey - The API secret key for authentication with PayChangu
   * @param environment - The environment to use (DEVELOPMENT or PRODUCTION)
   */
  constructor(secretKey: string, environment: Environment = "DEVELOPMENT") {
    // Configure API settings
    const apiConfig: ApiConfig = {
      baseUrl: BASE_PAYCHANGU_URL,
      serviceName: "PayChangu",
      timeoutMs: 60000, // PayChangu might need longer timeouts for some operations
    };

    // Configure authentication
    const authConfig: AuthConfig = {
      type: "bearer",
      token: secretKey,
    };

    // Initialize the parent class with our configuration
    super(apiConfig, authConfig);
  }
} 