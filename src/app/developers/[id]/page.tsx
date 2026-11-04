import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { developerService } from "@/services/developerService";
import { projectService } from "@/services/projectService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SafeImage } from "@/components/SafeImage";
import { siteConfig } from "@/config/site.config";

interface Props {
  params: Promise<{ id: string }>;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const developer = await developerService.getDeveloperBySlug(id);

  if (!developer) {
    return {
      title: "Developer Not Found | Zvisory",
      description: "Explore verified luxury developers across India with Zvisory.",
    };
  }

  const title =
    developer.seo?.title ||
    `${developer.name} Projects, Luxury Apartments & Portfolio | Zvisory`;
  const description =
    developer.seo?.description ||
    developer.shortDescription ||
    `Explore verified luxury residential developments by ${developer.name}. Browse floor plans, pricing, and project updates.`;
  const ogImage = developer.seo?.ogImage || developer.logo || siteConfig.ogImage;

  return {
    title,
    description,
    alternates: { canonical: `/developers/${id}` },
    openGraph: {
      title: developer.seo?.ogTitle || title,
      description: developer.seo?.ogDescription || description,
      url: `${siteConfig.url}/developers/${id}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: developer.seo?.ogTitle || title,
      description: developer.seo?.ogDescription || description,
      images: [ogImage],
    },
  };
}

export default async function DeveloperDetailPage({ params }: Props) {
  const { id } = await params;
  const developer = await developerService.getDeveloperBySlug(id);

  if (!developer) {
    notFound();
  }

  if (developer.status && developer.status !== "published") {
    notFound();
  }

  // Fetch all published projects for this developer
  const projects = await projectService.getProjectsByDeveloper(developer.name);

  // Distinct cities active
  const citiesActive = Array.from(new Set(projects.map((p) => p.city))).filter(Boolean);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: developer.name,
    description: developer.description || developer.shortDescription,
    image: developer.logo,
    url: `${siteConfig.url}/developers/${developer.slug}`,
    ...(developer.headquarters && {
      address: {
        "@type": "PostalAddress",
        addressLocality: developer.headquarters,
        addressCountry: "IN",
      },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 space-y-10 pb-16">
        {/* Developer Profile Header */}
        <div className="bg-[#124446] text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="text-xs text-[#BDD4E7] flex items-center gap-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/developers" className="hover:underline">Developers</Link>
              <span>/</span>
              <span className="text-[#D3A479] font-bold">{developer.name}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-3 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                  {developer.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={developer.logo}
                      alt={developer.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl font-black text-[#124446]">
                      {developer.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-[#D3A479] text-[#124446]">
                      Verified Developer
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{developer.name}</h1>
                  {developer.headquarters && (
                    <p className="text-xs sm:text-sm text-[#BDD4E7]">
                      📍 Corporate HQ: {developer.headquarters}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
                  <div className="text-2xl font-black text-white">{projects.length}</div>
                  <div className="text-[11px] text-[#BDD4E7] font-semibold uppercase">Live Projects</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
                  <div className="text-2xl font-black text-white">{citiesActive.length}</div>
                  <div className="text-[11px] text-[#BDD4E7] font-semibold uppercase">Active Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* About Developer Section */}
          {(developer.description || developer.shortDescription || developer.website) && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-[#124446]">
                  About {developer.name}
                </h2>
                {developer.website && (
                  <a
                    href={developer.website.startsWith("http") ? developer.website : `https://${developer.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Visit Official Website</span>
                    <span>↗</span>
                  </a>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {developer.description || developer.shortDescription}
              </p>

              {citiesActive.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Active Metropolitan Presence:
                  </span>
                  {citiesActive.map((cityName) => (
                    <Link
                      key={cityName}
                      href={`/cities/${cityName.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#124446] hover:text-white text-xs font-semibold text-slate-700 transition-colors"
                    >
                      {cityName}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Developer's Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#124446]">
                  Developments by {developer.name} ({projects.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing verified published projects developed by this builder
                </p>
              </div>

              <Link
                href={`/search?developer=${encodeURIComponent(developer.name)}`}
                className="text-xs font-bold text-[#D3A479] hover:underline"
              >
                Search &amp; Filter →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.slug}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <SafeImage
                      src={proj.image}
                      alt={proj.title}
                      fallbackSrc={FALLBACK_IMG}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {proj.status && (
                      <div className="absolute top-2 left-2 bg-[#124446] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                        {proj.status}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-[#D3A479] text-[#124446] font-bold text-xs px-3 py-1 rounded-lg shadow-sm">
                      {proj.startingPrice}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#8693AB]">
                        <span>{proj.categories?.[0] || "Luxury"}</span>
                        <span>{proj.city}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-[#124446] transition-colors mt-0.5">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">📍 {proj.location}</p>
                      {proj.unitType && proj.unitType.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.unitType.slice(0, 3).map((u) => (
                            <span
                              key={u}
                              className="px-2 py-0.5 bg-[#BDD4E7]/30 text-[#124446] rounded text-[10px] font-semibold"
                            >
                              {u}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/properties/${proj.slug}`}
                        className="flex-1 py-2 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold text-center block transition-colors"
                      >
                        View Project Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="py-16 text-center bg-white rounded-3xl border p-8 space-y-3">
                <div className="text-3xl">🏗️</div>
                <p className="text-slate-500 text-sm">No live projects currently listed under this developer.</p>
                <Link
                  href="/search"
                  className="inline-block px-6 py-2.5 rounded-xl bg-[#124446] text-white text-xs font-bold"
                >
                  Browse All Properties
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

