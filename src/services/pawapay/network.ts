import { Environment } from "../../config/constants";
import axios, { AxiosInstance } from "axios";

/**
 * Network manager for PawaPay API calls
 */
export class PawapayNetwork {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

  constructor(jwt: string, environment: Environment = 'DEVELOPMENT') {
    this.baseUrl = environment === 'PRODUCTION'
      ? 'https://api.pawapay.io/v1'
      : 'https://api.sandbox.pawapay.io/v1';

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Make a GET request to the PawaPay API
   * @param endpoint - API endpoint
   * @returns Promise resolving to the response data
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint);
    return response.data;
  }

  /**
   * Make a POST request to the PawaPay API
   * @param endpoint - API endpoint
   * @param data - Request payload
   * @returns Promise resolving to the response data
   */
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  /**
   * Make a PUT request to the PawaPay API
   * @param endpoint - API endpoint
   * @param data - Request payload
   * @returns Promise resolving to the response data
   */
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  /**
   * Make a DELETE request to the PawaPay API
   * @param endpoint - API endpoint
   * @returns Promise resolving to the response data
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }
} 