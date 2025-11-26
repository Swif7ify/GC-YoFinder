import { responsePayload, serverResponseError } from "@/server/utils/responsePayload";
import User from "@/server/models/UserSchema";
import { CompareHash } from "@/server/utils/TokenUtils";
import { connectToDatabase } from "@/server/lib/mongodb";
import { generateAccessJWT, generateRefreshJWT } from "@/server/utils/CookieUtils";

export async function AdminLogin(email: string, password: string) {
	try {
		await connectToDatabase();

		if (!email || !password || typeof email !== "string" || typeof password !== "string")
			return responsePayload(null, "error", "Missing Required Fields", 404);

		const user = await User.findOne({ email }, "password role");
		if (!user || user.role !== "admin") return responsePayload(null, "not_exists", "User Not Found", 404);

		const comparePassword = await CompareHash(user.password, password);
		if (!comparePassword) return responsePayload(null, "error", "Invalid Credentials", 404);

		const userID = user._id;

		const accessToken = await generateAccessJWT(user.email, userID.toString(), user.role);
		const refreshToken = await generateRefreshJWT(user.email, userID.toString(), user.role);

		if (!accessToken || !refreshToken) return responsePayload(null, "error", "Failed to generate tokens", 500);

		return responsePayload({ accessToken, refreshToken }, "success", "Login Successful", 200);
	} catch (error) {
		console.log(error);
		return serverResponseError();
	}
}
