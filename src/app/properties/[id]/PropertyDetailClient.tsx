"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/models/project";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactModal } from "@/components/layout/ContactModal";
import { loanService } from "@/services/loanService";

interface Props {
  project: Project;
  similar: Project[];
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

function SafeImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  const imgSrc = !src || errored ? FALLBACK_IMG : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imgSrc} alt={alt} className={className} onError={() => setErrored(true)} />
  );
}

export default function PropertyDetailClient({ project, similar }: Props) {
  const [contactOpen, setContactOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(
    project.priceRaw > 0 ? Math.round(project.priceRaw * 0.8) : 25000000
  );
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activePlan, setActivePlan] = useState(0);

  const emiResult = loanService.calculateEmi(loanAmount, interestRate, tenure);
  const maxLoan = project.priceRaw > 0 ? project.priceRaw : 100000000;

  const navTabs = [
    { key: "overview", label: "Overview" },
    { key: "amenities", label: "Amenities" },
    { key: "floorplans", label: "Floor Plans" },
    { key: "gallery", label: "Gallery" },
    { key: "location", label: "Location" },
    ...(project.faqs.length > 0 ? [{ key: "faqs", label: "FAQs" }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:underline">Properties</Link>
          <span>/</span>
          <Link href={`/search?city=${project.city}`} className="hover:underline">{project.city}</Link>
          <span>/</span>
          <span className="text-[#124446] font-bold">{project.title}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b pb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {project.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-0.5 rounded-full bg-[#124446] text-white text-[10px] font-extrabold uppercase"
                  >
                    {cat}
                  </span>
                ))}
                {project.status && (
                  <span className="px-3 py-0.5 rounded-full bg-[#BDD4E7]/40 text-[#124446] text-[10px] font-bold uppercase">
                    {project.status}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">{project.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                📍 {project.location}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
                {project.unitType.length > 0 && (
                  <span>🏠 {project.unitType.join(", ")}</span>
                )}
                {project.unitSizes && <span>📐 {project.unitSizes}</span>}
                {project.developer && <span>🏗️ {project.developer}</span>}
              </div>
            </div>

            <div className="text-left md:text-right space-y-2 shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-[#124446]">{project.startingPrice}</div>
              <p className="text-[10px] text-slate-400 font-medium">Starting Price</p>
              <button
                onClick={() => setContactOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Request Callback & Site Visit
              </button>
            </div>
          </div>

          {/* Image Gallery Hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[360px]">
            <div className="md:col-span-2 h-full rounded-2xl overflow-hidden bg-slate-100">
              <SafeImage src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:flex flex-col gap-4 h-full">
              {project.gallery.images.slice(0, 2).map((img, i) => (
                <div key={i} className={`${i === 1 ? "relative group" : ""} rounded-2xl overflow-hidden bg-slate-100 h-1/2`}>
                  <SafeImage src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover" />
                  {i === 1 && project.gallery.images.length > 2 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                      + {project.gallery.images.length - 2} Photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs">
            {project.unitType.length > 0 && (
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Configurations</span>
                <span className="font-bold text-slate-800 text-sm">{project.unitType.join(", ")}</span>
              </div>
            )}
            {project.unitSizes && (
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Super Area</span>
                <span className="font-bold text-slate-800 text-sm">{project.unitSizes}</span>
              </div>
            )}
            {(project.possession || project.status) && (
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">Possession</span>
                <span className="font-bold text-slate-800 text-sm">{project.possession || project.status}</span>
              </div>
            )}
            {project.reraNumber && (
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[10px]">RERA</span>
                <span className="font-bold text-[#124446] text-[10px] break-all">{project.reraNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Detail Specs */}
        {project.detailSpecs.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-[#124446] mb-4">Project Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.detailSpecs.map((spec, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">{spec.label}</div>
                  <div className="text-sm font-bold text-slate-900">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="sticky top-16 z-20 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-1 p-2 min-w-max">
            {navTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-[#124446] text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="text-xl font-bold text-[#124446]">{project.overview.heading}</h2>
                  <h3 className="text-base font-semibold text-slate-700">{project.overview.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{project.overview.description}</p>
                  {project.overview.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {project.overview.images.slice(0, 2).map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden h-40 bg-slate-100">
                          <SafeImage src={img} alt={`Overview ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Sections */}
                {project.infoSections.map((sec, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="text-xs font-bold uppercase text-[#D3A479] tracking-wider">{sec.heading}</div>
                    {sec.title && <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>}
                    {sec.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">{sec.description}</p>
                    )}
                  </div>
                ))}

                {/* Offers */}
                {project.offers.length > 0 && (
                  <div className="bg-gradient-to-r from-[#124446] to-[#1a5c5f] p-6 rounded-3xl text-white space-y-3">
                    <h3 className="text-lg font-bold">Special Offers</h3>
                    <div className="space-y-2">
                      {project.offers.map((offer, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-[#D3A479] font-bold mt-0.5">✦</span>
                          <span>{offer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Amenities Tab */}
            {activeTab === "amenities" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase text-[#D3A479] tracking-wider">{project.amenities.heading}</div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{project.amenities.title}</h2>
                </div>
                {project.amenities.items.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.amenities.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-xl bg-[#BDD4E7]/20 border border-[#BDD4E7]/40 text-xs font-semibold text-slate-800"
                      >
                        <span className="text-[#D3A479] font-black">✓</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Amenity details coming soon. Please contact us for more information.</p>
                )}
              </div>
            )}

            {/* Floor Plans Tab */}
            {activeTab === "floorplans" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase text-[#D3A479] tracking-wider">{project.floorPlans.heading}</div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{project.floorPlans.title}</h2>
                </div>
                {project.floorPlans.plans.length > 0 ? (
                  <>
                    {/* Plan selector tabs */}
                    <div className="flex flex-wrap gap-2">
                      {project.floorPlans.plans.map((plan, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePlan(i)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activePlan === i
                              ? "bg-[#124446] text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {plan.name}
                        </button>
                      ))}
                    </div>
                    {/* Active plan details */}
                    {project.floorPlans.plans[activePlan] && (
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-xs font-bold uppercase text-slate-400 block">Configuration</span>
                            <span className="font-bold text-slate-900">{project.floorPlans.plans[activePlan].name}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase text-slate-400 block">Area</span>
                            <span className="font-bold text-slate-900">{project.floorPlans.plans[activePlan].value}</span>
                          </div>
                          {project.floorPlans.plans[activePlan].basePrice && (
                            <div>
                              <span className="text-xs font-bold uppercase text-slate-400 block">Base Price</span>
                              <span className="font-bold text-[#124446]">{project.floorPlans.plans[activePlan].basePrice}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Floor plan details available on request. Please contact us.</p>
                )}
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === "gallery" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase text-[#D3A479] tracking-wider">{project.gallery.heading}</div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{project.gallery.title}</h2>
                  {project.gallery.description && (
                    <p className="text-sm text-slate-500 mt-1">{project.gallery.description}</p>
                  )}
                </div>
                {/* Main gallery viewer */}
                <div className="rounded-2xl overflow-hidden h-72 bg-slate-100">
                  <SafeImage
                    src={project.gallery.images[galleryIdx]}
                    alt={`${project.title} gallery ${galleryIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {project.gallery.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIdx(i)}
                      className={`shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                        i === galleryIdx ? "border-[#124446]" : "border-transparent"
                      }`}
                    >
                      <SafeImage src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Location Advantage Tab */}
            {activeTab === "location" && (
              <div className="space-y-6">
                {project.locationAdvantages.categories.length > 0 && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <div className="text-xs font-bold uppercase text-[#D3A479] tracking-wider">{project.locationAdvantages.heading}</div>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">{project.locationAdvantages.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.locationAdvantages.categories.map((cat, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <h4 className="text-sm font-bold text-[#124446] mb-2">📌 {cat.category}</h4>
                          <ul className="space-y-1">
                            {cat.items.map((item, j) => (
                              <li key={j} className="text-xs text-slate-600 flex items-start gap-1">
                                <span className="text-[#D3A479] mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map Embed */}
                {project.contact.locationMapUrl && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-lg font-bold text-[#124446]">{project.contact.heading}</h3>
                    <p className="text-sm text-slate-500">{project.contact.title}</p>
                    <div className="rounded-2xl overflow-hidden h-64 bg-slate-100">
                      <iframe
                        src={project.contact.locationMapUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map - ${project.title}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === "faqs" && project.faqs.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-xl font-bold text-[#124446]">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {project.faqs.map((faq, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        className="w-full text-left p-4 font-semibold text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <span className="text-[#124446] font-bold ml-2">{activeFaq === i ? "−" : "+"}</span>
                      </button>
                      {activeFaq === i && (
                        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMI Calculator - always visible at bottom of content */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#124446]">Home Loan EMI Calculator</h3>
                  <p className="text-xs text-slate-500">Estimate your monthly payment</p>
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
                      max={maxLoan}
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

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Enquiry Form - Sticky */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900">Enquire About This Property</h3>
              <p className="text-xs text-slate-500">Get official pricing, floor plans & schedule a site visit.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactOpen(true);
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  className="w-full p-3 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile Phone Number *"
                  className="w-full p-3 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446]"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124446]"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Download Brochure & Price Sheet
                </button>
              </form>
            </div>

            {/* Documents */}
            {project.documents.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-[#124446]">Project Documents</h3>
                <div className="space-y-2">
                  {project.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#124446] hover:bg-[#BDD4E7]/10 transition-all text-xs font-semibold text-slate-700"
                    >
                      <span className="text-[#D3A479]">📄</span>
                      <span className="flex-1">{doc.name}</span>
                      <span className="text-[10px] uppercase text-slate-400">{doc.type}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Info Summary */}
            <div className="bg-gradient-to-br from-[#124446]/5 to-[#BDD4E7]/20 p-5 rounded-3xl border border-[#124446]/10 space-y-3">
              <h4 className="text-sm font-bold text-[#124446]">Quick Summary</h4>
              <div className="space-y-2 text-xs">
                {project.developer && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Developer</span>
                    <span className="font-bold text-slate-900">{project.developer}</span>
                  </div>
                )}
                {project.propertyType && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type</span>
                    <span className="font-bold text-slate-900">{project.propertyType}</span>
                  </div>
                )}
                {project.landArea && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Land Area</span>
                    <span className="font-bold text-slate-900">{project.landArea}</span>
                  </div>
                )}
                {project.totalUnits && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Units</span>
                    <span className="font-bold text-slate-900">{project.totalUnits}</span>
                  </div>
                )}
                {project.paymentPlan && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Plan</span>
                    <span className="font-bold text-slate-900 text-right max-w-[60%]">{project.paymentPlan}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Projects */}
        {similar.length > 0 && (
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-xl font-bold text-[#124446]">Similar Projects in {project.city}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((s) => (
                <Link
                  key={s.slug}
                  href={`/properties/${s.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 space-y-2 block"
                >
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-100">
                    <SafeImage src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#124446] transition-colors">{s.title}</h4>
                  <p className="text-xs font-bold text-[#124446]">{s.startingPrice}</p>
                  <p className="text-xs text-slate-500">📍 {s.city}</p>
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
