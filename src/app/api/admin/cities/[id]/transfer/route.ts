import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { backendApi, ApiError } from "@/lib/api";
import { env } from "@/lib/env";

interface RouteProps {
  params: Promise<{ id: string }>;
}

// export async function POST(req: NextRequest, { params }: RouteProps) {
//   try {
//     const { id } = await params;
//     const cookieStore = await cookies();
//     const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

//     if (!token) {
//       return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
//     }

//     const { targetCityId } = await req.json();
//     if (!targetCityId) {
//       return NextResponse.json({ success: false, message: "targetCityId is required." }, { status: 400 });
//     }

//     const response = await backendApi.adminTransferCityProjects(token, id, targetCityId);
//     return NextResponse.json(response, { status: 200 });
//   } catch (error: unknown) {
//     if (error instanceof ApiError) {
//       return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
//     }
//     const message = error instanceof Error ? error.message : "Internal Server Error";
//     return NextResponse.json({ success: false, message }, { status: 500 });
//   }
// }
export async function POST(req: NextRequest, { params }: RouteProps) {
  try {
    console.log("[TRANSFER ROUTE HIT]");

    const { id } = await params;
    console.log("[TRANSFER CITY ID]:", id);

    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      console.log("[TRANSFER ERROR] No auth token found");
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { targetCityId } = await req.json();
    console.log("[TARGET CITY ID]:", targetCityId);

    if (!targetCityId) {
      return NextResponse.json(
        { success: false, message: "targetCityId is required." },
        { status: 400 }
      );
    }

    console.log("[CALLING EXPRESS BACKEND]");
    const response = await backendApi.adminTransferCityProjects(
      token,
      id,
      targetCityId
    );

    console.log("[BACKEND TRANSFER RESPONSE]:", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("[TRANSFER ROUTE ERROR]:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
