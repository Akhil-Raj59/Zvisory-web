import { NextRequest, NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Pass client IP from Next.js headers if present
    const forwardedFor = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
    if (forwardedFor && !body.ipAddress) {
      body.ipAddress = forwardedFor.split(",")[0].trim();
    }

    const response = await backendApi.createLead(body);
    return NextResponse.json(response, { status: 201 });
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

