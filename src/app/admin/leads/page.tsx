"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { leadService } from "@/services/leadService";
import type { Lead, LeadStats, LeadStatus } from "@/models/lead";

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  contacted: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  closed: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, statsRes] = await Promise.allSettled([
        leadService.adminGetLeads({
          page,
          limit: 15,
          search: search.trim() || undefined,
          status: status !== "all" ? status : undefined,
          city: city.trim() || undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
        leadService.adminGetStats(),
      ]);

      if (leadsRes.status === "fulfilled") {
        setLeads(leadsRes.value.leads || []);
        setTotalPages(leadsRes.value.pagination.totalPages || 1);
        setTotalLeads(leadsRes.value.pagination.total || 0);
      } else {
        setError(leadsRes.reason?.message || "Failed to load leads");
      }

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error fetching leads");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, city]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function handleStatusChange(leadId: string, newStatus: LeadStatus) {
    setUpdatingId(leadId);
    try {
      const updated = await leadService.adminUpdateStatus(leadId, newStatus, `Updated via lead table`);
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: updated.status } : l))
      );
      // Refresh stats
      const newStats = await leadService.adminGetStats();
      setStats(newStats);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  }

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setCity("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Lead Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track, qualify, and manage incoming property enquiries with attribution &amp; CRM sync.
          </p>
        </div>
        <button
          onClick={() => fetchLeads()}
          className="self-start sm:self-auto px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <span>🔄</span>
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Stats Cards Overview */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Total Leads</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              New Leads
            </span>
            <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">{stats.new}</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Contacted
            </span>
            <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">{stats.contacted}</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Closed
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{stats.closed}</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Today&apos;s Enquiries</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">{stats.today}</div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <form
        onSubmit={handleFilterSubmit}
        className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center gap-3"
      >
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name, phone, email, project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="w-36">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="w-36">
          <input
            type="text"
            placeholder="Filter by city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Apply Filters
        </button>

        {(search || status !== "all" || city) && (
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </form>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Lead Contact</th>
                <th className="py-3 px-4">Interested Property</th>
                <th className="py-3 px-4">Attribution Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Integrations</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading leads from database...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No lead records found matching your filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                      <div>{new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                      <div className="text-[10px] text-zinc-400">{new Date(lead.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">{lead.fullName}</div>
                      <div className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        <a href={`tel:${lead.countryCode}${lead.phone}`}>{lead.countryCode} {lead.phone}</a>
                      </div>
                      {lead.email && <div className="text-zinc-400 truncate max-w-[180px]">{lead.email}</div>}
                    </td>

                    <td className="py-3 px-4">
                      {lead.projectName ? (
                        <div>
                          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {lead.projectSlug ? (
                              <Link href={`/properties/${lead.projectSlug}`} target="_blank" className="hover:underline text-[#124446] dark:text-[#D3A479]">
                                {lead.projectName} ↗
                              </Link>
                            ) : (
                              lead.projectName
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {lead.city && <span>📍 {lead.city}</span>}
                            {lead.developer && <span className="ml-1.5">• {lead.developer}</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="text-zinc-400 italic">General Enquiry ({lead.formType})</div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {lead.utmSource || lead.firstTouch?.utmSource || "direct"}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {lead.utmCampaign || lead.firstTouch?.utmCampaign || "organic"}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select
                          disabled={updatingId === lead._id}
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value as LeadStatus)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold border focus:outline-none cursor-pointer ${
                            STATUS_COLORS[lead.status]
                          }`}
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="closed">CLOSED</option>
                        </select>
                        {updatingId === lead._id && (
                          <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold w-fit ${
                            lead.emailStatus === "sent"
                              ? "bg-emerald-100 text-emerald-800"
                              : lead.emailStatus === "failed"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          Email: {lead.emailStatus}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold w-fit ${
                            lead.crmStatus === "synced"
                              ? "bg-emerald-100 text-emerald-800"
                              : lead.crmStatus === "configuration_required"
                              ? "bg-amber-100 text-amber-800"
                              : lead.crmStatus === "failed"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          CRM: {lead.crmStatus}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/leads/${lead._id}`}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          <div>
            Showing {leads.length} of {totalLeads} total leads (Page {page} of {totalPages})
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 disabled:opacity-40 hover:bg-white dark:hover:bg-zinc-700 cursor-pointer"
            >
              ← Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 disabled:opacity-40 hover:bg-white dark:hover:bg-zinc-700 cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
