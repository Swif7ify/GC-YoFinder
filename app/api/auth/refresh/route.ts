import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAccessJWT, verifyRefreshJWT } from "@/server/utils/CookieUtils";
import { connectToDatabase } from "@/server/lib/mongodb";
import User from "@/server/models/UserSchema";

export async function POST(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refreshToken")?.value;

		if (!refreshToken) {
			cookieStore.delete("accessToken");
			cookieStore.delete("refreshToken");
			cookieStore.delete("rememberToken");
			return NextResponse.json({ error: "No refresh token" }, { status: 401 });
		}

		let decoded;
		try {
			decoded = await verifyRefreshJWT(refreshToken);
		} catch (err: any) {
			cookieStore.delete("accessToken");
			cookieStore.delete("refreshToken");
			cookieStore.delete("rememberToken");
			return NextResponse.json({ error: "Refresh token invalid or expired" }, { status: 401 });
		}

		if (decoded.status_code !== 200) {
			cookieStore.delete("accessToken");
			cookieStore.delete("refreshToken");
			cookieStore.delete("rememberToken");
			return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
		}

		const userID = decoded.payload.userID;

		await connectToDatabase();
		const user = await User.findById(userID);
		if (!user) {
			cookieStore.delete("accessToken");
			cookieStore.delete("refreshToken");
			cookieStore.delete("rememberToken");
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const newAccessToken = await generateAccessJWT(user.email, user._id.toString(), user.role);

		const response = NextResponse.json({
			payload: { accessToken: newAccessToken },
			status: { message: "Token refreshed" },
		});

		response.cookies.set("accessToken", newAccessToken, {
			httpOnly: true,
			secure: true,
			path: "/",
			maxAge: 60 * 30,
		});

		return response;
	} catch (error) {
		return NextResponse.json({ error: "Token refresh failed" }, { status: 500 });
	}
}
