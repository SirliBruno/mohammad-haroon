/**
 * Aurora — signature ambient background for the whole site.
 * Fixed, non-interactive, GPU-friendly. Two slowly drifting radial
 * glows + a subtle grid + a fine noise texture. Honors reduced-motion.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Drifting radial glows */}
      <div
        className="absolute -top-1/3 -left-1/4 h-[70vmax] w-[70vmax] rounded-full opacity-[0.35] blur-3xl motion-safe:animate-[aurora-a_22s_ease-in-out_infinite_alternate]"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--color-primary) 55%, transparent) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 h-[65vmax] w-[65vmax] rounded-full opacity-[0.28] blur-3xl motion-safe:animate-[aurora-b_28s_ease-in-out_infinite_alternate]"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--color-accent) 55%, transparent) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "var(--color-foreground)",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Vignette top edge for section rhythm */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background to-transparent" />
    </div>
  );
}
