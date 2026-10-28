import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { env } from "@/lib/env";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const response = await backendApi.adminGetCityById(token, id);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const response = await backendApi.adminUpdateCity(token, id, body);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const response = await backendApi.adminDeleteCity(token, id);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
