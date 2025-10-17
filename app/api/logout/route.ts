import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/server/lib/mongodb";
import AuthRemember from "@/server/models/AuthRememberSchema";
import { getUserFromRequest } from "@/services/Access";

export async function POST(request: NextRequest) {
	try {
		const user = await getUserFromRequest(request);

		if (user) {
			await connectToDatabase();
			await AuthRemember.deleteMany({ userID: user.userID });
		}

		const response = NextResponse.json({ message: "Logged out successfully" });

		response.cookies.set("accessToken", "", {
			maxAge: 0,
			path: "/",
			httpOnly: true,
			secure: true,
		});

		response.cookies.set("refreshToken", "", {
			maxAge: 0,
			path: "/",
			httpOnly: true,
			secure: true,
		});

		response.cookies.set("rememberToken", "", {
			maxAge: 0,
			path: "/",
			httpOnly: true,
			secure: true,
		});

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json({ error: "Logout failed" }, { status: 500 });
	}
}
