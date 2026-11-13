"use client";

import { useState } from "react";
import { CountryCodeSelect } from "@/components/common/CountryCodeSelect";
import { TurnstileWidget } from "@/components/common/TurnstileWidget";
import { leadService } from "@/services/leadService";

export interface ContactModalProjectContext {
  projectId?: string;
  projectName?: string;
  projectSlug?: string;
  city?: string;
  developer?: string;
  projectUrl?: string;
  formType?: string;
  formLocation?: string;
}

interface ContactModalProps {
  onClose: () => void;
  projectContext?: ContactModalProjectContext;
}

export function ContactModal({ onClose, projectContext }: ContactModalProps) {
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

    // Validation
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
        fullName: name,
        email: email.trim(),
        countryCode,
        phone: cleanPhone,
        message: message.trim(),

        formType: projectContext?.formType || (projectContext?.projectName ? "property_modal" : "header_contact_modal"),
        formLocation: projectContext?.formLocation || (projectContext?.projectName ? "property_detail" : "header_navigation"),
        projectId: projectContext?.projectId || null,
        projectName: projectContext?.projectName || "",
        projectSlug: projectContext?.projectSlug || "",
        city: projectContext?.city || "",
        developer: projectContext?.developer || "",
        projectUrl: projectContext?.projectUrl || (typeof window !== "undefined" ? window.location.href : ""),

        turnstileToken,
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#124446] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Request Callback</h3>
            <p className="text-xs text-[#BDD4E7] mt-0.5">
              {projectContext?.projectName
                ? `Enquiring for ${projectContext.projectName}`
                : "Speak with a Senior Zvisory Real Estate Consultant"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-4 p-3 rounded-xl bg-[#BDD4E7]/30 text-[#124446] text-xs flex items-center gap-2">
            <span className="font-bold">📞 Direct Advisory Line:</span>
            <span>+91 98765 43210 / +91 11 4567 8900</span>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl font-bold">
                ✓
              </div>
              <h4 className="text-xl font-bold text-slate-900">Enquiry Submitted!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>. A dedicated Zvisory senior property advisor will contact you at{" "}
                <strong>
                  {countryCode} {phone}
                </strong>{" "}
                shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#124446]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <CountryCodeSelect value={countryCode} onChange={setCountryCode} disabled={loading} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#124446]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#124446]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Property Requirement / Message
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    projectContext?.projectName
                      ? `Interested in ${projectContext.projectName}. Please share floor plans, pricing and schedule a site visit.`
                      : "Looking for 3 BHK luxury property in Gurugram..."
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#124446]"
                ></textarea>
              </div>

              {/* Cloudflare Turnstile */}
              <TurnstileWidget onVerify={setTurnstileToken} />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#D3A479] hover:bg-[#b88c63] disabled:bg-slate-300 disabled:cursor-not-allowed text-[#124446] font-bold text-sm uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-[#124446]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <span>Submit Callback Request</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
