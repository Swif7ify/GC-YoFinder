import { NextRequest, NextResponse } from "next/server";
import { AdminLogin } from "@/server/handlers/AdminAuth";
import { cookies } from "next/headers";

const validateField = async (email: string, password: string) => {
	if (!email || !password) return false;

	if (typeof email !== "string" || typeof password !== "string") return false;

	return true;
};

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		const cookieStore = await cookies();

		const isValid = await validateField(email, password);
		if (!isValid) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

		const response = await AdminLogin(email, password);
		const message = response.status.message;
		const statusCode = response.status_code;

		switch (response.status.remarks) {
			case "success":
				const loginData = response.payload;
				await setUserCookies(cookieStore, loginData.accessToken, loginData.refreshToken);

				return NextResponse.json({ status: statusCode });
			case "social_exists":
				return NextResponse.json({ error: message }, { status: statusCode });
			case "not_exists":
				return NextResponse.json({ error: message }, { status: statusCode });
			default:
				return NextResponse.json({ error: message }, { status: statusCode });
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: "Something Went wrong" }, { status: 500 });
	}
}

async function setUserCookies(cookieStore: any, accessToken: string, refreshToken: string) {
	cookieStore.set("accessToken", accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 30, // 30 minutes
	});
	cookieStore.set("refreshToken", refreshToken, {
		httpOnly: true,
		secure: true,
		path: "/",
		maxAge: 60 * 60 * 24, // 1 day
	});
}

async function setAuthRememberCookies(cookieStore: any, selector: string, token: string) {
	cookieStore.set("rememberToken", JSON.stringify({ selector, token }), {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});
}
