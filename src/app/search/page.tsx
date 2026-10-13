"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { projectService } from "@/services/projectService";
import { Project } from "@/models/project";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

function SafeImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  const imgSrc = !src || errored ? FALLBACK_IMG : src;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={imgSrc} alt={alt} className={className} onError={() => setErrored(true)} />;
}

function SearchContent() {
  const searchParams = useSearchParams();

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    cities: string[];
    developers: string[];
    propertyTypes: string[];
    categories: string[];
    unitConfigs: string[];
  }>({ cities: [], developers: [], propertyTypes: [], categories: [], unitConfigs: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Filters
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "All");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [developer, setDeveloper] = useState("All");
  const [unitConfig, setUnitConfig] = useState("All");
  const [budget, setBudget] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Compare state (up to 3 projects)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const [projects, opts] = await Promise.all([
        projectService.getAllProjects(),
        projectService.getFilterOptions(),
      ]);
      setAllProjects(projects);
      setFilterOptions(opts);
      setLoading(false);
    }
    init();
  }, []);

  const BUDGET_RANGES = ["Under 1 Cr", "1 – 2 Cr", "2 – 3 Cr", "3 – 5 Cr", "5 Cr +"];

  const filteredProjects = useMemo(() => {
    let result = [...allProjects];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.developer.toLowerCase().includes(q) ||
          p.microMarket.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q)) ||
          p.secondaryKeywords.some((k) => k.toLowerCase().includes(q)) ||
          p.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (city !== "All") {
      const c = city.toLowerCase();
      result = result.filter(
        (p) => p.city.toLowerCase() === c || p.location.toLowerCase().includes(c)
      );
    }

    if (category !== "All") {
      const cat = category.toLowerCase();
      result = result.filter((p) => p.categories.some((c) => c.toLowerCase() === cat));
    }

    if (developer !== "All") {
      const dev = developer.toLowerCase();
      result = result.filter((p) => p.developer.toLowerCase().includes(dev));
    }

    if (unitConfig !== "All") {
      const uc = unitConfig.toLowerCase();
      result = result.filter((p) => p.unitType.some((u) => u.toLowerCase().includes(uc)));
    }

    if (budget !== "All") {
      switch (budget) {
        case "Under 1 Cr":
          result = result.filter((p) => p.priceRaw > 0 && p.priceRaw < 10000000);
          break;
        case "1 – 2 Cr":
          result = result.filter((p) => p.priceRaw >= 10000000 && p.priceRaw <= 20000000);
          break;
        case "2 – 3 Cr":
          result = result.filter((p) => p.priceRaw >= 20000000 && p.priceRaw <= 30000000);
          break;
        case "3 – 5 Cr":
          result = result.filter((p) => p.priceRaw >= 30000000 && p.priceRaw <= 50000000);
          break;
        case "5 Cr +":
          result = result.filter((p) => p.priceRaw >= 50000000);
          break;
      }
    }

    // Sorting
    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => (a.priceRaw || 999999999) - (b.priceRaw || 999999999));
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => (b.priceRaw || 0) - (a.priceRaw || 0));
    } else if (sortBy === "name_asc") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "location_asc") {
      result = [...result].sort((a, b) => a.city.localeCompare(b.city));
    }

    return result;
  }, [allProjects, query, city, category, developer, unitConfig, budget, sortBy]);

  const comparedProjects = useMemo(
    () => allProjects.filter((p) => selectedForCompare.includes(p.slug)),
    [allProjects, selectedForCompare]
  );

  function toggleCompare(slug: string) {
    if (selectedForCompare.includes(slug)) {
      setSelectedForCompare(selectedForCompare.filter((s) => s !== slug));
    } else {
      if (selectedForCompare.length >= 3) {
        alert("You can compare up to 3 projects at a time.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, slug]);
    }
  }

  function resetFilters() {
    setQuery("");
    setCity("All");
    setCategory("All");
    setDeveloper("All");
    setUnitConfig("All");
    setBudget("All");
    setSortBy("default");
  }

  const activeFilterCount = [city, category, developer, unitConfig, budget].filter(
    (v) => v !== "All"
  ).length + (query.trim() ? 1 : 0);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Bar & Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by project, developer, city, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#124446]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between sm:justify-end flex-wrap">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#124446]"
            >
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A–Z</option>
              <option value="location_asc">Location: A–Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-[#124446] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "list"
                    ? "bg-[#124446] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                List
              </button>
            </div>

            {/* Filters trigger */}
            <button
              onClick={() => setFilterModalOpen(true)}
              className="relative px-4 py-2 rounded-xl bg-[#BDD4E7]/40 hover:bg-[#BDD4E7] text-[#124446] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-[#124446] text-white text-[9px] font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Compare trigger */}
            {selectedForCompare.length > 0 && (
              <button
                onClick={() => setCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#D3A479] text-[#124446] text-xs font-bold uppercase tracking-wider shadow-md animate-pulse"
              >
                Compare ({selectedForCompare.length}/3)
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Chips: City */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs overflow-x-auto">
          <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0">Cities:</span>
          {["All", ...filterOptions.cities].map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                city === c
                  ? "bg-[#124446] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c === "All" ? "All Cities" : c}
            </button>
          ))}
        </div>

        {/* Quick Filter Chips: Budget */}
        <div className="flex flex-wrap items-center gap-2 text-xs overflow-x-auto">
          <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0">Budget:</span>
          {BUDGET_RANGES.map((b) => (
            <button
              key={b}
              onClick={() => setBudget(budget === b ? "All" : b)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                budget === b
                  ? "bg-[#D3A479] text-[#124446]"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="text-xs text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
          <span>
            {loading
              ? "Loading..."
              : `${filteredProjects.length} of ${allProjects.length} projects`}
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-[#D3A479] font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading properties...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="text-4xl">🏙️</div>
          <h3 className="text-lg font-bold text-slate-800">No projects match your search</h3>
          <p className="text-xs text-slate-500">Try broadening your search or resetting filters.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#124446] text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.slug}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <SafeImage
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {proj.status && (
                  <div className="absolute top-3 left-3 bg-[#124446] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                    {proj.status}
                  </div>
                )}
                <button
                  onClick={() => toggleCompare(proj.slug)}
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors shadow-sm ${
                    selectedForCompare.includes(proj.slug)
                      ? "bg-[#D3A479] text-[#124446]"
                      : "bg-black/60 text-white hover:bg-black"
                  }`}
                >
                  {selectedForCompare.includes(proj.slug) ? "✓ Comparing" : "+ Compare"}
                </button>
                <div className="absolute bottom-3 right-3 bg-white text-[#124446] font-bold text-xs px-3 py-1 rounded-lg shadow-sm">
                  {proj.startingPrice}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8693AB]">
                    {proj.categories[0] || proj.propertyType} · {proj.city}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#124446] transition-colors leading-snug mt-0.5">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">📍 {proj.location}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.unitType.slice(0, 3).map((u) => (
                      <span key={u} className="px-2 py-0.5 bg-[#BDD4E7]/30 text-[#124446] rounded text-[10px] font-semibold">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/properties/${proj.slug}`}
                  className="w-full py-2.5 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold uppercase tracking-wider text-center block transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.slug}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-64 h-48 sm:h-auto shrink-0 relative bg-slate-100">
                <SafeImage
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
                {proj.status && (
                  <div className="absolute top-2 left-2 bg-[#124446] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                    {proj.status}
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8693AB]">
                        {proj.categories[0] || proj.propertyType} · {proj.city}
                      </span>
                      <h3 className="font-bold text-slate-900 text-lg">{proj.title}</h3>
                      <p className="text-xs text-slate-500">📍 {proj.location}</p>
                    </div>
                    <span className="text-base font-black text-[#124446] shrink-0">{proj.startingPrice}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{proj.overview.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-700">
                    {proj.unitSizes && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100">Area: {proj.unitSizes}</span>
                    )}
                    {proj.developer && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100">By: {proj.developer}</span>
                    )}
                    {proj.reraNumber && (
                      <span className="px-2 py-0.5 rounded-md bg-[#BDD4E7]/30 text-[#124446]">RERA ✓</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href={`/properties/${proj.slug}`}
                    className="px-5 py-2.5 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    View Details →
                  </Link>
                  <button
                    onClick={() => toggleCompare(proj.slug)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedForCompare.includes(proj.slug)
                        ? "bg-[#D3A479] text-[#124446]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {selectedForCompare.includes(proj.slug) ? "✓ Comparing" : "+ Compare"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compare Modal */}
      {compareModalOpen && comparedProjects.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-auto max-h-[90vh] p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-[#124446]">Project Comparison</h3>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <div className={`grid gap-4 text-xs ${comparedProjects.length === 1 ? "grid-cols-1" : comparedProjects.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {comparedProjects.map((p) => (
                <div key={p.slug} className="p-4 bg-slate-50 rounded-xl space-y-3 border">
                  <div className="h-28 rounded-lg overflow-hidden bg-slate-100">
                    <SafeImage src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                  <div className="space-y-1.5">
                    <InfoRow label="Developer" value={p.developer} />
                    <InfoRow label="Location" value={p.location} />
                    <InfoRow label="Starting Price" value={p.startingPrice} highlight />
                    <InfoRow label="Unit Types" value={p.unitType.join(", ")} />
                    <InfoRow label="Unit Sizes" value={p.unitSizes} />
                    <InfoRow label="Land Area" value={p.landArea} />
                    <InfoRow label="Total Units" value={p.totalUnits} />
                    <InfoRow label="Property Type" value={p.propertyType} />
                    <InfoRow label="Payment Plan" value={p.paymentPlan} />
                    <InfoRow label="Status" value={p.status} />
                    <InfoRow label="RERA" value={p.reraNumber} />
                  </div>
                  <Link
                    href={`/properties/${p.slug}`}
                    className="block text-center py-2 rounded-xl bg-[#124446] text-white font-bold text-[10px] uppercase"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filter Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4 border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-bold text-slate-900">Advanced Filters</h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <FilterSelect
                label="City"
                value={city}
                onChange={setCity}
                options={filterOptions.cities}
                allLabel="All Cities"
              />
              <FilterSelect
                label="Category"
                value={category}
                onChange={setCategory}
                options={filterOptions.categories}
                allLabel="All Categories"
              />
              <FilterSelect
                label="Developer"
                value={developer}
                onChange={setDeveloper}
                options={filterOptions.developers}
                allLabel="All Developers"
              />
              <FilterSelect
                label="Unit Configuration"
                value={unitConfig}
                onChange={setUnitConfig}
                options={filterOptions.unitConfigs}
                allLabel="All Configurations"
              />
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#124446]"
                >
                  <option value="All">All Budgets</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#124446]"
                >
                  <option value="default">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A–Z</option>
                  <option value="location_asc">Location: A–Z</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#124446] text-white font-bold text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  if (!value || value === "Contact for Details" || value === "RERA Verified") return null;
  return (
    <div className="flex justify-between items-start gap-1 py-0.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className={`font-semibold text-right ${highlight ? "text-[#124446]" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <div>
      <label className="block font-bold uppercase text-slate-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#124446]"
      >
        <option value="All">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />
      <Suspense
        fallback={<div className="p-10 text-center text-slate-500">Loading properties...</div>}
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
