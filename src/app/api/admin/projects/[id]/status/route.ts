import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { env } from "@/lib/env";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { status } = await req.json();
    if (!status || !["draft", "published", "archived"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status value." }, { status: 400 });
    }

    const response = await backendApi.adminUpdateStatus(token, id, status);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
