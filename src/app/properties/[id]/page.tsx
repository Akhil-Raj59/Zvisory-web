"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { propertyService } from "@/services/propertyService";
import { loanService } from "@/services/loanService";
import { Property } from "@/mock/properties";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactModal } from "@/components/layout/ContactModal";

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  // EMI Calculator widget state
  const [loanAmount, setLoanAmount] = useState(25000000); // 2.5 Cr
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const prop = await propertyService.getPropertyById(id);
      const sim = await propertyService.getSimilarProperties(id);
      setProperty(prop);
      setSimilar(sim);
      if (prop) {
        setLoanAmount(Math.round(prop.priceRaw * 0.8)); // 80% LTV default
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-12 text-slate-500 font-medium">
          Loading property details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-12 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Property Not Found</h2>
          <Link href="/search" className="px-4 py-2 bg-[#124446] text-white rounded-xl text-xs font-bold">
            Back to Search
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const emiResult = loanService.calculateEmi(loanAmount, interestRate, tenure);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:underline">Search</Link>
          <span>/</span>
          <span className="text-[#124446] font-bold">{property.name}</span>
        </div>

        {/* Hero Gallery Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-[#124446] text-white text-[10px] font-extrabold uppercase">
                  {property.status}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-[#BDD4E7]/40 text-[#124446] text-[10px] font-bold uppercase">
                  {property.type}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {property.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                📍 {property.location} · {property.city}
              </p>
            </div>

            <div className="text-left md:text-right space-y-2">
              <div className="text-2xl sm:text-3xl font-black text-[#124446]">
                {property.price}
              </div>
              <button
                onClick={() => setContactOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Request Callback &amp; Site Visit
              </button>
            </div>
          </div>

          {/* Main Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[380px]">
            <div className="md:col-span-2 h-full rounded-2xl overflow-hidden bg-slate-100">
              <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:flex flex-col gap-4 h-full">
              <div className="h-1/2 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                  alt="Clubhouse"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/2 rounded-2xl overflow-hidden bg-slate-100 relative group">
                <img
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80"
                  alt="Interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                  + 12 Photos &amp; Video Tour
                </div>
              </div>
            </div>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs">
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Configurations</span>
              <span className="font-bold text-slate-800 text-sm">{property.unitConfigs.join(", ")}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Super Area</span>
              <span className="font-bold text-slate-800 text-sm">{property.area}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Possession</span>
              <span className="font-bold text-slate-800 text-sm">{property.possessionTime}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">RERA Number</span>
              <span className="font-bold text-[#124446] text-xs">{property.reraNo || "Verified RERA"}</span>
            </div>
          </div>
        </div>

        {/* Overview & USPs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-[#124446]">Project Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-[#124446]">Key Highlights &amp; Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.usps.map((usp, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-800 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[#D3A479] font-bold">✓</span>
                    <span>{usp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive EMI Calculator Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#124446]">Home Loan EMI Calculator</h3>
                  <p className="text-xs text-slate-500">Estimate your monthly payment for this property</p>
                </div>
                <Link href="/home-loan" className="text-xs font-bold text-[#D3A479] hover:underline">
                  Full Loan Advisor →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Loan Amount:</span>
                      <span className="text-[#124446]">₹ {(loanAmount / 100000).toFixed(2)} Lacs</span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={property.priceRaw}
                      step={500000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-[#124446]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Interest Rate (% p.a.):</span>
                      <span className="text-[#124446]">{interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={7.5}
                      max={12.0}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-[#124446]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Tenure (Years):</span>
                      <span className="text-[#124446]">{tenure} Years</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={1}
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full accent-[#124446]"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#124446] text-white flex flex-col justify-between space-y-4 shadow-inner">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D3A479]">
                      Estimated Monthly Payment
                    </span>
                    <div className="text-3xl font-black text-white mt-1">
                      ₹ {emiResult.monthlyEmi.toLocaleString("en-IN")} / mo
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#BDD4E7] border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span>Principal Amount:</span>
                      <span className="text-white font-bold">₹ {loanAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest Payable:</span>
                      <span className="text-[#D3A479] font-bold">₹ {emiResult.totalInterest.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900">Enquire About This Property</h3>
              <p className="text-xs text-slate-500">Get official developer pricing, site visit cab, and floor plan PDF.</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you! Our advisory team will contact you shortly.");
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  className="w-full p-3 rounded-xl border text-xs text-slate-900"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile Phone Number *"
                  className="w-full p-3 rounded-xl border text-xs text-slate-900"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 rounded-xl border text-xs text-slate-900"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Download Brochure &amp; Price Sheet
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-xl font-bold text-[#124446]">Similar Luxury Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((s) => (
                <Link
                  key={s.id}
                  href={`/properties/${s.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 space-y-2 block"
                >
                  <img src={s.image} alt={s.name} className="h-40 w-full object-cover rounded-xl" />
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#124446] transition-colors">{s.name}</h4>
                  <p className="text-xs font-bold text-[#124446]">{s.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      <Footer />
    </div>
  );
}
