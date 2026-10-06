/**
 * Environment configuration helper.
 * Provides safe defaults for local development.
 */

export const env = {
  EXPRESS_API_URL:
    process.env.EXPRESS_API_URL?.replace(/\/+$/, "") || "http://localhost:5000",
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PROD: process.env.NODE_ENV === "production",
  // JWT expiry matching server (7 days in seconds)
  AUTH_COOKIE_MAX_AGE: 7 * 24 * 60 * 60,
  AUTH_COOKIE_NAME: "auth_token",
} as const;
