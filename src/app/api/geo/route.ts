import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * IP Geolocation API Route
 * Resolves visitor's country code using edge CDN headers with fallback to ip-api.com.
 * No API key or paid service required. Does NOT request browser GPS permission.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Check CDN / Edge Geolocation Headers (Vercel, Cloudflare, AWS CloudFront, Fastly)
    const edgeCountry =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      req.headers.get("cloudfront-viewer-country") ||
      req.headers.get("fastly-client-country") ||
      req.headers.get("x-country-code");

    if (
      edgeCountry &&
      /^[a-zA-Z]{2}$/.test(edgeCountry) &&
      edgeCountry.toUpperCase() !== "XX" &&
      edgeCountry.toUpperCase() !== "T1"
    ) {
      const code = edgeCountry.toUpperCase();
      return NextResponse.json(
        {
          success: true,
          countryCode: code,
          source: "edge-header",
        },
        {
          headers: {
            "Cache-Control": "private, max-age=3600",
          },
        }
      );
    }

    // 2. Extract client IP from proxy headers
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = (forwarded ? forwarded.split(",")[0].trim() : realIp) || "";

    const isPrivateOrLocalIp =
      !clientIp ||
      clientIp === "127.0.0.1" ||
      clientIp === "::1" ||
      clientIp.startsWith("192.168.") ||
      clientIp.startsWith("10.") ||
      clientIp.startsWith("172.16.");

    // 3. Query ip-api.com (free, reliable, requires no key)
    // If local/loopback IP, query without IP path to inspect outbound public IP of caller
    const ipApiUrl = isPrivateOrLocalIp
      ? "http://ip-api.com/json/?fields=status,country,countryCode"
      : `http://ip-api.com/json/${encodeURIComponent(clientIp)}?fields=status,country,countryCode`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

    const response = await fetch(ipApiUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.countryCode) {
        return NextResponse.json(
          {
            success: true,
            countryCode: String(data.countryCode).toUpperCase(),
            countryName: data.country || "",
            source: "ip-api",
          },
          {
            headers: {
              "Cache-Control": "private, max-age=3600",
            },
          }
        );
      }
    }

    // 4. Default Fallback to India (+91)
    return NextResponse.json(
      {
        success: true,
        countryCode: "IN",
        countryName: "India",
        fallback: true,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=300",
        },
      }
    );
  } catch {
    // Return India fallback on timeout or error
    return NextResponse.json(
      {
        success: true,
        countryCode: "IN",
        countryName: "India",
        fallback: true,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=300",
        },
      }
    );
  }
}

