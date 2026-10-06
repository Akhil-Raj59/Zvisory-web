import { NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const expressResponse = await backendApi.login({ email, password });
    const { token, user } = expressResponse;

    if (!token || !user) {
      return NextResponse.json(
        { success: false, message: "Authentication failed. Invalid response from server." },
        { status: 500 }
      );
    }

    // Return user info to client without leaking the JWT token to client-side JS
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        user,
      },
      { status: 200 }
    );

    // Set secure httpOnly cookie with maxAge matching JWT_EXPIRY (7 days)
    response.cookies.set(env.AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.IS_PROD,
      sameSite: "lax",
      path: "/",
      maxAge: env.AUTH_COOKIE_MAX_AGE,
    });

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
