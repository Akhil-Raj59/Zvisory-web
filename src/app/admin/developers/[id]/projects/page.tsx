"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  slug: string;
  city: string;
  startingPrice: string;
  status: string;
  launchStatus: string;
  categories: string[];
  updatedAt: string;
}

const STATUS_PILL: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  archived: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function DeveloperProjectsPage() {
  const { id } = useParams<{ id: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [developer, setDeveloper] = useState<{ name: string; slug: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15", status: statusFilter });
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/developers/${id}/projects?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to load projects");
      setProjects(json.data || []);
      setTotal(json.total || 0);
      setTotalPages(json.totalPages || 1);
      if (json.developer) setDeveloper(json.developer);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [id, page, statusFilter, search]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/developers" className="hover:text-zinc-700 transition-colors">Developers</Link>
            <span>/</span>
            {developer && (
              <>
                <Link href={`/admin/developers/${id}`} className="hover:text-zinc-700 transition-colors">{developer.name}</Link>
                <span>/</span>
              </>
            )}
            <span>Projects</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {developer ? `${developer.name} — Projects` : "Developer Projects"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">{total} total projects</p>
        </div>
        <Link
          href={`/admin/developers/${id}`}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
        >
          ← Back to Developer
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search projects..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-sm">
            <div className="inline-block w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 text-sm">⚠️ {error}</div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 text-sm">No projects found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Launch Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {projects.map((proj) => (
                <tr key={proj._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{proj.title}</div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{proj.slug}</div>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{proj.city}</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">{proj.startingPrice}</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{proj.launchStatus}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_PILL[proj.status] || ""}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/projects/${proj._id}`}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
            <span>{(page - 1) * 15 + 1}–{Math.min(page * 15, total)} of {total}</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-100">Previous</button>
              <span className="px-3 py-1.5 font-bold">{page}/{totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-100">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
