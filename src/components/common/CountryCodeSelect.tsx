"use client";

import { useState, useRef, useEffect } from "react";

export interface CountryOption {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const POPULAR_COUNTRIES: CountryOption[] = [
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Qatar", code: "QA", dialCode: "+974", flag: "🇶🇦" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
];

export const ALL_COUNTRIES: CountryOption[] = [
  ...POPULAR_COUNTRIES,
  { name: "Kuwait", code: "KW", dialCode: "+965", flag: "🇰🇼" },
  { name: "Oman", code: "OM", dialCode: "+968", flag: "🇴🇲" },
  { name: "Bahrain", code: "BH", dialCode: "+973", flag: "🇧🇭" },
  { name: "Hong Kong", code: "HK", dialCode: "+852", flag: "🇭🇰" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "Ireland", code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { name: "Sweden", code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", dialCode: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", dialCode: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "FI", dialCode: "+358", flag: "🇫🇮" },
  { name: "Belgium", code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
  { name: "Poland", code: "PL", dialCode: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { name: "Greece", code: "GR", dialCode: "+30", flag: "🇬🇷" },
  { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { name: "Thailand", code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { name: "Philippines", code: "PH", dialCode: "+63", flag: "🇵🇭" },
  { name: "Vietnam", code: "VN", dialCode: "+84", flag: "🇻🇳" },
  { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94", flag: "🇱🇰" },
  { name: "Nepal", code: "NP", dialCode: "+977", flag: "🇳🇵" },
  { name: "Mauritius", code: "MU", dialCode: "+230", flag: "🇲🇺" },
  { name: "Israel", code: "IL", dialCode: "+972", flag: "🇮🇱" },
  { name: "Egypt", code: "EG", dialCode: "+20", flag: "🇪🇬" },
  { name: "Kenya", code: "KE", dialCode: "+254", flag: "🇰🇪" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
];

/**
 * Returns country option by ISO 2-letter country code.
 */
export function getCountryByIso(isoCode?: string): CountryOption | undefined {
  if (!isoCode) return undefined;
  const upper = isoCode.trim().toUpperCase();
  return ALL_COUNTRIES.find((c) => c.code === upper);
}

/**
 * Resolves dial code from ISO 2-letter code with fallback to India (+91).
 */
export function getDialCodeByIso(isoCode?: string): string {
  const match = getCountryByIso(isoCode);
  return match ? match.dialCode : "+91";
}

interface CountryCodeSelectProps {
  value: string;
  isoCode?: string;
  onChange: (dialCode: string, isoCode?: string) => void;
  disabled?: boolean;
}

export function CountryCodeSelect({
  value = "+91",
  isoCode,
  onChange,
  disabled = false,
}: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // If specific isoCode is passed (e.g. CA vs US which share +1), respect that
  const selectedCountry =
    (isoCode ? ALL_COUNTRIES.find((c) => c.code === isoCode.toUpperCase()) : null) ||
    ALL_COUNTRIES.find((c) => c.dialCode === value) ||
    ALL_COUNTRIES[0];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredCountries = ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#124446] shrink-0"
        aria-label="Select Country Calling Code"
      >
        <span>{selectedCountry.flag}</span>
        <span>{selectedCountry.dialCode}</span>
        <span className="text-[10px] text-slate-500">▼</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 text-slate-900">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <input
              type="text"
              autoFocus
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#124446]"
            />
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, idx) => (
                <button
                  key={`${country.code}-${country.dialCode}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(country.dialCode, country.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#BDD4E7]/20 transition-colors ${
                    country.code === selectedCountry.code ? "bg-[#BDD4E7]/30 font-bold" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{country.flag}</span>
                    <span className="truncate max-w-[130px]">{country.name}</span>
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">{country.dialCode}</span>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
