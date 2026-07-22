import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/mockups/devices";
import type { Service } from "@/features/services/schema";
import { cn } from "@/lib/utils";

/**
 * ServiceShowcaseCard — mini case-study card for the /services grid.
 *
 * Layout mirrors the wireframe:
 *   ┌─────────────────────────┐
 *   │  ╭─── header panel ──╮  │   floating, inset from card edges
 *   │                        │
 *   │        [ 📱 ] [logo]    │   iPhone + glass logo badge
 *   │                        │
 *   │  ╭─── footer panel ──╮  │   featured projects + view link
 *   └─────────────────────────┘
 */
export function ServiceShowcaseCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const showcase = service.showcase;
  const featured = showcase?.featuredProjects ?? [];
  const primaryProject = featured[0];

  return (
    <article
      className={cn(
        "group relative isolate aspect-[4/5] w-full overflow-hidden rounded-[32px]",
        "border border-border/70 bg-card",
        "shadow-xs transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl",
        "focus-within:border-primary/40",
        className,
      )}
    >
      {/* Ambient glow behind the phone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_50%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100"
      />

      {/* Card-level link (covers the empty showcase area only, so inner links stay clickable) */}
      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        aria-label={service.title}
        className="absolute inset-0 z-0 rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      {/* Header panel (floating) */}
      <div className="pointer-events-none absolute inset-x-5 top-5 z-10 rounded-3xl border border-border/70 bg-background/60 px-5 py-4 backdrop-blur-md md:px-6 md:py-5">
        <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {service.title}
        </h3>
        <p
          className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground"
        >
          {service.summary}
        </p>
      </div>

      {/* Showcase area — centered iPhone + glass logo badge */}
      <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-8">
        <div className="relative transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2.5">
          <PhoneFrame className="w-[160px] md:w-[170px]">
            {showcase?.phoneImage ? (
              <img
                src={showcase.phoneImage}
                alt={`${service.title} — preview`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
            )}
          </PhoneFrame>

          {/* Glass logo badge — overlaps the phone */}
          {(showcase?.logoImage || showcase?.logoLabel) && (
            <div
              aria-label={showcase.logoLabel ?? "logo"}
              className={cn(
                "absolute -left-6 top-1/3 grid size-16 place-items-center rounded-2xl",
                "border border-border/60 bg-background/70 shadow-lg backdrop-blur-xl",
                "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:rotate-[5deg] group-hover:scale-[1.05]",
              )}
              dir="ltr"
            >
              {showcase.logoImage ? (
                <img
                  src={showcase.logoImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-8 object-contain"
                />
              ) : (
                <span className="font-mono text-[10px] font-medium tracking-tight text-foreground">
                  {showcase.logoLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer panel (floating) — featured projects */}
      <div
        className={cn(
          "absolute inset-x-5 bottom-5 z-10 rounded-3xl border border-border/60 bg-secondary/70 px-5 py-4 backdrop-blur-md md:px-6 md:py-5",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground" dir="ltr">
            Featured Projects
          </p>
          {primaryProject && (
            <Link
              to="/work/$slug"
              params={{ slug: primaryProject.slug }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-20 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              <span>عرض المشروع</span>
              <ArrowLeft className="size-3.5" aria-hidden />
            </Link>
          )}
        </div>

        {featured.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {featured.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link
                  to="/work/$slug"
                  params={{ slug: p.slug }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-20 flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  <span
                    aria-hidden
                    className="inline-block size-1 rounded-full bg-muted-foreground/60"
                  />
                  <span className="truncate">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">قريبًا</p>
        )}
      </div>
    </article>
  );
}
