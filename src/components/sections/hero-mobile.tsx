/**
 * HeroMobile — "Atomic Orbit" (chip edition)
 *
 * Personal monogram (MH) as the nucleus, fixed at the exact center.
 * Around it, small premium pill chips orbit like electrons on 2 thin
 * paths at different speeds and directions. Each chip carries a small
 * icon + project name + optional status dot. Tap a chip → orbits pause,
 * the chip glides to the nucleus and scales up, others dim; details
 * below fade in. Tap the nucleus (or ✕) to return.
 */
import { useMemo, useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpLeft,
  Globe,
  LayoutDashboard,
  GraduationCap,
  UtensilsCrossed,
  Settings2,
  ShoppingBag,
  X,
  type LucideProps,
} from "lucide-react";
import { listHeroProjectsPublic } from "@/lib/cms/hero.functions";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

/* ---------------- Data ---------------- */

type Status = "live" | "wip" | "idle";

type Item = {
  slug: string;
  name: string;
  category: string;
  tech: string[];
  description: string;
  Icon: ComponentType<LucideProps>;
  status: Status;
};

const FALLBACK: Item[] = [
  {
    slug: "taste-skill",
    name: "Taste Skill",
    category: "منصّة تعلّم",
    tech: ["Next.js", "TypeScript", "Prisma"],
    description: "منصّة تعليمية بتجربة قراءة هادئة ومحتوى قابل للإدارة.",
    Icon: GraduationCap,
    status: "live",
  },
  {
    slug: "restaurant",
    name: "Restaurant",
    category: "نظام مطاعم",
    tech: ["React", "Supabase"],
    description: "نظام إدارة طلبات للمطاعم بواجهة سريعة وسير عمل واضح.",
    Icon: UtensilsCrossed,
    status: "live",
  },
  {
    slug: "northwind",
    name: "Dashboard",
    category: "لوحة تحليلات",
    tech: ["Next.js", "PostgreSQL"],
    description: "لوحة تحليلات هادئة مبنية للسرعة ووضوح القرار.",
    Icon: LayoutDashboard,
    status: "wip",
  },
  {
    slug: "erp",
    name: "ERP System",
    category: "منظومة ERP",
    tech: ["React", "NestJS"],
    description: "منظومة موارد للشركات بواجهة مرتّبة وتقارير موثوقة.",
    Icon: Settings2,
    status: "idle",
  },
  {
    slug: "haven",
    name: "Haven",
    category: "تجارة إلكترونية",
    tech: ["Shopify", "Hydrogen"],
    description: "متجر أنيق بتجربة شراء انسيابية وأداء عالٍ.",
    Icon: ShoppingBag,
    status: "live",
  },
  {
    slug: "atelier",
    name: "Atelier",
    category: "موقع تعريفي",
    tech: ["React", "TypeScript"],
    description: "موقع محرّر بلغة تصميم دافئة ومحتوى قابل للإدارة.",
    Icon: Globe,
    status: "live",
  },
];

const STATUS_COLOR: Record<Status, string> = {
  live: "bg-emerald-500",
  wip: "bg-amber-500",
  idle: "bg-neutral-400",
};

const STATUS_LABEL: Record<Status, string> = {
  live: "مُطلق",
  wip: "قيد التطوير",
  idle: "مؤرشف",
};

/* ---------------- Orbit layout ---------------- */

type OrbitDef = {
  /** Radius as % of the stage width. */
  r: number;
  /** Rotation period (seconds). */
  dur: number;
  /** Direction of travel. */
  dir: 1 | -1;
  /** Starting angles for chips on this orbit (deg). */
  angles: number[];
};

const ORBITS: OrbitDef[] = [
  { r: 27, dur: 44, dir: 1, angles: [30, 210] },        // inner: 2 chips
  { r: 40, dur: 72, dir: -1, angles: [90, 210, 330] },  // outer: 3 chips
];

/* ---------------- Chip ---------------- */

function Chip({
  item,
  dimmed,
  hidden,
  onClick,
}: {
  item: Item;
  dimmed: boolean;
  hidden: boolean;
  onClick: () => void;
}) {
  const { Icon } = item;
  return (
    <motion.button
      type="button"
      dir="rtl"
      aria-label={`عرض ${item.name}`}
      onClick={onClick}
      className={cn(
        "pointer-events-auto inline-flex items-center gap-1.5 rounded-full",
        "border border-border/60 bg-background/85 backdrop-blur-md",
        "px-3 py-1.5 text-[11.5px] font-medium tracking-tight text-foreground",
        "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "hover:border-primary/40 hover:text-primary transition-colors",
      )}
      animate={{
        opacity: hidden ? 0 : dimmed ? 0.35 : 1,
        scale: dimmed && !hidden ? 0.94 : 1,
        filter: dimmed && !hidden ? "blur(1.5px)" : "blur(0px)",
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Icon className="size-3.5 text-muted-foreground" aria-hidden />
      <span className="whitespace-nowrap">{item.name}</span>
      <span
        className={cn("size-1.5 shrink-0 rounded-full", STATUS_COLOR[item.status])}
        aria-label={STATUS_LABEL[item.status]}
      />
    </motion.button>
  );
}

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
        Icon: fb.Icon,
        status: fb.status,
      };
    });
  }, [dbHero]);

  // Flatten orbit slots → global project index.
  const slots = useMemo(() => {
    const out: {
      orbit: number;
      angle: number;
      duration: number;
      dir: 1 | -1;
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
        @keyframes orbit-cw  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>

      {/* ---------- Stage ---------- */}
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        {/* Background: radial gradient + very faint grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
        >
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          {/* Soft glow behind nucleus */}
          <div className="absolute left-1/2 top-1/2 size-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 size-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-2xl" />
        </div>

        {/* Faint particles */}
        {!reduce && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { top: "18%", left: "52%", d: 14 },
              { top: "60%", left: "22%", d: 17 },
              { top: "74%", left: "72%", d: 19 },
              { top: "34%", left: "84%", d: 16 },
            ].map((p, i) => (
              <motion.span
                key={i}
                className="absolute size-[3px] rounded-full bg-foreground/15"
                style={{ top: p.top, left: p.left }}
                animate={{ y: [0, -6, 0], opacity: [0.12, 0.3, 0.12] }}
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
                ? "border-border/20 opacity-40"
                : "border-border/45 opacity-80",
            )}
            style={{
              width: `${o.r * 2}%`,
              height: `${o.r * 2}%`,
            }}
          />
        ))}

        {/* Orbit spinners */}
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
              opacity: active != null ? 0.4 : 1,
            }}
          >
            {slots
              .filter((s) => s.orbit === oi)
              .map((slot, i) => {
                const item = projects[slot.itemIndex];
                const isActive = active === slot.itemIndex;
                return (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${slot.angle}deg)` }}
                  >
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                      {/* Counter-rotate so chips stay upright */}
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
                          <Chip
                            item={item}
                            dimmed={active != null && !isActive}
                            hidden={isActive}
                            onClick={() => setActive(slot.itemIndex)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}

        {/* Nucleus (logo) — also closes the active chip */}
        <motion.button
          type="button"
          onClick={() => setActive(null)}
          aria-label={active != null ? "إغلاق المشروع" : site.name}
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          animate={{
            scale: active != null ? 0.78 : 1,
            opacity: active != null ? 0.7 : 1,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          disabled={active == null}
        >
          <div className="relative grid size-[74px] place-items-center rounded-full border border-border/70 bg-background/85 shadow-[0_22px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/22 blur-2xl" />
            <span className="text-[17px] font-bold tracking-tight text-foreground">
              MH
            </span>
          </div>
        </motion.button>

        {/* Focused chip at the nucleus */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              key={activeItem.slug}
              className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.7, y: 4 }}
              animate={{ opacity: 1, scale: 1.15, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 4 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                dir="rtl"
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/95 px-4 py-2 text-[13px] font-semibold tracking-tight text-foreground shadow-[0_20px_45px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md"
              >
                <activeItem.Icon
                  className="size-4 text-primary"
                  aria-hidden
                />
                <span className="whitespace-nowrap">{activeItem.name}</span>
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    STATUS_COLOR[activeItem.status],
                  )}
                  aria-hidden
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close chip */}
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
      <div className="mt-8 min-h-[210px] px-1">
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
                ? "منتجات رقمية تدور حول علامة واحدة. المس أي شريحة لاستكشاف مشروع."
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
