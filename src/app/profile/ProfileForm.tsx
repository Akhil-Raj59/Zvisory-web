"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";

interface ProfileFormProps {
  initialUser: User;
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const { setUser: setGlobalUser } = useAuth();
  const [user, setUser] = useState<User>(initialUser);
  const [fullName, setFullName] = useState(initialUser.fullName || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Avatar must be an image file (JPG, PNG, WebP, etc.)");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError("Full name is required");
      return;
    }

    if (trimmedName.length < 5 || trimmedName.length > 50) {
      setError("Full name must be between 5 and 50 characters");
      return;
    }

    // Skip if nothing changed
    if (trimmedName === user.fullName && !avatar) {
      setSuccess("No changes to save.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", trimmedName);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = data.user as User;
      if (updatedUser) {
        setUser(updatedUser);
        setFullName(updatedUser.fullName);
        // Sync with global auth state so Navbar updates instantly
        setGlobalUser(updatedUser);
      }

      setAvatar(null);
      setAvatarPreview(null);
      setSuccess(data.message || "Profile updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const displayAvatarUrl = avatarPreview ?? user.avatar?.secure_url ?? null;
  const initials = (user.fullName || "User").slice(0, 2).toUpperCase();

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="w-full max-w-lg p-8 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D3A479] text-[#124446] font-black text-lg flex items-center justify-center">
            Z
          </div>
          <span className="text-2xl font-black text-[#124446]">Zvisory</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Your Account Profile</h1>
        <p className="text-xs text-slate-500">
          Manage your verified account credentials and personal details
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

      {/* Account Info Card */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Email Address</span>
          <span className="font-mono text-slate-800 font-semibold">{user.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Assigned Role</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#124446] text-white">
            {user.role || "CUSTOMER"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Phone Number</span>
          <span className="text-slate-700 font-medium">
            {(user as unknown as { phoneNumber?: string }).phoneNumber || "Not provided"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Email Verified</span>
          <span className={`font-bold ${user.isEmailVerified ? "text-emerald-700" : "text-amber-600"}`}>
            {user.isEmailVerified ? "✓ Verified" : "⚠ Pending Verification"}
          </span>
        </div>
        {formattedDate && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Member Since</span>
            <span className="text-slate-600">{formattedDate}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Avatar */}
        <div>
          <label className="block font-bold uppercase tracking-wider text-slate-600 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center">
              {displayAvatarUrl &&
              displayAvatarUrl !==
                "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg" ? (
                <Image
                  src={displayAvatarUrl}
                  alt={user.fullName || "User Avatar"}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <span className="text-xl font-black text-[#124446]">{initials}</span>
              )}
            </div>
            <div>
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
                className="text-xs font-bold text-[#124446] hover:underline disabled:opacity-50 cursor-pointer"
              >
                {avatar ? "Change selected photo" : "Upload / Replace photo"}
              </button>
              {avatar && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar(null);
                      setAvatarPreview(null);
                    }}
                    disabled={isLoading}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}
              <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP · Max 5 MB</p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            minLength={5}
            maxLength={50}
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446] text-xs"
            disabled={isLoading}
          />
          <p className="text-[10px] text-slate-400 mt-1">5–50 characters</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Saving changes..." : "Save Profile Changes"}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <Link href="/change-password" className="font-bold text-[#124446] hover:underline">
          Change Password →
        </Link>
        <Link href="/" className="hover:underline">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}
