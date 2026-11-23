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

  const devList =
    developers.length >= 4
      ? developers.map((d) => ({
          name: d.name,
          slug: d.slug || d.name.toLowerCase().replace(/\s+/g, "-"),
          logo: d.logo,
        }))
      : DEFAULT_DEVELOPERS;

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
      }}
      className="devs-section"
    >
      <style>{`
        @media (max-width: 1024px) {
          .devs-section { padding: 48px 24px 56px !important; gap: 32px !important; }
          .devs-carousel { width: 100% !important; }
          .devs-row { flex-wrap: wrap !important; justify-content: center !important; }
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

      {/* Carousel */}
      <div
        className="devs-carousel"
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
          {visibleDevs.map((dev, idx) => (
            <Link
              key={`${dev.slug}-${idx}`}
              href={`/developers/${dev.slug}`}
              style={{
                width: 326,
                height: 303,
                boxSizing: "border-box",
                background: "#F8FFFB",
                border: "1px solid #D3A479",
                borderRadius: 8,
                padding: 16,
                filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.25))",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                flexShrink: 0,
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              {dev.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dev.logo}
                  alt={dev.name}
                  style={{
                    width: 292,
                    height: 139,
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    // Fall back to clean typography
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : null}

              {/* Developer Name text */}
              <span
                style={{
                  font: `600 24px/normal ${HK}`,
                  color: "#124446",
                  textAlign: "center",
                  marginTop: dev.logo ? 12 : 0,
                  maxWidth: 292,
                }}
              >
                {dev.name}
              </span>
            </Link>
          ))}
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
