export async function ValidateStringField(
	...fields: (string | undefined)[]
): Promise<boolean> {
	for (const field of fields) {
		if (!field || typeof field !== "string") {
			return false;
		}
	}
	return true;
}
