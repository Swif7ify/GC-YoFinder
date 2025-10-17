import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export async function middleware(request: NextRequest, response: NextResponse) {
	const isPublicRoute = request.nextUrl.pathname.startsWith("/login");
	const ProtectedRoutes = request.nextUrl.pathname.startsWith("/dashboard");

	if (isPublicRoute) {
		const accessTokenRaw = request.cookies.get("accessToken")?.value;
		const rememberToken = request.cookies.get("rememberToken")?.value;
		if (accessTokenRaw) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}

		if (rememberToken) {
			try {
				const { selector, token } = JSON.parse(rememberToken);
				const response = await fetch(
					new URL("/api/auth/remember", request.url),
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ selector, token }),
					}
				);

				if (response.ok) {
					const data = await response.json();
					const redirectResponse = NextResponse.redirect(
						new URL("/dashboard", request.url)
					);

					redirectResponse.cookies.set(
						"accessToken",
						data.payload.accessToken,
						{
							httpOnly: true,
							secure: true,
							path: "/",
							maxAge: 60 * 30,
						}
					);

					redirectResponse.cookies.set(
						"refreshToken",
						data.payload.refreshToken,
						{
							httpOnly: true,
							secure: true,
							path: "/",
							maxAge: 60 * 60 * 24,
						}
					);

					return redirectResponse;
				} else {
					const redirectResponse = NextResponse.redirect(
						new URL("/login", request.url)
					);
					redirectResponse.cookies.set("rememberToken", "", {
						maxAge: 0,
						path: "/",
					});
					return redirectResponse;
				}
			} catch {
				const response = NextResponse.next();
				response.cookies.set("rememberToken", "", {
					maxAge: 0,
					path: "/",
				});
			}
		}
	}

	if (ProtectedRoutes) {
		const accessToken = request.cookies.get("accessToken")?.value;
		const refreshToken = request.cookies.get("refreshToken")?.value;

		try {
			if (!accessToken) {
				if (refreshToken) {
					return NextResponse.next();
				}
				response.cookies.set("accessToken", "", {
					maxAge: 0,
					path: "/",
				});
				response.cookies.set("refreshToken", "", {
					maxAge: 0,
					path: "/",
				});
				return NextResponse.redirect(new URL(`/`, request.url));
			}

			const { exp } = jwtDecode<{ exp: number; role: string }>(
				accessToken
			);
			const now = dayjs().unix();

			if (exp < now) {
				if (refreshToken) {
					return NextResponse.next();
				}
				response.cookies.set("accessToken", "", {
					maxAge: 0,
					path: "/",
				});
				response.cookies.set("refreshToken", "", {
					maxAge: 0,
					path: "/",
				});

				return NextResponse.redirect(new URL(`/`, request.url));
			}

			const { role } = jwtDecode<{ exp?: number; role?: string }>(
				accessToken
			);

			if (
				request.nextUrl.pathname.startsWith("/admin-dashboard") &&
				role !== "admin"
			)
				return NextResponse.redirect(
					new URL("/login-admin", request.url)
				);

			if (
				request.nextUrl.pathname.startsWith("/dashboard") &&
				role !== "student"
			)
				return NextResponse.redirect(
					new URL("/login", request.url)
				);

			return NextResponse.next();
		} catch {
			const response = NextResponse.redirect(new URL("/", request.url));
			response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
			response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
			return response;
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/dashboard/:path*"],
};
