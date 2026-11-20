"use client";

import { useRef } from "react";
import Link from "next/link";
import type { City } from "@/models/city";

const CITY_FALLBACK_IMAGES: Record<string, string> = {
  Gurugram: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=400&q=80",
  Bengaluru: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80",
  Hyderabad: "https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=400&q=80",
  Mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80",
  Pune: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=400&q=80",
  Noida: "https://images.unsplash.com/photo-1628178122394-ff8533d5ba4b?auto=format&fit=crop&w=400&q=80",
  Delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80",
};

const DEFAULT_CITY_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80";

interface CityBrowseCirclesProps {
  cities: City[];
}

export function CityBrowseCircles({ cities }: CityBrowseCirclesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // If cities prop is empty, provide sensible default tier-1 metro list
  const displayCities = cities && cities.length > 0 ? cities : [
    { id: "gurugram", name: "Gurugram", slug: "gurugram", projectCount: 24 },
    { id: "bengaluru", name: "Bengaluru", slug: "bengaluru", projectCount: 18 },
    { id: "hyderabad", name: "Hyderabad", slug: "hyderabad", projectCount: 15 },
    { id: "mumbai", name: "Mumbai", slug: "mumbai", projectCount: 22 },
    { id: "pune", name: "Pune", slug: "pune", projectCount: 12 },
    { id: "noida", name: "Noida", slug: "noida", projectCount: 14 },
  ];

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  return (
    <section className="py-14 bg-[#F8FFFB] border-b border-[#E5EDE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
              Explore Locations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#124446] tracking-tight mt-1">
              Browse New Projects in India
            </h2>
            <p className="text-xs sm:text-sm text-[#557173] mt-1 max-w-xl">
              Discover verified high-rise apartments, luxury villas, and prime plots across India&apos;s fastest growing real estate hubs.
            </p>
          </div>

          {/* Controls: View all + scroll buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/cities"
              className="text-xs font-bold text-[#124446] hover:text-[#D3A479] transition-colors"
            >
              View All Cities →
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-full border border-[#557173]/20 bg-white hover:bg-[#124446] hover:text-white flex items-center justify-center text-[#124446] transition-colors shadow-xs cursor-pointer"
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-full border border-[#557173]/20 bg-white hover:bg-[#124446] hover:text-white flex items-center justify-center text-[#124446] transition-colors shadow-xs cursor-pointer"
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Circular Avatar Cities Row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        >
          {displayCities.map((city) => {
            const count = (city as City).publishedProjectsCount ?? city.projectCount ?? 0;
            const imgSrc =
              (city as City).image ||
              (city as City).coverImage ||
              CITY_FALLBACK_IMAGES[city.name] ||
              DEFAULT_CITY_IMAGE;

            return (
              <Link
                key={city.id || city.name}
                href={`/search?city=${encodeURIComponent(city.name)}`}
                className="flex flex-col items-center group shrink-0 transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Circular Image Container with mint border glow */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white border-2 border-[#E5EDE9] group-hover:border-[#124446] shadow-sm group-hover:shadow-md transition-all">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_CITY_IMAGE;
                      }}
                    />
                  </div>
                </div>

                {/* City Name */}
                <span className="mt-3 text-sm font-bold text-[#124446] group-hover:text-[#D3A479] transition-colors text-center">
                  {city.name}
                </span>

                {/* Projects Pill */}
                <span className="text-[11px] font-medium text-[#557173] group-hover:text-slate-700 transition-colors">
                  {count > 0 ? `${count} Projects` : "Explore Projects"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

