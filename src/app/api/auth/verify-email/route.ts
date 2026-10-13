import { NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const expressResponse = await backendApi.verifyEmail({ email, otp });
    const { token, user } = expressResponse;

    const response = NextResponse.json(
      {
        success: true,
        message: expressResponse.message || "Email verified successfully.",
        user,
      },
      { status: 200 }
    );

    if (token) {
      // Set secure httpOnly cookie so user is automatically logged in
      response.cookies.set(env.AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: env.IS_PROD,
        sameSite: "lax",
        path: "/",
        maxAge: env.AUTH_COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
