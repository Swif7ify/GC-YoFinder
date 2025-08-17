export function responsePayload(payload: any, remarks: string, message: string, code: number) {
	const status = {
		remarks,
		message,
	};
	return {
		status,
		payload,
		timestamp: new Date().toISOString(),
		prepared_by: "ORDOVEZ, E.R",
		status_code: code,
	};
}

export async function serverResponseError(payload = null, message = "Internal Server Error", code = 500) {
	return responsePayload(payload, "error", message, code);
}

export async function invalidInputTypeError(payload = null, message = "Invalid input type", code = 400) {
	return responsePayload(payload, "error", message, code);
}

export async function missingRequiredFieldError(payload = null, message = "Missing required field", code = 404) {
	return responsePayload(payload, "error", message, code);
}

export async function userNotFoundError(payload = null, message = "User not found", code = 404) {
	return responsePayload(payload, "error", message, code);
}
