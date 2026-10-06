"use client";

import Link from "next/link";
import { Property } from "@/mock/properties";

export function FeaturedProjectsSection({ properties }: { properties: Property[] }) {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D3A479]">
              Handpicked Residences
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#124446] tracking-tight mt-1">
              Featured Luxury Projects
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Premium high-rise developments and exclusive gated communities in prime locations.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#BDD4E7]/40 hover:bg-[#BDD4E7] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            <span>View All Projects</span>
            <span>→</span>
          </Link>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#124446] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  {prop.status}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#D3A479] text-[#124446] text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                  {prop.price}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8693AB]">
                    {prop.type} · {prop.city}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#124446] transition-colors leading-snug">
                    {prop.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    📍 {prop.location}
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100">{prop.area}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">{prop.unitConfigs.join(", ")}</span>
                  </div>
                </div>

                <Link
                  href={`/properties/${prop.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold uppercase tracking-wider text-center transition-colors block shadow-xs"
                >
                  View Details &amp; Floor Plans →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
