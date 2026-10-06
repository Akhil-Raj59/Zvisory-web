"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export function RegisterForm() {
  const router = useRouter();

  // Role Selection: CUSTOMER vs EMPLOYEE vs ADMIN
  const [role, setRole] = useState<"CUSTOMER" | "EMPLOYEE" | "ADMIN">("CUSTOMER");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isUnverifiedConflict, setIsUnverifiedConflict] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Avatar must be an image file (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar file size must be under 5 MB");
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
  }

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

    // Phone number validation for Customer and Employee ONLY
    if (role !== "ADMIN") {
      if (!phone.trim()) {
        return "Phone number is required for Customer / Employee registration";
      }
      if (phone.trim().length < 10) {
        return "Please enter a valid mobile phone number";
      }
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

      // Only append phoneNumber if role is CUSTOMER or EMPLOYEE (omitted for ADMIN!)
      if (role !== "ADMIN" && phone.trim()) {
        formData.append("phoneNumber", phone.trim());
      }

      if (avatar) {
        formData.append("avatar", avatar);
      }

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

      {/* Role Selector Tabs (Customer vs Employee vs Admin) */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
          Register As
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole("CUSTOMER")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              role === "CUSTOMER"
                ? "bg-[#124446] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("EMPLOYEE")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              role === "EMPLOYEE"
                ? "bg-[#124446] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setRole("ADMIN")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              role === "ADMIN"
                ? "bg-[#124446] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Admin
          </button>
        </div>
        {role === "ADMIN" && (
          <p className="text-[11px] text-[#124446] font-semibold text-center mt-1">
            ℹ️ Admin registration mode (Phone number field omitted as per client specification)
          </p>
        )}
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
        {/* Avatar Upload */}
        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Profile Avatar <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-[#124446] bg-slate-100 shrink-0 flex items-center justify-center">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <span className="text-lg font-bold text-[#124446]">
                  {fullName ? fullName.slice(0, 1).toUpperCase() : "?"}
                </span>
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="font-bold text-[#124446] hover:underline"
              >
                {avatar ? "Change Photo" : "Upload Photo"}
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatar(null);
                    setAvatarPreview(null);
                  }}
                  disabled={isLoading}
                  className="ml-3 text-red-500 font-medium hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

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
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446]"
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
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446]"
            placeholder="e.g. vikram@example.com"
            disabled={isLoading}
          />
        </div>

        {/* Phone Number Input (DISPLAYED ONLY FOR CUSTOMER & EMPLOYEE - HIDDEN FOR ADMIN) */}
        {role !== "ADMIN" && (
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Mobile Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446]"
              placeholder="e.g. +91 98765 43210"
              disabled={isLoading}
            />
          </div>
        )}

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
              className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446]"
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
              className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#124446]"
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
          {isLoading ? "Creating Account..." : `Register as ${role.toLowerCase()}`}
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
