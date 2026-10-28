"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { TransferProjectsModal } from "@/components/admin/city/TransferProjectsModal";
import { DeleteCityModal } from "@/components/admin/city/DeleteCityModal";

interface CityItem {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  image: string;
  coverImage?: string;
  startingPrice: string;
  projectCount: number;
  publishedProjectsCount: number;
  draftProjectsCount: number;
  status: "published" | "draft" | "archived";
  isFeatured: boolean;
  updatedAt: string;
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

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityItem[]>([]);
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
    all: 0,
    published: 0,
    draft: 0,
    archived: 0,
  });

  // Modal states
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [cityForTransfer, setCityForTransfer] = useState<CityItem | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<CityItem | null>(null);

  const fetchCities = useCallback(async () => {
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

      const res = await fetch(`/api/admin/cities?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load cities");
      }

      setCities(json.data || []);
      setTotal(json.total || 0);
      setTotalPages(json.totalPages || 1);
      if (json.statusSummary) {
        setStatusSummary(json.statusSummary);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading cities");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sortBy, search]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Handle status quick toggle
  const handleStatusChange = async (id: string, newStatus: "draft" | "published" | "archived") => {
    try {
      const res = await fetch(`/api/admin/cities/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update status");
      }
      setSuccessMsg("Status updated successfully");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchCities();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">City Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage metropolitan locations, highlights, SEO metadata, and project assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/cities/new"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>+</span> Create City
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Filters & Status Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: "all", label: "All Cities", count: statusSummary.all },
            { id: "published", label: "Published", count: statusSummary.published },
            { id: "draft", label: "Draft", count: statusSummary.draft },
            { id: "archived", label: "Archived", count: statusSummary.archived },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id as any);
                setPage(1);
              }}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by city name, state, or slug..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
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
              onClick={() => fetchCities()}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Refresh"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Cities Table / Cards */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-500 space-y-3">
            <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p>Loading registered cities...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-rose-600 dark:text-rose-400 space-y-3">
            <p>⚠️ {error}</p>
            <button
              onClick={() => fetchCities()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
            >
              Retry
            </button>
          </div>
        ) : cities.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <span className="text-3xl">🏙️</span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">No cities found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {search || statusFilter !== "all"
                ? "Try adjusting your search query or status filter."
                : "No cities have been registered yet. Create your first city to get started."}
            </p>
            <Link
              href="/admin/cities/new"
              className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              + Create City
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Slug / Region</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {cities.map((city) => (
                  <tr
                    key={city._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* City Info & Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                          {city.image || city.coverImage ? (
                            <Image
                              src={city.image || city.coverImage || ""}
                              alt={city.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                              🏙️
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/cities/${city._id || city.slug}`}
                            className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors"
                          >
                            {city.name}
                          </Link>
                          <div className="text-[11px] text-zinc-500">
                            {city.startingPrice || "Price On Request"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Slug & Region */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {city.slug}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {[city.state, city.country].filter(Boolean).join(", ") || "—"}
                      </div>
                    </td>

                    {/* Associated Projects Count Badge */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tabular-nums text-zinc-900 dark:text-zinc-100">
                          {city.projectCount}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          ({city.publishedProjectsCount ?? 0} pub / {city.draftProjectsCount ?? 0} draft)
                        </span>
                      </div>
                    </td>

                    {/* Status Pill & Quick Change */}
                    <td className="py-3.5 px-4">
                      <select
                        value={city.status}
                        onChange={(e) =>
                          handleStatusChange(
                            city._id,
                            e.target.value as "draft" | "published" | "archived"
                          )
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer ${
                          STATUS_PILL[city.status] || STATUS_PILL.draft
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    {/* Featured Status */}
                    <td className="py-3.5 px-4">
                      {city.isFeatured ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/cities/${city._id || city.slug}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                          title="View Details & Associated Projects"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/cities/${city._id || city.slug}/edit`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-950 transition-colors"
                          title="Edit City"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setCityForTransfer(city);
                            setTransferModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-950 transition-colors"
                          title="Transfer Projects"
                        >
                          Transfer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCityToDelete(city);
                            setDeleteModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-950 transition-colors"
                          title="Delete City"
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

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
            <span>
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} cities
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
      {cityForTransfer && (
        <TransferProjectsModal
          isOpen={transferModalOpen}
          onClose={() => {
            setTransferModalOpen(false);
            setCityForTransfer(null);
          }}
          sourceCity={cityForTransfer}
          availableCities={cities}
          onTransferSuccess={() => {
            setSuccessMsg("Projects transferred successfully!");
            fetchCities();
          }}
        />
      )}

      {/* Delete City Modal */}
      {cityToDelete && (
        <DeleteCityModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setCityToDelete(null);
          }}
          city={cityToDelete}
          onDeleteSuccess={() => {
            setSuccessMsg("City deleted successfully.");
            fetchCities();
          }}
          onRequestTransfer={() => {
            setCityForTransfer(cityToDelete);
            setTransferModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
