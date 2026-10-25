import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { env } from "@/lib/env";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const response = await backendApi.adminGetProjects(token, params);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const body = await req.json();
    const response = await backendApi.adminCreateProject(token, body);
    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
