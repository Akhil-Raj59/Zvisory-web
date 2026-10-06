"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email") || "";

  // Derive initial value from URL query parameter without redundant effect
  const [userTypedEmail, setUserTypedEmail] = useState<string | null>(null);
  const email = userTypedEmail !== null ? userTypedEmail : queryEmail;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Successfully verified. Redirect user to login with verified banner
      router.push("/login?verified=true");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    if (!email.trim()) {
      setError("Please provide your email address to resend OTP");
      return;
    }

    if (cooldown > 0) return;

    setError(null);
    setInfo(null);
    setIsResending(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setInfo(data.message || "A new 6-digit OTP has been sent to your email.");
      // Start 60-second cooldown timer
      setCooldown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend OTP";
      setError(msg);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Verify Email</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Enter the 6-digit code sent to your email address
        </p>
      </div>

      {info && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm">
          {info}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setUserTypedEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 text-sm"
            placeholder="user@example.com"
            disabled={isLoading || isResending}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
            6-Digit Verification Code (OTP)
          </label>
          <input
            type="text"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 text-sm font-mono tracking-widest text-center"
            placeholder="123456"
            disabled={isLoading || isResending}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || isResending || otp.length !== 6}
          className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading || isResending || cooldown > 0}
            className="w-full py-2 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending
              ? "Resending Code..."
              : cooldown > 0
              ? `Resend Code in ${cooldown}s`
              : "Resend Verification Code"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
        <div>
          Already verified?{" "}
          <Link href="/login" className="font-medium text-zinc-900 dark:text-zinc-100 underline">
            Sign In
          </Link>
        </div>
        <div>
          <Link href="/" className="hover:underline">
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
