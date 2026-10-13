import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. No session token found." },
        { status: 401 }
      );
    }

    const expressResponse = await backendApi.getMe(token);

    return NextResponse.json(
      {
        success: true,
        user: expressResponse.user,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      const response = NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
      if (error.statusCode === 401 || error.statusCode === 404) {
        response.cookies.set(env.AUTH_COOKIE_NAME, "", {
          httpOnly: true,
          secure: env.IS_PROD,
          sameSite: "lax",
          path: "/",
          maxAge: 0,
        });
      }
      return response;
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
