"use client";

import Link from "next/link";
import { Project } from "@/models/project";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  // Use a plain img with onError fallback — avoids next/image domain config for external URLs
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || FALLBACK_IMG}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      onError={(e) => {
        (e.target as HTMLImageElement).src = FALLBACK_IMG;
      }}
    />
  );
}

interface Props {
  projects: Project[];
}

export function FeaturedProjectsSection({ projects }: Props) {
  if (!projects || projects.length === 0) return null;

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
          {projects.map((project) => (
            <div
              key={project.slug}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <ProjectImage
                  src={project.image || project.bannerUrl}
                  alt={project.title}
                />
                <div className="absolute top-3 left-3 bg-[#124446] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  {project.status}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#D3A479] text-[#124446] text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                  {project.startingPrice}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8693AB]">
                    {project.propertyType} · {project.city}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#124446] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    📍 {project.location || project.microMarket}
                  </p>

                  {/* Configurations & sizes row */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {project.unitType.slice(0, 3).map((cfg) => (
                      <span
                        key={cfg}
                        className="px-2 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-700"
                      >
                        {cfg}
                      </span>
                    ))}
                    {project.unitSizes && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-700">
                        {project.unitSizes}
                      </span>
                    )}
                  </div>

                  {/* Developer */}
                  <p className="text-[11px] text-[#6A6A86] font-semibold">
                    By {project.developer}
                  </p>
                </div>

                <Link
                  href={`/properties/${project.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold uppercase tracking-wider text-center transition-colors block shadow-xs"
                >
                  View Details & Floor Plans →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
