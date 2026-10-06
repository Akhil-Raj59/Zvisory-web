import { env } from "./env";

export interface UserAvatar {
  public_id: string;
  secure_url: string;
}

export type UserRole = "USER" | "ADMIN" | "CUSTOMER";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole | string;
  avatar?: UserAvatar;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  token?: string;
  user?: User;
  data?: T;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  stack?: string;
  error?: string;
}

export interface PingResponse {
  status: string;
  message: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public details?: ApiErrorResponse;

  constructor(message: string, statusCode: number = 500, details?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

/**
 * Low-level typed fetch wrapper for backend Express calls.
 * All calls are made server-side by Next.js route handlers or Server Components.
 */
async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers: customHeaders, ...restOptions } = options;

  const url = `${env.EXPRESS_API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(customHeaders);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to connect to backend service";
    throw new ApiError(`Network error: ${message}`, 503);
  }

  let responseData: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    let errorMessage = "An error occurred while communicating with the server";

    if (responseData && typeof responseData === "object") {
      const errObj = responseData as ApiErrorResponse;
      errorMessage = errObj.message || errObj.error || errorMessage;
    } else if (typeof responseData === "string" && responseData) {
      errorMessage = responseData;
    }

    throw new ApiError(
      errorMessage,
      response.status,
      responseData && typeof responseData === "object" ? (responseData as ApiErrorResponse) : undefined
    );
  }

  return responseData as T;
}

/**
 * Backend API Client
 * All paths match the Express router mounted at /api/v1/users
 */
export const backendApi = {
  /**
   * Health check / ping
   */
  async ping(): Promise<PingResponse> {
    return apiFetch<PingResponse>("/ping", { method: "GET" });
  },

  /**
   * Health check with latency measurement
   */
  async pingWithTiming(): Promise<{ response?: PingResponse; latencyMs: number; error?: string }> {
    const start = performance.now();
    try {
      const response = await this.ping();
      return { response, latencyMs: Math.round(performance.now() - start) };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to ping backend";
      return { latencyMs: Math.round(performance.now() - start), error: message };
    }
  },

  /**
   * Register a new user account.
   * Note: The Next.js route handler at /api/auth/register handles avatar (FormData)
   * by forwarding multipart directly to Express. This server-side method is only
   * used for non-avatar JSON registrations in server contexts.
   */
  async register(payload: { fullName: string; email: string; password: string }): Promise<ApiSuccessResponse> {
    return apiFetch<ApiSuccessResponse>("/api/v1/users/register", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Authenticate user with email and password
   */
  async login(credentials: { email: string; password: string }): Promise<ApiSuccessResponse & { token: string; user: User }> {
    return apiFetch<ApiSuccessResponse & { token: string; user: User }>("/api/v1/user/login", {
      method: "POST",
      body: credentials,
    });
  },

  /**
   * Get currently authenticated user profile
   */
  async getMe(token: string): Promise<ApiSuccessResponse & { user: User }> {
    return apiFetch<ApiSuccessResponse & { user: User }>("/api/v1/user/me", {
      method: "GET",
      token,
    });
  },

  /**
   * Verify email with OTP
   */
  async verifyEmail(payload: { email: string; otp: string }): Promise<ApiSuccessResponse & { token?: string; user?: User }> {
    return apiFetch<ApiSuccessResponse & { token?: string; user?: User }>("/api/v1/user/verify-email", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Resend email verification OTP
   */
  async resendVerificationOtp(payload: { email: string }): Promise<ApiSuccessResponse> {
    return apiFetch<ApiSuccessResponse>("/api/v1/user/resend-verification-otp", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Request password reset link
   */
  async forgotPassword(payload: { email: string }): Promise<ApiSuccessResponse> {
    return apiFetch<ApiSuccessResponse>("/api/v1/user/forget-password", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Reset password with reset token
   */
  async resetPassword(resetToken: string, payload: { password: string }): Promise<ApiSuccessResponse> {
    return apiFetch<ApiSuccessResponse>(`/api/v1/user/reset-password/${encodeURIComponent(resetToken)}`, {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Logout user (stateless on backend — JWT-based)
   */
  async logout(): Promise<ApiSuccessResponse> {
    return apiFetch<ApiSuccessResponse>("/api/v1/user/logout", {
      method: "GET",
    });
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(token: string, payload: { oldPassword: string; newPassword: string }): Promise<ApiSuccessResponse> {
    return apiFetch<ApiSuccessResponse>("/api/v1/user/change-password", {
      method: "POST",
      token,
      body: payload,
    });
  },
};
