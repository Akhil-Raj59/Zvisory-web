"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { leadService } from "@/services/leadService";
import type { Lead, LeadJob, LeadStatus } from "@/models/lead";

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  contacted: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  closed: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
};

export default function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [jobs, setJobs] = useState<LeadJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Change State
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>("new");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Job Retry State
  const [retryingJobId, setRetryingJobId] = useState<string | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  async function loadLead() {
    setLoading(true);
    setError(null);
    try {
      const data = await leadService.adminGetLeadById(id);
      setLead(data.lead);
      setJobs(data.jobs || []);
      setSelectedStatus(data.lead.status);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load lead details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLead();
  }, [id]);

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!lead) return;
    setUpdatingStatus(true);
    try {
      const updated = await leadService.adminUpdateStatus(
        lead._id,
        selectedStatus,
        statusNote
      );
      setLead(updated);
      setStatusNote("");
      await loadLead();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleRetryJob(jobId: string) {
    if (!lead) return;
    setRetryingJobId(jobId);
    setRetryMessage(null);
    try {
      await leadService.adminRetryJob(lead._id, jobId);
      setRetryMessage("Job re-queued successfully! Executing in background.");
      // Refresh lead and jobs after a short moment
      setTimeout(() => {
        loadLead();
      }, 1500);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to retry job");
    } finally {
      setRetryingJobId(null);
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <div className="text-sm text-zinc-500">Loading lead profile...</div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
          ⚠️ {error || "Lead not found"}
        </div>
        <Link
          href="/admin/leads"
          className="inline-block px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold"
        >
          ← Back to All Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/admin/leads" className="hover:underline">
            Leads
          </Link>
          <span>/</span>
          <span className="font-mono text-zinc-800 dark:text-zinc-200">{lead._id}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadLead()}
            className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold"
          >
            🔄 Refresh
          </button>
          <Link
            href="/admin/leads"
            className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold"
          >
            ← Back to Table
          </Link>
        </div>
      </div>

      {/* Main Lead Header Card */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {lead.fullName}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                STATUS_COLORS[lead.status]
              }`}
            >
              {lead.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-mono">
            <a
              href={`tel:${lead.countryCode}${lead.phone}`}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              📞 {lead.countryCode} {lead.phone}
            </a>
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="hover:underline">
                ✉️ {lead.email}
              </a>
            )}
            <span>
              🕒 {new Date(lead.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </span>
          </div>
        </div>

        {/* Quick Status Updater */}
        <form
          onSubmit={handleStatusUpdate}
          className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 w-full md:w-auto flex flex-col sm:flex-row gap-2"
        >
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
            className="px-3 py-2 rounded-lg text-xs font-bold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
          >
            <option value="new">Status: NEW</option>
            <option value="contacted">Status: CONTACTED</option>
            <option value="closed">Status: CLOSED</option>
          </select>
          <input
            type="text"
            placeholder="Admin note (optional)..."
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
          />
          <button
            type="submit"
            disabled={updatingStatus}
            className="px-4 py-2 rounded-lg bg-[#124446] hover:bg-[#0d3335] text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-colors"
          >
            {updatingStatus ? "Saving..." : "Update"}
          </button>
        </form>
      </div>

      {retryMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          ✓ {retryMessage}
        </div>
      )}

      {/* Grid: Details & Enquiry Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Enquiry Context & Message */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Property &amp; Enquiry Context
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Interested Property</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {lead.projectName ? (
                  lead.projectSlug ? (
                    <Link
                      href={`/properties/${lead.projectSlug}`}
                      target="_blank"
                      className="text-[#124446] dark:text-[#D3A479] hover:underline"
                    >
                      {lead.projectName} ↗
                    </Link>
                  ) : (
                    lead.projectName
                  )
                ) : (
                  <span className="italic text-zinc-400">General Advisory</span>
                )}
              </span>
            </div>

            {lead.city && (
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">City / Market</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.city}</span>
              </div>
            )}

            {lead.developer && (
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">Developer</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.developer}</span>
              </div>
            )}

            <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Form Type</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">{lead.formType}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Form Location</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">{lead.formLocation}</span>
            </div>

            {lead.submissionPage && (
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">Submission URL</span>
                <span className="truncate max-w-[240px] text-zinc-600 dark:text-zinc-400 font-mono">
                  {lead.submissionPage}
                </span>
              </div>
            )}
          </div>

          {lead.message && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Customer Message
              </span>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed border border-zinc-100 dark:border-zinc-700">
                {lead.message}
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Marketing Attribution */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Marketing Attribution &amp; Session
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">UTM Source</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                {lead.utmSource || lead.firstTouch?.utmSource || "direct"}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">UTM Medium</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">
                {lead.utmMedium || lead.firstTouch?.utmMedium || "none"}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">UTM Campaign</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">
                {lead.utmCampaign || lead.firstTouch?.utmCampaign || "none"}
              </span>
            </div>

            {lead.referrer && (
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">Referrer</span>
                <span className="truncate max-w-[240px] font-mono text-zinc-600 dark:text-zinc-400">
                  {lead.referrer}
                </span>
              </div>
            )}

            {lead.landingPage && (
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">First Landing Page</span>
                <span className="truncate max-w-[240px] font-mono text-zinc-600 dark:text-zinc-400">
                  {lead.landingPage}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Client Environment</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">
                {lead.deviceType} • {lead.browser}
              </span>
            </div>

            {lead.ipAddress && (
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">Captured IP Address</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200">{lead.ipAddress}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Outbox Synchronization Jobs & Retries */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Integration Outbox Jobs (Email &amp; CRM Sync)
          </h2>
          <span className="text-xs text-zinc-400">Persistent MongoDB Outbox Pattern</span>
        </div>

        {jobs.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
            No Outbox jobs queued for this lead.
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {job.type === "EMAIL_NOTIFICATION" ? "📧 Email Notifications" : "💼 LeadSquared CRM Sync"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        job.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : job.status === "configuration_required"
                          ? "bg-amber-100 text-amber-800"
                          : job.status === "failed"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-500 font-mono">
                    Attempts: {job.attempts} / {job.maxAttempts} • Last Attempt:{" "}
                    {job.lastAttemptAt ? new Date(job.lastAttemptAt).toLocaleTimeString("en-IN") : "Pending"}
                  </div>

                  {job.lastError && (
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono">
                      Error: {job.lastError}
                    </div>
                  )}

                  {job.result && (job.result as any).externalId && (
                    <div className="text-[11px] text-emerald-600 font-mono">
                      LeadSquared ID: {(job.result as any).externalId}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={retryingJobId === job._id}
                    onClick={() => handleRetryJob(job._id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {retryingJobId === job._id ? "Retrying..." : "Retry Job Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card 4: Status History Timeline */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
          Status Change History
        </h2>

        {lead.statusHistory && lead.statusHistory.length > 0 ? (
          <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
            {lead.statusHistory.map((item, idx) => (
              <div key={item._id || idx} className="relative text-xs space-y-0.5">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#124446] ring-4 ring-white dark:ring-zinc-900"></span>
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase text-zinc-900 dark:text-zinc-100">{item.status}</span>
                  <span className="text-zinc-400 font-mono text-[10px]">
                    {new Date(item.changedAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                  {item.changedBy && (
                    <span className="text-zinc-500 text-[11px]">by {item.changedBy.fullName}</span>
                  )}
                </div>
                {item.notes && <p className="text-zinc-600 dark:text-zinc-400">{item.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-zinc-400 italic">No previous status updates.</div>
        )}
      </div>
    </div>
  );
}

