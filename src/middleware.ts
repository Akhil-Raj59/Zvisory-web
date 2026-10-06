import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  _id?: string;
  role?: string;
  exp?: number;
}

/**
 * Decodes JWT payload in Edge runtime without Node dependencies.
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);

    // Optional expiration check if exp is in payload
    if (parsed.exp && typeof parsed.exp === "number") {
      if (Date.now() >= parsed.exp * 1000) {
        return null;
      }
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Returns the appropriate dashboard path based on user role.
 */
function getRoleDashboard(role?: string): string {
  const r = (role || "").toUpperCase();
  if (r === "ADMIN") return "/dashboard/admin";
  if (r === "EMPLOYEE") return "/dashboard/employee";
  return "/dashboard/customer";
}

export function middleware(request: NextRequest) {
  // Support both "auth_token" (primary) and "token" (legacy/fallback)
  const token =
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("token")?.value;

  const path = request.nextUrl.pathname;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role ? payload.role.toUpperCase() : null;
  const isAuthenticated = Boolean(role);

  // 1. Unauthenticated users trying to access protected paths
  const isProtectedPath =
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/admin" ||
    path.startsWith("/admin/");

  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users opening login or register pages -> redirect to role dashboard
  const isAuthPage = path === "/login" || path === "/register";
  if (isAuthPage && isAuthenticated) {
    const targetDashboard = getRoleDashboard(role || undefined);
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 3. Authenticated users on root /dashboard -> redirect to role dashboard
  if (path === "/dashboard" && isAuthenticated) {
    const targetDashboard = getRoleDashboard(role || undefined);
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 4. Role-based access control for protected routes
  if (isAuthenticated) {
    // Admin routes
    if (path.startsWith("/dashboard/admin") || path.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL(getRoleDashboard(role || undefined), request.url));
      }
    }

    // Employee routes
    if (path.startsWith("/dashboard/employee")) {
      if (role !== "EMPLOYEE" && role !== "ADMIN") {
        return NextResponse.redirect(new URL(getRoleDashboard(role || undefined), request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};

