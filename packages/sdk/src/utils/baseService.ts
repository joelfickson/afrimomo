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
		if (typeof response === "object" && response !== null) {
			const hasErrorMessage =
				"errorMessage" in response &&
				typeof (response as any).errorMessage === "string";
			const hasStatusCode =
				"statusCode" in response &&
				typeof (response as any).statusCode === "number";
			const hasErrorObject =
				"errorObject" in response &&
				typeof (response as any).errorObject === "string";

			return hasErrorMessage && hasStatusCode && hasErrorObject;
		}

		return false;
	}
}
