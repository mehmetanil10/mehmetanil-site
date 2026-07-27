import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const secureCookie =
    forwardedProto === "https" || req.nextUrl.protocol === "https:";

  let token = null;

  if (secret) {
    try {
      token = await getToken({ req, secret, secureCookie });
    } catch {
      // Geçersiz veya değiştirilen token anonim istek olarak değerlendirilir.
    }
  }

  const isAdmin = token?.role === "ADMIN";

  if (isAdminRoute && !isLoginPage && !isAdmin) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${req.nextUrl.pathname}${req.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
