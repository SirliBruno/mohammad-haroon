/**
 * HeroMobile — bespoke mobile hero.
 *
 * A calm, premium "orbit" composition:
 *  • Personal monogram (MH) as the still center of the brand.
 *  • Real project objects (browser, phone, dashboard tile, store tile)
 *    floating organically around it with independent slow drift.
 *  • Tap an object → it magnetically glides to center, becomes the focus;
 *    remaining objects step back (scale/opacity/blur).
 *  • Details panel below updates on selection with a smooth crossfade.
 */
import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpLeft } from "lucide-react";
import {
  DashboardUI,
  EditorUI,
  MobileAppUI,
  StoreUI,
} from "@/components/mockups/ui-samples";
import { listHeroProjectsPublic } from "@/lib/cms/hero.functions";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

/* ---------------- Types & data ---------------- */

type ObjectKind = "browser" | "phone" | "dashboard" | "store";

type Slot = {
  /** Position around the monogram, in % of the stage box. */
  x: number;
  y: number;
  /** Base scale — sets visual depth. */
  scale: number;
  /** Small idle rotation, degrees. */
  rot: number;
  /** Object kind selects which mock chrome to render. */
  kind: ObjectKind;
  /** Floating cycle seconds (each object drifts independently). */
  drift: number;
  /** Vertical drift range in px. */
  amp: number;
};

const SLOTS: Slot[] = [
  { x: 14, y: 18, scale: 0.92, rot: -6, kind: "browser", drift: 11, amp: 6 },
  { x: 74, y: 12, scale: 0.72, rot: 5, kind: "dashboard", drift: 13, amp: 5 },
  { x: 78, y: 68, scale: 0.82, rot: -4, kind: "phone", drift: 12, amp: 7 },
  { x: 10, y: 70, scale: 0.7, rot: 6, kind: "store", drift: 14, amp: 5 },
];

type Item = {
  slug: string;
  name: string;
  host: string;
  category: string;
  tech: string;
  description: string;
  Preview: ComponentType<{ className?: string }>;
};

const FALLBACK: Item[] = [
  {
    slug: "northwind-analytics",
    name: "Northwind",
    host: "northwind.app",
    category: "لوحة تحكم",
    tech: "Next.js",
    description: "لوحة تحليلات هادئة مبنية للسرعة ووضوح القرار.",
    Preview: DashboardUI,
  },
  {
    slug: "haven-storefront",
    name: "Haven",
    host: "haven.co",
    category: "تجارة إلكترونية",
    tech: "Shopify",
    description: "متجر أنيق بتجربة شراء انسيابية وأداء عالٍ.",
    Preview: StoreUI,
  },
  {
    slug: "atelier-cms",
    name: "Atelier",
    host: "atelier.studio",
    category: "موقع تعريفي",
    tech: "React",
    description: "موقع محرّر بلغة تصميم دافئة ومحتوى قابل للإدارة.",
    Preview: EditorUI,
  },
  {
    slug: "lumen-payments",
    name: "Lumen",
    host: "lumen.finance",
    category: "تطبيق جوال",
    tech: "TypeScript",
    description: "تجربة دفع رقمية سلسة على الجوال.",
    Preview: MobileAppUI,
  },
];

/* ---------------- Object chrome ---------------- */

function BrowserObj({ children }: { children: ReactNode }) {
  return (
    <div className="w-[220px] overflow-hidden rounded-xl border border-border/60 bg-card shadow-[0_20px_50px_-25px_rgba(0,0,0,0.4)]">
      <div dir="ltr" className="flex items-center gap-1 border-b border-border/60 bg-muted/50 px-2 py-1">
        <span className="size-1.5 rounded-full bg-red-400/70" />
        <span className="size-1.5 rounded-full bg-amber-400/70" />
        <span className="size-1.5 rounded-full bg-emerald-400/70" />
      </div>
      <div className="aspect-[16/10] w-full bg-background">{children}</div>
    </div>
  );
}

function PhoneObj({ children }: { children: ReactNode }) {
  return (
    <div className="w-[110px] rounded-[1.4rem] border border-neutral-800/70 bg-neutral-900 p-[3px] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] dark:border-neutral-700">
      <div className="relative overflow-hidden rounded-[1.2rem] bg-black">
        <div className="pointer-events-none absolute left-1/2 top-1 z-10 h-2.5 w-10 -translate-x-1/2 rounded-full bg-black" />
        <div className="aspect-[9/19.5] w-full overflow-hidden rounded-[1.2rem] bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}

function TileObj({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="w-[150px] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_18px_40px_-22px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-2.5 py-1.5">
        <span className="text-[9px] font-medium tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="size-1.5 rounded-full bg-emerald-500" />
      </div>
      <div className="aspect-[4/3] w-full bg-background">{children}</div>
    </div>
  );
}

function renderObject(kind: ObjectKind, item: Item) {
  const { Preview } = item;
  switch (kind) {
    case "browser":
      return (
        <BrowserObj>
          <Preview className="size-full" />
        </BrowserObj>
      );
    case "phone":
      return (
        <PhoneObj>
          <MobileAppUI className="size-full" />
        </PhoneObj>
      );
    case "dashboard":
      return (
        <TileObj label="Dashboard">
          <DashboardUI className="size-full" />
        </TileObj>
      );
    case "store":
      return (
        <TileObj label="Store">
          <StoreUI className="size-full" />
        </TileObj>
      );
  }
}

/* ---------------- Component ---------------- */

export function HeroMobile() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const fetchHero = useServerFn(listHeroProjectsPublic);
  const { data: dbHero } = useQuery({
    queryKey: ["hero-projects-public"],
    queryFn: () => fetchHero(),
    staleTime: 60_000,
  });

  const projects: Item[] = useMemo(() => {
    if (!dbHero || dbHero.length === 0) return FALLBACK;
    return dbHero.slice(0, 4).map((r, i): Item => {
      const fb = FALLBACK[i % FALLBACK.length];
      const Preview = (props: { className?: string }) =>
        r.cover_url ? (
          <img
            src={r.cover_url}
            alt={r.title}
            className={cn("size-full object-cover", props.className)}
          />
        ) : (
          <fb.Preview {...props} />
        );
      return {
        slug: r.id,
        name: r.title,
        host: r.host || fb.host,
        category: r.category || fb.category,
        tech: fb.tech,
        description: fb.description,
        Preview,
      };
    });
  }, [dbHero]);

  // Wrap slot count to project count (in case fewer than 4 projects exist).
  const slots = useMemo(
    () =>
      SLOTS.map((s, i) => ({
        ...s,
        itemIndex: i % Math.max(projects.length, 1),
      })),
    [projects.length],
  );

  useEffect(() => {
    if (active >= projects.length) setActive(0);
  }, [projects.length, active]);

  const current = projects[Math.min(active, projects.length - 1)];

  return (
    <div dir="rtl" className="relative w-full select-none" aria-label="عرض المشاريع">
      {/* ---------- Stage ---------- */}
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        {/* Background: radial glow + subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(65%_65%_at_50%_50%,black,transparent)]"
        >
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />
          <div className="absolute left-1/2 top-1/2 size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
        </div>

        {/* Tiny drifting particles */}
        {!reduce && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { top: "18%", left: "48%", d: 12 },
              { top: "58%", left: "22%", d: 14 },
              { top: "72%", left: "72%", d: 16 },
            ].map((p, i) => (
              <motion.span
                key={i}
                className="absolute size-1 rounded-full bg-foreground/20"
                style={{ top: p.top, left: p.left }}
                animate={{ y: [0, -8, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{
                  duration: p.d,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.4,
                }}
              />
            ))}
          </div>
        )}

        {/* Monogram — the still center */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: reduce ? 1 : 0.86 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative grid size-20 place-items-center rounded-full border border-border/70 bg-background/80 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/15 blur-2xl" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              MH
            </span>
          </div>
          <p className="mt-2 text-center text-[10px] font-medium tracking-wide text-muted-foreground">
            {site.name}
          </p>
        </motion.div>

        {/* Floating project objects */}
        {slots.map((slot, i) => {
          const item = projects[slot.itemIndex];
          const isActive = slot.itemIndex === active;
          const isDim = active !== slot.itemIndex;
          // Outward push offset for non-active objects (in px).
          const cx = 50;
          const cy = 50;
          const dx = slot.x - cx;
          const dy = slot.y - cy;
          const norm = Math.hypot(dx, dy) || 1;
          const pushX = (dx / norm) * 6;
          const pushY = (dy / norm) * 6;

          return (
            <motion.button
              key={i}
              type="button"
              aria-label={`عرض ${item.name}`}
              onClick={() => setActive(slot.itemIndex)}
              className="absolute z-10 origin-center touch-manipulation focus:outline-none"
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
              }}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{
                x: isActive ? `calc(-50% + ${cx - slot.x}%)` : `calc(-50% + ${pushX}px)`,
                y: isActive ? `calc(-50% + ${cy - slot.y}%)` : `calc(-50% + ${pushY}px)`,
                scale: isActive ? 1.05 : slot.scale * 0.86,
                rotate: isActive ? 0 : slot.rot,
                opacity: isActive ? 1 : 0.5,
                filter: isDim ? "blur(2px)" : "blur(0px)",
                zIndex: isActive ? 30 : 10,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 22,
                mass: 0.7,
              }}
            >
              {/* Inner idle-float wrapper — independent slow drift */}
              <motion.div
                animate={
                  reduce || isActive
                    ? undefined
                    : { y: [0, -slot.amp, 0, slot.amp * 0.6, 0] }
                }
                transition={
                  reduce || isActive
                    ? undefined
                    : {
                        duration: slot.drift,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.6,
                      }
                }
                className={cn(
                  "transition-shadow",
                  isActive && "drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]",
                )}
              >
                {renderObject(slot.kind, item)}
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* ---------- Details panel ---------- */}
      <div className="mt-6 min-h-[168px] px-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-block h-px w-6 bg-border" />
              <span>{current.category}</span>
              <span aria-hidden>·</span>
              <span dir="ltr">{current.tech}</span>
            </div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {current.name}
            </h3>
            <p className="mt-2 max-w-md text-[13.5px] leading-[1.85] text-muted-foreground">
              {current.description}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/work"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-[12.5px] font-medium text-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
              >
                عرض المشروع
                <ArrowUpLeft className="size-3.5" aria-hidden />
              </Link>
              <div className="flex items-center gap-1.5">
                {projects.map((p, i) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`اختيار ${p.name}`}
                    className={cn(
                      "h-1.5 rounded-full transition-[width,background-color] duration-500",
                      i === active
                        ? "w-6 bg-foreground/70"
                        : "w-1.5 bg-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sr-only" aria-live="polite">
        {current.name}
      </div>
    </div>
  );
}
