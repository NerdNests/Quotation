import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/libs/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = pathname === "/login" || pathname.startsWith("/api/auth/");
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (isPublicRoute) {
    if (pathname === "/login" && session) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
