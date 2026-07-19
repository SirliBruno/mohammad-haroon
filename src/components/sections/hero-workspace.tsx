/**
 * HeroWorkspace — an "infinite digital workspace" canvas for the hero.
 *
 * Composition rules (do not violate without a design read):
 *  - The FEATURED centerpiece is stable: only its screen contents crossfade
 *    every ~7s. Replace <FeaturedScreen /> children with real project
 *    screenshots by editing FEATURED_SCREENS below.
 *  - Ambient elements (phone, tablet, sticky notes, tags, wireframes,
 *    annotations) live on a "scatter" layer that auto-drifts slowly and
 *    accepts pointer drag. Each element also has a private float loop.
 *  - Every element receives a small parallax offset driven by the mouse
 *    position, at different depths, to sell the "canvas" feel.
 *
 * All motion respects prefers-reduced-motion.
 */
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  animate,
} from "motion/react";
import { ExternalLink } from "lucide-react";
import { BrowserFrame, PhoneFrame, TabletFrame } from "@/components/mockups/devices";
import {
  DashboardUI,
  EditorUI,
  MobileAppUI,
  StoreUI,
  TabletReadUI,
} from "@/components/mockups/ui-samples";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Featured centerpiece                                                        */
/* -------------------------------------------------------------------------- */

type FeaturedScreen = {
  slug: string;
  url: string;
  title: string;
  category: string;
  Screen: (p: { className?: string }) => JSX.Element;
  liveDemo?: string;
};

/** Pool of screen shapes the centerpiece rotates through. Each one is a
 *  drop-in slot for a real screenshot: swap <Screen /> for an <img />. */
const FEATURED_SCREENS: FeaturedScreen[] = (() => {
  const featured = projects.filter((p) => p.featured);
  const pool = (featured.length ? featured : projects).slice(0, 5);
  const uiPool: Array<FeaturedScreen["Screen"]> = [
    DashboardUI,
    StoreUI,
    EditorUI,
    TabletReadUI,
    DashboardUI,
  ];
  return pool.map((p, i) => ({
    slug: p.slug,
    url: p.liveDemo ? safeHost(p.liveDemo) : `${p.slug}.app`,
    title: p.title.split("—")[0].trim(),
    category: p.category,
    liveDemo: p.liveDemo,
    Screen: uiPool[i % uiPool.length],
  }));
})();

function safeHost(u: string) {
  try {
    return new URL(u).host;
  } catch {
    return u;
  }
}

/* -------------------------------------------------------------------------- */
/* Ambient scatter elements                                                    */
/* -------------------------------------------------------------------------- */

/** Sticky note — subtle warm tint, slight rotation, hand-typed feel. */
function StickyNote({
  children,
  tone = "amber",
  className,
}: {
  children: React.ReactNode;
  tone?: "amber" | "rose" | "sky";
  className?: string;
}) {
  const toneMap = {
    amber: "bg-amber-100/90 text-amber-950 dark:bg-amber-200/90 dark:text-amber-950",
    rose: "bg-rose-100/90 text-rose-950 dark:bg-rose-200/90 dark:text-rose-950",
    sky: "bg-sky-100/90 text-sky-950 dark:bg-sky-200/90 dark:text-sky-950",
  } as const;
  return (
    <div
      className={cn(
        "rounded-md px-3 py-2 text-[11px] leading-snug shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)]",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small floating tag pill. */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/60 bg-background/85 px-2.5 py-1 text-[10px] font-medium tracking-wide text-foreground/80 shadow-[0_6px_18px_-10px_rgba(0,0,0,0.25)] backdrop-blur-md">
      {children}
    </span>
  );
}

/** Compact wireframe card — abstract layout blocks. */
function WireframeCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-background/85 p-3 shadow-[0_16px_40px_-22px_rgba(0,0,0,0.35)] backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-muted-foreground/40" />
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
        <span className="size-1.5 rounded-full bg-muted-foreground/20" />
      </div>
      <div className="mt-2 h-1.5 w-16 rounded-sm bg-muted-foreground/25" />
      <div className="mt-2 grid grid-cols-3 gap-1">
        <div className="col-span-2 h-8 rounded-sm bg-muted-foreground/15" />
        <div className="h-8 rounded-sm bg-primary/25" />
      </div>
      <div className="mt-1.5 h-1 w-14 rounded-sm bg-muted-foreground/15" />
      <div className="mt-0.5 h-1 w-10 rounded-sm bg-muted-foreground/10" />
    </div>
  );
}

/** Colorway swatch strip — designer artefact. */
function SwatchStrip({ className }: { className?: string }) {
  const swatches = [
    "bg-neutral-900",
    "bg-neutral-500",
    "bg-primary",
    "bg-accent",
    "bg-emerald-500",
  ];
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-border/60 bg-background/85 px-2.5 py-1.5 shadow-[0_10px_28px_-16px_rgba(0,0,0,0.3)] backdrop-blur-md",
        className,
      )}
    >
      {swatches.map((s, i) => (
        <span key={i} className={cn("size-3 rounded-full ring-1 ring-black/5", s)} />
      ))}
    </div>
  );
}

/** Curved SVG "connection" arrow — like a Figma flow line. */
function FlowArrow({
  className,
  d = "M2 60 C 40 10, 120 10, 158 58",
}: {
  className?: string;
  d?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 70"
      className={cn("text-primary/60", className)}
      aria-hidden
    >
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}

/** Typography specimen card. */
function TypeSpecimen({ className }: { className?: string }) {
  return (
    <div
      dir="ltr"
      className={cn(
        "rounded-lg border border-border/60 bg-background/90 px-4 py-3 shadow-[0_16px_40px_-22px_rgba(0,0,0,0.35)] backdrop-blur",
        className,
      )}
    >
      <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        Type / 01
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight leading-none">
        Aa
      </div>
      <div className="text-[10px] text-muted-foreground">Display / Sans</div>
    </div>
  );
}

/** Placeholder client mark — geometric monogram. */
function ClientMark({
  glyph,
  className,
}: {
  glyph: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid size-11 place-items-center rounded-xl border border-border/60 bg-background/90 text-sm font-semibold tracking-tight text-foreground/80 shadow-[0_10px_28px_-16px_rgba(0,0,0,0.3)] backdrop-blur-md",
        className,
      )}
    >
      {glyph}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax wrapper                                                            */
/* -------------------------------------------------------------------------- */

type ParallaxCtx = {
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
};

/** Scatter-layer element with private float + mouse parallax at given depth. */
function ScatterItem({
  ctx,
  depth,
  x,
  y,
  rotate = 0,
  floatY = 8,
  duration = 9,
  delay = 0,
  className,
  children,
}: {
  ctx: ParallaxCtx;
  depth: number; // 0.02 (far) → 0.06 (near). Larger = moves more with mouse.
  x: string | number;
  y: string | number;
  rotate?: number;
  floatY?: number;
  duration?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const tx = useTransform(ctx.mx, (v) => v * depth);
  const ty = useTransform(ctx.my, (v) => v * depth);
  return (
    <motion.div
      className={cn("absolute", className)}
      style={{ left: x, top: y, x: tx, y: ty, rotate }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -floatY, 0] }}
        transition={
          reduce
            ? undefined
            : { duration, repeat: Infinity, ease: "easeInOut", delay }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

export function HeroWorkspace() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement>(null);

  // ---- Featured crossfade cycle ----
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduce || FEATURED_SCREENS.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FEATURED_SCREENS.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [reduce]);

  // ---- Mouse parallax (single source of truth for all depths) ----
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });
  const ctx: ParallaxCtx = useMemo(() => ({ mx, my }), [mx, my]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    // Range roughly ±(size/2) — pass raw pixels; each item scales by its depth.
    rawX.set(e.clientX - (r.left + r.width / 2));
    rawY.set(e.clientY - (r.top + r.height / 2));
  };
  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  // ---- Scatter layer: gentle horizontal auto-drift + drag ----
  const scatterX = useMotionValue(0);
  useEffect(() => {
    if (reduce) return;
    // Very slow back-and-forth drift — never travels far, never distracts.
    const controls = animate(scatterX, [0, 24, -20, 0], {
      duration: 40,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [reduce, scatterX]);

  const current = FEATURED_SCREENS[active] ?? FEATURED_SCREENS[0];

  return (
    <div
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      dir="ltr"
      className="relative isolate h-[520px] w-full select-none overflow-hidden rounded-[28px] sm:h-[580px] md:h-[640px]"
      aria-label="مساحة عمل تصميم رقمية"
      role="img"
      style={{
        // Soft edge fade so items feel like they extend past the frame.
        maskImage:
          "radial-gradient(120% 100% at 50% 50%, black 60%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(120% 100% at 50% 50%, black 60%, transparent 100%)",
      }}
    >
      {/* ---------- Background: subtle grid + radial glow ---------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute left-1/2 top-1/2 size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 size-[380px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* ---------- Scatter layer (auto-drift + drag) ---------- */}
      <motion.div
        className="absolute inset-0"
        style={{ x: scatterX }}
        drag="x"
        dragElastic={0.18}
        dragConstraints={{ left: -60, right: 60 }}
        dragMomentum={false}
      >
        {/* Sticky note — top-left area */}
        <ScatterItem
          ctx={ctx}
          depth={0.04}
          x="4%"
          y="8%"
          rotate={-4}
          floatY={6}
          duration={10}
        >
          <StickyNote tone="amber">
            <div className="font-semibold">لوحة تحكم SaaS</div>
            <div className="mt-0.5 text-[10px] opacity-75">Discovery → v2</div>
          </StickyNote>
        </ScatterItem>

        {/* Tag cloud — upper right */}
        <ScatterItem ctx={ctx} depth={0.05} x="72%" y="6%" rotate={2}>
          <div className="flex flex-col items-start gap-1.5">
            <Tag>Product Design</Tag>
            <Tag>Next.js</Tag>
          </div>
        </ScatterItem>

        {/* Wireframe card — mid-left, behind laptop edge */}
        <ScatterItem
          ctx={ctx}
          depth={0.03}
          x="2%"
          y="46%"
          rotate={-3}
          floatY={10}
          duration={12}
          delay={0.4}
        >
          <WireframeCard className="w-40" />
        </ScatterItem>

        {/* Flow arrow — bridging wireframe and laptop */}
        <ScatterItem
          ctx={ctx}
          depth={0.025}
          x="14%"
          y="42%"
          rotate={-6}
          floatY={4}
          duration={11}
        >
          <FlowArrow className="h-14 w-32" />
        </ScatterItem>

        {/* Phone mockup — bottom-left */}
        <ScatterItem
          ctx={ctx}
          depth={0.055}
          x="6%"
          y="62%"
          rotate={-6}
          floatY={10}
          duration={11}
          delay={0.8}
        >
          <PhoneFrame className="w-[120px] sm:w-[132px]">
            <MobileAppUI />
          </PhoneFrame>
        </ScatterItem>

        {/* Sticky note — under phone */}
        <ScatterItem
          ctx={ctx}
          depth={0.045}
          x="22%"
          y="82%"
          rotate={3}
          floatY={5}
          duration={9}
          delay={0.2}
        >
          <StickyNote tone="rose" className="w-[132px]">
            <div className="font-semibold">Onboarding</div>
            <div className="mt-0.5 text-[10px] opacity-75">3 خطوات، ثانيتان لكل شاشة</div>
          </StickyNote>
        </ScatterItem>

        {/* Tablet — bottom-right, tucked behind */}
        <ScatterItem
          ctx={ctx}
          depth={0.035}
          x="66%"
          y="58%"
          rotate={5}
          floatY={9}
          duration={13}
          delay={0.5}
        >
          <TabletFrame className="w-[220px] opacity-95 sm:w-[240px]">
            <TabletReadUI />
          </TabletFrame>
        </ScatterItem>

        {/* Type specimen — right column */}
        <ScatterItem
          ctx={ctx}
          depth={0.05}
          x="80%"
          y="34%"
          rotate={-3}
          floatY={7}
          duration={10}
          delay={0.6}
        >
          <TypeSpecimen />
        </ScatterItem>

        {/* Swatch strip — top-center-ish */}
        <ScatterItem
          ctx={ctx}
          depth={0.04}
          x="42%"
          y="2%"
          rotate={-2}
          floatY={5}
          duration={9}
        >
          <SwatchStrip />
        </ScatterItem>

        {/* Small annotation label near featured */}
        <ScatterItem
          ctx={ctx}
          depth={0.03}
          x="30%"
          y="10%"
          rotate={-1}
          floatY={4}
          duration={8}
          delay={0.3}
        >
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary ring-1 ring-primary/25 backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            المشروع المميّز
          </div>
        </ScatterItem>

        {/* Client marks — lower right corner cluster */}
        <ScatterItem
          ctx={ctx}
          depth={0.05}
          x="82%"
          y="80%"
          rotate={-4}
          floatY={6}
          duration={11}
          delay={0.7}
        >
          <div className="flex items-center gap-2">
            <ClientMark glyph="H" />
            <ClientMark glyph="◐" />
            <ClientMark glyph="N" />
          </div>
        </ScatterItem>

        {/* Second flow arrow — connecting tablet back to center */}
        <ScatterItem
          ctx={ctx}
          depth={0.02}
          x="58%"
          y="66%"
          rotate={12}
          floatY={4}
          duration={12}
        >
          <FlowArrow
            className="h-14 w-28 rotate-180"
            d="M2 60 C 40 10, 120 10, 158 58"
          />
        </ScatterItem>
      </motion.div>

      {/* ---------- Featured centerpiece (stable, only screen crossfades) ---------- */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="pointer-events-auto relative w-[86%] max-w-[560px]"
          style={{
            // Tiny parallax on the centerpiece itself — makes it feel anchored, not glued.
            x: useTransform(ctx.mx, (v) => v * 0.015),
            y: useTransform(ctx.my, (v) => v * 0.015),
          }}
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ambient glow behind the centerpiece */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-linear-to-br from-primary/15 via-accent/10 to-transparent blur-3xl"
          />

          <BrowserFrame url={current.url} className="w-full">
            {/*
             * FEATURED SCREEN SLOT.
             * Replace <current.Screen /> with:
             *   <img src="/screens/<slug>.jpg" alt={current.title} className="size-full object-cover" />
             * once you have real project screenshots.
             */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="size-full"
              >
                <current.Screen />
              </motion.div>
            </AnimatePresence>
          </BrowserFrame>

          {/* Caption strip under the featured piece — title + category + live link */}
          <div
            dir="rtl"
            className="mt-4 flex items-baseline justify-between gap-4 px-1"
          >
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={current.slug}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="truncate text-sm font-medium tracking-tight text-foreground md:text-base"
                >
                  {current.title}
                </motion.h3>
              </AnimatePresence>
              <div className="text-xs text-muted-foreground">{current.category}</div>
            </div>
            <div className="flex items-center gap-2">
              {current.liveDemo ? (
                <a
                  href={current.liveDemo}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`عرض مباشر لـ ${current.title}`}
                  className="grid size-8 place-items-center rounded-full border border-border/60 bg-background/70 text-foreground/80 backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              ) : null}
              <Link
                to="/work/$slug"
                params={{ slug: current.slug }}
                className="text-xs font-medium text-foreground/70 underline-offset-4 hover:text-primary hover:underline"
              >
                دراسة الحالة
              </Link>
            </div>
          </div>

          {/* Progress dots — subtle indicator of the crossfade cycle */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {FEATURED_SCREENS.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`عرض المشروع ${i + 1}`}
                className={cn(
                  "h-1 rounded-full transition-[width,background-color] duration-500",
                  i === active
                    ? "w-5 bg-foreground/70"
                    : "w-1 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* SR-only live region for the featured piece */}
      <div className="sr-only" aria-live="polite">
        {current.title}
      </div>
    </div>
  );
}
