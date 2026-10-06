import { NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

/**
 * POST /api/auth/change-password
 * Requires authentication via httpOnly cookie.
 */
export async function POST(request: Request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Old password and new password are required" },
        { status: 400 }
      );
    }

    const expressResponse = await backendApi.changePassword(token, {
      oldPassword,
      newPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: expressResponse.message || "Password changed successfully",
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
