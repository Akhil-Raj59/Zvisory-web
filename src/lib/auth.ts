import { cookies } from "next/headers";
import { backendApi, ApiError, type User } from "./api";
import { env } from "./env";

/**
 * Roles that have access to the admin area.
 * Only ADMIN. CUSTOMER and USER are redirected away.
 */
export function isAdminRole(role?: string): boolean {
  if (!role) return false;
  return role.toUpperCase() === "ADMIN";
}

/**
 * Returns the normalized role label for display.
 */
export function getRoleLabel(role?: string): string {
  if (!role) return "USER";
  switch (role.toUpperCase()) {
    case "ADMIN": return "ADMIN";
    case "CUSTOMER": return "CUSTOMER";
    default: return "USER";
  }
}

/**
 * Retrieves the currently authenticated user from the Express backend
 * using the auth token from the cookie store..
 *
 * returns the User object if authenticated, or null if unauthorized.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const response = await backendApi.getMe(token);
    if (response.success && response.user) {
      return response.user;
    }

    return null;
  } catch (err: unknown) {
    if (err instanceof ApiError && (err.statusCode === 401 || err.statusCode === 404)) {
      try {
        const cookieStore = await cookies();
        cookieStore.delete(env.AUTH_COOKIE_NAME);
      } catch {
        // Read-only cookie store in RSC render handled safely
      }
    }
    return null;
  }
}

/**
 * Retrives the auth token from the cookie store (for protected server actions).
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(env.AUTH_COOKIE_NAME)?.value ?? null;
  } catch {
    return null;
  }
}
