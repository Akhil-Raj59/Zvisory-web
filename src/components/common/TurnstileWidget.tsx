"use client";

import { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: unknown) => void;
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: (error: unknown) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  className = "",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  const isPlaceholderKey =
    !siteKey ||
    siteKey === "your_cloudflare_site_key" ||
    siteKey.startsWith("your_") ||
    siteKey === "dummy";

  useEffect(() => {
    // Development fallback when credentials are placeholders
    if (isPlaceholderKey) {
      onVerify("bypass-dev-token");
      return;
    }

    let isMounted = true;

    function renderWidget() {
      if (!window.turnstile || !containerRef.current || !isMounted) return;

      // Prevent duplicate rendering attempts in the same container
      if (widgetIdRef.current) return;

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            if (isMounted) onVerify(token);
          },
          "expired-callback": () => {
            if (isMounted && onExpire) onExpire();
          },
          "error-callback": (err: unknown) => {
            console.error("Turnstile error:", err);
            if (isMounted && onError) onError(err);
          },
          theme: "light",
          size: "normal",
        });
      } catch (err) {
        console.error("Failed to render Turnstile widget:", err);
      }
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      // Load Turnstile script
      const scriptId = "cloudflare-turnstile-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          renderWidget();
        };
        document.head.appendChild(script);
      } else {
        const existingScript = document.getElementById(scriptId) as HTMLScriptElement;
        const originalOnload = existingScript.onload;
        existingScript.onload = (e) => {
          if (typeof originalOnload === "function") {
            originalOnload.call(existingScript, e);
          }
          renderWidget();
        };
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey, isPlaceholderKey, onVerify, onExpire, onError]);

  if (isPlaceholderKey) {
    return (
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium ${className}`}
      >
        <span>🛡️</span>
        <span>Spam Protection Active (Safe Development Mode)</span>
      </div>
    );
  }

  return (
    <div className={`turnstile-container my-2 ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}