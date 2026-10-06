"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { propertyService, PropertyFilterOptions } from "@/services/propertyService";
import { Property } from "@/mock/properties";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function SearchContent() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Filters state
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "All");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "All");
  const [launchStatus, setLaunchStatus] = useState(searchParams.get("status") || "All");
  const [budget, setBudget] = useState(searchParams.get("budget") || "All");
  const [unitConfig, setUnitConfig] = useState("All");

  // Comparison state (up to 3 properties)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      const filters: PropertyFilterOptions = {
        searchQuery: query,
        city,
        propertyType,
        launchStatus,
        budget,
        unitConfig
      };
      const res = await propertyService.getAllProperties(filters);
      setProperties(res);
      setLoading(false);
    }
    fetchProperties();
  }, [query, city, propertyType, launchStatus, budget, unitConfig]);

  function toggleCompare(id: string) {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert("You can compare up to 3 properties at a time.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  }

  const comparedProperties = properties.filter((p) => selectedForCompare.includes(p.id));

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search & Filter Top Sticky Header (Section 2.2) */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by city, project name, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#124446]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between sm:justify-end">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "grid" ? "bg-[#124446] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "list" ? "bg-[#124446] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                List View
              </button>
            </div>

            {/* Filter Pop-up Trigger */}
            <button
              onClick={() => setFilterModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#BDD4E7]/40 hover:bg-[#BDD4E7] text-[#124446] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Filters</span>
              <span className="w-2 h-2 rounded-full bg-[#124446]"></span>
            </button>

            {/* Compare Drawer Trigger */}
            {selectedForCompare.length > 0 && (
              <button
                onClick={() => setCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#D3A479] text-[#124446] text-xs font-bold uppercase tracking-wider transition-colors shadow-md animate-pulse cursor-pointer"
              >
                Compare ({selectedForCompare.length}/3)
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider">Quick Filters:</span>
          {["High Rise", "Low Rise", "Plots", "Commercial"].map((type) => (
            <button
              key={type}
              onClick={() => setPropertyType(propertyType === type ? "All" : type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                propertyType === type ? "bg-[#124446] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
          {["Under 1 Cr", "1 – 2 Cr", "2 – 3 Cr", "3 – 5 Cr", "5 Cr +"].map((b) => (
            <button
              key={b}
              onClick={() => setBudget(budget === b ? "All" : b)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                budget === b ? "bg-[#D3A479] text-[#124446]" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Property Listings (Section 2.4) */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading property listings...</div>
      ) : properties.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="text-4xl">🏙️</div>
          <h3 className="text-lg font-bold text-slate-800">No properties match your exact filters</h3>
          <p className="text-xs text-slate-500">Try resetting filters to see more results.</p>
          <button
            onClick={() => {
              setQuery("");
              setCity("All");
              setPropertyType("All");
              setLaunchStatus("All");
              setBudget("All");
              setUnitConfig("All");
            }}
            className="px-4 py-2 rounded-xl bg-[#124446] text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <img src={prop.image} alt={prop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-3 left-3 bg-[#124446] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                  {prop.status}
                </div>
                <button
                  onClick={() => toggleCompare(prop.id)}
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors shadow-sm ${
                    selectedForCompare.includes(prop.id)
                      ? "bg-[#D3A479] text-[#124446]"
                      : "bg-black/60 text-white hover:bg-black"
                  }`}
                >
                  {selectedForCompare.includes(prop.id) ? "✓ Compared" : "+ Compare"}
                </button>
                <div className="absolute bottom-3 right-3 bg-white text-[#124446] font-bold text-xs px-3 py-1 rounded-lg shadow-sm">
                  {prop.price}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8693AB]">
                    {prop.type} · {prop.city}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#124446] transition-colors leading-snug">
                    {prop.name}
                  </h3>
                  <p className="text-xs text-slate-500">📍 {prop.location}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5">{prop.description}</p>
                </div>

                <Link
                  href={`/properties/${prop.id}`}
                  className="w-full py-2.5 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold uppercase tracking-wider text-center block transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-64 h-48 sm:h-auto shrink-0 relative bg-slate-100">
                <img src={prop.image} alt={prop.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-[#124446] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {prop.status}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8693AB]">
                      {prop.type} · {prop.city}
                    </span>
                    <span className="text-base font-black text-[#124446]">{prop.price}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{prop.name}</h3>
                  <p className="text-xs text-slate-500">📍 {prop.location}</p>
                  <p className="text-xs text-slate-600 mt-2">{prop.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100">Area: {prop.area}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">Possession: {prop.possessionTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href={`/properties/${prop.id}`}
                    className="px-5 py-2.5 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    View Details →
                  </Link>
                  <button
                    onClick={() => toggleCompare(prop.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedForCompare.includes(prop.id)
                        ? "bg-[#D3A479] text-[#124446]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {selectedForCompare.includes(prop.id) ? "✓ Comparing" : "+ Compare"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property Comparison Modal (Section 2.3) */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#124446]">Property Comparison Tool</h3>
              <button onClick={() => setCompareModalOpen(false)} className="text-slate-500 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              {comparedProperties.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl space-y-2 border">
                  <img src={p.image} alt={p.name} className="h-24 w-full object-cover rounded-lg" />
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h4>
                  <p className="font-black text-[#124446]">{p.price}</p>
                  <p>📍 {p.location}</p>
                  <p>📐 {p.area}</p>
                  <p>🏢 Type: {p.type}</p>
                  <p>⏳ Status: {p.status}</p>
                  <p>🔑 Possession: {p.possessionTime}</p>
                  <p>📜 RERA: {p.reraNo || "N/A"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Pop-up Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4 border">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-bold text-slate-900">Advanced Property Filters</h3>
              <button onClick={() => setFilterModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-white"
                >
                  <option value="All">All Cities</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Noida">Noida</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-white"
                >
                  <option value="All">All Property Types</option>
                  <option value="High Rise">High Rise</option>
                  <option value="Low Rise">Low Rise</option>
                  <option value="Plots">Plots</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Launch Status</label>
                <select
                  value={launchStatus}
                  onChange={(e) => setLaunchStatus(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pre Launch">Pre Launch</option>
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready to Move-in (New)">Ready to Move-in (New)</option>
                  <option value="Ready to Move-in (Resale)">Ready to Move-in (Resale)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Unit Configuration</label>
                <select
                  value={unitConfig}
                  onChange={(e) => setUnitConfig(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-white"
                >
                  <option value="All">All Configurations</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="4 BHK+">4 BHK+</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setFilterModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#124446] text-white font-bold text-xs uppercase"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />
      <Suspense fallback={<div className="p-10 text-center">Loading search results...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
