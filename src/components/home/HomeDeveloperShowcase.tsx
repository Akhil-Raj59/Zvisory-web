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
    logo: "/figma-assets/Top developers/eagle_and_circle_(Prestige).png",
  },
  {
    name: "Godrej Properties",
    slug: "godrej-properties",
    logo: "/figma-assets/Top developers/godrej-properties-seeklogo.png",
  },
  {
    name: "Birla Estates",
    slug: "birla-estates",
    logo: "/figma-assets/Top developers/Birla.svg",
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
  // Display 5 or 6 cards visible at a time on desktop
  const VISIBLE_COUNT = 5;
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
  // Wrap around if needed to always show VISIBLE_COUNT
  if (visibleDevs.length < VISIBLE_COUNT && totalDevs >= VISIBLE_COUNT) {
    visibleDevs.push(...devList.slice(0, VISIBLE_COUNT - visibleDevs.length));
  }

  return (
    <section
      style={{
        background: "#124446",
        padding: "64px 120px 72px",
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
          .devs-row { overflow-x: auto !important; flex-wrap: nowrap !important; justify-content: flex-start !important; gap: 16px !important; }
        }
        @media (max-width: 768px) {
          .devs-section { padding: 36px 16px 44px !important; gap: 24px !important; }
          .devs-carousel { padding: 0 !important; width: 100% !important; }
          .devs-carousel button { display: none !important; }
          .devs-row {
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            gap: 12px !important;
            padding: 8px 0 !important;
            scroll-snap-type: x mandatory;
          }
          .devs-row::-webkit-scrollbar { display: none; }
          .devs-row { -ms-overflow-style: none; scrollbar-width: none; }
          .devs-card {
            width: 180px !important;
            height: 190px !important;
            padding: 8px !important;
            scroll-snap-align: start;
          }
        }
      `}</style>

      {/* Heading */}
      <h2
        style={{
          margin: 0,
          font: `600 32px/40px ${PJS}`,
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
          width: "100%",
          maxWidth: 1581,
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "8px 0",
          justifyContent: "center",
        }}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous developers"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid #D3A479",
            background: "transparent",
            color: "#D3A479",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            fontSize: 18,
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

        {/* Developer Tiles Row */}
        <div
          className="devs-row"
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            overflow: "hidden",
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
                  width: 217,
                  height: 221,
                  boxSizing: "border-box",
                  background: isHovered ? "#FFFFFF" : "#124446",
                  border: "0.5px solid #D3A479",
                  borderRadius: 8,
                  padding: 8,
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
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
                {/* Logo Image */}
                <div
                  style={{
                    width: 200,
                    height: 95,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isHovered ? "transparent" : "#FFFFFF",
                    borderRadius: 6,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                >
                  {dev.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={dev.logo}
                      alt={dev.name}
                      style={{
                        maxWidth: 180,
                        maxHeight: 75,
                        objectFit: "contain",
                        transition: "transform 0.2s ease",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                      }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        font: `600 18px ${HK}`,
                        color: "#124446",
                        textAlign: "center",
                      }}
                    >
                      {dev.name}
                    </span>
                  )}
                </div>

                {/* Developer Name text */}
                <span
                  style={{
                    font: `600 18px/23px ${HK}`,
                    color: isHovered ? "#124446" : "#F8FFFB",
                    textAlign: "center",
                    marginTop: 8,
                    maxWidth: 190,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {dev.name}
                </span>

                {/* Details view (project count, view projects link) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  <span
                    style={{
                      font: `400 12px/16px ${HK}`,
                      color: isHovered ? "#557173" : "#D3A479",
                    }}
                  >
                    {dev.projectCount} Projects
                  </span>
                  <span
                    style={{
                      font: `400 12px ${HK}`,
                      color: isHovered ? "#124446" : "#D3A479",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    View →
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
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid #D3A479",
            background: "transparent",
            color: "#D3A479",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            fontSize: 18,
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
