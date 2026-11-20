"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { City } from "@/models/city";
import type { Developer } from "@/models/developer";

interface HomeHeroProps {
  cities?: City[];
  developers?: Developer[];
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

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#124446]">
      {/* Background Hero Image with Dark Teal Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{
          backgroundImage: `url('/images/home_hero_bg.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#124446]/92 via-[#124446]/85 to-[#0d3233]/95" />

      {/* Decorative Subtle Grid / Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,255,241,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center text-white space-y-8">
        {/* Hero Title & Subheading matching Figma Design */}
        <div className="space-y-4 pb-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E6FFF1]/15 text-[#E6FFF1] border border-[#E6FFF1]/20 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#D3A479] animate-pulse" />
            <span>India&apos;s Trusted Luxury Property Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Find Your Dream Home,
            <span className="block text-[#E6FFF1] mt-1">Not Just A Property.</span>
          </h1>

          {/* <p className="text-sm sm:text-base lg:text-lg text-[#E6FFF1]/80 max-w-2xl mx-auto font-normal leading-relaxed">
            Curated luxury residences, transparent market insights, and personalized real estate advisory across India&apos;s prime metropolitan corridors.
          </p> */}
        </div>

        {/* Floating Search Card */}
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-4 sm:p-6 border border-[#E5EDE9] text-slate-800">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Top Row: City Selector + Search Input + Search Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* City Selector */}
              <div className="relative sm:w-48 shrink-0">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">
                  📍
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-8 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#124446] focus:bg-white appearance-none cursor-pointer"
                  aria-label="Select City"
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
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {/* Keyword Search Input */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">
                  🔍
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by project, locality, developer..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#124446] focus:bg-white transition-all"
                />
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-[#124446] hover:bg-[#0d3233] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Search</span>
                <span className="text-base leading-none">→</span>
              </button>
            </div>

            {/* Bottom Row: 5 Filter Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-100">
              {/* 1. Property Type */}
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#124446] appearance-none cursor-pointer pr-6"
                  aria-label="Property Type"
                >
                  <option value="All">Property Type: All</option>
                  <option value="High Rise">High Rise</option>
                  <option value="Low Rise">Low Rise</option>
                  <option value="Plots">Plots</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>

              {/* 2. Configuration */}
              <div className="relative">
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#124446] appearance-none cursor-pointer pr-6"
                  aria-label="Configuration"
                >
                  <option value="All">Configuration: All</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="5 BHK">5 BHK+</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>

              {/* 3. Status */}
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#124446] appearance-none cursor-pointer pr-6"
                  aria-label="Status"
                >
                  <option value="All">Status: All</option>
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready To Move-In">Ready To Move</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>

              {/* 4. Budget */}
              <div className="relative">
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#124446] appearance-none cursor-pointer pr-6"
                  aria-label="Budget"
                >
                  <option value="All">Budget: All</option>
                  <option value="Under 1.5 Cr">Under ₹1.5 Cr</option>
                  <option value="1.5 - 3 Cr">₹1.5 - ₹3 Cr</option>
                  <option value="3 - 5 Cr">₹3 - ₹5 Cr</option>
                  <option value="Above 5 Cr">Above ₹5 Cr</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>

              {/* 5. Developer */}
              <div className="relative col-span-2 sm:col-span-1">
                <select
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#124446] appearance-none cursor-pointer pr-6"
                  aria-label="Developer"
                >
                  <option value="All">Developer: All</option>
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
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

