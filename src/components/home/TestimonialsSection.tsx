"use client";

import { useState } from "react";
import { Testimonial } from "@/mock/testimonials";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D3A479]">
            Client Experiences
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#124446] tracking-tight mt-1">
            What Our Buyers &amp; Investors Say
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Real stories from homeowners and investors who secured their dream properties with Zvisory.
          </p>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => setActiveIndex(idx)}
              className={`p-6 rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                activeIndex === idx
                  ? "border-[#124446] shadow-xl ring-2 ring-[#124446]/20"
                  : "border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Video Thumbnail preview if present */}
              {t.videoThumbnail && (
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 bg-slate-900 group">
                  <img
                    src={t.videoThumbnail}
                    alt={t.name}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#D3A479] text-[#124446] flex items-center justify-center font-bold text-xl shadow-lg">
                      ▶
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded">
                    Video Story
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#D3A479] text-sm">
                  {"★".repeat(t.rating)}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                activeIndex === idx ? "bg-[#124446] w-6" : "bg-slate-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
