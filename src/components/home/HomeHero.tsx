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

/** Caret icon using Figma SVG */
function Caret() {
  return (
    <img
      src="/figma-assets/Header+ banner/arrow_drop_down_.svg"
      alt=""
      width={18}
      height={18}
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}

/** Location pin SVG */
function LocationPin() {
  return (
    <img
      src="/figma-assets/Header+ banner/my_location_24dp_124446_FILL0_wght400_GRAD0_opsz24.svg"
      alt=""
      width={20}
      height={20}
      style={{ display: "block", flexShrink: 0 }}
    />
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
  const [detectingLocation, setDetectingLocation] = useState(false);

  function handleDetectCity() {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        const { latitude, longitude } = pos.coords;
        // Known active cities with coordinates
        const cityCoords = [
          { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
          { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
          { name: "Gurugram", lat: 28.4595, lon: 77.0266 },
          { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
          { name: "Pune", lat: 18.5204, lon: 73.8567 },
          { name: "Noida", lat: 28.5355, lon: 77.3910 },
        ];
        let closest = "Hyderabad";
        let minDist = Infinity;
        for (const c of cityCoords) {
          const d = Math.hypot(c.lat - latitude, c.lon - longitude);
          if (d < minDist) {
            minDist = d;
            closest = c.name;
          }
        }
        setCity(closest);
      },
      (err) => {
        setDetectingLocation(false);
        console.warn("Geolocation denied or timed out:", err.message);
        if (city === "All") {
          setCity("Hyderabad");
        }
      },
      { timeout: 8000 }
    );
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== "All") params.set("city", city);
    if (query.trim()) params.set("q", query.trim());
    if (propertyType !== "All") {
      params.set("propertyType", propertyType);
      params.set("type", propertyType);
    }
    if (bhk !== "All") {
      params.set("unitConfig", bhk);
      params.set("bhk", bhk);
    }
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
          height: 736px;
          min-height: 700px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 30px;
          border-bottom: 1px solid #F8FFFB;
          overflow: hidden;
          padding: 60px 16px;
          box-sizing: border-box;
        }
        .hero-search-wrapper {
          position: relative;
          z-index: 1;
          width: 780px;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }
        .hero-heading-block {
          width: 780px;
          max-width: 100%;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 900px) {
          .hero-section {
            height: auto !important;
            min-height: 380px !important;
            padding: 32px 16px 40px !important;
            gap: 20px !important;
          }
          .hero-search-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          .hero-heading-block {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          .hero-filter-bar {
            width: 100% !important;
            gap: 16px !important;
            height: auto !important;
            flex-wrap: wrap !important;
            padding: 12px !important;
          }
        }
        @media (max-width: 768px) {
          .hero-section {
            height: auto !important;
            min-height: 340px !important;
            gap: 18px !important;
            padding: 28px 16px 36px !important;
          }
          .hero-top-bar {
            flex-direction: column !important;
            height: auto !important;
            gap: 10px !important;
            width: 100% !important;
            padding: 12px !important;
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
            gap: 10px 16px !important;
            justify-content: flex-start !important;
            padding: 10px !important;
            width: 100% !important;
          }
          .hero-title {
            font-size: clamp(24px, 6.5vw, 36px) !important;
            line-height: 1.25 !important;
          }
        }
      `}</style>

      <section className="hero-section">
        {/* ── Background image ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma-assets/Header+ banner/Banner image.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* ── Gradient overlay ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(18, 68, 70, 0.75) 30%, rgba(18, 68, 70, 0.25) 68.27%, #F8FFFB 100%)",
          }}
        />

        {/* ── Heading block ── */}
        <div className="hero-heading-block">
          <h1
            className="hero-title"
            style={{
              fontFamily: PJ,
              fontWeight: 500,
              fontSize: 56,
              lineHeight: "71px",
              color: "#FFFFFF",
              margin: 0,
              textAlign: "center",
            }}
          >
            Find Your Dream Home, Not Just A Property.
          </h1>
        </div>

        {/* ── Search card wrapper ── */}
        <div className="hero-search-wrapper">
          <form onSubmit={handleSearch} style={{ width: "100%", display: "contents" }}>

            {/* ── Top bar (Frame 12) ── */}
            <div
              className="hero-top-bar"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                background: "#F8FFFB",
                border: "1px solid #124446",
                borderRadius: 8,
                boxSizing: "border-box",
                gap: 16,
              }}
            >
              {/* City select with location icon & caret */}
              <div
                className="hero-city-select"
                style={{
                  position: "relative",
                  width: 145,
                  height: 43,
                  background: "#F8FFFB",
                  border: "1px solid #124446",
                  borderRadius: 5,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 8px 0 10px",
                  gap: 6,
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                <LocationPin />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-label="Select City"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#124446",
                    fontFamily: HK,
                    fontSize: 16,
                    fontWeight: 400,
                    appearance: "none",
                    WebkitAppearance: "none",
                    cursor: "pointer",
                    outline: "none",
                    paddingRight: 16,
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
                <div style={{ position: "absolute", right: 8, pointerEvents: "none" }}>
                  <Caret />
                </div>
              </div>

              {/* Search input with search icon & tune icon */}
              <div
                className="hero-search-input"
                style={{
                  position: "relative",
                  height: 43,
                  background: "#F8FFFB",
                  border: "1px solid #124446",
                  borderRadius: 5,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 12px",
                  gap: 8,
                  boxSizing: "border-box",
                  flexGrow: 1,
                  flexShrink: 1,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma-assets/Header+ banner/Search.svg"
                  alt=""
                  width={20}
                  height={20}
                  style={{ display: "block", flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by Project, Locality or Developer..."
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    fontFamily: HK,
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#124446",
                    outline: "none",
                    padding: 0,
                  }}
                />
                {/* Tune / Filter icon or detect location button */}
                <button
                  type="button"
                  onClick={handleDetectCity}
                  disabled={detectingLocation}
                  title={detectingLocation ? "Detecting nearest city..." : "Detect nearest city"}
                  aria-label="Filter or detect location"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none",
                    opacity: detectingLocation ? 0.4 : 1,
                    transition: "opacity 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma-assets/Header+ banner/tune_24dp_124446_FILL0_wght400_GRAD0_opsz24.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="hero-search-btn"
                style={{
                  height: 43,
                  background: "#124446",
                  color: "#F8FFFB",
                  border: "none",
                  borderRadius: 5,
                  padding: "0 28px",
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

            {/* ── Filter bar (Frame 404 / Frame 19) ── */}
            <div
              className="hero-filter-bar"
              style={{
                width: 700,
                maxWidth: "100%",
                height: 55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 40,
                padding: "10px 16px",
                background: "#F8FFFB",
                border: "1px solid #124446",
                borderRadius: 6,
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
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="4+ BHK">4+ BHK</option>
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
                  <option value="Pre Launch">Pre Launch</option>
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready to move in (New)">Ready to move in (New)</option>
                  <option value="Ready to move in (Re Sale)">Ready to move in (Re Sale)</option>
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
                  <option value="Under 1 Cr">Under ₹1 Cr</option>
                  <option value="1 – 2 Cr">₹1 – 2 Cr</option>
                  <option value="2 – 3 Cr">₹2 – 3 Cr</option>
                  <option value="3 – 5 Cr">₹3 – 5 Cr</option>
                  <option value="5 Cr +">₹5 Cr +</option>
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
