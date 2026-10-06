"use client";

import { useState } from "react";

export function LeadCollection({ contextText = "Get direct advisory callback from our real estate experts" }: { contextText?: string }) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPhone("");
    }, 4000);
  }

  return (
    <section className="py-12 bg-[#124446] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#124446] via-[#1a5b5d] to-[#124446] p-8 rounded-3xl border border-[#D3A479]/40 shadow-xl text-center space-y-4">
          <div className="max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D3A479]">
              Instant Assistance
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Looking for Personalized Property Recommendations?
            </h3>
            <p className="text-xs sm:text-sm text-[#BDD4E7]">
              {contextText}
            </p>
          </div>

          {submitted ? (
            <div className="p-4 rounded-xl bg-[#D3A479]/20 text-[#D3A479] font-bold text-sm max-w-md mx-auto animate-in fade-in">
              ✓ Thank you! Our expert consultant will reach out to your mobile shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your 10-digit mobile number"
                className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D3A479]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer shrink-0"
              >
                Get Callback
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
