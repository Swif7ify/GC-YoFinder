import jwt from "jsonwebtoken";

export async function generateAccessJWT(email: string, userID: string) {
	try {
		if (!process.env.JWT_SECRET) {
			throw new Error("JWT_SECRET environment variable is not defined.");
		}
		const token = jwt.sign({ email, userID }, process.env.JWT_SECRET, { expiresIn: "15m" });
		return token;
	} catch (error) {
		console.error("Error signing JWT:", error);
		throw error;
	}
}

export async function generateRefreshJWT(email: string, userID: string) {
	try {
		if (!process.env.JWT_SECRET) {
			throw new Error("JWT_SECRET environment variable is not defined.");
		}
		const token = jwt.sign({ email, userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
		return token;
	} catch (error) {
		console.error("Error signing JWT:", error);
		throw error;
	}
}

export async function decodeJWT(token: string, ignoreExpiration = false) {
	try {
		if (!process.env.JWT_SECRET) {
			throw new Error("JWT_SECRET environment variable is not defined.");
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration });
		return decoded;
	} catch (error) {
		console.error("Error decoding JWT:", error);
		throw error;
	}
}
