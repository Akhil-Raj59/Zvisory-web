"use client";

import { useState } from "react";
import Link from "next/link";
import type { Developer } from "@/models/developer";

const HK = '"Hanken Grotesk", system-ui, sans-serif';
const PJS = '"Plus Jakarta Sans", sans-serif';

const DEFAULT_DEVELOPERS: { name: string; slug: string; logo?: string }[] = [
  {
    name: "Prestige Group",
    slug: "prestige-group",
    logo: "https://images.seeklogo.com/logo-png/43/1/prestige-group-logo-png_seeklogo-431872.png",
  },
  {
    name: "Godrej Properties",
    slug: "godrej-properties",
    logo: "https://images.seeklogo.com/logo-png/24/1/godrej-properties-logo-png_seeklogo-249539.png",
  },
  {
    name: "DLF",
    slug: "dlf",
  },
  {
    name: "Sobha",
    slug: "sobha",
  },
  {
    name: "Oberoi Realty",
    slug: "oberoi-realty",
  },
  {
    name: "Tata Housing",
    slug: "tata-housing",
  },
  {
    name: "Brigade Group",
    slug: "brigade-group",
  },
  {
    name: "Lodha",
    slug: "lodha",
  },
];

interface HomeDeveloperShowcaseProps {
  developers?: Developer[];
}

export function HomeDeveloperShowcase({ developers = [] }: HomeDeveloperShowcaseProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const devList =
    developers.length >= 4
      ? developers.map((d) => ({
          name: d.name,
          slug: d.slug || d.name.toLowerCase().replace(/\s+/g, "-"),
          logo: d.logo,
          projectCount: d.publishedProjectsCount || d.projectCount || 10,
          minPrice: d.minPrice || "1.5 Cr onwards",
        }))
      : DEFAULT_DEVELOPERS.map((d) => ({
          ...d,
          projectCount: 8,
          minPrice: "1.5 Cr onwards",
        }));

  const totalDevs = devList.length;
  // Display 4 cards visible at a time on desktop
  const VISIBLE_COUNT = 4;
  const maxIndex = Math.max(0, totalDevs - VISIBLE_COUNT);

  function handlePrev() {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  }

  function handleNext() {
    setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 40) {
      handlePrev();
    } else if (deltaX < -40) {
      handleNext();
    }
    setTouchStartX(null);
  }

  const visibleDevs = devList.slice(startIndex, startIndex + VISIBLE_COUNT);
  // Wrap around if needed to always show 4
  if (visibleDevs.length < VISIBLE_COUNT && totalDevs >= VISIBLE_COUNT) {
    visibleDevs.push(...devList.slice(0, VISIBLE_COUNT - visibleDevs.length));
  }

  return (
    <section
      style={{
        background: "#124446",
        padding: "64px 150px 72px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 56,
        boxSizing: "border-box",
        width: "100%",
        overflow: "hidden",
      }}
      className="devs-section"
    >
      <style>{`
        @media (max-width: 1440px) {
          .devs-section { padding: 56px 40px 64px !important; }
        }
        @media (max-width: 1024px) {
          .devs-section { padding: 48px 24px 56px !important; gap: 32px !important; }
          .devs-carousel { width: 100% !important; gap: 16px !important; }
          .devs-row { flex-wrap: wrap !important; justify-content: center !important; gap: 20px !important; }
        }
        @media (max-width: 768px) {
          .devs-section { padding: 36px 16px 44px !important; gap: 24px !important; }
          .devs-card {
            width: 260px !important;
            height: 260px !important;
            padding: 12px !important;
          }
        }
      `}</style>

      {/* Heading */}
      <h2
        style={{
          margin: 0,
          font: `600 32px/normal ${PJS}`,
          color: "#F8FFFB",
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        Our Top Developers
      </h2>

      {/* Carousel with Touch Support */}
      <div
        className="devs-carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          width: 1544,
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "8px 0 16px",
          justifyContent: "center",
        }}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous developers"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1.5px solid #D3A479",
            background: "transparent",
            color: "#D3A479",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            fontSize: 16,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(211,164,121,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          ←
        </button>

        {/* 4 Developer Tiles Row */}
        <div
          className="devs-row"
          style={{
            display: "flex",
            gap: 40,
            justifyContent: "center",
            flex: 1,
          }}
        >
          {visibleDevs.map((dev, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <Link
                key={`${dev.slug}-${idx}`}
                href={`/developers/${dev.slug}`}
                className="devs-card"
                style={{
                  width: 326,
                  height: 303,
                  boxSizing: "border-box",
                  background: isHovered ? "#FFFFFF" : "#F8FFFB",
                  border: isHovered ? "1.5px solid #124446" : "1px solid #D3A479",
                  borderRadius: 8,
                  padding: 16,
                  filter: isHovered
                    ? "drop-shadow(0 8px 16px rgba(0,0,0,0.2))"
                    : "drop-shadow(0 4px 3px rgba(0,0,0,0.25))",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  flexShrink: 0,
                  transition: "all 0.25s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Standard View */}
                {dev.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={dev.logo}
                    alt={dev.name}
                    style={{
                      width: 292,
                      height: 110,
                      objectFit: "contain",
                      transition: "transform 0.2s ease",
                      transform: isHovered ? "scale(0.95)" : "scale(1)",
                    }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : null}

                {/* Developer Name text */}
                <span
                  style={{
                    font: `600 22px/normal ${HK}`,
                    color: "#124446",
                    textAlign: "center",
                    marginTop: dev.logo ? 8 : 0,
                    maxWidth: 292,
                  }}
                >
                  {dev.name}
                </span>

                {/* Hover Details view (project count, min price, view projects link) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 10,
                    opacity: isHovered ? 1 : 0.85,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      font: `500 12px ${HK}`,
                      color: "#557173",
                      background: "rgba(18,68,70,0.08)",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {dev.projectCount} Projects · From ₹{dev.minPrice}
                  </span>

                  <span
                    style={{
                      font: `600 13px ${HK}`,
                      color: isHovered ? "#124446" : "#D3A479",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    View Projects →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next developers"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1.5px solid #D3A479",
            background: "transparent",
            color: "#D3A479",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            fontSize: 16,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(211,164,121,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          →
        </button>
      </div>
    </section>
  );
}
