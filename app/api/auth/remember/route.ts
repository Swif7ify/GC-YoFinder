import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/server/lib/mongodb";
import AuthRemember from "@/server/models/AuthRememberSchema";
import User from "@/server/models/UserSchema";
import { CompareHash } from "@/server/utils/TokenUtils";
import { generateAccessJWT, generateRefreshJWT } from "@/server/utils/CookieUtils";
import { getCurrentTimeInTimezone } from "@/server/utils/timeUtils";

export async function POST(request: NextRequest) {
	try {
		const { selector, token } = await request.json();

		if (!selector || !token || typeof selector !== "string" || typeof token !== "string") {
			return NextResponse.json({ error: "Invalid request" }, { status: 400 });
		}

		await connectToDatabase();

		const authRemember = await AuthRemember.findOne({ selector });
		if (!authRemember) {
			return NextResponse.json({ error: "Invalid remember token" }, { status: 401 });
		}

		const currentTime = new Date();
		if (currentTime > authRemember.expiry) {
			await AuthRemember.deleteOne({ selector });
			return NextResponse.json({ error: "Remember token expired" }, { status: 401 });
		}

		const isValidToken = await CompareHash(authRemember.token_hash, token);
		if (!isValidToken) {
			await AuthRemember.deleteOne({ selector });
			return NextResponse.json({ error: "Invalid remember token" }, { status: 401 });
		}

		const user = await User.findById(authRemember.userID);
		if (!user) {
			await AuthRemember.deleteOne({ selector });
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const accessToken = await generateAccessJWT(user.email, user._id.toString(), user.role);
		const refreshToken = await generateRefreshJWT(user.email, user._id.toString(), user.role);

		if (!accessToken || !refreshToken) {
			return NextResponse.json({ error: "Failed to generate tokens" }, { status: 500 });
		}

		const timezone = user.timezone || "Asia/Manila";
		const updated_at = await getCurrentTimeInTimezone(timezone);

		await AuthRemember.findOneAndUpdate({ selector }, { updated_at }, { new: true });

		return NextResponse.json({
			payload: { accessToken, refreshToken },
			status: { message: "Login successful via remember token" },
		});
	} catch (error) {
		console.error("Remember token error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
