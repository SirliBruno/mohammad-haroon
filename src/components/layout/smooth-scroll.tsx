import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Smooth momentum scroll provider using Lenis.
 * Delivers an elite, buttery-smooth scrolling experience matching top digital design studios.
 * Automatically respects `prefers-reduced-motion` and handles anchor links (#...) gracefully.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Only run on client and if reduced motion is not preferred
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1.05,
    });

    window.__lenis = lenis;

    // RAF loop for buttery rendering
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global anchor click listener for silk-smooth anchor scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLAnchorElement>("a[href*='#']");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Check if it's an on-page anchor link (e.g. #what-i-build or /#what-i-build)
      const url = new URL(target.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        const targetEl = document.querySelector(url.hash);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -70,
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}

/**
 * Programmatically scroll smoothly to an element or selector with Lenis inertia.
 */
export function smoothScrollTo(target: string | HTMLElement, offset = -70) {
  if (typeof window === "undefined") return;

  const targetEl =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!targetEl) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(targetEl, {
      offset,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    targetEl.scrollIntoView({ behavior: "smooth" });
  }
}

