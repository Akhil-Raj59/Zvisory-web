"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Developer {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  shortDescription: string;
  description: string;
  website: string;
  headquarters: string;
  status: "published" | "draft" | "archived";
  projectStats: { total: number; published: number; draft: number; archived: number };
  totalProjects: number;
  recentProjects: Array<{
    _id: string;
    title: string;
    slug: string;
    city: string;
    status: string;
    startingPrice: string;
    cardBanner: string;
    launchStatus: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const STATUS_PILL: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  archived: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function DeveloperDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/developers/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Not found");
        setDeveloper(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load developer");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleStatusChange = async (newStatus: "draft" | "published" | "archived") => {
    if (!developer) return;
    try {
      const res = await fetch(`/api/admin/developers/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setDeveloper((d) => d ? { ...d, status: newStatus } : d);
      setSuccessMsg("Status updated");
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-16">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !developer) return (
    <div className="p-8 text-center text-rose-600 text-sm space-y-3">
      <p>⚠️ {error || "Developer not found"}</p>
      <button onClick={() => router.push("/admin/developers")} className="px-4 py-2 rounded-xl text-xs bg-zinc-100 hover:bg-zinc-200">← Back</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/developers" className="hover:text-zinc-700 transition-colors">Developers</Link>
            <span>/</span>
            <span>{developer.name}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{developer.name}</h1>
          {developer.shortDescription && (
            <p className="text-sm text-zinc-500 mt-1 max-w-xl">{developer.shortDescription}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={developer.status}
            onChange={(e) => handleStatusChange(e.target.value as "draft" | "published" | "archived")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer ${STATUS_PILL[developer.status]}`}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <Link
            href={`/admin/developers/${id}/edit`}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Edit Developer
          </Link>
          <Link
            href="/admin/developers"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300">
          ✅ {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-start gap-4">
              {developer.logo && (
                <div className="relative w-20 h-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 shrink-0 overflow-hidden">
                  <Image src={developer.logo} alt={developer.name} fill className="object-contain p-2" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    /{developer.slug}
                  </span>
                  {developer.headquarters && (
                    <span className="text-xs text-zinc-500">📍 {developer.headquarters}</span>
                  )}
                  {developer.website && (
                    <a href={developer.website} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline">
                      🌐 Website ↗
                    </a>
                  )}
                </div>
                {developer.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                    {developer.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Recent Projects</h2>
              <Link
                href={`/admin/developers/${id}/projects`}
                className="text-xs text-emerald-600 hover:underline"
              >
                View all {developer.totalProjects} →
              </Link>
            </div>

            {developer.recentProjects.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">No projects associated with this developer yet.</p>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {developer.recentProjects.map((project) => (
                  <div key={project._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors truncate block"
                      >
                        {project.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                        <span>{project.city}</span>
                        <span>·</span>
                        <span>{project.startingPrice}</span>
                        <span>·</span>
                        <span>{project.launchStatus}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_PILL[project.status] || ""}`}>
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Stats & Meta */}
        <div className="space-y-5">
          {/* Project Stats */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
            <h2 className="text-sm font-bold">Project Stats</h2>
            {[
              { label: "Total Projects", value: developer.totalProjects, color: "text-zinc-900 dark:text-zinc-100" },
              { label: "Published", value: developer.projectStats?.published ?? 0, color: "text-emerald-700" },
              { label: "Draft", value: developer.projectStats?.draft ?? 0, color: "text-amber-700" },
              { label: "Archived", value: developer.projectStats?.archived ?? 0, color: "text-zinc-500" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{stat.label}</span>
                <span className={`font-bold text-sm tabular-nums ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Metadata */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
            <h2 className="text-sm font-bold">Metadata</h2>
            {[
              { label: "Created", value: new Date(developer.createdAt).toLocaleDateString("en-IN") },
              { label: "Updated", value: new Date(developer.updatedAt).toLocaleDateString("en-IN") },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{item.label}</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-2">
            <h2 className="text-sm font-bold mb-3">Quick Actions</h2>
            <Link
              href={`/admin/developers/${id}/edit`}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 transition-colors"
            >
              ✏️ Edit Developer Profile
            </Link>
            <Link
              href={`/admin/developers/${id}/projects`}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 transition-colors"
            >
              📁 View All Projects ({developer.totalProjects})
            </Link>
            <Link
              href={`/admin/projects/new`}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 transition-colors"
            >
              + Create New Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
