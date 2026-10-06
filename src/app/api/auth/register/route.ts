import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { ApiError } from "@/lib/api";

/**
 * POST /api/auth/register
 *
 * Accepts either JSON (no avatar) or multipart/form-data (with avatar).
 * Forwards directly to the Express backend as multipart/form-data since
 * the backend uses multer to handle the avatar upload.
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    let forwardBody: FormData;

    if (contentType.includes("multipart/form-data")) {
      // Already FormData — forward as-is
      forwardBody = await request.formData();
    } else {
      // JSON payload — convert to FormData (no avatar)
      const body = await request.json();
      const { fullName, email, password } = body;

      if (!fullName || !email || !password) {
        return NextResponse.json(
          { success: false, message: "All fields (fullName, email, password) are required" },
          { status: 400 }
        );
      }

      forwardBody = new FormData();
      forwardBody.append("fullName", fullName.trim());
      forwardBody.append("email", email.trim().toLowerCase());
      forwardBody.append("password", password);
    }

    // Forward to Express backend — let fetch set the Content-Type with the correct boundary
    const expressUrl = `${env.EXPRESS_API_URL}/api/v1/user/register`;
    const expressResponse = await fetch(expressUrl, {
      method: "POST",
      body: forwardBody,
      cache: "no-store",
    });

    let responseData: unknown = null;
    const responseContentType = expressResponse.headers.get("content-type");
    if (responseContentType?.includes("application/json")) {
      responseData = await expressResponse.json();
    } else {
      responseData = await expressResponse.text();
    }

    if (!expressResponse.ok) {
      const errData = responseData as { message?: string };
      const message = errData?.message || "Registration failed";
      return NextResponse.json(
        { success: false, message },
        { status: expressResponse.status }
      );
    }

    const successData = responseData as { message?: string };
    return NextResponse.json(
      {
        success: true,
        message: successData?.message || "Verification OTP sent to your email",
      },
      { status: 201 }
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
