import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/mockups/devices";
import type { Service } from "@/features/services/schema";
import { cn } from "@/lib/utils";

/**
 * ServiceShowcaseCard — premium mini case-study card.
 *
 * Three-layer composition:
 *   1) Floating header pill (title + 2-line summary)
 *   2) Tilted iPhone hero showing real work, with a glass tech badge
 *   3) Floating footer panel with 3 thumbnail-based project previews
 *
 * Everything animates on hover: card lifts, phone floats up, badge rotates
 * back to level, footer slides up. Motion uses a long ease-out (700ms).
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
  const primary = featured[0];

  return (
    <article
      className={cn(
        "group relative isolate aspect-[4/5] w-full overflow-hidden rounded-[36px]",
        "border border-border/60 bg-card",
        "shadow-[0_1px_2px_hsl(0_0%_0%/0.04),0_8px_24px_-12px_hsl(0_0%_0%/0.08)]",
        "transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1.5 hover:border-primary/30",
        "hover:shadow-[0_1px_2px_hsl(0_0%_0%/0.06),0_30px_60px_-20px_hsl(0_0%_0%/0.25)]",
        "focus-within:border-primary/40",
        className,
      )}
    >
      {/* Ambient radial glow behind the phone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_58%_48%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_70%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100"
      />
      {/* Subtle grain for premium texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Card-wide navigation surface (clickable background) */}
      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        aria-label={service.title}
        className="absolute inset-0 z-0 rounded-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      {/* 1 — Floating header pill */}
      <div className="pointer-events-none absolute inset-x-5 top-5 z-30 rounded-3xl border border-border/60 bg-background/75 px-6 py-5 backdrop-blur-xl md:px-7 md:py-6">
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-foreground md:text-xl">
          {service.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {service.summary}
        </p>
      </div>

      {/* 2 — Showcase: tilted iPhone breaking the grid + floating badge */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        {/* Phone: shifted right and rotated, overlapping the header slightly */}
        <div
          className={cn(
            "absolute right-[8%] top-[18%]",
            "rotate-[9deg]",
            "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover:-translate-y-4 group-hover:rotate-[7deg]",
          )}
          style={{
            filter: "drop-shadow(0 30px 40px hsl(0 0% 0% / 0.25))",
          }}
        >
          <PhoneFrame className="w-[180px] md:w-[200px]">
            {showcase?.phoneImage ? (
              <img
                src={showcase.phoneImage}
                alt={`${service.title} — preview`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/25 via-accent/10 to-background" />
            )}
          </PhoneFrame>
        </div>

        {/* Floating tech badge — glassmorphism, overlaps phone on the left */}
        {(showcase?.logoImage || showcase?.logoLabel) && (
          <div
            aria-hidden
            className={cn(
              "absolute left-[14%] top-[42%] z-10",
              "grid size-[72px] place-items-center rounded-3xl md:size-[80px]",
              "border border-white/25 bg-white/15 backdrop-blur-2xl",
              "shadow-[0_10px_30px_-8px_hsl(0_0%_0%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.35)]",
              "-rotate-[8deg]",
              "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:rotate-0 group-hover:scale-[1.06]",
            )}
            dir="ltr"
          >
            {showcase.logoImage ? (
              <img
                src={showcase.logoImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-10 object-contain"
              />
            ) : (
              <span className="px-2 text-center font-mono text-[11px] font-semibold tracking-tight text-foreground">
                {showcase.logoLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3 — Floating footer panel: mini project previews (thumbnails) */}
      <div
        className={cn(
          "absolute inset-x-5 bottom-5 z-30 rounded-3xl border border-border/60 bg-secondary/75 p-5 backdrop-blur-xl md:p-6",
          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:-translate-y-1.5",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p
            className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
            dir="ltr"
          >
            Featured Work
          </p>
          {primary && (
            <Link
              to="/work/$slug"
              params={{ slug: primary.slug }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-20 inline-flex items-center gap-1 text-xs font-medium text-foreground/85 transition-colors hover:text-primary"
            >
              <span>عرض المشروع</span>
              <ArrowLeft className="size-3.5" aria-hidden />
            </Link>
          )}
        </div>

        {featured.length > 0 ? (
          <ul className="grid grid-cols-3 gap-2.5">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/work/$slug"
                  params={{ slug: p.slug }}
                  onClick={(e) => e.stopPropagation()}
                  className="group/mini relative z-20 block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-muted">
                    {p.cover ? (
                      <img
                        src={p.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mini:scale-[1.08]"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/10" />
                    )}
                  </div>
                  <p className="mt-2 truncate text-[11px] font-medium text-foreground/80 transition-colors group-hover/mini:text-foreground">
                    {p.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">قريبًا</p>
        )}
      </div>
    </article>
  );
}
