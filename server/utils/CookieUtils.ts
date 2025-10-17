import jwt from "jsonwebtoken";
import { responsePayload, serverResponseError } from "./responsePayload";

export async function generateAccessJWT(
	email: string,
	userID: string,
	role: string
) {
	try {
		if (!process.env.JWT_SECRET)
			throw new Error("JWT_SECRET environment variable is not defined.");

		const token = jwt.sign(
			{ email, userID, role },
			process.env.JWT_SECRET,
			{ expiresIn: "30m" }
		);
		return token;
	} catch (error) {
		console.error("Error signing JWT:", error);
		throw error;
	}
}

export async function generateRefreshJWT(
	email: string,
	userID: string,
	role: string
) {
	try {
		if (!process.env.JWT_SECRET)
			throw new Error("JWT_SECRET environment variable is not defined.");

		const token = jwt.sign(
			{ email, userID, role },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);
		return token;
	} catch (error) {
		console.error("Error signing JWT:", error);
		throw error;
	}
}

export async function decodeJWT(token: string, ignoreExpiration = false) {
	try {
		if (!process.env.JWT_SECRET)
			throw new Error("JWT_SECRET environment variable is not defined.");

		const decoded = jwt.verify(token, process.env.JWT_SECRET, {
			ignoreExpiration,
		});
		return decoded;
	} catch (error) {
		console.error("Error decoding JWT:", error);
		throw error;
	}
}

export async function verifyRefreshJWT(token: string) {
	try {
		if (!process.env.JWT_SECRET)
			throw new Error("JWT_SECRET environment variable is not defined.");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded)
			return responsePayload(null, "error", "Invalid Token", 404);

		return responsePayload(decoded, "success", "Valid Token", 200);
	} catch (error) {
		console.error("Error verifying JWT:", error);
		throw error;
	}
}
