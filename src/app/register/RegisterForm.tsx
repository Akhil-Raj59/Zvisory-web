"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export function RegisterForm() {
  const router = useRouter();

  // Public registration always creates CUSTOMER accounts.
  // Role is set server-side; we never expose a role picker to the public.
  const role = "CUSTOMER" as const;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isUnverifiedConflict, setIsUnverifiedConflict] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): string | null {
    const trimmedName = fullName.trim();
    if (!trimmedName || !email.trim() || !password || !confirmPassword) {
      return "All required fields must be completed";
    }

    if (trimmedName.length < 5 || trimmedName.length > 50) {
      return "Full name must be between 5 and 50 characters";
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return "Please enter a valid email address";
    }

    if (!phone.trim()) {
      return "Phone number is required";
    }
    if (phone.trim().length < 10) {
      return "Please enter a valid mobile phone number";
    }

    if (password.length < 6 || password.length > 64) {
      return "Password must be between 6 and 64 characters";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsUnverifiedConflict(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("role", role);
      formData.append("phoneNumber", phone.trim());

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (
          res.status === 409 &&
          typeof data.message === "string" &&
          data.message.toLowerCase().includes("not verified")
        ) {
          setIsUnverifiedConflict(true);
        }
        throw new Error(data.message || "Registration failed");
      }

      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg p-8 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D3A479] text-[#124446] font-black text-lg flex items-center justify-center">
            Z
          </div>
          <span className="text-2xl font-black text-[#124446]">Zvisory</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Create Account</h1>
        <p className="text-xs text-slate-500">
          Join the Zvisory Real Estate Advisory Platform
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
          <div>{error}</div>
          {isUnverifiedConflict && (
            <div className="font-bold underline">
              <Link href={`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`}>
                Go to Email OTP Verification →
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Full Name */}
        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446] focus:outline-none"
            placeholder="e.g. Vikram Sharma"
            disabled={isLoading}
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446] focus:outline-none"
            placeholder="e.g. vikram@example.com"
            disabled={isLoading}
          />
        </div>

        {/* Mobile Phone Number */}
        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Mobile Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446] focus:outline-none"
            placeholder="e.g. +91 98765 43210"
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446] focus:outline-none"
              placeholder="Min 6 characters"
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

        {/* Confirm Password */}
        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446] focus:outline-none"
              placeholder="Re-enter password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[11px]"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 space-y-2 pt-2">
        <div>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#124446] hover:underline">
            Sign In
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
