"use client";

import { useState } from "react";
import { CountryCodeSelect } from "@/components/common/CountryCodeSelect";
import { TurnstileWidget } from "@/components/common/TurnstileWidget";
import { leadService } from "@/services/leadService";

interface LeadCollectionProps {
  contextText?: string;
  formLocation?: string;
}

export function LeadCollection({
  contextText = "Get direct advisory callback from our real estate experts",
  formLocation = "homepage_banner",
}: LeadCollectionProps) {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 6) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (countryCode === "+91" && cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);

    try {
      await leadService.submitLead({
        fullName: name.trim() || "Website Visitor",
        email: email.trim(),
        countryCode,
        phone: cleanPhone,
        message: message.trim(),

        formType: "homepage_callback",
        formLocation,
        projectUrl: typeof window !== "undefined" ? window.location.href : "",

        turnstileToken,
      });

      setSubmitted(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit request. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12 bg-[#124446] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#124446] via-[#1a5b5d] to-[#124446] p-6 sm:p-10 rounded-3xl border border-[#D3A479]/40 shadow-xl text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D3A479]">
              Instant Assistance
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Looking for Personalized Property Recommendations?
            </h3>
            <p className="text-xs sm:text-sm text-[#BDD4E7]">{contextText}</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-[#D3A479]/20 text-[#D3A479] font-bold text-sm max-w-md mx-auto animate-in fade-in space-y-1 border border-[#D3A479]/30">
              <div className="text-2xl">✓</div>
              <div className="text-base text-white">Enquiry Received!</div>
              <p className="text-xs text-[#BDD4E7] font-normal">
                Our senior real estate consultant will reach out to your mobile shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-3">
              {error && (
                <div className="p-3 rounded-xl bg-rose-900/60 border border-rose-400 text-rose-200 text-xs font-medium">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name *"
                    className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D3A479]"
                  />
                </div>

                <div className="flex gap-2">
                  <CountryCodeSelect value={countryCode} onChange={setCountryCode} disabled={loading} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile Number *"
                    className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D3A479]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address (Optional)"
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D3A479]"
                />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Requirement (e.g. 3 BHK in Gurugram)"
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D3A479]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <TurnstileWidget onVerify={setTurnstileToken} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] disabled:bg-slate-500 disabled:cursor-not-allowed text-[#124446] font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer shrink-0"
                >
                  {loading ? "Submitting..." : "Get Advisory Callback →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
