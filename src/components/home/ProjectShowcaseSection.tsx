"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/models/project";
import { ContactModal, ContactModalProjectContext } from "@/components/layout/ContactModal";

const FALLBACK_PROJECT_IMG =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

const HK = '"Hanken Grotesk", system-ui, sans-serif';

const FALLBACK_PROJECTS = [
  {
    id: "k-raheja-modern-vivarea",
    slug: "k-raheja-modern-vivarea",
    title: "K Raheja Modern Vivarea",
    developer: "K Raheja Corp Homes",
    location: "Mahalaxmi",
    city: "South Mumbai",
    unitType: ["3 & 4 BHK Residences"],
    startingPrice: "9.10 Cr onwards",
    possession: "Jun 2028",
    unitSizes: "1500 - 3300 sq.ft.",
    reraNumber: "P51900008345",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "birla-homes",
    slug: "birla-homes",
    title: "Birla Homes",
    developer: "Birla Estates",
    location: "South Hyderabad",
    city: "Hyderabad",
    unitType: ["2 & 3 BHK Residences"],
    startingPrice: "5 Cr onwards",
    possession: "Aug 2029",
    unitSizes: "1000 - 1600 sq.ft.",
    reraNumber: "P02400001234",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "godrej-horizon",
    slug: "godrej-horizon",
    title: "Godrej Horizon",
    developer: "Godrej Properties",
    location: "Dadar, Mumbai",
    city: "Mumbai",
    unitType: ["2 & 3 BHK Residences"],
    startingPrice: "3.50 Cr onwards",
    possession: "Dec 2027",
    unitSizes: "1100 - 1800 sq.ft.",
    reraNumber: "P51900034821",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dlf-the-arbour",
    slug: "dlf-the-arbour",
    title: "DLF The Arbour",
    developer: "DLF",
    location: "Sector 63",
    city: "Gurugram",
    unitType: ["4 BHK Luxury Residences"],
    startingPrice: "8.50 Cr onwards",
    possession: "Mid 2028",
    unitSizes: "3950 sq.ft.",
    reraNumber: "RC/REP/HARERA/GGM/680/412/2023/24",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  },
];

interface ProjectShowcaseSectionProps {
  projects: Project[];
  selectedCity?: string;
}

// Map-pin SVG icon
function MapPinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#557173"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Checkmark icon for RERA badge
function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#124446" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ProjectShowcaseSection({ projects, selectedCity }: ProjectShowcaseSectionProps) {
  const [comparedSlugs, setComparedSlugs] = useState<Record<string, boolean>>({});
  const [selectedProjectForEnquiry, setSelectedProjectForEnquiry] =
    useState<ContactModalProjectContext | null>(null);

  const sourceProjects =
    projects && projects.length > 0
      ? projects
      : (FALLBACK_PROJECTS as unknown as Project[]);
  const displayedProjects = sourceProjects.slice(0, 6);
  const primaryCity = selectedCity || sourceProjects?.[0]?.city || "Hyderabad";
  const projectCount = sourceProjects?.length || 0;

  function toggleCompare(slug: string) {
    setComparedSlugs((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  function openEnquiry(project: Project) {
    setSelectedProjectForEnquiry({
      projectId: project._id || project.id,
      projectName: project.title,
      projectSlug: project.slug,
      city: project.city,
      developer: project.developer,
      projectUrl:
        typeof window !== "undefined"
          ? `${window.location.origin}/properties/${project.slug}`
          : "",
      formType: "project_card_enquiry",
      formLocation: "homepage_featured_section",
    });
  }

  return (
    <>
      <div style={{ width: "100%" }}>
        {/* Horizontal scroll row */}
        <div
          className="city-cards-row"
          style={{
            display: "flex",
            gap: 40,
            alignItems: "flex-start",
            overflowX: "auto",
            padding: "24px 0 24px 150px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <style>{`
            @media (max-width: 767px) {
              .city-cards-row { padding-left: 16px !important; }
            }
            .city-cards-row::-webkit-scrollbar { display: none; }
            .city-cards-row { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {displayedProjects.length === 0 ? (
            <div
              style={{
                padding: "48px 150px",
                color: "#557173",
                fontFamily: HK,
                fontSize: 16,
              }}
            >
              No projects found for {primaryCity}.
            </div>
          ) : (
            displayedProjects.map((project) => {
              const isCompared = Boolean(comparedSlugs[project.slug]);
              const imgSrc = project.image || project.bannerUrl || FALLBACK_PROJECT_IMG;
              const unitTypeText = Array.isArray(project.unitType)
                ? project.unitType.join(", ")
                : project.unitType || project.propertyType || "";

              return (
                <div
                  key={project.slug || project.id}
                  style={{
                    width: 608,
                    flexShrink: 0,
                    background: "#FFFFFF",
                    borderRadius: 20,
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Card image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={project.title}
                    style={{
                      width: 608,
                      height: 342,
                      borderRadius: "20px 20px 0 0",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_PROJECT_IMG;
                    }}
                  />

                  {/* Card body */}
                  <div
                    style={{
                      padding: "0 16px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {/* Block A */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {/* Title row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            font: `600 24px/normal ${HK}`,
                            color: "#124446",
                            width: 276,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {project.title}
                        </span>
                        {/* RERA badge */}
                        <span
                          style={{
                            display: "flex",
                            gap: 5,
                            alignItems: "center",
                            font: `400 11px ${HK}`,
                            color: "#124446",
                          }}
                        >
                          <CheckIcon />
                          {project.reraNumber ? "RERA Approved" : "Verified Listing"}
                        </span>
                      </div>

                      {/* Builder line */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          font: `400 12px ${HK}`,
                          color: "#557173",
                        }}
                      >
                        <MapPinIcon size={15} />
                        {`By ${project.developer || "Verified Developer"}`}
                      </div>

                      {/* Locality line */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          font: `400 12px ${HK}`,
                          color: "#557173",
                        }}
                      >
                        <MapPinIcon size={14} />
                        {`${project.location || project.microMarket || ""}, ${project.city}`}
                      </div>
                    </div>

                    {/* Row B */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ font: `400 16px ${HK}`, color: "#124446" }}
                      >
                        {unitTypeText}
                      </span>
                      <span
                        style={{
                          background: "rgba(18,68,70,0.2)",
                          padding: 4,
                          borderRadius: 4,
                          font: `600 20px ${HK}`,
                          color: "#124446",
                        }}
                      >
                        ₹ {project.startingPrice || "On Request"}
                      </span>
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: 1,
                        background: "rgba(18,68,70,0.2)",
                        width: "100%",
                      }}
                    />

                    {/* Row C */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ font: `400 16px ${HK}`, color: "#124446" }}>
                        {`Possession ${project.possession || "Dec 2026"}`}
                      </span>
                      <span style={{ font: `400 16px ${HK}`, color: "#124446" }}>
                        {project.unitSizes || ""}
                      </span>
                    </div>

                    {/* Buttons row */}
                    <div
                      style={{
                        display: "flex",
                        gap: 18,
                        alignItems: "center",
                      }}
                    >
                      {/* View Details */}
                      <Link
                        href={`/properties/${project.slug}`}
                        style={{
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          font: `400 16px ${HK}`,
                          background: "#124446",
                          border: "1px solid #D3A479",
                          padding: "0 56px",
                          color: "#FFFFFF",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Details
                      </Link>

                      {/* Submit Enquiry */}
                      <button
                        type="button"
                        onClick={() => openEnquiry(project)}
                        style={{
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          font: `400 16px ${HK}`,
                          background: "#FFFFFF",
                          border: "1px solid #124446",
                          padding: "0 52px",
                          color: "#124446",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Submit Enquiry
                      </button>

                      {/* Compare */}
                      <button
                        type="button"
                        onClick={() => toggleCompare(project.slug)}
                        style={{
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          borderRadius: 6,
                          font: `400 16px ${HK}`,
                          border: "1px solid #124446",
                          padding: "0 20px",
                          color: "#124446",
                          background: "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            border: "1px solid #557173",
                            borderRadius: 3,
                            background: isCompared ? "#124446" : "transparent",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        Compare
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View all button */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <Link
            href={`/search?city=${encodeURIComponent(primaryCity)}`}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: 12,
              border: "1px solid #D3A479",
              borderRadius: 8,
              boxShadow: "0 4px 6px rgba(0,0,0,0.25)",
              font: `400 16px ${HK}`,
              color: "#124446",
              background: "none",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            View all {projectCount > 0 ? projectCount : 20} projects in {primaryCity}
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* ContactModal */}
      {selectedProjectForEnquiry && (
        <ContactModal
          projectContext={selectedProjectForEnquiry}
          onClose={() => setSelectedProjectForEnquiry(null)}
        />
      )}
    </>
  );
}
