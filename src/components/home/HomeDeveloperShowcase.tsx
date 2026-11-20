"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Developer } from "@/models/developer";

const TOP_DEV_NAMES = [
  "DLF",
  "Godrej Properties",
  "Prestige Group",
  "Sobha",
  "Oberoi Realty",
  "Tata Housing",
  "Brigade Group",
  "Lodha",
];

interface HomeDeveloperShowcaseProps {
  developers?: Developer[];
}

export function HomeDeveloperShowcase({ developers = [] }: HomeDeveloperShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // If live developers list is short, ensure top developers are visible
  const devList = developers.length > 0 ? developers : TOP_DEV_NAMES.map((name, i) => ({
    id: `dev-${i}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    projectCount: 8 + (i % 6),
  }));

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="py-16 bg-[#F8FFFB] border-b border-[#E5EDE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
              Trusted Brands
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#124446] tracking-tight mt-1">
              Our Top Developers
            </h2>
            <p className="text-xs sm:text-sm text-[#557173] mt-1 max-w-xl">
              Collaborating exclusively with grade-A developers recognized for structural quality, punctual delivery, and RERA compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/developers"
              className="text-xs font-bold text-[#124446] hover:text-[#D3A479] transition-colors"
            >
              View All Developers →
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

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        >
          {devList.map((dev) => {
            const count = (dev as Developer).publishedProjectsCount ?? dev.projectCount ?? 0;
            return (
              <Link
                key={dev.id || dev.name}
                href={`/developers/${dev.slug || dev.id}`}
                className="group flex flex-col items-center justify-center min-w-[200px] sm:min-w-[220px] p-6 bg-white rounded-2xl border border-[#E5EDE9] hover:border-[#124446] shadow-xs hover:shadow-lg transition-all duration-300 text-center shrink-0"
              >
                {/* Brand Initial Badge or Logo */}
                <div className="w-16 h-16 rounded-2xl bg-[#F8FFFB] border border-[#E5EDE9] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform overflow-hidden p-2">
                  {(dev as Developer).logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(dev as Developer).logo}
                      alt={dev.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xl font-extrabold text-[#124446]">
                      {dev.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Developer Name */}
                <h3 className="font-extrabold text-sm text-[#124446] group-hover:text-[#D3A479] transition-colors line-clamp-1">
                  {dev.name}
                </h3>

                {/* Active Projects Counter */}
                <span className="text-[11px] font-semibold text-[#557173] mt-1">
                  {count > 0 ? `${count} Active Projects` : "Verified Partner"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

