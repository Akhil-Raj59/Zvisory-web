"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  developer: string;
  city: string;
  microMarket: string;
  category?: string;
  categories: string[];
  propertyType: string;
  startingPrice: string;
  priceNumeric: number | null;
  launchStatus: string;
  status: "draft" | "published" | "archived";
  cardBanner: string;
  bannerUrl: string;
  updatedAt: string;
}

interface StatusSummary {
  all: number;
  published: number;
  draft: number;
  archived: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [cityFilter, setCityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusSummary, setStatusSummary] = useState<StatusSummary>({ all: 0, published: 0, draft: 0, archived: 0 });

  // Master reference data
  const [cities, setCities] = useState<string[]>([]);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Seed state
  const [isSeedingDb, setIsSeedingDb] = useState(false);

  // Fetch reference data once
  useEffect(() => {
    async function loadRefData() {
      try {
        const res = await fetch("/api/admin/reference-data");
        const json = await res.json();
        if (json.success && json.data) {
          setCities(json.data.cities || []);
        }
      } catch (e) {
        console.error("Failed to load reference data", e);
      }
    }
    loadRefData();
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        status: statusFilter,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(cityFilter !== "All" ? { city: cityFilter } : {}),
      });

      const res = await fetch(`/api/admin/projects?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load projects");
      }

      setProjects(json.data || []);
      setTotal(json.total || 0);
      setTotalPages(json.totalPages || 1);
      if (json.statusSummary) {
        setStatusSummary(json.statusSummary);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading projects");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, cityFilter, search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle status toggle (publish/unpublish/archive)
  const handleStatusChange = async (id: string, newStatus: "draft" | "published" | "archived") => {
    try {
      const res = await fetch(`/api/admin/projects/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update status");
      }

      setSuccessMsg(`Project status changed to ${newStatus}`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchProjects();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  // Handle seed from Excel
  const handleSeedFromExcel = async () => {
    if (!confirm("Seed all projects from Excel JSON into MongoDB? Existing projects with the same slug will be updated.")) return;
    setIsSeedingDb(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projects/bulk-seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Seeding failed");
      }
      setSuccessMsg(`✓ Seeded ${json.insertedCount ?? 0} new + updated ${json.updatedCount ?? 0} projects.`);
      setTimeout(() => setSuccessMsg(null), 6000);
      fetchProjects();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Seeding failed");
    } finally {
      setIsSeedingDb(false);
    }
  };

  // Handle deletion
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectToDelete._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete project");
      }

      setSuccessMsg(`Project "${projectToDelete.title}" deleted.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Projects Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage real estate projects, media, pricing, specifications, and publication states.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSeedFromExcel}
            disabled={isSeedingDb}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSeedingDb ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Seeding...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Seed from Excel
              </>
            )}
          </button>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            <span>+</span>
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center justify-between">
          <span>✓ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-medium">
          ✕ {error}
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3 overflow-x-auto text-xs font-semibold">
        {(["all", "published", "draft", "archived"] as const).map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors capitalize flex items-center gap-1.5 ${
              statusFilter === st
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            }`}
          >
            <span>{st}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                statusFilter === st
                  ? "bg-slate-800 text-white dark:bg-zinc-200 dark:text-slate-900"
                  : "bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
              }`}
            >
              {statusSummary[st] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Secondary Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            placeholder="Search by title, developer, location, or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500 dark:text-zinc-400">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-2" />
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 dark:text-zinc-400">
            <p className="font-semibold text-slate-700 dark:text-zinc-200 text-base mb-1">
              No projects found
            </p>
            <p>Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-800/60 uppercase tracking-wider text-[10px] text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800 font-bold">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Location & Developer</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Launch Status</th>
                  <th className="py-3 px-4">Publication</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {projects.map((p) => {
                  const bannerImg =
                    p.cardBanner ||
                    p.bannerUrl ||
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80";

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* Project info & thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0 border border-slate-200 dark:border-zinc-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={bannerImg}
                              alt={p.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-0.5 max-w-[200px] sm:max-w-[280px]">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {p.title}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 truncate">
                              /{p.slug}
                            </div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              {p.categories?.join(", ") || "Luxury"} · {p.propertyType}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location & Developer */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-zinc-200">
                          {p.developer}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                          📍 {p.microMarket ? `${p.microMarket}, ${p.city}` : p.city}
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {p.startingPrice}
                        </div>
                        {p.priceNumeric ? (
                          <div className="text-[10px] text-slate-400 font-mono">
                            ₹{(p.priceNumeric / 10000000).toFixed(2)} Cr
                          </div>
                        ) : null}
                      </td>

                      {/* Launch Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {p.launchStatus}
                        </span>
                      </td>

                      {/* Publication Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={p.status}
                          onChange={(e) =>
                            handleStatusChange(
                              p._id,
                              e.target.value as "draft" | "published" | "archived"
                            )
                          }
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none transition-colors ${
                            p.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                              : p.status === "draft"
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                              : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors"
                            title="View Public Page"
                          >
                            ↗
                          </Link>
                          <Link
                            href={`/admin/projects/${p._id}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setProjectToDelete(p);
                              setDeleteModalOpen(true);
                            }}
                            className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <div>
            Showing <span className="font-semibold">{projects.length}</span> of{" "}
            <span className="font-semibold">{total}</span> total projects
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded-md border border-slate-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded-md border border-slate-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-zinc-800 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Project?
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900 dark:text-white">
                {projectToDelete.title}
              </strong>{" "}
              and all of its associated specifications, floor plans, and media references? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
