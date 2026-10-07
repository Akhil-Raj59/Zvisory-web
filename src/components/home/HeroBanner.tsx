"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroBanner() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [launchStatus, setLaunchStatus] = useState("All");
  const [budget, setBudget] = useState("All");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (propertyType !== "All") params.set("type", propertyType);
    if (launchStatus !== "All") params.set("status", launchStatus);
    if (budget !== "All") params.set("budget", budget);

    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative w-full min-h-[550px] lg:min-h-[650px] flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 transform scale-105 transition-transform duration-10000 hover:scale-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#124446] via-[#124446]/70 to-slate-950/80" />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white space-y-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#D3A479] text-[#124446] tracking-wider uppercase shadow-md">
            ✨ Premium Real Estate Advisory
          </span> */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
            Find Your Dream Luxury Home &amp; Investment
          </h1>
          <p className="text-base sm:text-lg text-[#BDD4E7] font-medium max-w-2xl mx-auto">
            Discover verified high-rise apartments, luxury low-rise floors, plots, and commercial properties with expert advisory.
          </p>
        </div>

        {/* Section 1.2 Search Bar Component */}
        <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20 text-slate-900">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Top Search Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by City name, Project name, area name (e.g. Gurugram, DLF Midtown, Sector 111)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#124446] focus:bg-white transition-colors"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Property Type Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 text-left">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#124446]"
                >
                  <option value="All">All Property Types</option>
                  <option value="High Rise">High Rise</option>
                  <option value="Low Rise">Low Rise</option>
                  <option value="Plots">Plots</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Launch Status Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 text-left">
                  Launch Status
                </label>
                <select
                  value={launchStatus}
                  onChange={(e) => setLaunchStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#124446]"
                >
                  <option value="All">All Launch Statuses</option>
                  <option value="Pre Launch">Pre Launch</option>
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready to Move-in (New)">Ready to Move-in (New)</option>
                  <option value="Ready to Move-in (Resale)">Ready to Move-in (Resale)</option>
                </select>
              </div>

              {/* Budget Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 text-left">
                  Budget Range
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#124446]"
                >
                  <option value="All">All Budgets</option>
                  <option value="Under 1 Cr">Under 1 Cr</option>
                  <option value="1 – 2 Cr">1 – 2 Cr</option>
                  <option value="2 – 3 Cr">2 – 3 Cr</option>
                  <option value="3 – 5 Cr">3 – 5 Cr</option>
                  <option value="5 Cr +">5 Cr +</option>
                </select>
              </div>
            </div>

            {/* Call To Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Search Properties</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
