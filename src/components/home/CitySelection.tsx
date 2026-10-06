"use client";

import { useRef } from "react";
import Link from "next/link";
import { City } from "@/mock/cities";

export function CitySelection({ cities }: { cities: City[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D3A479]">
              Explore Locations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#124446] tracking-tight mt-1">
              Properties by Prime Cities
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select your preferred metropolitan region to explore curated luxury developments.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-[#124446] hover:text-white flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-[#124446] hover:text-white flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        {/* Section 1.3 Horizontal Scroll Container / Mobile Vertical Stacking (2 per row on mobile) */}
        <div
          ref={scrollRef}
          className="flex sm:flex-row overflow-x-auto gap-5 pb-4 no-scrollbar grid grid-cols-2 sm:grid-cols-none sm:auto-cols-[280px] sm:grid-flow-col"
        >
          {cities.map((city) => (
            <div
              key={city.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-200">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D3A479] text-[#124446]">
                    {city.projectCount} Projects
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#124446] transition-colors">
                    {city.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Price: {city.priceRange}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5">
                    {city.description}
                  </p>
                </div>

                <Link
                  href={`/cities/${city.id}`}
                  className="w-full py-2 px-3 rounded-lg bg-slate-100 group-hover:bg-[#124446] text-slate-800 group-hover:text-white text-xs font-bold uppercase tracking-wider text-center transition-colors block"
                >
                  View Projects →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
