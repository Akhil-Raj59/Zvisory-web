"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Project } from "@/models/project";
import { ContactModal, ContactModalProjectContext } from "@/components/layout/ContactModal";

const FALLBACK_PROJECT_IMG =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

type TabKey = "new_projects" | "ready_to_move" | "top_localities" | "top_developers";

interface ProjectShowcaseSectionProps {
  projects: Project[];
}

export function ProjectShowcaseSection({ projects }: ProjectShowcaseSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("new_projects");
  const [savedSlugs, setSavedSlugs] = useState<Record<string, boolean>>({});
  const [comparedSlugs, setComparedSlugs] = useState<Record<string, boolean>>({});
  const [selectedProjectForEnquiry, setSelectedProjectForEnquiry] =
    useState<ContactModalProjectContext | null>(null);

  // Filter projects based on active tab
  const displayedProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    switch (activeTab) {
      case "ready_to_move":
        return projects.filter(
          (p) =>
            p.status?.toLowerCase().includes("ready") ||
            p.possession?.toLowerCase().includes("ready")
        );
      case "top_developers":
        // Sort/prioritize DLF, Prestige, Godrej, Sobha
        return [...projects].sort((a, b) => {
          const aTop = /dlf|godrej|prestige|sobha|oberoi/i.test(a.developer || "");
          const bTop = /dlf|godrej|prestige|sobha|oberoi/i.test(b.developer || "");
          return aTop === bTop ? 0 : aTop ? -1 : 1;
        });
      case "top_localities":
        return projects.filter((p) => Boolean(p.location || p.microMarket));
      case "new_projects":
      default:
        return projects;
    }
  }, [projects, activeTab]);

  // Determine current primary city for bottom link
  const primaryCity = projects?.[0]?.city || "India";
  const projectCount = projects?.length || 0;

  function toggleSave(slug: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSavedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  }

  function toggleCompare(slug: string, e: React.MouseEvent) {
    e.stopPropagation();
    setComparedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  }

  function openEnquiry(project: Project) {
    setSelectedProjectForEnquiry({
      projectId: project._id || project.id,
      projectName: project.title,
      projectSlug: project.slug,
      city: project.city,
      developer: project.developer,
      projectUrl: typeof window !== "undefined" ? `${window.location.origin}/properties/${project.slug}` : "",
      formType: "project_card_enquiry",
      formLocation: "homepage_featured_section",
    });
  }

  return (
    <>
      <section className="py-16 bg-white border-b border-[#E5EDE9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
                Featured Residences
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#124446] tracking-tight mt-1">
                Handpicked Luxury Developments
              </h2>
              <p className="text-xs sm:text-sm text-[#557173] mt-1 max-w-xl">
                RERA-approved luxury apartments, penthouses, and gated community villas verified by our senior advisory team.
              </p>
            </div>

            {/* Filter Tabs matching Figma Layout */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F8FFFB] border border-[#E5EDE9] overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("new_projects")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "new_projects"
                    ? "bg-[#124446] text-white shadow-sm"
                    : "text-[#557173] hover:text-[#124446]"
                }`}
              >
                New Projects
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ready_to_move")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "ready_to_move"
                    ? "bg-[#124446] text-white shadow-sm"
                    : "text-[#557173] hover:text-[#124446]"
                }`}
              >
                Ready To Move
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("top_localities")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "top_localities"
                    ? "bg-[#124446] text-white shadow-sm"
                    : "text-[#557173] hover:text-[#124446]"
                }`}
              >
                Top Localities
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("top_developers")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "top_developers"
                    ? "bg-[#124446] text-white shadow-sm"
                    : "text-[#557173] hover:text-[#124446]"
                }`}
              >
                Top Developers
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {displayedProjects.length === 0 ? (
            <div className="text-center py-16 bg-[#F8FFFB] rounded-3xl border border-[#E5EDE9]">
              <p className="text-sm font-semibold text-[#557173]">
                No projects found in this category. Explore our full catalog below.
              </p>
              <Link
                href="/search"
                className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-[#124446] text-white font-bold text-xs"
              >
                Browse All Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProjects.slice(0, 6).map((project) => {
                const isSaved = Boolean(savedSlugs[project.slug]);
                const isCompared = Boolean(comparedSlugs[project.slug]);
                const imgSrc = project.image || project.bannerUrl || FALLBACK_PROJECT_IMG;
                const reraText = project.reraNumber ? "✓ RERA Approved" : "Verified Listing";

                return (
                  <div
                    key={project.slug || project.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-[#E5EDE9] shadow-sm hover:shadow-xl hover:border-[#124446]/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top Image Container */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_PROJECT_IMG;
                        }}
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E6FFF1] text-[#124446] border border-[#124446]/10 shadow-xs">
                          {reraText}
                        </span>
                        {project.status && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#124446]/80 backdrop-blur-xs text-white">
                            {project.status}
                          </span>
                        )}
                      </div>

                      {/* Save / Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleSave(project.slug, e)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs ${
                          isSaved
                            ? "bg-[#D3A479] text-white shadow-md"
                            : "bg-white/80 hover:bg-white text-slate-700 shadow-xs"
                        }`}
                        aria-label="Save Property"
                      >
                        {isSaved ? "♥" : "♡"}
                      </button>

                      {/* Starting Price Pill */}
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs text-[#124446] font-extrabold text-sm shadow-md border border-white/50">
                        {project.startingPrice || "Price on Request"}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-1.5">
                        {/* Developer & Locality */}
                        <div className="flex items-center justify-between text-xs text-[#557173] font-medium">
                          <span className="truncate max-w-[180px]">
                            {project.developer ? `By ${project.developer}` : "Verified Developer"}
                          </span>
                          <span className="truncate max-w-[140px] text-right">
                            📍 {project.location || project.microMarket || project.city}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-extrabold text-[#124446] text-lg group-hover:text-[#D3A479] transition-colors leading-snug line-clamp-1">
                          <Link href={`/properties/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h3>

                        {/* Configuration badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {Array.isArray(project.unitType) && project.unitType.length > 0 ? (
                            project.unitType.slice(0, 3).map((u) => (
                              <span
                                key={u}
                                className="px-2 py-0.5 rounded-md bg-[#F8FFFB] border border-[#E5EDE9] text-[11px] font-semibold text-[#124446]"
                              >
                                {u}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-[#F8FFFB] border border-[#E5EDE9] text-[11px] font-semibold text-[#124446]">
                              {project.propertyType || "Luxury Apartment"}
                            </span>
                          )}
                        </div>

                        {/* Possession & Specs Row */}
                        <div className="pt-2 border-t border-[#E5EDE9]/60 flex items-center justify-between text-xs text-[#557173]">
                          <div>
                            <span className="font-semibold text-slate-800">Possession: </span>
                            <span>{project.possession || "Dec 2026"}</span>
                          </div>
                          {project.unitSizes && (
                            <div className="text-right truncate max-w-[130px]">
                              <span>{project.unitSizes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons & Compare Toggle */}
                      <div className="pt-3 border-t border-[#E5EDE9] space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/properties/${project.slug}`}
                            className="flex-1 py-2.5 rounded-xl border border-[#124446] text-[#124446] hover:bg-[#124446] hover:text-white font-bold text-xs text-center transition-all cursor-pointer"
                          >
                            View Details
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEnquiry(project)}
                            className="flex-1 py-2.5 rounded-xl bg-[#124446] hover:bg-[#0d3233] text-white font-bold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer"
                          >
                            Submit Enquiry
                          </button>
                        </div>

                        {/* Compare Toggle */}
                        <div className="flex items-center justify-between text-[11px] text-[#557173] px-1">
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={(e) => toggleCompare(project.slug, e as unknown as React.MouseEvent)}
                              className="rounded border-slate-300 text-[#124446] focus:ring-[#124446] w-3.5 h-3.5"
                            />
                            <span className={isCompared ? "font-bold text-[#124446]" : ""}>
                              {isCompared ? "Added to Compare" : "Add to Compare"}
                            </span>
                          </label>
                          <span className="text-[10px] text-slate-400">RERA Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom City Deep Link Banner matching Figma */}
          <div className="mt-12 text-center">
            <Link
              href={`/search?city=${encodeURIComponent(primaryCity)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#F8FFFB] border border-[#E5EDE9] text-[#124446] hover:bg-[#E6FFF1] font-bold text-sm transition-all shadow-xs group"
            >
              <span>View all {projectCount > 0 ? projectCount : 20}+ projects in {primaryCity}</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Render ContactModal if project selected */}
      {selectedProjectForEnquiry && (
        <ContactModal
          projectContext={selectedProjectForEnquiry}
          onClose={() => setSelectedProjectForEnquiry(null)}
        />
      )}
    </>
  );
}

