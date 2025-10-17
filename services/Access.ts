import { NextRequest } from "next/server";
import { decodeJWT } from "@/server/utils/CookieUtils";

export async function getUserFromRequest(request: NextRequest) {
	const accessToken = request.cookies.get("accessToken")?.value;
	if (!accessToken) return null;

	try {
		const decoded = await decodeJWT(accessToken);
		let email: string | undefined;
		let userID: string | undefined;
		if (
			typeof decoded === "object" &&
			decoded !== null &&
			"email" in decoded
		) {
			email = (decoded as { email?: string }).email;
		}

		if (
			typeof decoded === "object" &&
			decoded !== null &&
			"userID" in decoded
		) {
			userID = (decoded as { userID?: string }).userID;
		}

		return email || userID ? { email, userID } : null;
	} catch {
		return null;
	}
}
