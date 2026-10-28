import type { Metadata } from "next";
import Image from "next/image";
import { getCurrentUser, getAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { backendApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Dashboard Overview | Zvisory Admin",
  robots: {
    index: false,
    follow: false,
  },
};

interface StatsData {
  projects: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    featured: number;
  };
  cities: number;
  cityStats?: {
    total: number;
    published: number;
    distinctInProjects: number;
  };
  projectsByCity?: Array<{ _id: string; total: number; published: number }>;
  developers: number;
  recentProjects: Array<{
    _id: string;
    title: string;
    slug: string;
    status: string;
    launchStatus: string;
    updatedAt: string;
    city: string;
    developer: string;
    cardBanner?: string;
  }>;
}

async function getAdminStats(token: string): Promise<StatsData | null> {
  try {
    const res = await backendApi.adminGetStats(token);
    if (res?.success && res.data) return res.data as StatsData;
    return null;
  } catch {
    return null;
  }
}

const STATUS_PILL: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  archived: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const token = await getAuthToken();
  const stats = token ? await getAdminStats(token) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Welcome back, {user.fullName}. Real-time statistics across projects and city modules.
        </p>
      </div>

      {/* Stats Grid */}
      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Projects", value: stats.projects.total, color: "text-zinc-900 dark:text-zinc-100" },
            { label: "Published", value: stats.projects.published, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Draft Projects", value: stats.projects.draft, color: "text-amber-600 dark:text-amber-400" },
            { label: "Archived Projects", value: stats.projects.archived, color: "text-zinc-500 dark:text-zinc-400" },
            { label: "Total Cities", value: stats.cityStats?.total ?? stats.cities, color: "text-sky-600 dark:text-sky-400" },
            { label: "Published Cities", value: stats.cityStats?.published ?? stats.cities, color: "text-indigo-600 dark:text-indigo-400" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col gap-1"
            >
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
              <span className={`text-3xl font-bold tabular-nums ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 text-sm text-amber-800 dark:text-amber-300">
          ⚠️ Could not load live stats — backend may be offline or database is empty.
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <span>📁</span> All Projects
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>+</span> New Project
          </Link>
          <Link
            href="/admin/cities"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <span>🏙️</span> City Management
          </Link>
          <Link
            href="/admin/cities/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>+</span> New City
          </Link>
        </div>
      </div>

      {/* Projects by City Distribution */}
      {stats?.projectsByCity && stats.projectsByCity.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>🏙️</span> Projects Grouped by City
            </h2>
            <Link
              href="/admin/cities"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Manage all cities →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.projectsByCity.map((c) => (
              <div
                key={c._id}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 block">
                    {c._id || "Unknown"}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {c.published} published
                  </span>
                </div>
                <span className="text-base font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                  {c.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects */}
      {stats?.recentProjects && stats.recentProjects.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recently Updated Projects</h2>
            <Link href="/admin/projects" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {stats.recentProjects.map((p) => (
              <div key={p._id} className="flex items-center gap-4 px-6 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                {p.cardBanner ? (
                  <div className="relative h-10 w-16 rounded overflow-hidden flex-shrink-0 bg-zinc-100">
                    <Image src={p.cardBanner} alt={p.title} fill sizes="64px" className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="h-10 w-16 rounded flex-shrink-0 bg-zinc-200 dark:bg-zinc-700" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{p.developer} · {p.city}</p>
                </div>
                <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_PILL[p.status] || STATUS_PILL.archived}`}>
                  {p.status}
                </span>
                <Link
                  href={`/admin/projects/${p._id}`}
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline flex-shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

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
