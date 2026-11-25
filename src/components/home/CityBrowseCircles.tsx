"use client";

import { useState, useEffect } from "react";
import type { City } from "@/models/city";
import { ProjectShowcaseSection } from "./ProjectShowcaseSection";
import type { Project } from "@/models/project";
import { projectService } from "@/services/projectService";

const CITY_FALLBACK_IMAGES: Record<string, string> = {
  Gurugram: "/figma-assets/Browse City/Project image (1).jpg",
  Bengaluru: "/figma-assets/Browse City/Project image (2).jpg",
  Hyderabad: "/figma-assets/Browse City/Project image (3).jpg",
  Mumbai: "/figma-assets/Browse City/Project image (4).jpg",
  Pune: "/figma-assets/Browse City/Project image (5).jpg",
  Noida: "/figma-assets/Browse City/Project image (6).jpg",
  Delhi: "/figma-assets/Browse City/Project image (7).jpg",
};

const DEFAULT_CITY_IMAGE = "/figma-assets/Browse City/Project image (8).jpg";

type TabKey = "new_projects" | "ready_to_move" | "top_localities" | "top_developers";

const TABS: { key: TabKey; label: string }[] = [
  { key: "new_projects", label: "New Projects" },
  { key: "ready_to_move", label: "Ready To Move" },
  { key: "top_localities", label: "Top Localities" },
  { key: "top_developers", label: "Top Developers" },
];

const DEFAULT_CITIES: City[] = [
  { id: "gurugram", name: "Gurugram", slug: "gurugram", projectCount: 24 },
  { id: "bengaluru", name: "Bengaluru", slug: "bengaluru", projectCount: 18 },
  { id: "hyderabad", name: "Hyderabad", slug: "hyderabad", projectCount: 15 },
  { id: "mumbai", name: "Mumbai", slug: "mumbai", projectCount: 22 },
  { id: "pune", name: "Pune", slug: "pune", projectCount: 12 },
  { id: "noida", name: "Noida", slug: "noida", projectCount: 14 },
];

interface CityBrowseCirclesProps {
  cities: City[];
  projects?: Project[];
}

const HK = '"Hanken Grotesk", system-ui, sans-serif';
const PJS = '"Plus Jakarta Sans", sans-serif';

export function CityBrowseCircles({ cities, projects = [] }: CityBrowseCirclesProps) {
  const displayCities = cities && cities.length > 0 ? cities : DEFAULT_CITIES;

  // Hyderabad is selected by default as required by wireframe
  const defaultCityName =
    displayCities.find((c) => c.name.toLowerCase() === "hyderabad")?.name ||
    displayCities[0]?.name ||
    "Hyderabad";

  const [selectedCity, setSelectedCity] = useState<string>(defaultCityName);
  const [activeTab, setActiveTab] = useState<TabKey>("new_projects");
  const [cityProjects, setCityProjects] = useState<Project[]>(projects);
  const [loading, setLoading] = useState(false);

  // Fetch real projects from backend whenever selectedCity changes
  useEffect(() => {
    let active = true;
    async function loadCityProjects() {
      if (!selectedCity) return;
      setLoading(true);
      try {
        const res = await projectService.getAllProjects({ city: selectedCity, limit: 12 });
        if (active) {
          if (res && res.length > 0) {
            setCityProjects(res);
          } else {
            setCityProjects([]);
          }
        }
      } catch (err) {
        console.error("Failed to load projects for city", selectedCity, err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCityProjects();
    return () => {
      active = false;
    };
  }, [selectedCity]);

  // Filter projects by selected city + active tab
  const filteredProjects = (() => {
    let base = [...cityProjects];

    // Filter projects matching city (case-insensitive) if available
    const cityFiltered = base.filter(
      (p) => p.city?.toLowerCase() === selectedCity.toLowerCase()
    );
    if (cityFiltered.length > 0) {
      base = cityFiltered;
    }

    switch (activeTab) {
      case "ready_to_move":
        base = base.filter(
          (p) =>
            /ready/i.test(p.status || "") ||
            /ready/i.test(p.possession || "")
        );
        break;
      case "top_developers":
        base = [...base].sort((a, b) => {
          const aTop = /dlf|godrej|prestige|brigade|sobha|oberoi|birla|myscape|asbl/i.test(
            a.developer || ""
          );
          const bTop = /dlf|godrej|prestige|brigade|sobha|oberoi|birla|myscape|asbl/i.test(
            b.developer || ""
          );
          return aTop === bTop ? 0 : aTop ? -1 : 1;
        });
        break;
      case "top_localities":
        base = base.filter((p) => Boolean(p.location || p.microMarket));
        break;
      case "new_projects":
      default:
        // Sort by launch status or newest
        base = [...base].sort((a, b) => {
          const aNew = /new|pre/i.test(a.status || "");
          const bNew = /new|pre/i.test(b.status || "");
          return aNew === bNew ? 0 : aNew ? -1 : 1;
        });
        break;
    }
    return base;
  })();

  return (
    <section
      style={{
        background: "#F8FFFB",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        alignItems: "center",
        padding: "64px 0 72px",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <style>{`
        .city-chips-container::-webkit-scrollbar { display: none; }
        .city-chips-container { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 900px) {
          .city-chips-container {
            justify-content: flex-start !important;
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            gap: 20px !important;
            padding: 8px 16px !important;
          }
          .city-tabs-row {
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            width: 100% !important;
            justify-content: flex-start !important;
            padding: 12px 16px !important;
            gap: 16px !important;
          }
          .city-tabs-row button {
            font-size: 18px !important;
            padding: 8px 12px !important;
            white-space: nowrap !important;
          }
        }
      `}</style>
      {/* Heading */}
      <h2
        style={{
          font: `600 32px/42px ${HK}`,
          color: "#124446",
          textAlign: "center",
          margin: 0,
        }}
      >
        Browse New Projects in India
      </h2>

      {/* City chips row */}
      <div
        className="city-chips-container"
        style={{
          display: "flex",
          gap: 40,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap",
          padding: "0 120px",
          boxSizing: "border-box",
        }}
      >
        {displayCities.map((city) => {
          const isSelected = city.name.toLowerCase() === selectedCity.toLowerCase();
          const imgSrc =
            city.image ||
            city.coverImage ||
            CITY_FALLBACK_IMAGES[city.name] ||
            DEFAULT_CITY_IMAGE;

          return (
            <button
              key={city.id || city.name}
              type="button"
              onClick={() => setSelectedCity(city.name)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 12,
                cursor: "pointer",
                border: isSelected ? "0.5px solid #D3A479" : "0.5px solid transparent",
                background: isSelected ? "rgba(18,68,70,0.2)" : "transparent",
                opacity: isSelected ? 1 : 0.5,
                width: 125,
                height: 126,
                boxSizing: "border-box",
                transition: "all 150ms ease",
                outline: "none",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) (e.currentTarget as HTMLButtonElement).style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) (e.currentTarget as HTMLButtonElement).style.opacity = "0.5";
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={city.name}
                width={80}
                height={80}
                style={{ borderRadius: "50%", objectFit: "cover", width: 80, height: 80, border: "1px solid #D3A479", boxSizing: "border-box" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_CITY_IMAGE;
                }}
              />
              <span
                style={{
                  font: `600 16px/21px ${HK}`,
                  color: "#124446",
                  textAlign: "center",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {city.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabs row */}
      <div
        className="city-tabs-row"
        style={{
          display: "flex",
          gap: 36,
          alignItems: "center",
          paddingTop: 16,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 24px",
                font: `600 20px/26px ${HK}`,
                cursor: "pointer",
                background: "none",
                border: "none",
                borderBottom: isActive ? "1px solid #D3A479" : "1px solid transparent",
                color: isActive ? "#124446" : "#557173",
                outline: "none",
                transition: "color 150ms ease, border-color 150ms ease",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Project showcase — passes filtered projects */}
      <ProjectShowcaseSection
        projects={filteredProjects}
        selectedCity={selectedCity}
      />
    </section>
  );
}
