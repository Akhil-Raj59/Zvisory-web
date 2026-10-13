import Link from "next/link";
import type { Metadata } from "next";
import { projectService } from "@/services/projectService";
import { propertyService } from "@/services/propertyService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cityProjects = await projectService.getProjectsByCity(id);
  const cityName =
    cityProjects.length > 0
      ? cityProjects[0].city
      : id.charAt(0).toUpperCase() + id.slice(1);

  return {
    title: `Luxury Properties in ${cityName} | Zvisory`,
    description: `Explore ${cityProjects.length}+ verified luxury residential projects in ${cityName}. Browse apartments, villas, and premium developments.`,
    alternates: { canonical: `/cities/${id}` },
    openGraph: {
      title: `Luxury Properties in ${cityName} | Zvisory`,
      description: `${cityProjects.length}+ premium real estate projects in ${cityName}.`,
    },
  };
}

export default async function CityDetailsPage({ params }: Props) {
  const { id } = await params;

  // Fetch both city meta info and Excel-based real projects
  const [cityData, cityProjects] = await Promise.all([
    propertyService.getCityById(id),
    projectService.getProjectsByCity(id),
  ]);

  if (cityProjects.length === 0 && !cityData) notFound();

  const cityName =
    cityData?.name ||
    (cityProjects.length > 0 ? cityProjects[0].city : id.charAt(0).toUpperCase() + id.slice(1));

  const cityImage = cityData?.image || FALLBACK_IMG;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 space-y-10 pb-16">
        {/* City Hero */}
        <div className="relative h-[340px] bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cityImage}
            alt={cityName}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#124446] via-[#124446]/60 to-transparent" />
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D3A479] text-[#124446]">
              {cityProjects.length}+ Verified Projects
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Luxury Properties in {cityName}
            </h1>
            {cityData?.description && (
              <p className="text-sm text-[#BDD4E7] max-w-xl mx-auto">{cityData.description}</p>
            )}
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 justify-center pt-2 text-xs">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <div className="font-black text-xl">{cityProjects.length}</div>
                <div className="text-[#BDD4E7]">Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <div className="font-black text-xl">
                  {[...new Set(cityProjects.map((p) => p.developer))].length}
                </div>
                <div className="text-[#BDD4E7]">Developers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <div className="font-black text-xl">
                  {[...new Set(cityProjects.map((p) => p.categories[0]))].length}
                </div>
                <div className="text-[#BDD4E7]">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/search" className="hover:underline">Properties</Link>
            <span>/</span>
            <span className="text-[#124446] font-bold">{cityName}</span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#124446]">
              Projects in {cityName}
            </h2>
            <Link
              href={`/search?city=${cityName}`}
              className="text-xs font-bold text-[#D3A479] hover:underline"
            >
              Filter & View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityProjects.map((proj) => (
              <div
                key={proj.slug}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMG;
                    }}
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
                    <span className="text-[10px] font-bold uppercase text-[#8693AB]">
                      {proj.categories[0]} · {proj.microMarket || proj.city}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#124446] transition-colors mt-0.5">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">📍 {proj.location}</p>
                    {proj.unitType.length > 0 && (
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
                      View Project →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cityProjects.length === 0 && (
            <div className="py-16 text-center bg-white rounded-2xl border p-8 space-y-3">
              <div className="text-3xl">🏙️</div>
              <p className="text-slate-500 text-sm">No projects found for this city.</p>
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
