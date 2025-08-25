"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Set initial state
    setIsMobile(mediaQuery.matches);

    // Subscribe to changes
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Safari fallback
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }
  }, [breakpoint]);

  return isMobile;
} 