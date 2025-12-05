import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

/*
 Middleware: route protection + remember-me handling

 Responsibilities:
 - Redirect authenticated users away from public login routes.
 - Support a "remember me" token to silently rehydrate sessions.
 - Protect dashboard routes by validating `accessToken` and falling
   back to `refreshToken` where appropriate.
 - Clear cookies and redirect to login/root on invalid tokens.

 Notes:
 - This middleware runs for paths defined in `config.matcher` below.
 - We intentionally return `NextResponse.next()` in cases where a
   refresh token exists so downstream code (API route) can attempt
   token rotation without forcing an immediate redirect here.
*/

export async function middleware(request: NextRequest, response: NextResponse) {
	// Determine route types for easier branching
	const isPublicRoute = request.nextUrl.pathname.startsWith("/login");
	const ProtectedRoutes = request.nextUrl.pathname.startsWith("/dashboard");

	// Handle public routes (e.g. /login). If the user already has a valid
	// access token we redirect them to their dashboard. If they have a
	// remember token we attempt to refresh the session silently.
	if (isPublicRoute) {
		const accessTokenRaw = request.cookies.get("accessToken")?.value;
		const rememberToken = request.cookies.get("rememberToken")?.value;

		// If an access token exists, try decoding user role and redirect
		// to the appropriate dashboard. Any decode error should fall
		// through so the user can still log in.
		if (accessTokenRaw) {
			try {
				const { role } = jwtDecode<{ role?: string }>(accessTokenRaw);
				if (role === "admin")
					return NextResponse.redirect(
						new URL("/dashboard-admin", request.url)
					);
				return NextResponse.redirect(
					new URL("/dashboard", request.url)
				);
			} catch {
				// Silent fail: malformed token or decode error — allow login flow
			}
		}

		// If the user has a remember token (persistent session) attempt
		// to call the remember endpoint to obtain new tokens and set them
		// as cookies before redirecting to the dashboard. If it fails,
		// clear the remember cookie and fall back to showing the login page.
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

					// Set newly issued access/refresh tokens as httpOnly cookies
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
					// If remember endpoint rejected the token, clear remember cookie
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
				// On any parse/fetch error clear the remember token and continue
				const responseNext = NextResponse.next();
				responseNext.cookies.set("rememberToken", "", {
					maxAge: 0,
					path: "/",
				});
			}
		}
	}

	// Protect dashboard routes: require a valid access token (or allow
	// the presence of a refresh token so downstream code may attempt
	// rotation). On invalid or expired tokens we clear cookies and
	// redirect to the root/login page.
	if (ProtectedRoutes) {
		const accessToken = request.cookies.get("accessToken")?.value;
		const refreshToken = request.cookies.get("refreshToken")?.value;

		try {
			// If no access token is present, but a refresh token exists we
			// allow the request to continue so token rotation can be attempted
			// by the API. Otherwise clear cookies and redirect to root.
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

			// Check token expiration (exp is a unix timestamp)
			const { exp } = jwtDecode<{ exp: number; role: string }>(
				accessToken
			);
			const now = dayjs().unix();

			// If token expired, allow refresh flow when refresh token exists,
			// otherwise clear and redirect to root.
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

			// Role-based routing: ensure the user has permissions for the
			// route being accessed (admin vs student dashboard areas).
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
				return NextResponse.redirect(new URL("/login", request.url));

			// All checks passed — allow request to proceed
			return NextResponse.next();
		} catch {
			// On decode/parsing error, clear cookies and redirect to root
			const responseErr = NextResponse.redirect(
				new URL("/", request.url)
			);
			responseErr.cookies.set("accessToken", "", {
				maxAge: 0,
				path: "/",
			});
			responseErr.cookies.set("refreshToken", "", {
				maxAge: 0,
				path: "/",
			});
			return responseErr;
		}
	}

	// Default: continue processing
	return NextResponse.next();
}

// Apply middleware only to the listed routes — keep this in sync with
// the app's routing structure. The matcher below covers public login
// pages and any dashboard paths.
export const config = {
	matcher: ["/login", "/login-admin", "/dashboard/:path*"],
};
