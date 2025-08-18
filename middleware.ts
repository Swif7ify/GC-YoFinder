import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
	const isPublicRoute = request.nextUrl.pathname.startsWith("/login");

	if (isPublicRoute) {
		const accessTokenRaw = request.cookies.get("accessToken")?.value;
		if (accessTokenRaw) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/login"],
};
