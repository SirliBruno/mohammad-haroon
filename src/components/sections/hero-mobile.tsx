/**
 * HeroMobile — "Project Orbit"
 *
 * Fixed personal monogram (MH) at the center of the stage.
 * Around it, six miniature real UI objects float organically:
 * landing browser, e-commerce browser, phone app, dashboard tile,
 * POS terminal, and booking calendar. Each is a real interface, not
 * an icon. Tap → the object glides to center and grows; the rest
 * gently step back with blur/dim. Details panel below fades in sync.
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
import { BookingUI, PosUI, RestaurantUI } from "@/components/mockups/ui-extras";
import { listHeroProjectsPublic } from "@/lib/cms/hero.functions";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

/* ---------------- Types & data ---------------- */

type ObjectKind =
  | "browser-landing"
  | "browser-store"
  | "phone"
  | "dashboard"
  | "pos"
  | "booking";

type Slot = {
  /** Position around the monogram (% of the stage). */
  x: number;
  y: number;
  /** Base scale — sets visual depth. */
  scale: number;
  /** Small idle rotation. */
  rot: number;
  /** Miniature interface kind. */
  kind: ObjectKind;
  /** Independent floating cycle (seconds). */
  drift: number;
  /** Vertical drift amplitude (px). */
  amp: number;
};

// Organic scatter — different angles / sizes / distances / depth.
const SLOTS: Slot[] = [
  { x: 8,  y: 12, scale: 1.02, rot: -5, kind: "browser-landing", drift: 12, amp: 6 },
  { x: 78, y: 8,  scale: 0.72, rot: 6,  kind: "dashboard",       drift: 14, amp: 5 },
  { x: 86, y: 56, scale: 0.90, rot: -4, kind: "phone",           drift: 11, amp: 7 },
  { x: 62, y: 82, scale: 0.68, rot: 5,  kind: "booking",         drift: 15, amp: 4 },
  { x: 6,  y: 68, scale: 0.86, rot: 4,  kind: "browser-store",   drift: 13, amp: 6 },
  { x: 30, y: 88, scale: 0.62, rot: -6, kind: "pos",             drift: 16, amp: 4 },
];

type Item = {
  slug: string;
  name: string;
  host: string;
  category: string;
  tech: string[];
  description: string;
  Preview: ComponentType<{ className?: string }>;
};

const FALLBACK: Item[] = [
  {
    slug: "atelier-cms",
    name: "Atelier",
    host: "atelier.studio",
    category: "موقع تعريفي",
    tech: ["React", "TypeScript", "Framer"],
    description: "موقع محرّر بلغة تصميم دافئة ومحتوى قابل للإدارة بالكامل.",
    Preview: EditorUI,
  },
  {
    slug: "northwind-analytics",
    name: "Northwind",
    host: "northwind.app",
    category: "لوحة تحليلات",
    tech: ["Next.js", "PostgreSQL", "Chart.js"],
    description: "لوحة تحليلات هادئة مبنية للسرعة ووضوح القرار.",
    Preview: DashboardUI,
  },
  {
    slug: "lumen-payments",
    name: "Lumen",
    host: "lumen.finance",
    category: "تطبيق جوال",
    tech: ["React Native", "Stripe"],
    description: "تجربة دفع رقمية سلسة على الجوال مع إشعارات حيّة.",
    Preview: MobileAppUI,
  },
  {
    slug: "haven-storefront",
    name: "Haven",
    host: "haven.co",
    category: "تجارة إلكترونية",
    tech: ["Shopify", "Hydrogen"],
    description: "متجر أنيق بتجربة شراء انسيابية وأداء عالٍ.",
    Preview: StoreUI,
  },
  {
    slug: "verano-pos",
    name: "Verano POS",
    host: "verano.app",
    category: "نظام نقاط بيع",
    tech: ["React", "Supabase"],
    description: "نظام نقاط بيع للمقاهي بواجهة سريعة وسير عمل واضح.",
    Preview: PosUI,
  },
  {
    slug: "orbit-booking",
    name: "Orbit",
    host: "orbit.reserve",
    category: "نظام حجوزات",
    tech: ["Next.js", "Postgres"],
    description: "نظام حجوزات مرن للاستوديوهات والصالونات مع تقويم حيّ.",
    Preview: BookingUI,
  },
];

/* ---------------- Object chrome ---------------- */

function BrowserObj({
  children,
  host,
  width = 232,
}: {
  children: ReactNode;
  host: string;
  width?: number;
}) {
  return (
    <div
      style={{ width }}
      className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-[0_28px_60px_-30px_rgba(0,0,0,0.5)]"
    >
      <div
        dir="ltr"
        className="flex items-center gap-1.5 border-b border-border/60 bg-muted/60 px-2 py-1.5"
      >
        <span className="size-1.5 rounded-full bg-red-400/70" />
        <span className="size-1.5 rounded-full bg-amber-400/70" />
        <span className="size-1.5 rounded-full bg-emerald-400/70" />
        <span className="mx-auto rounded-md bg-background/70 px-2 py-[1px] text-[8px] tracking-tight text-muted-foreground">
          {host}
        </span>
      </div>
      <div className="aspect-[16/10] w-full bg-background">{children}</div>
    </div>
  );
}

function PhoneObj({ children }: { children: ReactNode }) {
  return (
    <div className="w-[118px] rounded-[1.5rem] border border-neutral-800/70 bg-neutral-900 p-[3px] shadow-[0_22px_45px_-22px_rgba(0,0,0,0.6)] dark:border-neutral-700">
      <div className="relative overflow-hidden rounded-[1.3rem] bg-black">
        <div className="pointer-events-none absolute left-1/2 top-1 z-10 h-2.5 w-10 -translate-x-1/2 rounded-full bg-black" />
        <div className="aspect-[9/19.5] w-full overflow-hidden rounded-[1.3rem] bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}

function TileObj({
  children,
  label,
  width = 160,
  ratio = "4/3",
}: {
  children: ReactNode;
  label: string;
  width?: number;
  ratio?: string;
}) {
  return (
    <div
      style={{ width }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_22px_45px_-24px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/50 px-2.5 py-1.5">
        <span className="text-[9px] font-medium tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="size-1.5 rounded-full bg-emerald-500" />
      </div>
      <div style={{ aspectRatio: ratio }} className="w-full bg-background">
        {children}
      </div>
    </div>
  );
}

function renderObject(kind: ObjectKind, item: Item) {
  const { Preview, host } = item;
  switch (kind) {
    case "browser-landing":
      return (
        <BrowserObj host={host} width={236}>
          <Preview className="size-full" />
        </BrowserObj>
      );
    case "browser-store":
      return (
        <BrowserObj host={host} width={200}>
          <StoreUI className="size-full" />
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
        <TileObj label="Analytics" width={158}>
          <DashboardUI className="size-full" />
        </TileObj>
      );
    case "pos":
      return (
        <TileObj label="POS" width={138} ratio="5/4">
          <PosUI className="size-full" />
        </TileObj>
      );
    case "booking":
      return (
        <TileObj label="Booking" width={132} ratio="1/1">
          <BookingUI className="size-full" />
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
    return dbHero.slice(0, SLOTS.length).map((r, i): Item => {
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

  // Ensure RestaurantUI stays available for future kinds without a dead import warning.
  void RestaurantUI;

  return (
    <div
      dir="rtl"
      className="relative w-full select-none"
      aria-label="مدار المشاريع"
    >
      {/* ---------- Stage ---------- */}
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        {/* Background: radial gradient + subtle grid + soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          <div className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        {/* Almost-invisible particles */}
        {!reduce && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { top: "22%", left: "44%", d: 13 },
              { top: "60%", left: "20%", d: 15 },
              { top: "74%", left: "70%", d: 17 },
              { top: "36%", left: "82%", d: 14 },
            ].map((p, i) => (
              <motion.span
                key={i}
                className="absolute size-[3px] rounded-full bg-foreground/15"
                style={{ top: p.top, left: p.left }}
                animate={{ y: [0, -6, 0], opacity: [0.15, 0.35, 0.15] }}
                transition={{
                  duration: p.d,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.2,
                }}
              />
            ))}
          </div>
        )}

        {/* Monogram — fixed center */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: reduce ? 1 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative grid size-[76px] place-items-center rounded-full border border-border/70 bg-background/80 shadow-[0_22px_55px_-25px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-2xl" />
            <span className="text-[17px] font-bold tracking-tight text-foreground">
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
          const isDim = !isActive;
          const cx = 50;
          const cy = 50;
          const dx = slot.x - cx;
          const dy = slot.y - cy;
          const norm = Math.hypot(dx, dy) || 1;
          const pushX = (dx / norm) * 8;
          const pushY = (dy / norm) * 8;

          return (
            <motion.button
              key={i}
              type="button"
              aria-label={`عرض ${item.name}`}
              onClick={() => setActive(slot.itemIndex)}
              className="absolute z-10 origin-center touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{
                x: isActive
                  ? `calc(-50% + ${cx - slot.x}%)`
                  : `calc(-50% + ${pushX}px)`,
                y: isActive
                  ? `calc(-50% + ${cy - slot.y}%)`
                  : `calc(-50% + ${pushY}px)`,
                scale: isActive ? 1.1 : slot.scale * 0.9,
                rotate: isActive ? 0 : slot.rot,
                opacity: isActive ? 1 : 0.45,
                filter: isDim ? "blur(2.5px)" : "blur(0px)",
                zIndex: isActive ? 30 : 10,
              }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 22,
                mass: 0.75,
              }}
            >
              {/* Independent slow drift */}
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
                        delay: i * 0.7,
                      }
                }
                className={cn(
                  "transition-shadow",
                  isActive && "drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)]",
                )}
              >
                {renderObject(slot.kind, item)}
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* ---------- Details panel ---------- */}
      <div className="mt-8 min-h-[210px] px-1">
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
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {current.name}
            </h3>
            <p className="mt-2.5 max-w-md text-[13.5px] leading-[1.9] text-muted-foreground">
              {current.description}
            </p>
            <div dir="ltr" className="mt-3 flex flex-wrap gap-1.5">
              {current.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
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
