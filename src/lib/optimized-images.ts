/**
 * Utility to map uncompressed or heavy legacy Supabase Storage image links
 * to ultra-optimized local WebP assets.
 */
export function getOptimizedImageUrl(src: string | null | undefined, slug?: string | null): string {
  if (src) {
    const s = src.trim();

    // 1. SpeakUp cover (was 3.65 MB base64-in-SVG)
    if (s.includes("241f11bb") || (s.includes("speakup") && s.includes(".svg"))) {
      return "/images/projects/speakup-cover.webp";
    }

    // 2. Rent Right platform / cover (was 22.3 MB base64-in-SVG)
    if (s.includes("7d26df9d") || (s.includes("rent-right") && s.includes(".svg"))) {
      return "/images/hero/rent-right-desktop.webp";
    }

    // 3. Rent Right desktop screenshot (was 925 KB PNG)
    if (s.includes("b99b5b71")) {
      return "/images/hero/rent-right-desktop.webp";
    }

    // 4. Rent Right mobile screenshot (was 877 KB PNG)
    if (s.includes("ed60788c")) {
      return "/images/hero/rent-right-mobile.webp";
    }

    // 5. SpeakUp desktop (was 430 KB PNG)
    if (s.includes("eb057ed3")) {
      return "/images/hero/speakup-desktop.webp";
    }

    // 6. SpeakUp mobile (was ~300 KB PNG)
    if (s.includes("26dbb069")) {
      return "/images/hero/speakup-mobile.webp";
    }

    // 7. Fitness Camp desktop / cover (was 2.73 MB SVG / 600 KB PNG)
    if (s.includes("c0852fc3") || s.includes("47536a47") || (s.includes("fitness") && s.includes(".svg"))) {
      return "/images/hero/fitness-camp-desktop.webp";
    }

    // 8. Fitness Camp mobile (was ~400 KB PNG)
    if (s.includes("4f64609a")) {
      return "/images/hero/fitness-camp-mobile.webp";
    }

    return s;
  }

  // Fallback by slug if src is missing
  if (slug === "rent-right") return "/images/hero/rent-right-desktop.webp";
  if (slug === "speakup") return "/images/projects/speakup-cover.webp";
  if (slug === "fitness-camp-management") return "/images/hero/fitness-camp-desktop.webp";

  return "";
}
