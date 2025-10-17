import Argon2 from "argon2";
import crypto from "crypto";
import AuthRemember from "@/server/models/AuthRememberSchema";

export async function TokenHasher(token: string) {
	try {
		const hashedToken = await Argon2.hash(token, {
			type: Argon2.argon2id,
			memoryCost: 2048,
			timeCost: 4,
			parallelism: 3,
		});

		if (!hashedToken) throw new Error("Failed to hashed token");

		return hashedToken;
	} catch (error) {
		throw error;
	}
}

export async function CompareHash(hashOne: string, hashTwo: string) {
	try {
		const result = await Argon2.verify(hashOne, hashTwo);
		if (!result) return false;

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function generateSelectorToken() {
	try {
		let selectorToken;
		let count = 1;
		while (count < 20) {
			selectorToken = await generateRandomBytes();
			const result = await AuthRemember.findOne(
				{ selectorToken },
				"selector"
			);
			if (!result) {
				break;
			}
			count++;
		}
		return selectorToken;
	} catch (error) {
		throw error;
	}
}

export async function generateTokenHashed() {
	try {
		const token = await generateRandomBytes();
		const hashedToken = await TokenHasher(token);
		if (!hashedToken) {
			throw new Error("something went wrong");
		}
		return { hashedToken, token };
	} catch (error) {
		throw error;
	}
}

async function generateRandomBytes() {
	try {
		return crypto.randomBytes(16).toString("hex");
	} catch (error) {
		throw error;
	}
}
