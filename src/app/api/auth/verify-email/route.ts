import { NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";

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

    // Discard any token returned by Express; user must log in explicitly
    return NextResponse.json(
      {
        success: true,
        message: expressResponse.message || "Email verified successfully. You may now log in.",
      },
      { status: 200 }
    );
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
