"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Project } from "@/models/project";
import { ContactModal, ContactModalProjectContext } from "@/components/layout/ContactModal";

const FALLBACK_PROJECT_IMG = "/figma-assets/Browse City/Project image.avif";

const HK = '"Hanken Grotesk", system-ui, sans-serif';

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

// Checkmark icon for RERA badge using Figma SVG
function CheckIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/figma-assets/Browse City/rera check.svg"
      alt="RERA"
      width={16}
      height={16}
      style={{ flexShrink: 0 }}
      onError={(e) => {
        // Fallback to inline SVG if image fails
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

export function ProjectShowcaseSection({ projects, selectedCity }: ProjectShowcaseSectionProps) {
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([]);
  const [selectedProjectForEnquiry, setSelectedProjectForEnquiry] =
    useState<ContactModalProjectContext | null>(null);

  // Sync compared projects with localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("zvisory_compare_projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setComparedSlugs(parsed);
        }
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const sourceProjects = Array.isArray(projects) ? projects : [];
  const displayedProjects = sourceProjects.slice(0, 6);
  const primaryCity = selectedCity || sourceProjects?.[0]?.city || "Hyderabad";
  const projectCount = sourceProjects.length;

  function toggleCompare(slug: string) {
    let next: string[];
    if (comparedSlugs.includes(slug)) {
      next = comparedSlugs.filter((s) => s !== slug);
    } else {
      if (comparedSlugs.length >= 3) {
        alert("You can compare up to 3 projects at a time.");
        return;
      }
      next = [...comparedSlugs, slug];
    }
    setComparedSlugs(next);
    try {
      localStorage.setItem("zvisory_compare_projects", JSON.stringify(next));
    } catch {
      // Ignore localStorage write error
    }
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
      <div style={{ width: "100%", position: "relative" }}>
        {/* Horizontal scroll row with responsive styling */}
        <div
          className="city-cards-row"
          style={{
            display: "flex",
            gap: 40,
            alignItems: "flex-start",
            overflowX: "auto",
            padding: "24px 0 24px 120px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <style>{`
            @media (max-width: 1024px) {
              .city-cards-row {
                padding-left: 24px !important;
                padding-right: 24px !important;
                gap: 24px !important;
              }
            }
            @media (max-width: 767px) {
              .city-cards-row {
                padding-left: 16px !important;
                padding-right: 16px !important;
                flex-direction: row !important;
                align-items: flex-start !important;
                overflow-x: auto !important;
                flex-wrap: nowrap !important;
                gap: 16px !important;
                scroll-snap-type: x mandatory;
              }
              .project-card {
                width: 320px !important;
                min-width: 320px !important;
                max-width: 85vw !important;
                scroll-snap-align: start;
              }
              .project-card-img {
                height: 200px !important;
              }
              .project-card-actions {
                display: grid !important;
                grid-template-columns: 1fr 1fr 1fr !important;
                gap: 8px !important;
                width: 100% !important;
              }
              .project-card-actions a,
              .project-card-actions button {
                padding: 0 4px !important;
                font-size: 13px !important;
                height: 38px !important;
                justify-content: center !important;
              }
            }
            .city-cards-row::-webkit-scrollbar { display: none; }
            .city-cards-row { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {displayedProjects.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                color: "#557173",
                fontFamily: HK,
                fontSize: 16,
                textAlign: "center",
                width: "100%",
              }}
            >
              No projects found for {primaryCity}.
            </div>
          ) : (
            displayedProjects.map((project) => {
              const isCompared = comparedSlugs.includes(project.slug);
              const imgSrc = project.image || project.cardBanner || project.bannerUrl || FALLBACK_PROJECT_IMG;
              const unitTypeText = Array.isArray(project.unitType)
                ? project.unitType.join(", ")
                : project.unitType || project.propertyType || "";

              return (
                <div
                  key={project.slug || project.id}
                  className="project-card"
                  style={{
                    width: 514,
                    minWidth: 480,
                    flexShrink: 0,
                    background: "#FFFFFF",
                    borderRadius: 20,
                    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* Card image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={project.title}
                    className="project-card-img"
                    style={{
                      width: "100%",
                      height: 306,
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
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Block A */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 12 }}>
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
                            font: `600 20px/26px ${HK}`,
                            color: "#124446",
                            maxWidth: "70%",
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
                            font: `400 11px/14px ${HK}`,
                            color: "#124446",
                            flexShrink: 0,
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
                          gap: 6,
                          font: `400 12px/16px ${HK}`,
                          color: "#557173",
                        }}
                      >
                        <MapPinIcon size={14} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {`By ${project.developer || "Verified Developer"}`}
                        </span>
                      </div>

                      {/* Locality line */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          font: `400 12px/16px ${HK}`,
                          color: "#557173",
                        }}
                      >
                        <MapPinIcon size={14} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {`${project.location || project.microMarket || ""}, ${project.city}`}
                        </span>
                      </div>
                    </div>

                    {/* Row B */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        minHeight: 34,
                      }}
                    >
                      <span
                        style={{
                          font: `400 16px/21px ${HK}`,
                          color: "#124446",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "50%",
                        }}
                      >
                        {unitTypeText}
                      </span>
                      <span
                        style={{
                          background: "rgba(18, 68, 70, 0.2)",
                          padding: "4px 8px",
                          borderRadius: 4,
                          font: `600 20px/26px ${HK}`,
                          color: "#124446",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₹ {project.startingPrice || "On Request"}
                      </span>
                    </div>

                    {/* Details divider */}
                    <div
                      style={{
                        height: 1,
                        background: "rgba(18, 68, 70, 0.2)",
                        width: "100%",
                      }}
                    />

                    {/* Row C */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        minHeight: 29,
                      }}
                    >
                      <span style={{ font: `400 16px/21px ${HK}`, color: "#124446" }}>
                        {`Possession ${project.possession || "Dec 2026"}`}
                      </span>
                      <span style={{ font: `400 16px/21px ${HK}`, color: "#124446" }}>
                        {project.unitSizes || ""}
                      </span>
                    </div>

                    {/* Buttons row */}
                    <div
                      className="project-card-actions"
                      style={{
                        display: "flex",
                        gap: 18,
                        alignItems: "center",
                        height: 45,
                        marginTop: 4,
                      }}
                    >
                      {/* View Details */}
                      <Link
                        href={`/properties/${project.slug}`}
                        style={{
                          flex: 1,
                          height: 45,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          font: `400 16px/21px ${HK}`,
                          background: "#124446",
                          border: "1px solid #D3A479",
                          color: "#FFFFFF",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          boxSizing: "border-box",
                        }}
                      >
                        View Details
                      </Link>

                      {/* Submit Enquiry */}
                      <button
                        type="button"
                        onClick={() => openEnquiry(project)}
                        style={{
                          flex: 1,
                          height: 45,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          font: `400 16px/21px ${HK}`,
                          background: "#FFFFFF",
                          border: "1px solid #124446",
                          color: "#124446",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          boxSizing: "border-box",
                        }}
                      >
                        Submit Enquiry
                      </button>

                      {/* Compare */}
                      <button
                        type="button"
                        onClick={() => toggleCompare(project.slug)}
                        style={{
                          flex: 1,
                          height: 45,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          borderRadius: 6,
                          font: `400 16px/21px ${HK}`,
                          border: "1px solid #124446",
                          color: "#124446",
                          background: "#FFFFFF",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          boxSizing: "border-box",
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
                        {isCompared ? "✓ Comparing" : "Compare"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View all button */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 16 }}>
          <Link
            href={`/search?city=${encodeURIComponent(primaryCity)}`}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "12px 16px",
              border: "1px solid #D3A479",
              borderRadius: 8,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.25)",
              font: `400 16px/21px ${HK}`,
              color: "#124446",
              background: "none",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <span>View all {projectCount > 0 ? projectCount : 20} projects in {primaryCity}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma-assets/Browse City/arrow_right_alt_24dp_124446_FILL0_wght400_GRAD0_opsz24.svg"
              alt="arrow"
              width={24}
              height={24}
              style={{ display: "block" }}
            />
          </Link>
        </div>

        {/* Compare floating badge if projects are selected */}
        {comparedSlugs.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              background: "#124446",
              color: "#F8FFFB",
              borderRadius: 9999,
              boxShadow: "0 8px 24px rgba(18,68,70,0.35)",
            }}
          >
            <span style={{ font: `600 13px ${HK}` }}>
              Comparing {comparedSlugs.length}/3 projects
            </span>
            <Link
              href="/search?compare=true"
              style={{
                background: "#D3A479",
                color: "#124446",
                padding: "6px 14px",
                borderRadius: 9999,
                font: `700 11px ${HK}`,
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Compare Now →
            </Link>
          </div>
        )}
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
