import mongoose from "mongoose";
import {
	responsePayload,
	serverResponseError,
} from "@/server/utils/responsePayload";
import User from "@/server/models/UserSchema";
import AuthRemember from "@/server/models/AuthRememberSchema";
import {
	CompareHash,
	generateSelectorToken,
	generateTokenHashed,
} from "@/server/utils/TokenUtils";
import { connectToDatabase } from "@/server/lib/mongodb";
import {
	generateAccessJWT,
	generateRefreshJWT,
} from "@/server/utils/CookieUtils";
import {
	getCurrentTimeInTimezone,
	getTimeInTimezoneExpire,
} from "../utils/timeUtils";

export async function UserLogin(
	email: string,
	password: string,
	remember_me: boolean
) {
	try {
		await connectToDatabase();

		if (
			!email ||
			!password ||
			typeof email !== "string" ||
			typeof password !== "string"
		)
			return responsePayload(
				null,
				"error",
				"Missing Required Fields",
				404
			);

		let selector;
		let tokenHashed;
		let token;

		const user = await User.findOne({ email }, "password role");
		if (!user || user.role !== "student")
			return responsePayload(null, "not_exists", "User Not Found", 404);

		const comparePassword = await CompareHash(user.password, password);
		if (!comparePassword)
			return responsePayload(null, "error", "Invalid Credentials", 404);

		const userID = user._id;

		const accessToken = await generateAccessJWT(
			user.email,
			userID.toString(),
			user.role
		);
		const refreshToken = await generateRefreshJWT(
			user.email,
			userID.toString(),
			user.role
		);

		if (!accessToken || !refreshToken)
			return responsePayload(
				null,
				"error",
				"Failed to generate tokens",
				500
			);

		if (remember_me) {
			selector = await generateSelectorToken();
			const tokens = await generateTokenHashed();
			tokenHashed = tokens.hashedToken;
			token = tokens.token;
			if (!selector && !tokens)
				return responsePayload(
					null,
					"error",
					"something went wrong",
					500
				);

			const tokenExpiry = await getTimeInTimezoneExpire(
				user.timezone,
				43200
			); // 30 days

			const updated_at = await getCurrentTimeInTimezone(user.timezone);
			const created_at = await getCurrentTimeInTimezone(user.timezone);

			const existByID = await AuthRemember.findOne({ userID });
			if (existByID) {
				const deleteByID = await AuthRemember.deleteMany({ userID });
				if (!deleteByID)
					return responsePayload(
						null,
						"error",
						"failed to delete existing authremember tokens",
						500
					);
			}

			const result = await AuthRemember.create({
				userID,
				selector,
				token_hash: tokenHashed,
				expiry: new Date(tokenExpiry),
				updated_at,
				created_at,
			});
			if (!result)
				return responsePayload(
					null,
					"error",
					"failed to set authremember tokens",
					500
				);

			return responsePayload(
				{ accessToken, refreshToken, selector, token },
				"success",
				"User logged in successfully",
				200
			);
		}

		return responsePayload(
			{ accessToken, refreshToken },
			"success",
			"Login Successful",
			200
		);
	} catch (error) {
		console.log(error);
		return serverResponseError();
	}
}
