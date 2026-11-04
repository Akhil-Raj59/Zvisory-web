import Link from "next/link";
import type { Metadata } from "next";
import { developerService } from "@/services/developerService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Top Real Estate Developers in India | Zvisory",
  description:
    "Explore profiles, track records, and verified luxury developments from India's premier real estate builders and developers.",
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    title: "Top Real Estate Developers in India | Zvisory",
    description: "Explore verified luxury portfolios from India's leading developers.",
    url: `${siteConfig.url}/developers`,
    images: [{ url: siteConfig.ogImage }],
  },
};

export default async function DevelopersPage() {
  const developers = await developerService.getAllDevelopers({ sort: "projects_desc" });

  const totalProjects = developers.reduce((acc, d) => acc + (d.projectCount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Section */}
        <div className="relative bg-[#124446] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#BDD4E7_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D3A479] text-[#124446]">
              Premier Builders &amp; Promoters
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              India&apos;s Leading Luxury Developers
            </h1>
            <p className="text-sm sm:text-base text-[#BDD4E7] max-w-2xl mx-auto font-medium">
              Explore {developers.length} verified developer brands delivering {totalProjects}+ landmark residential and commercial developments across India.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb */}
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#124446] font-bold">Developers</span>
          </div>

          {/* Developers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <div
                key={dev.slug || dev.name}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-2.5 shrink-0 group-hover:scale-105 transition-transform">
                      {dev.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={dev.logo}
                          alt={dev.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xl font-black text-[#124446]">
                          {dev.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#BDD4E7]/40 text-[#124446] text-xs font-bold shrink-0">
                      {dev.projectCount || 0} Developments
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#124446] transition-colors">
                      {dev.name}
                    </h2>
                    {dev.headquarters && (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        📍 Headquarters: {dev.headquarters}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {dev.description || dev.shortDescription || `Explore verified luxury developments by ${dev.name}.`}
                  </p>

                  {dev.website && (
                    <div className="pt-2">
                      <a
                        href={dev.website.startsWith("http") ? dev.website : `https://${dev.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-slate-400 hover:text-[#124446] inline-flex items-center gap-1"
                      >
                        <span>Official Website</span>
                        <span>↗</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <Link
                    href={`/developers/${dev.slug}`}
                    className="w-full py-2.5 rounded-xl bg-[#124446] hover:bg-[#0c2f30] text-white text-xs font-bold uppercase tracking-wider text-center transition-colors block shadow-sm"
                  >
                    View Portfolio &amp; Projects →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {developers.length === 0 && (
            <div className="py-16 text-center bg-white rounded-3xl border p-8 space-y-3">
              <div className="text-3xl">🏗️</div>
              <p className="text-slate-500 text-sm">No developers found.</p>
              <Link
                href="/search"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#124446] text-white text-xs font-bold"
              >
                Browse All Properties
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

