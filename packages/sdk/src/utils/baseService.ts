export class BaseService {
	/**
	 * Formats a phone number by removing leading + or 0
	 * @param phoneNumber The phone number to format
	 * @returns The formatted phone number
	 */
	protected formatPhoneNumber(phoneNumber: string): string {
		return phoneNumber.replace(/^([+0])/, "");
	}

	/**
	 * Checks if a given response is a NetworkResponse.
	 * @param response The response to check
	 * @returns True if the response is a NetworkResponse
	 */
	protected isNetworkError(response: unknown): boolean {
		interface NetworkErrorResponse {
			errorMessage: string;
			statusCode: number;
			errorObject: string;
			[key: string]: unknown;
		}

		if (typeof response === "object" && response !== null) {
			const res = response as NetworkErrorResponse;
			const hasErrorMessage =
				"errorMessage" in res && typeof res.errorMessage === "string";
			const hasStatusCode =
				"statusCode" in res && typeof res.statusCode === "number";
			const hasErrorObject =
				"errorObject" in res && typeof res.errorObject === "string";

			return hasErrorMessage && hasStatusCode && hasErrorObject;
		}

		return false;
	}
}
