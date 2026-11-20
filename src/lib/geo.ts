"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getCountryByIso, getDialCodeByIso } from "@/components/common/CountryCodeSelect";

export interface DetectedCountryResult {
  countryCode: string; // ISO 2-letter code e.g. "IN", "US", "AE"
  dialCode: string;    // Dialing prefix e.g. "+91", "+1", "+971"
  countryName: string; // Country name e.g. "India", "United States"
}

const STORAGE_KEY = "zvisory_detected_geo";

const FALLBACK_COUNTRY: DetectedCountryResult = {
  countryCode: "IN",
  dialCode: "+91",
  countryName: "India",
};

/**
 * Detects visitor's country via IP geolocation silently (without GPS permission).
 * Caches in sessionStorage so detection occurs at most once per browsing session.
 */
export async function detectVisitorCountry(): Promise<DetectedCountryResult> {
  if (typeof window === "undefined") {
    return FALLBACK_COUNTRY;
  }

  // 1. Check session cache
  try {
    const cached = window.sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.dialCode && parsed.countryCode) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }

  // 2. Fetch from Next.js /api/geo endpoint (silent IP detection)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

    const res = await fetch("/api/geo", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const iso = (data.countryCode || "IN").toUpperCase();
      const countryOption = getCountryByIso(iso);
      const dialCode = countryOption ? countryOption.dialCode : getDialCodeByIso(iso);
      const countryName = countryOption?.name || data.countryName || "India";

      const result: DetectedCountryResult = {
        countryCode: iso,
        dialCode,
        countryName,
      };

      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      } catch {
        // ignore
      }

      return result;
    }
  } catch {
    // Fallback on timeout or network error
  }

  return FALLBACK_COUNTRY;
}

/**
 * React Hook for forms that use CountryCodeSelect.
 * - Initializes with fallback "+91".
 * - Runs silent IP country detection in the background.
 * - Does NOT block user typing or form submission.
 * - If user manually selects a country before detection finishes, the manual selection is PRESERVED.
 */
export function useAutoCountryCode(initialDialCode = "+91") {
  const [countryCode, setCountryCodeState] = useState(initialDialCode);
  const [isoCode, setIsoCode] = useState("IN");
  const [isDetecting, setIsDetecting] = useState(true);
  const userHasSelectedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    detectVisitorCountry()
      .then((detected) => {
        if (!isMounted) return;
        setIsDetecting(false);

        // Only auto-update if the user has NOT manually chosen another country code yet
        if (!userHasSelectedRef.current) {
          setCountryCodeState(detected.dialCode);
          setIsoCode(detected.countryCode);
        }
      })
      .catch(() => {
        if (isMounted) setIsDetecting(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setCountryCode = useCallback((newDialCode: string, newIsoCode?: string) => {
    userHasSelectedRef.current = true;
    setCountryCodeState(newDialCode);
    if (newIsoCode) {
      setIsoCode(newIsoCode.toUpperCase());
    } else {
      const match = getCountryByIso(newIsoCode);
      if (match) setIsoCode(match.code);
    }
  }, []);

  return {
    countryCode,
    isoCode,
    setCountryCode,
    isDetecting,
  };
}

