/**
 * Utility to map uncompressed or heavy legacy Supabase Storage image links
 * to ultra-optimized local WebP assets.
 */
export function getOptimizedImageUrl(src: string | null | undefined, slug?: string | null): string {
  if (src) {
    const s = src.trim();

    // 1. SpeakUp project presentation cover (was 3.65 MB base64-in-SVG)
    if (s.includes("241f11bb") || (s.includes("speakup") && s.includes(".svg"))) {
      return "/images/projects/speakup-cover.webp";
    }

    // 2. Rent Right project presentation cover (was 22.3 MB base64-in-SVG)
    if (s.includes("7d26df9d") || (s.includes("rent-right") && s.includes(".svg"))) {
      return "/images/projects/rent-right-cover.webp";
    }

    // 3. Rent Right desktop screenshot (in Hero)
    if (s.includes("b99b5b71")) {
      return "/images/hero/rent-right-desktop.webp";
    }

    // 4. Rent Right mobile screenshot (in Hero)
    if (s.includes("ed60788c")) {
      return "/images/hero/rent-right-mobile.webp";
    }

    // 5. SpeakUp desktop (in Hero)
    if (s.includes("eb057ed3")) {
      return "/images/hero/speakup-desktop.webp";
    }

    // 6. SpeakUp mobile (in Hero)
    if (s.includes("26dbb069")) {
      return "/images/hero/speakup-mobile.webp";
    }

    // 7. Fitness Camp project presentation cover (was 2.73 MB SVG)
    if (s.includes("47536a47") || (s.includes("fitness") && s.includes(".svg"))) {
      return "/images/projects/fitness-camp-cover.webp";
    }

    // 8. Fitness Camp desktop (in Hero)
    if (s.includes("c0852fc3")) {
      return "/images/hero/fitness-camp-desktop.webp";
    }

    // 9. Fitness Camp mobile (in Hero)
    if (s.includes("4f64609a")) {
      return "/images/hero/fitness-camp-mobile.webp";
    }

    return s;
  }

  // Fallback by slug if src is missing
  if (slug === "rent-right") return "/images/projects/rent-right-cover.webp";
  if (slug === "speakup") return "/images/projects/speakup-cover.webp";
  if (slug === "fitness-camp-management") return "/images/projects/fitness-camp-cover.webp";

  return "";
}
