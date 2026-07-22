import { Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/mockups/devices";
import type { Service } from "@/features/services/schema";
import { cn } from "@/lib/utils";

/**
 * ServiceShowcaseCard — the project is the hero.
 *
 * Reading order:
 *   1. Header (title dominates, description is quieter and narrower)
 *   2. Phone showing a REAL project (falls back to first featured cover)
 *   3. Floating logo — attached to the phone, glassmorphic, physical
 *   4. Featured projects panel — generous, premium previews
 *
 * Composition varies per card via a slug-derived hash: tilt direction,
 * angle magnitude, phone size, logo side. Cards feel handcrafted, not
 * duplicated. A faint category-relevant background sits behind the phone.
 */

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

type Variant = {
  rotate: number; // deg
  phoneWidth: string;
  logoSide: "left" | "right";
  logoOffset: string;
  logoRotate: number;
};

function variantFor(slug: string): Variant {
  const h = hashSlug(slug);
  const variants: Variant[] = [
    { rotate: -6, phoneWidth: "w-[158px] md:w-[178px]", logoSide: "right", logoOffset: "-right-6", logoRotate: 8 },
    { rotate: 0, phoneWidth: "w-[162px] md:w-[184px]", logoSide: "right", logoOffset: "-right-7", logoRotate: 6 },
    { rotate: 6, phoneWidth: "w-[156px] md:w-[176px]", logoSide: "left", logoOffset: "-left-6", logoRotate: -8 },
    { rotate: -4, phoneWidth: "w-[168px] md:w-[190px]", logoSide: "left", logoOffset: "-left-7", logoRotate: -5 },
    { rotate: 4, phoneWidth: "w-[160px] md:w-[180px]", logoSide: "right", logoOffset: "-right-5", logoRotate: 10 },
    { rotate: -8, phoneWidth: "w-[154px] md:w-[174px]", logoSide: "left", logoOffset: "-left-5", logoRotate: -10 },
  ];
  return variants[h % variants.length];
}

export function ServiceShowcaseCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const showcase = service.showcase;
  const featured = (showcase?.featuredProjects ?? []).slice(0, 3);
  const v = variantFor(service.slug);

  // The project IS the hero — use a real project cover on the phone when
  // no dedicated phoneImage is supplied. Never fall back to placeholder art.
  const phoneScreen = showcase?.phoneImage ?? featured[0]?.cover;

  return (
    <article
      className={cn(
        "group relative w-full",
        "pb-[16%]", // room for the projects panel to hang below the stage
        className,
      )}
    >
      {/* ── THE STAGE ── */}
      <div
        className={cn(
          "relative aspect-[4/5] w-full rounded-[32px]",
          "border border-border/50 bg-gradient-to-b from-secondary/40 to-card",
        "shadow-[0_1px_2px_hsl(0_0%_0%/0.04),0_20px_40px_-24px_hsl(0_0%_0%/0.12)]",
          "transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:border-primary/25",
          "group-hover:shadow-[0_1px_2px_hsl(0_0%_0%/0.06),0_40px_70px_-24px_hsl(0_0%_0%/0.22)]",
        )}
      >
        {/* Ambient radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[22%] h-[55%] bg-[radial-gradient(50%_60%_at_50%_45%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_75%)] opacity-80 transition-opacity duration-700 group-hover:opacity-100"
        />
        {/* Faint grid pattern behind the phone (3–5% opacity) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-[24%] h-[46%] rounded-2xl opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Micro noise texture for premium feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[32px] opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Nav surface */}
        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          aria-label={service.title}
          className="absolute inset-0 z-0 rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />

        {/* ── 1. HEADER ── */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-8 pt-9 text-center md:pt-10">
          <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground md:text-[1.4rem]">
            {service.title}
          </h3>
          <p className="mx-auto mt-2.5 line-clamp-2 max-w-[68%] text-[13px] leading-[1.65] text-muted-foreground/85">
            {service.summary}
          </p>
        </div>

        {/* ── 2. PHONE (hero) + 3. FLOATING LOGO ── */}
        <div className="pointer-events-none absolute inset-x-0 top-[34%] z-20 flex justify-center">
          <div
            className={cn(
              "relative",
            )}
            style={{
              transform: `rotate(${v.rotate}deg)`,
              filter:
                "drop-shadow(0 14px 18px hsl(0 0% 0% / 0.14)) drop-shadow(0 28px 40px hsl(0 0% 0% / 0.18)) drop-shadow(0 50px 70px hsl(0 0% 0% / 0.14))",
            }}
          >
            <PhoneFrame className={v.phoneWidth}>
              {phoneScreen ? (
                <img
                  src={phoneScreen}
                  alt={`${service.title} — preview`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                // Intentionally blank — never fake content.
                <div className="h-full w-full bg-background" />
              )}
              {/* Edge lighting / subtle screen reflection */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-transparent mix-blend-overlay"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-white/8 to-transparent mix-blend-overlay"
              />
            </PhoneFrame>

            {/* Floating logo — attached to phone, +20% size, richer glass */}
            {(showcase?.logoImage || showcase?.logoLabel) && (
              <div
                aria-hidden
                dir="ltr"
                className={cn(
                  "absolute top-[42%]",
                  v.logoOffset,
                  "grid size-[70px] place-items-center rounded-2xl md:size-[78px]",
                  "border border-white/40 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/20 dark:bg-white/10",
                  "shadow-[0_10px_20px_-6px_hsl(0_0%_0%/0.25),0_24px_44px_-10px_hsl(0_0%_0%/0.35),inset_0_1px_0_hsl(0_0%_100%/0.6)]",
                )}
                style={{ transform: `rotate(${v.logoRotate}deg)` }}
              >
                {showcase?.logoImage ? (
                  <img
                    src={showcase.logoImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-10 object-contain"
                  />
                ) : (
                  <span className="px-2 text-center font-mono text-xs font-semibold tracking-tight text-foreground">
                    {showcase!.logoLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. FEATURED PROJECTS PANEL ── */}
      {featured.length > 0 && (
        <div
          className={cn(
            "relative z-10 mx-3 -mt-[13%] rounded-3xl border border-border/60 bg-card/95 p-7 backdrop-blur-xl md:p-8",
            "shadow-[0_1px_2px_hsl(0_0%_0%/0.05),0_30px_60px_-24px_hsl(0_0%_0%/0.22)]",
            "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover:-translate-y-1.5",
          )}
        >
          <ul className="grid grid-cols-3 gap-5">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/work/$slug"
                  params={{ slug: p.slug }}
                  onClick={(e) => e.stopPropagation()}
                  className="group/mini relative z-20 block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-[0_2px_6px_hsl(0_0%_0%/0.06),0_12px_24px_-10px_hsl(0_0%_0%/0.18)]">
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
                  <p className="mt-3 truncate text-[13px] font-medium text-foreground/85 transition-colors group-hover/mini:text-foreground">
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
