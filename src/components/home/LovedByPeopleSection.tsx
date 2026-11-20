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
];

const STATS = [
  { value: "3,000+", label: "Homes Sold" },
  { value: "₹2,500+ Cr", label: "Advised Value" },
  { value: "50+", label: "Top Developers" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15+", label: "Years Experience" },
];

interface LovedByPeopleSectionProps {
  testimonials?: Testimonial[];
}

export function LovedByPeopleSection({
  testimonials = DEFAULT_TESTIMONIALS,
}: LovedByPeopleSectionProps) {
  const items = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = items[currentIndex] || items[0];

  function handlePrev() {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }

  return (
    <section className="py-20 bg-[#F8FFFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Figma Design */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
            Client Experiences
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#124446] tracking-tight">
            We Are Loved By People From All Part Of The Country
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#557173]">
            Real Stories. Real People. Real Trust.
          </p>
        </div>

        {/* Dark Teal Hero Card Container */}
        <div className="bg-[#124446] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle geometric background overlay */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#E6FFF1]/5 blur-3xl pointer-events-none" />

          {/* Testimonial Content: 2-Column Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Quote, Profile, Controls */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              {/* Quote Mark */}
              <div className="text-[#D3A479] text-5xl font-serif leading-none select-none">
                “
              </div>

              {/* Quote Body */}
              <p className="text-base sm:text-lg lg:text-xl font-medium text-white/95 leading-relaxed min-h-[100px]">
                {current.quote}
              </p>

              {/* User Meta Row */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D3A479] shadow-sm shrink-0 bg-[#0d3233]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-base leading-snug">
                      {current.name}
                    </h3>
                    <p className="text-xs text-[#E6FFF1]/80 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>📍 {current.location}</span>
                      <span>•</span>
                      <span className="text-[#D3A479]">Verified Client</span>
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#D3A479] text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>

              {/* Carousel Navigation Arrows & Indicators */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex
                          ? "w-8 bg-[#D3A479]"
                          : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-[#124446] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    aria-label="Previous testimonial"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-[#124446] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    aria-label="Next testimonial"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-2xl border border-white/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    current.videoThumbnail ||
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Luxury Residence"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#D3A479] text-[#124446]">
                    Zvisory Advisory Experience
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stat Row: 5 Pill Cards */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-xl sm:text-2xl font-black text-[#E6FFF1] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-[#E6FFF1]/70 font-semibold mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

