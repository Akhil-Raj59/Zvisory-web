import { NextResponse } from "next/server";
import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";

/**
 * PUT /api/auth/update-profile
 * Requires authentication via httpOnly cookie.
 * Accepts multipart/form-data (fullName + optional avatar file).
 */
export async function PUT(request: Request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Get current user to know the id
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Session expired." },
        { status: 401 }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    let forwardBody: FormData;

    if (contentType.includes("multipart/form-data")) {
      forwardBody = await request.formData();
    } else {
      const body = await request.json();
      forwardBody = new FormData();
      if (body.fullName) forwardBody.append("fullName", body.fullName.trim());
    }

    const expressUrl = `${env.EXPRESS_API_URL}/api/v1/user/update/${currentUser._id}`;

    const expressResponse = await fetch(expressUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      const message = errData?.message || "Profile update failed";
      return NextResponse.json(
        { success: false, message },
        { status: expressResponse.status }
      );
    }

    const successData = responseData as { message?: string; user?: unknown };
    return NextResponse.json(
      {
        success: true,
        message: successData?.message || "Profile updated successfully",
        user: successData?.user,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
