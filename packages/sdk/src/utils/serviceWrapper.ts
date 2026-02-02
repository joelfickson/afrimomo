import type { ServiceError } from "../types";
import type { HttpClient } from "./httpClient";

export type ServiceResult<T> = T | ServiceError;

export function isServiceError(result: unknown): result is ServiceError {
	return (
		typeof result === "object" &&
		result !== null &&
		"errorMessage" in result &&
		"statusCode" in result
	);
}

export async function wrapServiceCall<T>(
	operation: () => Promise<T>,
	errorHandler: HttpClient["handleApiError"],
	context: string,
): Promise<ServiceResult<T>> {
	try {
		return await operation();
	} catch (error) {
		if (isServiceError(error)) {
			return error;
		}
		return errorHandler(error, context);
	}
}
