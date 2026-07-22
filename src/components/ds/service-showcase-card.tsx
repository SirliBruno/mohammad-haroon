import { Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/mockups/devices";
import type { Service } from "@/features/services/schema";
import { cn } from "@/lib/utils";

/**
 * ServiceShowcaseCard — the phone is the hero.
 *
 * The card is a low-key stage. The phone mockup breaks out of it: rotated,
 * oversized, extending above the top edge. A single floating brand badge
 * hovers in front of the phone like a physical object. The card only
 * supports the presentation with a tiny header + 3 project thumbnails.
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
        // extra top padding so the phone can float above the stage
        "pt-[26%]",
        className,
      )}
    >
      {/* The STAGE — a subtle pedestal. Not a marketing card. */}
      <div
        className={cn(
          "relative aspect-[5/6] w-full rounded-[32px]",
          "border border-border/50 bg-gradient-to-b from-secondary/40 to-card",
          "shadow-[0_1px_2px_hsl(0_0%_0%/0.04),0_20px_40px_-24px_hsl(0_0%_0%/0.12)]",
          "transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:-translate-y-1 group-hover:border-primary/25",
          "group-hover:shadow-[0_1px_2px_hsl(0_0%_0%/0.06),0_40px_70px_-24px_hsl(0_0%_0%/0.22)]",
        )}
      >
        {/* Ambient glow anchored under the phone */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[62%] rounded-t-[32px] bg-[radial-gradient(55%_75%_at_50%_35%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_75%)] opacity-80 transition-opacity duration-700 group-hover:opacity-100"
        />
        {/* Soft ground shadow under the floating phone */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[58%] h-8 w-[55%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-2xl opacity-40 transition-opacity duration-700 group-hover:opacity-55"
        />

        {/* Card-wide navigation surface */}
        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          aria-label={service.title}
          className="absolute inset-0 z-0 rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />

        {/* Tiny supporting header — small, calm, low priority */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[36%] z-20 px-7 text-center">
          <h3 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
            {service.title}
          </h3>
          <p className="mx-auto mt-1 line-clamp-1 max-w-[85%] text-xs text-muted-foreground md:text-sm">
            {service.summary}
          </p>
        </div>

        {/* Footer strip — 3 project thumbnails only */}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20">
          {featured.length > 0 ? (
            <ul className="grid grid-cols-3 gap-2">
              {featured.map((p) => (
                <li key={p.slug} className="pointer-events-auto">
                  <Link
                    to="/work/$slug"
                    params={{ slug: p.slug }}
                    onClick={(e) => e.stopPropagation()}
                    className="group/mini relative z-20 block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-muted">
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
                    <p className="mt-1.5 truncate text-[11px] font-medium text-foreground/80 transition-colors group-hover/mini:text-foreground">
                      {p.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* THE HERO — phone breaks out of the stage from the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center">
        <div
          className={cn(
            "relative -rotate-[8deg]",
            "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover:-translate-y-2 group-hover:-rotate-[6deg]",
          )}
          style={{
            filter:
              "drop-shadow(0 24px 30px hsl(0 0% 0% / 0.18)) drop-shadow(0 40px 60px hsl(0 0% 0% / 0.22))",
          }}
        >
          <PhoneFrame className="w-[210px] md:w-[240px]">
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

          {/* Single floating brand object — feels physical, in front of phone */}
          {(showcase?.logoImage || showcase?.logoLabel) && (
            <div
              aria-hidden
              dir="ltr"
              className={cn(
                "absolute -left-6 bottom-[22%]",
                "grid size-[68px] place-items-center rounded-2xl md:size-[76px]",
                "border border-white/30 bg-white/85 backdrop-blur-2xl dark:bg-white/10",
                "shadow-[0_20px_40px_-10px_hsl(0_0%_0%/0.4),inset_0_1px_0_hsl(0_0%_100%/0.5)]",
                "rotate-[10deg]",
                "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:-translate-y-1 group-hover:rotate-[4deg] group-hover:scale-[1.05]",
              )}
            >
              {showcase?.logoImage ? (
                <img
                  src={showcase.logoImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-9 object-contain"
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
    </article>
  );
}
