import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "url field is required" },
        { status: 400 }
      );
    }

    const response = await backendApi.adminValidateMediaUrl(token, url);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
