"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { propertyService } from "@/services/propertyService";
import { Property } from "@/mock/properties";
import { City } from "@/mock/cities";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function CityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [city, setCity] = useState<City | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const c = await propertyService.getCityById(id);
      const props = await propertyService.getAllProperties({ city: c?.name || id });
      setCity(c);
      setProperties(props);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-12 text-slate-500 font-medium">
          Loading city developments...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 space-y-10 pb-16">
        {/* City Hero Banner (Section 4.2) */}
        <div className="relative h-[320px] bg-slate-950 flex items-center justify-center overflow-hidden">
          <img
            src={city?.image || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80"}
            alt={city?.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#124446] via-[#124446]/60 to-transparent" />
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D3A479] text-[#124446]">
              {city?.projectCount || 100}+ Verified Projects
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{city?.name || "Metropolitan City"}</h1>
            <p className="text-sm text-[#BDD4E7] max-w-xl mx-auto">{city?.description}</p>
          </div>
        </div>

        {/* City Developments Grid (Section 4.3) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#124446]">
              Featured Projects in {city?.name}
            </h2>
            <Link href="/search" className="text-xs font-bold text-[#D3A479] hover:underline">
              View All Filters →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <img src={prop.image} alt={prop.name} className="h-48 w-full object-cover" />
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#8693AB]">{prop.type}</span>
                    <h3 className="font-bold text-slate-900 text-base">{prop.name}</h3>
                    <p className="text-xs text-slate-500">📍 {prop.location}</p>
                    <p className="text-sm font-black text-[#124446] mt-2">{prop.price}</p>
                  </div>
                  <Link
                    href={`/properties/${prop.id}`}
                    className="w-full py-2 rounded-xl bg-[#124446] text-white text-xs font-bold text-center block"
                  >
                    View Project →
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
