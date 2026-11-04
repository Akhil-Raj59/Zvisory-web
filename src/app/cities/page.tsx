import Link from "next/link";
import type { Metadata } from "next";
import { cityService } from "@/services/cityService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Explore Luxury Properties by City | Zvisory",
  description:
    "Discover verified luxury high-rise apartments, villas, and premium gated communities across major metropolitan corridors in India.",
  alternates: {
    canonical: "/cities",
  },
  openGraph: {
    title: "Explore Luxury Properties by City | Zvisory",
    description:
      "Discover verified luxury high-rise apartments and estates across major cities in India.",
    url: `${siteConfig.url}/cities`,
    images: [{ url: siteConfig.ogImage }],
  },
};

export default async function CitiesPage() {
  const cities = await cityService.getAllCities({ sort: "featured" });

  const totalProjects = cities.reduce((acc, c) => acc + (c.projectCount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Section */}
        <div className="relative bg-[#124446] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#BDD4E7_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D3A479] text-[#124446]">
              Metropolitan Corridors
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Luxury Properties by City
            </h1>
            <p className="text-sm sm:text-base text-[#BDD4E7] max-w-2xl mx-auto font-medium">
              Explore {totalProjects}+ handpicked luxury developments across {cities.length} premier cities. Filter by micro-markets, verified price ranges, and builder portfolios.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb */}
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#124446] font-bold">Cities</span>
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div
                key={city.slug}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={city.image || city.coverImage}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {city.isFeatured && (
                        <span className="px-3 py-1 rounded-full bg-[#D3A479] text-[#124446] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                          Featured Corridor
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                      <div>
                        <h2 className="text-2xl font-black tracking-tight">{city.name}</h2>
                        <p className="text-xs text-[#BDD4E7] font-medium">{city.state || city.country}</p>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                        {city.projectCount || 0} Projects
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Starting Investment</span>
                      <span className="font-extrabold text-[#124446] text-sm">{city.startingPrice}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {city.description || city.shortDescription}
                    </p>

                    {city.localities && city.localities.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Top Corridors &amp; Sectors
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {city.localities.slice(0, 4).map((loc, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                            >
                              {loc}
                            </span>
                          ))}
                          {city.localities.length > 4 && (
                            <span className="text-[10px] text-slate-400 font-bold self-center">
                              +{city.localities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/cities/${city.slug}`}
                    className="w-full py-3 rounded-xl bg-[#124446] hover:bg-[#0c2f30] text-white text-xs font-bold uppercase tracking-wider text-center transition-colors block shadow-sm"
                  >
                    View All {city.name} Properties →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

