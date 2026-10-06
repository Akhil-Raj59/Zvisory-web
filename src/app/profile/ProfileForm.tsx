"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/lib/api";

interface ProfileFormProps {
  initialUser: User;
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const [user, setUser] = useState<User>(initialUser);
  const [fullName, setFullName] = useState(initialUser.fullName);
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
  const initials = user.fullName.slice(0, 2).toUpperCase();

  return (
    <div className="w-full max-w-lg p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Update your name and profile photo
        </p>
      </div>

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Read-only account info */}
      <div className="mb-6 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">Email</span>
          <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{user.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">Role</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            {user.role}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">Email Verified</span>
          <span className={`text-xs font-medium ${user.isEmailVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {user.isEmailVerified ? "Yes" : "No"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3">
            Profile Photo
          </label>
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
              {displayAvatarUrl ? (
                <Image
                  src={displayAvatarUrl}
                  alt={user.fullName}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-bold text-zinc-400">{initials}</span>
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
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline disabled:opacity-50"
              >
                {avatar ? "Change photo" : (displayAvatarUrl ? "Replace photo" : "Upload photo")}
              </button>
              {avatar && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => { setAvatar(null); setAvatarPreview(null); }}
                    disabled={isLoading}
                    className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
              <p className="text-[11px] text-zinc-400 mt-1">Max 5 MB · JPG, PNG, WebP</p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
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
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 text-sm"
            disabled={isLoading}
          />
          <p className="text-[11px] text-zinc-400 mt-1">5–50 characters</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          {isLoading ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/change-password" className="font-medium text-zinc-700 dark:text-zinc-300 hover:underline">
          Change Password
        </Link>
        <Link href="/" className="hover:underline">
          &larr; Return to Home
        </Link>
      </div>
    </div>
  );
}
