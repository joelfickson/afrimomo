import { ApiNetworkManager, ApiConfig, AuthConfig } from "../../utils/apiNetworkManager";
import type { Environment } from "../../config/constants";

/**
 * PawaPay Network implementation using the unified ApiNetworkManager
 */
export class PawapayNetworkV2 extends ApiNetworkManager {
  /**
   * Creates a new PawaPay Network manager
   * 
   * @param jwt - The JWT token for authentication with PawaPay
   * @param environment - The environment to use (DEVELOPMENT or PRODUCTION)
   */
  constructor(jwt: string, environment: Environment = "DEVELOPMENT") {
    // Determine the base URL based on environment
    const baseUrl = environment === "PRODUCTION"
      ? "https://api.pawapay.io/v1"
      : "https://api.sandbox.pawapay.io/v1";

    // Configure API settings
    const apiConfig: ApiConfig = {
      baseUrl,
      serviceName: "PawaPay",
      timeoutMs: 30000,
    };

    // Configure authentication
    const authConfig: AuthConfig = {
      type: "bearer",
      token: jwt,
    };

    // Initialize the parent class with our configuration
    super(apiConfig, authConfig);
  }
} 