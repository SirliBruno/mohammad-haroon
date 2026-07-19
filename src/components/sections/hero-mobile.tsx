/**
 * HeroMobile — "Atomic Orbit"
 *
 * The personal monogram (MH) is the nucleus, fixed at the exact center.
 * Two thin orbital rings carry small iPhone mockups — each phone shows a
 * mobile preview of a real featured project. Orbits rotate at different
 * speeds using linear timing. Tap any phone → orbits pause, the tapped
 * phone glides to center and scales up, the others recede with a soft
 * blur/dim. Tap the nucleus (or the close chip) to return.
 */
import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpLeft, X } from "lucide-react";
import { listHeroProjectsPublic } from "@/lib/cms/hero.functions";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

/* ---------------- Mini mobile screens ---------------- */

type ScreenProps = {
  tint: string; // gradient class for the header
  eyebrow: string;
  title: string;
  kpi: string;
  kpiLabel: string;
  accent: string; // tailwind bg class for accent bars
};

function MiniScreen({ tint, eyebrow, title, kpi, kpiLabel, accent }: ScreenProps) {
  return (
    <div
      dir="ltr"
      className="flex h-full w-full flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-2 pt-1 text-[6px] font-medium">
        <span>9:41</span>
        <span className="flex gap-[2px]">
          <span className="size-[3px] rounded-full bg-neutral-900 dark:bg-neutral-100" />
          <span className="size-[3px] rounded-full bg-neutral-900 dark:bg-neutral-100" />
        </span>
      </div>
      {/* Hero banner */}
      <div className={cn("mx-1.5 mt-1 h-6 rounded-md bg-linear-to-br", tint)} />
      {/* Title */}
      <div className="mx-1.5 mt-1.5">
        <div className="text-[6px] uppercase tracking-[0.18em] text-neutral-500">
          {eyebrow}
        </div>
        <div className="mt-[1px] truncate text-[8px] font-semibold tracking-tight">
          {title}
        </div>
      </div>
      {/* KPI card */}
      <div className="mx-1.5 mt-1 rounded-md border border-neutral-200 p-1 dark:border-neutral-800">
        <div className="text-[6px] text-neutral-500">{kpiLabel}</div>
        <div className="text-[9px] font-bold tracking-tight">{kpi}</div>
      </div>
      {/* List */}
      <div className="mx-1.5 mt-1.5 space-y-[3px]">
        {[92, 78, 64, 48].map((w, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className={cn("size-1 rounded-full", accent)} />
            <span
              className="h-[3px] rounded-sm bg-neutral-200 dark:bg-neutral-800"
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
      </div>
      {/* Tab bar */}
      <div className="mt-auto flex items-center justify-around border-t border-neutral-100 py-1 dark:border-neutral-900">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "size-1 rounded-full",
              i === 0 ? accent : "bg-neutral-300 dark:bg-neutral-700",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- iPhone frame ---------------- */

function PhoneFrame({
  children,
  width,
  featured = false,
}: {
  children: ReactNode;
  width: number;
  featured?: boolean;
}) {
  return (
    <div
      style={{ width }}
      className={cn(
        "rounded-[1.4rem] border border-neutral-800/70 bg-neutral-950 p-[3px] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)] dark:border-neutral-700",
        featured && "shadow-[0_30px_60px_-25px_rgba(0,0,0,0.55)]",
      )}
    >
      <div className="relative overflow-hidden rounded-[1.15rem] bg-black">
        <div className="pointer-events-none absolute left-1/2 top-[3px] z-10 h-[7px] w-[26px] -translate-x-1/2 rounded-full bg-black" />
        <div className="aspect-[9/19.5] w-full overflow-hidden rounded-[1.15rem] bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Project data ---------------- */

type Item = {
  slug: string;
  name: string;
  category: string;
  tech: string[];
  description: string;
  screen: ScreenProps;
};

const FALLBACK: Item[] = [
  {
    slug: "atelier",
    name: "Atelier",
    category: "موقع تعريفي",
    tech: ["React", "TypeScript", "Framer"],
    description: "موقع محرّر بلغة تصميم دافئة ومحتوى قابل للإدارة بالكامل.",
    screen: {
      tint: "from-stone-200 via-stone-300 to-stone-400 dark:from-stone-700 dark:via-stone-800 dark:to-stone-900",
      eyebrow: "Journal",
      title: "A quieter tool.",
      kpi: "6 min read",
      kpiLabel: "Essay",
      accent: "bg-stone-500",
    },
  },
  {
    slug: "northwind",
    name: "Northwind",
    category: "لوحة تحليلات",
    tech: ["Next.js", "PostgreSQL", "Charts"],
    description: "لوحة تحليلات هادئة مبنية للسرعة ووضوح القرار.",
    screen: {
      tint: "from-emerald-200 via-emerald-300 to-teal-400 dark:from-emerald-900 dark:via-emerald-800 dark:to-teal-900",
      eyebrow: "Today",
      title: "Revenue up 12%",
      kpi: "$48.2k",
      kpiLabel: "MRR",
      accent: "bg-emerald-500",
    },
  },
  {
    slug: "lumen",
    name: "Lumen",
    category: "تطبيق دفع",
    tech: ["React Native", "Stripe"],
    description: "تجربة دفع رقمية سلسة على الجوال مع إشعارات حيّة.",
    screen: {
      tint: "from-indigo-200 via-violet-300 to-fuchsia-300 dark:from-indigo-900 dark:via-violet-900 dark:to-fuchsia-900",
      eyebrow: "Wallet",
      title: "Good morning.",
      kpi: "$4,820",
      kpiLabel: "Balance",
      accent: "bg-violet-500",
    },
  },
  {
    slug: "haven",
    name: "Haven",
    category: "تجارة إلكترونية",
    tech: ["Shopify", "Hydrogen"],
    description: "متجر أنيق بتجربة شراء انسيابية وأداء عالٍ.",
    screen: {
      tint: "from-amber-200 via-orange-300 to-rose-300 dark:from-amber-900 dark:via-orange-900 dark:to-rose-900",
      eyebrow: "Spring",
      title: "Quiet essentials",
      kpi: "12 items",
      kpiLabel: "New in",
      accent: "bg-amber-500",
    },
  },
  {
    slug: "verano",
    name: "Verano",
    category: "نقاط بيع",
    tech: ["React", "Supabase"],
    description: "نظام نقاط بيع للمقاهي بواجهة سريعة وسير عمل واضح.",
    screen: {
      tint: "from-neutral-800 via-neutral-900 to-black",
      eyebrow: "Table 07",
      title: "Order in progress",
      kpi: "$54.00",
      kpiLabel: "Total",
      accent: "bg-neutral-500",
    },
  },
];

/* ---------------- Orbit layout ---------------- */

type OrbitDef = {
  /** Radius as a % of the stage width. */
  r: number;
  /** Orbit period in seconds. */
  dur: number;
  /** +1 clockwise, -1 counter-clockwise. */
  dir: 1 | -1;
  /** Angles (deg) where phones sit initially. */
  angles: number[];
};

const ORBITS: OrbitDef[] = [
  { r: 30, dur: 44, dir: 1, angles: [0, 180] },       // inner: 2 phones
  { r: 42, dur: 72, dir: -1, angles: [60, 190, 310] }, // outer: 3 phones
];

const PHONE_WIDTH = 74; // px — small phones on orbit
const FOCUS_WIDTH = 148; // px — active phone at center

/* ---------------- Component ---------------- */

export function HeroMobile() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const fetchHero = useServerFn(listHeroProjectsPublic);
  const { data: dbHero } = useQuery({
    queryKey: ["hero-projects-public"],
    queryFn: () => fetchHero(),
    staleTime: 60_000,
  });

  const projects: Item[] = useMemo(() => {
    if (!dbHero || dbHero.length === 0) return FALLBACK;
    return dbHero.slice(0, FALLBACK.length).map((r, i): Item => {
      const fb = FALLBACK[i % FALLBACK.length];
      return {
        slug: r.id,
        name: r.title,
        category: r.category || fb.category,
        tech: fb.tech,
        description: fb.description,
        screen: fb.screen,
      };
    });
  }, [dbHero]);

  // Flatten orbit slots → global index.
  const slots = useMemo(() => {
    const out: {
      orbit: number;
      angle: number;
      duration: number;
      dir: 1 | -1;
      r: number;
      itemIndex: number;
    }[] = [];
    let idx = 0;
    ORBITS.forEach((o, oi) => {
      o.angles.forEach((a) => {
        out.push({
          orbit: oi,
          angle: a,
          duration: o.dur,
          dir: o.dir,
          r: o.r,
          itemIndex: idx % Math.max(projects.length, 1),
        });
        idx++;
      });
    });
    return out;
  }, [projects.length]);

  const activeItem = active != null ? projects[active] : null;
  const displayed = activeItem ?? projects[0];

  return (
    <div
      dir="rtl"
      className="relative w-full select-none"
      aria-label="مدار المشاريع"
    >
      {/* Local keyframes for orbit spin (both directions). */}
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>

      {/* ---------- Stage ---------- */}
      <div className="relative mx-auto aspect-square w-full max-w-[440px]">
        {/* Background: radial gradient + faint grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          {/* Soft glow behind nucleus */}
          <div className="absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
        </div>

        {/* Faint particles */}
        {!reduce && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { top: "20%", left: "50%", d: 14 },
              { top: "62%", left: "22%", d: 17 },
              { top: "76%", left: "72%", d: 19 },
              { top: "34%", left: "82%", d: 16 },
            ].map((p, i) => (
              <motion.span
                key={i}
                className="absolute size-[3px] rounded-full bg-foreground/15"
                style={{ top: p.top, left: p.left }}
                animate={{ y: [0, -6, 0], opacity: [0.12, 0.32, 0.12] }}
                transition={{
                  duration: p.d,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.3,
                }}
              />
            ))}
          </div>
        )}

        {/* Orbit rings (thin) */}
        {ORBITS.map((o, i) => (
          <div
            key={i}
            aria-hidden
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[opacity,border-color] duration-700",
              active != null
                ? "border-border/25 opacity-40"
                : "border-border/50 opacity-80",
            )}
            style={{
              width: `${o.r * 2}%`,
              height: `${o.r * 2}%`,
            }}
          />
        ))}

        {/* Orbit containers (spin) — each holds its phones */}
        {ORBITS.map((o, oi) => (
          <div
            key={oi}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${o.r * 2}%`,
              height: `${o.r * 2}%`,
              animation: reduce
                ? undefined
                : `${o.dir === 1 ? "orbit-cw" : "orbit-ccw"} ${o.dur}s linear infinite`,
              animationPlayState: active != null ? "paused" : "running",
              transition: "opacity 0.6s ease",
              opacity: active != null ? 0.35 : 1,
            }}
          >
            {slots
              .filter((s) => s.orbit === oi)
              .map((slot, i) => {
                const item = projects[slot.itemIndex];
                const globalIdx = slot.itemIndex;
                const isActive = active === globalIdx;
                return (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${slot.angle}deg)` }}
                  >
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                      {/* Counter-rotate: cancel orbit spin + static offset so phone stays upright */}
                      <div
                        style={{
                          animation: reduce
                            ? undefined
                            : `${o.dir === 1 ? "orbit-ccw" : "orbit-cw"} ${o.dur}s linear infinite`,
                          animationPlayState:
                            active != null ? "paused" : "running",
                        }}
                      >
                        <div style={{ transform: `rotate(${-slot.angle}deg)` }}>
                          <motion.button
                            type="button"
                            aria-label={`عرض ${item.name}`}
                            onClick={() => setActive(globalIdx)}
                            className="pointer-events-auto touch-manipulation rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            animate={{
                              opacity: isActive ? 0 : active != null ? 0.35 : 1,
                              scale: active != null && !isActive ? 0.92 : 1,
                              filter:
                                active != null && !isActive
                                  ? "blur(2px)"
                                  : "blur(0px)",
                            }}
                            transition={{
                              duration: 0.55,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <PhoneFrame width={PHONE_WIDTH}>
                              <MiniScreen {...item.screen} />
                            </PhoneFrame>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}

        {/* Nucleus — the logo (also acts as "close" when a phone is active) */}
        <motion.button
          type="button"
          onClick={() => setActive(null)}
          aria-label={active != null ? "إغلاق المشروع" : site.name}
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          animate={{
            scale: active != null ? 0.7 : 1,
            opacity: active != null ? 0.55 : 1,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          disabled={active == null}
        >
          <div className="relative grid size-[68px] place-items-center rounded-full border border-border/70 bg-background/85 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-2xl" />
            <span className="text-[16px] font-bold tracking-tight text-foreground">
              MH
            </span>
          </div>
        </motion.button>

        {/* Focused phone at the nucleus */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              key={activeItem.slug}
              className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.72, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.82, y: 4 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <PhoneFrame width={FOCUS_WIDTH} featured>
                <MiniScreen {...activeItem.screen} />
              </PhoneFrame>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close chip (only when active) */}
        <AnimatePresence>
          {active != null && (
            <motion.button
              key="close"
              type="button"
              onClick={() => setActive(null)}
              aria-label="إغلاق المشروع"
              className="absolute left-3 top-3 z-50 grid size-9 place-items-center rounded-full border border-border/70 bg-background/80 text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <X className="size-4" aria-hidden />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- Details panel ---------- */}
      <div className="mt-8 min-h-[220px] px-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayed.slug + (active == null ? "-idle" : "-focus")}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-block h-px w-6 bg-border" />
              <span>
                {active == null ? "منظومة رقمية" : displayed.category}
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {active == null ? site.name : displayed.name}
            </h3>
            <p className="mt-2.5 max-w-md text-[13.5px] leading-[1.9] text-muted-foreground">
              {active == null
                ? "منظومة من المنتجات الرقمية تدور حول علامتك التجارية — المس أي هاتف لاستكشاف مشروع."
                : displayed.description}
            </p>
            {active != null && (
              <div dir="ltr" className="mt-3 flex flex-wrap gap-1.5">
                {displayed.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5">
              {active != null ? (
                <Link
                  to="/work"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-[12.5px] font-medium text-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
                >
                  عرض المشروع
                  <ArrowUpLeft className="size-3.5" aria-hidden />
                </Link>
              ) : (
                <span className="text-[11.5px] text-muted-foreground">
                  {projects.length} مشاريع في المدار
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sr-only" aria-live="polite">
        {active != null ? displayed.name : ""}
      </div>
    </div>
  );
}
