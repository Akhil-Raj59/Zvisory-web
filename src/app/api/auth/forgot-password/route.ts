import { NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const expressResponse = await backendApi.forgotPassword({ email });

    return NextResponse.json(
      {
        success: true,
        message: expressResponse.message || `Password reset link sent to ${email}`,
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
