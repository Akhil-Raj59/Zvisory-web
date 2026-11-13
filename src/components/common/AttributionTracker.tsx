"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { recordPageAttribution } from "@/lib/tracking";

export function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    recordPageAttribution();
  }, [pathname, searchParams]);

  return null;
}

