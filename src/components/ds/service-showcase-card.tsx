import { Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/mockups/devices";
import type { Service } from "@/features/services/schema";
import { cn } from "@/lib/utils";

/**
 * ServiceShowcaseCard — Apple-keynote composition.
 *
 * Reading order (top → bottom):
 *   1. Header (title + summary) — always readable, protected top zone
 *   2. Phone mockup — hero, ~70% inside the card, ~30% extending down
 *   3. Floating logo — attached to the phone, hovers next to the screen
 *   4. Featured projects panel — generous, balances the composition
 *
 * Layers cast progressively stronger shadows to build depth.
 */
export function ServiceShowcaseCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const showcase = service.showcase;
  const featured = (showcase?.featuredProjects ?? []).slice(0, 3);

  return (
    <article
      className={cn(
        "group relative w-full",
        // padding-bottom lets the phone extend slightly past the stage
        "pb-[14%]",
        className,
      )}
    >
      {/* THE STAGE — subtle pedestal */}
      <div
        className={cn(
          "relative aspect-[4/5] w-full rounded-[32px]",
          "border border-border/50 bg-gradient-to-b from-secondary/40 to-card",
          "shadow-[0_1px_2px_hsl(0_0%_0%/0.04),0_20px_40px_-24px_hsl(0_0%_0%/0.12)]",
          "transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:-translate-y-1 group-hover:border-primary/25",
          "group-hover:shadow-[0_1px_2px_hsl(0_0%_0%/0.06),0_40px_70px_-24px_hsl(0_0%_0%/0.22)]",
        )}
      >
        {/* Ambient glow behind the phone */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[18%] h-[55%] bg-[radial-gradient(50%_60%_at_50%_50%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_75%)] opacity-80 transition-opacity duration-700 group-hover:opacity-100"
        />

        {/* Clickable navigation surface */}
        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          aria-label={service.title}
          className="absolute inset-0 z-0 rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />

        {/* ─── 1. HEADER — protected top zone, always readable ─── */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-8 pt-8 text-center md:pt-9">
          <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {service.title}
          </h3>
          <p className="mx-auto mt-2 line-clamp-2 max-w-[88%] text-sm leading-relaxed text-muted-foreground">
            {service.summary}
          </p>
        </div>

        {/* ─── 2. PHONE — hero, positioned below header with breathing room ─── */}
        <div className="pointer-events-none absolute inset-x-0 top-[30%] z-20 flex justify-center">
          <div
            className={cn(
              "relative -rotate-[6deg]",
              "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:-translate-y-1.5 group-hover:-rotate-[4deg]",
            )}
            style={{
              filter:
                "drop-shadow(0 20px 24px hsl(0 0% 0% / 0.16)) drop-shadow(0 36px 48px hsl(0 0% 0% / 0.18))",
            }}
          >
            <PhoneFrame className="w-[150px] md:w-[168px]">
              {showcase?.phoneImage ? (
                <img
                  src={showcase.phoneImage}
                  alt={`${service.title} — preview`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                // Intentionally blank — never fake content
                <div className="h-full w-full bg-background" />
              )}
            </PhoneFrame>

            {/* ─── 3. FLOATING LOGO — attached to the phone ─── */}
            {(showcase?.logoImage || showcase?.logoLabel) && (
              <div
                aria-hidden
                dir="ltr"
                className={cn(
                  "absolute -right-5 top-[38%]",
                  "grid size-[58px] place-items-center rounded-2xl md:size-[64px]",
                  "border border-white/30 bg-white/90 backdrop-blur-2xl dark:bg-white/10",
                  "shadow-[0_18px_36px_-8px_hsl(0_0%_0%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.5)]",
                  "rotate-[8deg]",
                  "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "group-hover:-translate-y-1 group-hover:rotate-[2deg] group-hover:scale-[1.05]",
                )}
              >
                {showcase?.logoImage ? (
                  <img
                    src={showcase.logoImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-8 object-contain"
                  />
                ) : (
                  <span className="px-2 text-center font-mono text-[11px] font-semibold tracking-tight text-foreground">
                    {showcase!.logoLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 4. FEATURED PROJECTS — floating panel at the base ─── */}
      {featured.length > 0 && (
        <div
          className={cn(
            "relative z-10 mx-4 -mt-[12%] rounded-3xl border border-border/60 bg-card/95 p-6 backdrop-blur-xl md:p-7",
            "shadow-[0_1px_2px_hsl(0_0%_0%/0.04),0_24px_50px_-20px_hsl(0_0%_0%/0.18)]",
            "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover:-translate-y-1",
          )}
        >
          <ul className="grid grid-cols-3 gap-4">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/work/$slug"
                  params={{ slug: p.slug }}
                  onClick={(e) => e.stopPropagation()}
                  className="group/mini relative z-20 block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm">
                    {p.cover ? (
                      <img
                        src={p.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mini:scale-[1.06]"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                  <p className="mt-2.5 truncate text-xs font-medium text-foreground/80 transition-colors group-hover/mini:text-foreground">
                    {p.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
