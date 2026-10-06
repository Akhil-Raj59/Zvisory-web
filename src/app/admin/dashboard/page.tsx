import type { Metadata } from "next";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard Overview | Zvisory Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  // Auth is already enforced by admin/layout.tsx — this is just for user data
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Welcome back, {user.fullName}.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Your Profile</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Session authenticated via <code className="font-mono text-xs">GET /api/v1/users/me</code>
            </p>
          </div>
          <Link
            href="/profile"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
          >
            Edit Profile
          </Link>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            {user.avatar?.secure_url ? (
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 shrink-0">
                <Image
                  src={user.avatar.secure_url}
                  alt={user.fullName}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                {user.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold">{user.fullName}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {user.role}
                </span>
                {user.isEmailVerified ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">{user.email}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">ID: {user._id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Account Created</div>
              <div className="text-sm font-semibold mt-1">
                {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Last Updated</div>
              <div className="text-sm font-semibold mt-1">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Edit Profile
            </Link>
            <Link
              href="/change-password"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Change Password
            </Link>
          </div>
        </div>
      </div>

      {/* Security info */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-base font-semibold">Security State</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Session token stored in an <strong className="text-zinc-900 dark:text-zinc-100">httpOnly</strong>, <strong className="text-zinc-900 dark:text-zinc-100">secure</strong> cookie — inaccessible to client JavaScript.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Search engines: page configured with <strong className="text-zinc-900 dark:text-zinc-100">noindex, nofollow</strong>.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Role authorization verified server-side via <code className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">isAdminRole()</code>.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
