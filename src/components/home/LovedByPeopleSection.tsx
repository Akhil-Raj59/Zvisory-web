"use client";

import { useState } from "react";
import type { Testimonial } from "@/mock/testimonials";

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "suhana-yogi",
    name: "Suhana Yogi",
    role: "Homeowner",
    location: "Bengaluru",
    quote:
      "Zvisory provided unmatched clarity when navigating luxury high-rises in Bengaluru. Their data-driven price comparisons and unbiased advisory helped us finalize our dream apartment at significantly better terms than dealing with builders directly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    videoThumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "vikram-sharma",
    name: "Vikram & Ananya Sharma",
    role: "Homeowners",
    location: "Gurugram",
    quote:
      "Zvisory made our home buying process completely seamless. Their transparent market analysis and unbiased property comparisons saved us millions during negotiation and gave us complete peace of mind.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    videoThumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "rajesh-malhotra",
    name: "Rajesh Malhotra",
    role: "NRI Real Estate Investor",
    location: "London / Hyderabad",
    quote:
      "Managing property investments from abroad used to be stressful until I partnered with Zvisory. Their end-to-end guidance from RERA verification to registration paperwork was top-notch.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    videoThumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "priya-kapoor",
    name: "Priya Kapoor",
    role: "First-time Buyer",
    location: "Mumbai",
    quote:
      "As a first-time homebuyer, the process felt overwhelming. Zvisory's advisors walked me through every step and helped me find the perfect flat in Mumbai within my budget.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    videoThumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  },
];

const STATS = [
  { value: "3,000+", label: "Homes Sold" },
  { value: "₹2,500 Cr+", label: "Advised Value" },
  { value: "50+", label: "Top Developers" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15+", label: "Years Experience" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=813&q=80";

const jakartaSans: React.CSSProperties = {
  fontFamily: '"Plus Jakarta Sans", sans-serif',
};

const hankenGrotesk: React.CSSProperties = {
  fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
};

interface LovedByPeopleSectionProps {
  testimonials?: Testimonial[];
}

export function LovedByPeopleSection({
  testimonials,
}: LovedByPeopleSectionProps) {
  const items =
    testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = items[currentIndex] || items[0];

  function handlePrev() {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }

  // Show 4 pager dots (spec says 4 dots regardless)
  const DOT_COUNT = 4;

  return (
    <section style={{ background: "#124446" }}>
      {/* ── Band 1: Testimonial ── */}
      <div
        style={{
          background: "#124446",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="testimonial-band"
      >
        {/* Inner row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
          className="testimonial-inner-row"
        >
          {/* ── Left Column ── */}
          <div
            style={{
              padding: "10px 0",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignSelf: "stretch",
            }}
            className="testimonial-left-col"
          >
            {/* Title */}
            <h2
              style={{
                ...jakartaSans,
                fontWeight: 600,
                fontSize: "32px",
                lineHeight: "normal",
                color: "#F8FFFB",
                margin: 0,
              }}
            >
              We Are Loved By People From All Parts Of The Country
            </h2>

            {/* Subtitle */}
            <p
              style={{
                ...hankenGrotesk,
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "normal",
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Real Stories. Real People. Real Trust.
            </p>

            {/* Content block */}
            <div
              style={{
                paddingTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Author row */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#F8FFFB",
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.avatar}
                    alt={current.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Name block */}
                <div>
                  <div
                    style={{
                      ...hankenGrotesk,
                      fontWeight: 400,
                      fontSize: "16px",
                      color: "#F8FFFB",
                    }}
                  >
                    {current.name}
                  </div>
                  <div
                    style={{
                      ...hankenGrotesk,
                      fontWeight: 400,
                      fontSize: "12px",
                      color: "#FFFFFF",
                    }}
                  >
                    {current.location}
                  </div>
                </div>
              </div>

              {/* Quote text row */}
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                {/* Opening quote mark — rotated 180° to look like a closing/decorative glyph */}
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 36,
                    height: 26,
                    flexShrink: 0,
                    fontSize: "36px",
                    lineHeight: "26px",
                    color: "#D3A479",
                    transform: "rotate(180deg)",
                    fontFamily: "Georgia, serif",
                    userSelect: "none",
                  }}
                >
                  &ldquo;
                </span>

                <p
                  style={{
                    ...hankenGrotesk,
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  {current.quote}
                </p>
              </div>
            </div>

            {/* Pager */}
            <div
              style={{
                display: "flex",
                gap: "60px",
                alignItems: "center",
                height: "24px",
                width: "218px",
              }}
            >
              {/* Left arrow */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                style={{
                  width: 24,
                  height: 24,
                  color: "#FFFFFF",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ←
              </button>

              {/* Dots */}
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                {Array.from({ length: DOT_COUNT }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx % items.length)}
                    aria-label={`Go to slide ${idx + 1}`}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        idx === currentIndex
                          ? "#FFFFFF"
                          : "rgba(255,255,255,0.4)",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>

              {/* Right arrow */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                style={{
                  width: 24,
                  height: 24,
                  color: "#FFFFFF",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* ── Right Column: Image ── */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.videoThumbnail || FALLBACK_IMAGE}
            alt="Luxury property"
            className="testimonial-right-img"
            style={{
              borderRadius: "120px 0 120px 0",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* ── Band 2: Stats ── */}
      <div
        style={{
          background: "#124446",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="stats-band"
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#D3A479",
              padding: "20px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              color: "#124446",
            }}
            className="stat-card"
          >
            <div
              style={{
                ...jakartaSans,
                fontWeight: 600,
                fontSize: "32px",
                lineHeight: "normal",
                color: "#124446",
                whiteSpace: "nowrap",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                ...hankenGrotesk,
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "normal",
                color: "#124446",
                whiteSpace: "nowrap",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        /* Desktop defaults */
        .testimonial-band {
          padding: 72px 150px 0;
        }
        .testimonial-inner-row {
          flex-direction: row;
        }
        .testimonial-left-col {
          width: 619px;
        }
        .testimonial-right-img {
          width: 813px;
          height: 408px;
        }
        .stats-band {
          padding: 56px 0 72px;
          gap: 68px;
          flex-wrap: nowrap;
        }

        /* Mobile (<768px) */
        @media (max-width: 767px) {
          .testimonial-band {
            padding: 48px 24px 0;
          }
          .testimonial-inner-row {
            flex-direction: column;
            gap: 32px;
          }
          .testimonial-left-col {
            width: 100%;
          }
          .testimonial-right-img {
            width: 100%;
            height: 220px;
          }
          .stats-band {
            padding: 40px 24px 56px;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
          }
          .stat-card {
            min-width: calc(45% - 8px);
          }
        }
      `}</style>
    </section>
  );
}
