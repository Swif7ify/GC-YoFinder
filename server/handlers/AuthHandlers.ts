import User from "@/server/models/UserSchema";
import AuthRemember from "@/server/models/AuthRememberSchema";
import { connectToDatabase } from "../lib/mongodb";
import { responsePayload, serverResponseError } from "../utils/responsePayload";
import { generateAccessJWT, generateRefreshJWT, decodeJWT } from "@/server/utils/CookieUtils";
import { getCurrentTimeInTimezone } from "../utils/timeUtils";
import argon2 from "argon2";

export async function handleAuthRefresh(token: string, rememberToken: string | null, role: string) {
	try {
		await connectToDatabase();
		if (!token) {
			return responsePayload(null, "error", "No token provided", 400);
		}

		let decoded;
		if (rememberToken) {
			try {
				decoded = await decodeJWT(token);
			} catch (error: any) {
				if (error.name === "TokenExpiredError") {
					decoded = await decodeJWT(token, true);
				} else {
					console.error("Error decoding JWT:", error);
					return serverResponseError();
				}
			}
		} else {
			decoded = await decodeJWT(token);
		}

		let expired = false;
		let email: string | undefined;

		if (typeof decoded === "object" && decoded !== null && "email" in decoded) {
			email = (decoded as any).email;
		}
		if (!decoded || !email) {
			return responsePayload(null, "error", "Invalid token", 404);
		}

		const userData = await getUserData(email);
		const userID = userData._id.toString();
		if (!userData) {
			return responsePayload(null, "error", "User not found", 404);
		}
		if (typeof decoded === "object" && decoded !== null && "exp" in decoded && typeof decoded.exp === "number") {
			expired = decoded.exp < Date.now() / 1000;
		}

		if (expired && rememberToken) {
			let selector: string | undefined;
			let authToken: string | undefined;
			try {
				const parsed = JSON.parse(rememberToken);
				selector = parsed.selector;
				authToken = parsed.token;
			} catch (error) {
				console.log(error);
			}

			if (!selector || !token) {
				return responsePayload(null, "error", "Invalid remember token", 404);
			}

			const currentTime = await getCurrentTimeInTimezone(userData.timezone);
			const currentDate = new Date(currentTime);

			try {
				const exist = await AuthRemember.findOne({ userID, selector, expiry: { $gt: currentDate } });
				if (!exist) {
					return responsePayload(null, "error", "Invalid remember token", 404);
				}
				const hashedToken = await AuthRemember.findOne({ userID, selector }, "token_hash");

				if (!hashedToken?.token_hash || !authToken) {
					return responsePayload(null, "error", "Invalid remember token", 404);
				}

				const check = await argon2.verify(hashedToken.token_hash, authToken);
				if (!check) {
					return responsePayload(null, "error", "Invalid remember token", 404);
				}
			} catch (error) {
				console.log(error);
				return serverResponseError();
			}
		}

		const newAccessToken = await generateAccessJWT(email, userID, role);
		const newRefreshToken = await generateRefreshJWT(email, userID, role);
		return responsePayload(
			{ accessToken: newAccessToken, refreshToken: newRefreshToken },
			"success",
			"Tokens refreshed successfully",
			200
		);
	} catch (error) {
		console.log(error);
		return serverResponseError();
	}
}

async function getUserData(email: string) {
	return User.findOne({ email }, "email");
}
