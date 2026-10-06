import { NextResponse } from "next/server";
import { backendApi } from "@/lib/api";
import { env } from "@/lib/env";

export async function POST() {
  // Best-effort call to Express logout; failures will not prevent cookie clearance
  try {
    await backendApi.logout();
  } catch {
    // Intentionally ignore Express failure on logout to guarantee client session ends
  }

  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
    },
    { status: 200 }
  );

  // Clear the auth_token cookie
  response.cookies.set(env.AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
