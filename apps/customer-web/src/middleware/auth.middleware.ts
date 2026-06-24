import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

// ========================================
// PROTECTED ROUTES
// ========================================

const PROTECTED_ROUTES = [
  "/account",
  "/cart",
  "/wishlist",
];

// ========================================
// MIDDLEWARE
// ========================================

export function middleware(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  const isProtected =
    PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

  // ========================================
  // PUBLIC ROUTES
  // ========================================

  if (!isProtected) {
    return NextResponse.next();
  }

  // ========================================
  // COOKIE CHECK
  // ========================================

  const accessToken =
    request.cookies.get(
      "accessToken"
    )?.value;

  const refreshToken =
    request.cookies.get(
      "refreshToken"
    )?.value;

  // ========================================
  // IMPORTANT
  // ========================================
  //
  // If refreshToken exists:
  // allow request.
  //
  // Frontend interceptor will refresh
  // access token automatically.
  //
  // NEVER validate JWT in middleware.
  //
  // This prevents redirect loops.
  // ========================================

  const hasSession = !!refreshToken;

  // ========================================
  // REDIRECT
  // ========================================

  if (!hasSession) {
    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  // ========================================
  // CONTINUE
  // ========================================

  return NextResponse.next();
}

// ========================================
// MATCHER
// ========================================

export const config = {
  matcher: [
    "/account/:path*",
    "/cart/:path*",
    "/wishlist/:path*",
  ],
};