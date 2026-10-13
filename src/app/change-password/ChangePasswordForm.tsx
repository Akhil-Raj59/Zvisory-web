"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FieldErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export function ChangePasswordForm() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (!oldPassword) {
      errors.oldPassword = "Current password is required";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    } else if (newPassword.length > 64) {
      errors.newPassword = "New password must not exceed 64 characters";
    } else if (oldPassword && oldPassword === newPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    if (!confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password";
    } else if (newPassword && newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "New passwords do not match";
    }

    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Session expired — redirect to login
          router.push("/login?from=/change-password");
          return;
        }

        const msg = data.message || "Failed to change password";
        if (msg.toLowerCase().includes("old password")) {
          setFieldErrors((prev) => ({
            ...prev,
            oldPassword: msg,
          }));
        }
        throw new Error(msg);
      }

      setSuccess(data.message || "Password changed successfully.");
      setFieldErrors({});
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
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
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D3A479] text-[#124446] font-black text-lg flex items-center justify-center">
            Z
          </div>
          <span className="text-2xl font-black text-[#124446]">Zvisory</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Change Password</h1>
        <p className="text-xs text-slate-500">
          Update your secure login credentials
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
          ✕ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Current Password */}
        <div>
          <label
            htmlFor="oldPassword"
            className="block font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              type={showOld ? "text" : "password"}
              required
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                if (fieldErrors.oldPassword) {
                  setFieldErrors((prev) => ({ ...prev, oldPassword: undefined }));
                }
              }}
              className={`w-full px-3.5 py-2.5 pr-12 rounded-xl border text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446] text-xs ${
                fieldErrors.oldPassword ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
              }`}
              placeholder="Enter current password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowOld((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px] font-medium"
              tabIndex={-1}
              aria-label={showOld ? "Hide password" : "Show password"}
            >
              {showOld ? "Hide" : "Show"}
            </button>
          </div>
          {fieldErrors.oldPassword && (
            <p className="text-[11px] text-red-600 mt-1 font-semibold">{fieldErrors.oldPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="block font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNew ? "text" : "password"}
              required
              minLength={6}
              maxLength={64}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (fieldErrors.newPassword) {
                  setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                }
              }}
              className={`w-full px-3.5 py-2.5 pr-12 rounded-xl border text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446] text-xs ${
                fieldErrors.newPassword ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
              }`}
              placeholder="At least 6 characters"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px] font-medium"
              tabIndex={-1}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
          {fieldErrors.newPassword && (
            <p className="text-[11px] text-red-600 mt-1 font-semibold">{fieldErrors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type={showConfirm ? "text" : "password"}
              required
              minLength={6}
              maxLength={64}
              autoComplete="new-password"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
                if (fieldErrors.confirmNewPassword) {
                  setFieldErrors((prev) => ({ ...prev, confirmNewPassword: undefined }));
                }
              }}
              className={`w-full px-3.5 py-2.5 pr-12 rounded-xl border text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446] text-xs ${
                fieldErrors.confirmNewPassword ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
              }`}
              placeholder="Re-enter new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px] font-medium"
              tabIndex={-1}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {fieldErrors.confirmNewPassword && (
            <p className="text-[11px] text-red-600 mt-1 font-semibold">{fieldErrors.confirmNewPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Updating Password..." : "Update Password"}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <Link href="/profile" className="font-bold text-[#124446] hover:underline">
          ← Back to Profile
        </Link>
        <Link href="/" className="hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
