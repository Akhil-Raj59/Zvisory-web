"use client";

import { MOCK_JOBS } from "@/mock/careers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D3A479] text-[#124446]">
            Join Our Team
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#124446] tracking-tight">
            Build the Future of Real Estate Advisory
          </h1>
          <p className="text-sm text-slate-600">
            We are hiring passionate advisors, mortgage consultants, and technology engineers.
          </p>
        </div>

        {/* Culture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="text-3xl">🚀</div>
            <h3 className="font-bold text-slate-900 text-base">High Impact Work</h3>
            <p className="text-xs text-slate-600">Help families make their largest financial decision with total clarity and trust.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="text-3xl">💡</div>
            <h3 className="font-bold text-slate-900 text-base">Tech-Driven Culture</h3>
            <p className="text-xs text-slate-600">We leverage real-time market data, AI comparative tools, and modern web apps.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="text-3xl">📈</div>
            <h3 className="font-bold text-slate-900 text-base">Competitive Rewards</h3>
            <p className="text-xs text-slate-600">Top-tier compensation, performance bonuses, health benefits, and career growth.</p>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#124446]">Current Openings</h2>

          <div className="space-y-4">
            {MOCK_JOBS.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#BDD4E7]/40 text-[#124446] text-[10px] font-bold uppercase">
                      {job.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                  <p className="text-xs text-slate-500">📍 {job.location} · Experience: {job.experience}</p>
                  <p className="text-xs text-slate-600 max-w-2xl">{job.description}</p>
                </div>

                <button
                  onClick={() => alert(`Applying for ${job.title}. Please send CV to careers@zvisory.com`)}
                  className="px-6 py-3 rounded-xl bg-[#124446] hover:bg-[#0d3335] text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                >
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
