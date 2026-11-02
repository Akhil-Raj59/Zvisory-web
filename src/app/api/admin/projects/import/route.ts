import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * POST /api/admin/projects/import
 * Proxies the Excel file upload to the Express backend for processing.
 * Uses FormData passthrough — does NOT parse the file in Next.js.
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    // Read the incoming FormData and forward it as-is to the Express backend
    const formData = await req.formData();

    const backendUrl = `${env.EXPRESS_API_URL}/api/v1/admin/projects/import`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type — let fetch set it automatically with the boundary
      },
      body: formData,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    let data: unknown;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: false, message: text || "Unexpected response from server" };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// Disable Next.js body parsing to allow FormData passthrough
export const config = {
  api: {
    bodyParser: false,
  },
};
