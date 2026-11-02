"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { TransferDeveloperModal } from "@/components/admin/developer/TransferDeveloperModal";
import { DeleteDeveloperModal } from "@/components/admin/developer/DeleteDeveloperModal";

interface DeveloperItem {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  shortDescription: string;
  headquarters: string;
  website: string;
  projectCount: number;
  publishedProjectsCount: number;
  draftProjectsCount: number;
  status: "published" | "draft" | "archived";
  updatedAt: string;
  createdAt: string;
}

interface StatusSummary {
  all: number;
  published: number;
  draft: number;
  archived: number;
}

const STATUS_PILL: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  archived: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState<DeveloperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusSummary, setStatusSummary] = useState<StatusSummary>({
    all: 0, published: 0, draft: 0, archived: 0,
  });

  // Modal states
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [devForTransfer, setDevForTransfer] = useState<DeveloperItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [devToDelete, setDevToDelete] = useState<DeveloperItem | null>(null);

  const fetchDevelopers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        status: statusFilter,
        sort: sortBy,
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      const res = await fetch(`/api/admin/developers?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load developers");
      }

      setDevelopers(json.data || []);
      setTotal(json.total || 0);
      setTotalPages(json.totalPages || 1);
      if (json.statusSummary) setStatusSummary(json.statusSummary);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading developers");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sortBy, search]);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  const handleStatusChange = async (id: string, newStatus: "draft" | "published" | "archived") => {
    try {
      const res = await fetch(`/api/admin/developers/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to update status");
      setSuccessMsg("Status updated successfully");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchDevelopers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Developer Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage real estate developers, their profiles, and project associations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/developers/new"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>+</span> Create Developer
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold">✕</button>
        </div>
      )}

      {/* Filters & Status Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: "all", label: "All Developers", count: statusSummary.all },
            { id: "published", label: "Published", count: statusSummary.published },
            { id: "draft", label: "Draft", count: statusSummary.draft },
            { id: "archived", label: "Archived", count: statusSummary.archived },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setStatusFilter(tab.id as "all" | "published" | "draft" | "archived"); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-2.5 text-zinc-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by developer name, slug, or headquarters..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name_asc">Sort: Name (A–Z)</option>
              <option value="name_desc">Sort: Name (Z–A)</option>
              <option value="projects_desc">Sort: Most Projects</option>
              <option value="projects_asc">Sort: Fewest Projects</option>
            </select>
            <button
              onClick={() => fetchDevelopers()}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Refresh"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Developers Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-500 space-y-3">
            <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p>Loading developers...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-rose-600 dark:text-rose-400 space-y-3">
            <p>⚠️ {error}</p>
            <button
              onClick={() => fetchDevelopers()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
            >
              Retry
            </button>
          </div>
        ) : developers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <span className="text-3xl">🏗️</span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">No developers found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {search || statusFilter !== "all"
                ? "Try adjusting your search query or status filter."
                : "No developers have been registered yet. Create your first developer to get started."}
            </p>
            <Link
              href="/admin/developers/new"
              className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              + Create Developer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Developer</th>
                  <th className="py-3 px-4">Slug / HQ</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {developers.map((dev) => (
                  <tr
                    key={dev._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* Developer Info & Logo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                          {dev.logo ? (
                            <Image
                              src={dev.logo}
                              alt={dev.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                              🏗️
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/developers/${dev._id}`}
                            className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors"
                          >
                            {dev.name}
                          </Link>
                          {dev.shortDescription && (
                            <div className="text-[11px] text-zinc-500 max-w-[200px] truncate">
                              {dev.shortDescription}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug & HQ */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{dev.slug}</div>
                      {dev.headquarters && (
                        <div className="text-[11px] text-zinc-500">{dev.headquarters}</div>
                      )}
                    </td>

                    {/* Associated Projects Count */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tabular-nums text-zinc-900 dark:text-zinc-100">
                          {dev.projectCount}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          ({dev.publishedProjectsCount ?? 0} pub / {dev.draftProjectsCount ?? 0} draft)
                        </span>
                      </div>
                    </td>

                    {/* Status Pill & Quick Change */}
                    <td className="py-3.5 px-4">
                      <select
                        value={dev.status}
                        onChange={(e) =>
                          handleStatusChange(dev._id, e.target.value as "draft" | "published" | "archived")
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer ${
                          STATUS_PILL[dev.status] || STATUS_PILL.draft
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/developers/${dev._id}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/developers/${dev._id}/edit`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setDevForTransfer(dev); setTransferModalOpen(true); }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 transition-colors"
                        >
                          Transfer
                        </button>
                        <button
                          type="button"
                          onClick={() => { setDevToDelete(dev); setDeleteModalOpen(true); }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
            <span>
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} developers
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 font-bold text-zinc-800 dark:text-zinc-200">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Projects Modal */}
      {devForTransfer && (
        <TransferDeveloperModal
          isOpen={transferModalOpen}
          onClose={() => { setTransferModalOpen(false); setDevForTransfer(null); }}
          sourceDeveloper={devForTransfer}
          availableDevelopers={developers}
          onTransferSuccess={() => {
            setSuccessMsg("Projects transferred successfully!");
            fetchDevelopers();
          }}
        />
      )}

      {/* Delete Developer Modal */}
      {devToDelete && (
        <DeleteDeveloperModal
          isOpen={deleteModalOpen}
          onClose={() => { setDeleteModalOpen(false); setDevToDelete(null); }}
          developer={devToDelete}
          onDeleteSuccess={() => {
            setSuccessMsg("Developer deleted successfully.");
            fetchDevelopers();
          }}
          onRequestTransfer={() => {
            setDevForTransfer(devToDelete);
            setTransferModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
