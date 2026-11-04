import Link from "next/link";
import { Developer } from "@/models/developer";

interface Props {
  developers: Developer[];
}

export function DeveloperShowcase({ developers }: Props) {
  if (!developers || developers.length === 0) return null;

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
              Trusted Builders
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#124446] tracking-tight mt-1">
              India&apos;s Leading Luxury Developers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Explore portfolio highlights, verified credentials, and upcoming landmark projects from premier real estate developers.
            </p>
          </div>

          <Link
            href="/developers"
            className="text-xs font-bold text-[#124446] hover:text-[#D3A479] flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>View All Developers</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {developers.slice(0, 8).map((dev) => (
            <Link
              key={dev.slug || dev.name}
              href={`/developers/${dev.slug}`}
              className="p-5 rounded-2xl border border-slate-100 hover:border-[#D3A479] bg-slate-50/70 hover:bg-white shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform shadow-xs">
                  {dev.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={dev.logo}
                      alt={dev.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-black text-[#124446]">
                      {dev.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#124446] transition-colors leading-snug line-clamp-1">
                    {dev.name}
                  </h3>
                  {dev.headquarters && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      📍 {dev.headquarters}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="font-bold text-[#124446]">
                  {dev.projectCount || 0} Developments
                </span>
                <span className="text-[11px] text-[#D3A479] font-bold group-hover:translate-x-0.5 transition-transform">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

