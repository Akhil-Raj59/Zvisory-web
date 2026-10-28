"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TransferProjectsModal } from "./TransferProjectsModal";
import { DeleteCityModal } from "./DeleteCityModal";

interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  developer: string;
  city: string;
  status: "published" | "draft" | "archived";
  startingPrice?: string;
  cardBanner?: string;
  launchStatus?: string;
  updatedAt: string;
}

interface CityDetailsProps {
  city: {
    _id: string;
    id?: string;
    name: string;
    slug: string;
    state?: string;
    country?: string;
    image?: string;
    coverImage?: string;
    startingPrice?: string;
    shortDescription?: string;
    description?: string;
    highlights?: string[];
    localities?: string[];
    gallery?: string[];
    seo?: {
      title?: string;
      description?: string;
      keywords?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
    };
    status: "published" | "draft" | "archived";
    isFeatured?: boolean;
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
    archivedProjects: number;
    createdAt?: string;
    updatedAt?: string;
  };
  projects: ProjectItem[];
  allCities: Array<{ _id: string; name: string; slug: string; projectCount?: number }>;
}

const STATUS_PILL: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  archived: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export function CityDetailsClient({ city, projects: initialProjects, allCities }: CityDetailsProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(city.status);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleStatusChange = async (newStatus: "draft" | "published" | "archived") => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/cities/${city._id || city.slug}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update status");
      }
      setCurrentStatus(newStatus);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating status");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/cities"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              ← Back to Cities
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{city.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {city.name}
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                STATUS_PILL[currentStatus] || STATUS_PILL.draft
              }`}
            >
              {currentStatus}
            </span>
            {city.isFeatured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                ★ Featured
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Status Select */}
          <select
            value={currentStatus}
            disabled={statusUpdating}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <option value="published">Status: Published</option>
            <option value="draft">Status: Draft</option>
            <option value="archived">Status: Archived</option>
          </select>

          <Link
            href={`/cities/${city.slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1"
          >
            <span>↗</span> Public Page
          </Link>

          <button
            onClick={() => setTransferModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 transition-colors"
          >
            🔄 Transfer Projects
          </button>

          <Link
            href={`/admin/cities/${city._id || city.slug}/edit`}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
          >
            ✏️ Edit City
          </Link>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* City Hero Banner & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cover Image & Quick Specs */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
            {city.image || city.coverImage ? (
              <Image
                src={city.image || city.coverImage || ""}
                alt={city.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🏙️</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs">
                {city.startingPrice || "Price On Request"}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Slug:</span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{city.slug}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">State:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{city.state || "—"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Country:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{city.country || "India"}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-zinc-500">Public URL:</span>
              <Link
                href={`/cities/${city.slug}`}
                target="_blank"
                className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline truncate max-w-[180px]"
              >
                /cities/{city.slug}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Columns: Description, Highlights, SEO */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Projects", value: city.totalProjects, color: "text-zinc-900 dark:text-zinc-100" },
              { label: "Published", value: city.publishedProjects, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Drafts", value: city.draftProjects, color: "text-amber-600 dark:text-amber-400" },
              { label: "Archived", value: city.archivedProjects, color: "text-zinc-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs"
              >
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{stat.label}</div>
                <div className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Details & Localities */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            {city.shortDescription && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Short Description
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{city.shortDescription}</p>
              </div>
            )}

            {city.description && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Full Overview
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                  {city.description}
                </p>
              </div>
            )}

            {city.highlights && city.highlights.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Corridors & Highlights
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {city.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {city.localities && city.localities.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Key Localities / Sectors
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {city.localities.map((loc, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-900/40"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Showcase if available */}
      {city.gallery && city.gallery.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            City Media Gallery ({city.gallery.length} Images)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {city.gallery.map((img, i) => (
              <div
                key={i}
                className="relative h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800"
              >
                <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Associated Projects Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>🏗️</span> Associated Projects in {city.name}
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                {initialProjects.length} loaded
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Projects currently mapped to &quot;{city.name}&quot; in the database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/projects/new"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              + Add Project to {city.name}
            </Link>
          </div>
        </div>

        {initialProjects.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500 space-y-2">
            <p>No projects are currently assigned to this city.</p>
            <p className="text-xs text-zinc-400">
              You can create a project in this city or transfer projects from another city.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Project Title</th>
                  <th className="py-2.5 px-3">Developer</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {initialProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</div>
                      <div className="text-[11px] font-mono text-zinc-400">{p.slug}</div>
                    </td>
                    <td className="py-3 px-3 text-xs text-zinc-600 dark:text-zinc-400">
                      {p.developer}
                    </td>
                    <td className="py-3 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {p.startingPrice || "Price On Request"}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          STATUS_PILL[p.status] || STATUS_PILL.draft
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/projects/${p._id}`}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 transition-colors"
                      >
                        Edit Project →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Projects Modal */}
      <TransferProjectsModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        sourceCity={{
          _id: city._id,
          name: city.name,
          slug: city.slug,
          projectCount: city.totalProjects,
        }}
        availableCities={allCities}
        onTransferSuccess={() => {
          router.refresh();
        }}
      />

      {/* Delete City Modal */}
      <DeleteCityModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        city={{
          _id: city._id,
          name: city.name,
          slug: city.slug,
          projectCount: city.totalProjects,
        }}
        onDeleteSuccess={() => {
          router.push("/admin/cities");
        }}
        onRequestTransfer={() => {
          setTransferModalOpen(true);
        }}
      />
    </div>
  );
}
