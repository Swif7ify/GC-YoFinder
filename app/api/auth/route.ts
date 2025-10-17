import { NextRequest, NextResponse } from "next/server";
import { handleAuthRefresh } from "@/server/handlers/AuthHandlers";
import { cookies } from "next/headers";
import { decodeJWT } from "@/server/utils/CookieUtils";

export async function GET(request: NextRequest) {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refreshToken")?.value;
	const rememberToken = cookieStore.get("rememberToken")?.value;

	if (!refreshToken) {
		cookieStore.delete("accessToken");
		cookieStore.delete("refreshToken");
		return NextResponse.redirect(new URL("/", request.url));
	}

	const role = await decodeJWT(refreshToken)
		.then((decoded) => {
			if (
				typeof decoded === "object" &&
				decoded !== null &&
				"role" in decoded
			) {
				return (decoded as any).role;
			}
			return null;
		})
		.catch(() => null);

	try {
		const response = await handleAuthRefresh(
			refreshToken,
			rememberToken || null,
			role
		);

		if (response.status.remarks === "success") {
			cookieStore.delete("accessToken");
			cookieStore.delete("refreshToken");
			const { accessToken, refreshToken: newRefreshToken } =
				response.payload;
			cookieStore.set("accessToken", accessToken, {
				httpOnly: true,
				secure: true,
				path: "/",
				maxAge: 60 * 30,
			});
			cookieStore.set("refreshToken", newRefreshToken, {
				httpOnly: true,
				secure: true,
				path: "/",
				maxAge: 60 * 60 * 24,
			});

			const from =
				request.nextUrl.searchParams.get("from") || "/dashboard";
			return NextResponse.redirect(new URL(from, request.url));
		}
		cookieStore.delete("accessToken");
		cookieStore.delete("refreshToken");
		cookieStore.delete("rememberToken");
		return NextResponse.redirect(new URL("/signin", request.url));
	} catch (err) {
		cookieStore.delete("accessToken");
		cookieStore.delete("refreshToken");
		cookieStore.delete("rememberToken");
		return NextResponse.redirect(new URL("/signin", request.url));
	}
}
