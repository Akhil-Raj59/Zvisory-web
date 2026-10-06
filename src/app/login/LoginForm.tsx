"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnverified, setIsUnverified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsUnverified(false);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (
          res.status === 403 ||
          (typeof data.message === "string" && data.message.toLowerCase().includes("verify your email"))
        ) {
          setIsUnverified(true);
        }
        throw new Error(data.message || "Failed to log in");
      }

      // Role-based post-login redirect across 3 roles
      const role = (data.user?.role ?? "CUSTOMER").toUpperCase();

      if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (role === "EMPLOYEE") {
        router.push("/dashboard/employee");
      } else {
        // Customer / Custumer
        router.push("/dashboard/customer");
      }

      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D3A479] text-[#124446] font-black text-lg flex items-center justify-center">
            Z
          </div>
          <span className="text-2xl font-black text-[#124446]">Zvisory</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Sign In</h1>
        <p className="text-xs text-slate-500">
          Access your Zvisory role dashboard &amp; saved properties
        </p>
      </div>

      {verified && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          ✓ Your email has been verified successfully. Please log in below.
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
          <div>{error}</div>
          {isUnverified && (
            <div className="font-bold underline">
              <Link href={`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`}>
                Click here to verify your email →
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label htmlFor="email" className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446]"
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block font-semibold uppercase tracking-wider text-slate-600">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-[#124446] font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446]"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[11px]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
        >
          {isLoading ? "Signing In..." : "Sign In to Dashboard"}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 space-y-2 pt-2">
        <div>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-[#124446] hover:underline">
            Create Account
          </Link>
        </div>
        <div>
          <Link href="/" className="hover:underline">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
