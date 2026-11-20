"use client";

import { useState } from "react";
import { ContactModal } from "@/components/layout/ContactModal";

export function AdvisorCtaBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-12 bg-[#F8FFFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#124446] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
            {/* Background Glow Accents */}
            <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#E6FFF1]/10 blur-2xl pointer-events-none" />
            <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#D3A479]/10 blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="relative z-10 space-y-2 text-center md:text-left max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E6FFF1]/15 text-[#E6FFF1] border border-[#E6FFF1]/20">
                Personalized Property Consultation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Not sure which project is right for you?
              </h2>
              <p className="text-sm sm:text-base text-[#E6FFF1]/80 leading-relaxed font-normal">
                Get unbiased advice, price insights, and a shortlist tailored specifically to your family&apos;s lifestyle and budget goals.
              </p>
            </div>

            {/* Right Action Button */}
            <div className="relative z-10 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="px-8 py-4 rounded-2xl bg-[#D3A479] hover:bg-[#c29367] text-[#124446] font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Speak to an Advisor</span>
                <span className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <ContactModal
          projectContext={{
            formType: "homepage_advisory_callout",
            formLocation: "homepage_advisor_banner",
            projectName: "General Advisory Consultation",
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

