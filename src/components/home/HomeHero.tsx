"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { City } from "@/models/city";
import type { Developer } from "@/models/developer";

interface HomeHeroProps {
  cities?: City[];
  developers?: Developer[];
}

const HK = 'var(--font-hanken,"Hanken Grotesk"),sans-serif';
const PJ = 'var(--font-plus-jakarta,"Plus Jakarta Sans"),sans-serif';

/** Small caret icon used to replace default select arrow */
function Caret() {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path d="M1 1L6 7L11 1" stroke="#124446" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Location pin SVG */
function LocationPin() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
        fill="#557173"
      />
    </svg>
  );
}

export function HomeHero({ cities = [], developers = [] }: HomeHeroProps) {
  const router = useRouter();

  const [city, setCity] = useState("All");
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [bhk, setBhk] = useState("All");
  const [status, setStatus] = useState("All");
  const [budget, setBudget] = useState("All");
  const [developer, setDeveloper] = useState("All");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== "All") params.set("city", city);
    if (query.trim()) params.set("q", query.trim());
    if (propertyType !== "All") params.set("type", propertyType);
    if (bhk !== "All") params.set("bhk", bhk);
    if (status !== "All") params.set("status", status);
    if (budget !== "All") params.set("budget", budget);
    if (developer !== "All") params.set("developer", developer);

    router.push(`/search?${params.toString()}`);
  }

  /* ── Shared filter select style ── */
  const filterSelectStyle: React.CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    background: "none",
    border: 0,
    color: "#124446",
    fontFamily: HK,
    fontSize: 16,
    fontWeight: 400,
    cursor: "pointer",
    outline: "none",
    padding: 0,
  };

  const filterWrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  };

  return (
    <>
      {/* ── Responsive overrides injected as a <style> tag ── */}
      <style>{`
        .hero-section {
          position: relative;
          height: 1000px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 56px;
          border-bottom: 1px solid #F8FFFB;
          overflow: hidden;
        }
        .hero-search-wrapper {
          position: relative;
          z-index: 1;
          width: 845px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }
        .hero-heading-block {
          width: 736px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 900px) {
          .hero-search-wrapper {
            width: 100%;
            padding: 0 16px;
            box-sizing: border-box;
          }
          .hero-heading-block {
            width: 100%;
            padding: 0 16px;
            box-sizing: border-box;
          }
        }
        @media (max-width: 768px) {
          .hero-section {
            height: auto;
            min-height: 600px;
            gap: 32px;
            padding: 48px 0;
          }
          .hero-top-bar {
            flex-direction: column !important;
            height: auto !important;
            gap: 10px !important;
          }
          .hero-city-select {
            width: 100% !important;
          }
          .hero-search-input {
            width: 100% !important;
          }
          .hero-search-btn {
            width: 100% !important;
          }
          .hero-filter-bar {
            height: auto !important;
            flex-wrap: wrap !important;
            gap: 16px !important;
            padding: 12px !important;
          }
          .hero-line1 {
            font-size: 36px !important;
          }
          .hero-line2 {
            font-size: 30px !important;
          }
        }
      `}</style>

      <section className="hero-section">
        {/* ── Background image ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home_hero_bg.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-1.56%",
            top: 0,
            width: "103.36%",
            height: "99.99%",
            objectFit: "fill",
          }}
        />

        {/* ── Gradient overlay ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(18,68,70,.75) 30%, rgba(18,68,70,.25) 68.269%, #F8FFFB 100%)",
          }}
        />

        {/* ── Heading block ── */}
        <div className="hero-heading-block">
          <span
            className="hero-line1"
            style={{
              fontFamily: PJ,
              fontWeight: 500,
              fontSize: 64,
              lineHeight: "normal",
              color: "#FFFFFF",
              display: "block",
            }}
          >
            Find Your Dream Home,
          </span>
          <span
            className="hero-line2"
            style={{
              fontFamily: HK,
              fontWeight: 500,
              fontSize: 56,
              lineHeight: "normal",
              color: "#F8FFFB",
              display: "block",
            }}
          >
            Not Just A Property.
          </span>
        </div>

        {/* ── Search card wrapper ── */}
        <div className="hero-search-wrapper">
          <form onSubmit={handleSearch} style={{ width: "100%", display: "contents" }}>

            {/* ── Top bar ── */}
            <div
              className="hero-top-bar"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
                background: "#F8FFFB",
                border: "1px solid #124446",
                borderRadius: 8,
                boxSizing: "border-box",
                gap: 12,
              }}
            >
              {/* City select */}
              <select
                className="hero-city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="Select City"
                style={{
                  width: 142,
                  height: 40,
                  background: "#F8FFFB",
                  border: "1px solid #124446",
                  borderRadius: 5,
                  color: "#557173",
                  fontFamily: HK,
                  fontSize: 16,
                  fontWeight: 400,
                  padding: "0 8px",
                  appearance: "none",
                  WebkitAppearance: "none",
                  cursor: "pointer",
                  outline: "none",
                  flexShrink: 0,
                }}
              >
                <option value="All">All Cities</option>
                {cities.length > 0 ? (
                  cities.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Noida">Noida</option>
                  </>
                )}
              </select>

              {/* Search input */}
              <input
                className="hero-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                style={{
                  width: 465,
                  height: 40,
                  background: "#F8FFFB",
                  border: "1px solid #124446",
                  borderRadius: 5,
                  padding: "10px 18px",
                  fontFamily: HK,
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#124446",
                  outline: "none",
                  boxSizing: "border-box",
                  flexShrink: 1,
                  flexGrow: 1,
                }}
              />

              {/* Location pin */}
              <LocationPin />

              {/* Search button */}
              <button
                type="submit"
                className="hero-search-btn"
                style={{
                  width: 110,
                  height: 40,
                  background: "#124446",
                  color: "#F8FFFB",
                  border: "none",
                  borderRadius: 5,
                  padding: "10px 24px 10px 28px",
                  boxShadow: "2px 4px 2px rgba(0,0,0,.25)",
                  fontFamily: HK,
                  fontSize: 16,
                  fontWeight: 400,
                  cursor: "pointer",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Search
              </button>
            </div>

            {/* ── Filter bar ── */}
            <div
              className="hero-filter-bar"
              style={{
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 40,
                padding: "10px 16px",
                background: "#F8FFFB",
                border: "1px solid #124446",
                borderRadius: 6,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Property Type */}
              <label style={filterWrapStyle}>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  aria-label="Property Type"
                  style={filterSelectStyle}
                >
                  <option value="All">Property Type</option>
                  <option value="High Rise">High Rise</option>
                  <option value="Low Rise">Low Rise</option>
                  <option value="Plots">Plots</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <Caret />
              </label>

              {/* Configuration */}
              <label style={filterWrapStyle}>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  aria-label="Configuration"
                  style={filterSelectStyle}
                >
                  <option value="All">Configuration</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="5 BHK">5 BHK+</option>
                </select>
                <Caret />
              </label>

              {/* Status */}
              <label style={filterWrapStyle}>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  aria-label="Status"
                  style={filterSelectStyle}
                >
                  <option value="All">Status</option>
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready To Move-In">Ready To Move</option>
                </select>
                <Caret />
              </label>

              {/* Budget */}
              <label style={filterWrapStyle}>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  aria-label="Budget"
                  style={filterSelectStyle}
                >
                  <option value="All">Budget</option>
                  <option value="Under 1.5 Cr">Under ₹1.5 Cr</option>
                  <option value="1.5 - 3 Cr">₹1.5 – ₹3 Cr</option>
                  <option value="3 - 5 Cr">₹3 – ₹5 Cr</option>
                  <option value="Above 5 Cr">Above ₹5 Cr</option>
                </select>
                <Caret />
              </label>

              {/* Developer */}
              <label style={filterWrapStyle}>
                <select
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  aria-label="Developer"
                  style={filterSelectStyle}
                >
                  <option value="All">Developer</option>
                  {developers.length > 0 ? (
                    developers.map((d) => (
                      <option key={d.id || d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="DLF">DLF</option>
                      <option value="Godrej Properties">Godrej Properties</option>
                      <option value="Prestige Group">Prestige Group</option>
                      <option value="Sobha">Sobha</option>
                      <option value="Oberoi Realty">Oberoi Realty</option>
                    </>
                  )}
                </select>
                <Caret />
              </label>
            </div>

          </form>
        </div>
      </section>
    </>
  );
}
