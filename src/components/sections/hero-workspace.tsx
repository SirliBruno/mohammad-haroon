/**
 * HeroWorkspace — a premium, boundary-breaking product workspace.
 *
 * Composition rules:
 *  - The FEATURED centerpiece is a MacBook mockup. Only the screen contents
 *    crossfade every ~7s. Replace <current.Screen /> with real <img /> once
 *    project screenshots exist (see FEATURED_SCREENS below).
 *  - Supporting devices (iPhone, Tablet, Studio browser) overlap the laptop
 *    at the corners and intentionally break the container boundary.
 *  - Floating "product cards" (Lighthouse, Analytics, Project Status, Figma,
 *    Tech Tags) sit on a scatter layer with subtle mouse-parallax and float.
 *  - Every element respects prefers-reduced-motion.
 *
 * The canvas is `overflow-visible` so pieces at the edges deliberately extend
 * past the frame — Stripe/Framer/Linear style "living workspace" feel.
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
} from "motion/react";
import { ExternalLink, Sparkles, TrendingUp } from "lucide-react";
import { LaptopFrame, PhoneFrame } from "@/components/mockups/devices";
import {
  DashboardUI,
  EditorUI,
  MobileAppUI,
  StoreUI,
} from "@/components/mockups/ui-samples";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Featured centerpiece pool                                                  */
/* -------------------------------------------------------------------------- */

type FeaturedScreen = {
  slug: string;
  url: string;
  title: string;
  category: string;
  Screen: (p: { className?: string }) => ReactElement;
  liveDemo?: string;
};

const FEATURED_SCREENS: FeaturedScreen[] = (() => {
  const featured = projects.filter((p) => p.featured);
  const pool = (featured.length ? featured : projects).slice(0, 5);
  const uiPool: Array<FeaturedScreen["Screen"]> = [
    DashboardUI,
    StoreUI,
    EditorUI,
    DashboardUI,
    StoreUI,
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
/* Reusable floating "product cards"                                          */
/* -------------------------------------------------------------------------- */

/** Glass-panel wrapper used by all floating cards. */
function GlassPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-background/70 p-3.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Lighthouse-style performance score ring. */
function LighthouseCard({ className }: { className?: string }) {
  const scores = [
    { label: "Performance", value: 99, tone: "text-emerald-500" },
    { label: "Accessibility", value: 100, tone: "text-emerald-500" },
    { label: "SEO", value: 98, tone: "text-emerald-500" },
  ];
  return (
    <GlassPanel className={cn("w-[220px]", className)}>
      <div dir="ltr" className="flex items-center justify-between">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Lighthouse
        </div>
        <Sparkles className="size-3 text-emerald-500" aria-hidden />
      </div>
      <div dir="ltr" className="mt-3 flex items-center justify-between gap-2">
        {scores.map((s) => {
          const r = 16;
          const c = 2 * Math.PI * r;
          const dash = c * (s.value / 100);
          return (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <div className="relative size-10">
                <svg viewBox="0 0 40 40" className="size-full -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r={r}
                    fill="none"
                    strokeWidth="3"
                    className="stroke-muted"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r={r}
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${c}`}
                    className={s.tone}
                    stroke="currentColor"
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-[10px] font-semibold tabular-nums">
                  {s.value}
                </div>
              </div>
              <div className="text-[8px] text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

/** Analytics micro-widget — MRR spark. */
function AnalyticsCard({ className }: { className?: string }) {
  return (
    <GlassPanel className={cn("w-[200px]", className)}>
      <div dir="ltr" className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            MRR · Live
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight">$48,204</div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600">
          <TrendingUp className="size-2.5" aria-hidden /> 12.4%
        </div>
      </div>
      <svg viewBox="0 0 200 46" className="mt-2 h-10 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mrr-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 34 L20 30 L40 32 L60 22 L80 26 L100 16 L120 20 L140 10 L160 14 L180 6 L200 10 L200 46 L0 46 Z"
          fill="url(#mrr-g)"
          className="text-emerald-500"
        />
        <path
          d="M0 34 L20 30 L40 32 L60 22 L80 26 L100 16 L120 20 L140 10 L160 14 L180 6 L200 10"
          fill="none"
          strokeWidth="1.6"
          stroke="currentColor"
          className="text-emerald-500"
        />
      </svg>
    </GlassPanel>
  );
}

/** Project status card — timeline + progress. */
function StatusCard({
  title,
  stage,
  progress,
  className,
}: {
  title: string;
  stage: string;
  progress: number;
  className?: string;
}) {
  return (
    <GlassPanel className={cn("w-[220px]", className)}>
      <div dir="rtl" className="flex items-center justify-between">
        <div className="text-[11px] font-medium text-foreground">{title}</div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
          <span className="size-1 rounded-full bg-primary" /> نشِط
        </span>
      </div>
      <div dir="rtl" className="mt-1 text-[10px] text-muted-foreground">
        {stage}
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-linear-to-r from-primary to-accent"
        />
      </div>
      <div dir="ltr" className="mt-2 flex justify-between text-[9px] text-muted-foreground">
        <span>Discovery</span>
        <span>Design</span>
        <span>Ship</span>
      </div>
    </GlassPanel>
  );
}

/** Figma window mini. */
function FigmaCard({ className }: { className?: string }) {
  return (
    <GlassPanel className={cn("w-[210px] p-0 overflow-hidden", className)}>
      <div
        dir="ltr"
        className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-3 py-2"
      >
        <Figma className="size-3 text-muted-foreground" aria-hidden />
        <div className="text-[9px] font-medium tracking-wide text-muted-foreground">
          Product · Design v3
        </div>
      </div>
      <div className="grid grid-cols-6 gap-1 p-3">
        <div className="col-span-4 aspect-video rounded-md bg-linear-to-br from-primary/25 via-primary/10 to-accent/20" />
        <div className="col-span-2 aspect-video rounded-md bg-muted" />
        <div className="col-span-2 aspect-video rounded-md bg-muted" />
        <div className="col-span-2 aspect-video rounded-md bg-emerald-500/25" />
        <div className="col-span-2 aspect-video rounded-md bg-muted" />
      </div>
    </GlassPanel>
  );
}

/** Sticky note. */
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
    amber: "bg-amber-100/95 text-amber-950",
    rose: "bg-rose-100/95 text-rose-950",
    sky: "bg-sky-100/95 text-sky-950",
  } as const;
  return (
    <div
      className={cn(
        "rounded-md px-3 py-2 text-[11px] leading-snug shadow-[0_14px_36px_-16px_rgba(0,0,0,0.4)]",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Tech tag pill. */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/60 bg-background/85 px-2.5 py-1 text-[10px] font-medium tracking-wide text-foreground/80 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.3)] backdrop-blur-md">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax scatter item                                                       */
/* -------------------------------------------------------------------------- */

type ParallaxCtx = {
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
};

function ScatterItem({
  ctx,
  depth,
  x,
  y,
  rotate = 0,
  floatY = 8,
  duration = 9,
  delay = 0,
  z = 0,
  className,
  children,
}: {
  ctx: ParallaxCtx;
  depth: number;
  x: string | number;
  y: string | number;
  rotate?: number;
  floatY?: number;
  duration?: number;
  delay?: number;
  z?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const tx = useTransform(ctx.mx, (v) => v * depth);
  const ty = useTransform(ctx.my, (v) => v * depth);
  return (
    <motion.div
      className={cn("absolute", className)}
      style={{ left: x, top: y, x: tx, y: ty, rotate, zIndex: z }}
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
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

export function HeroWorkspace() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement>(null);

  // ---- Featured crossfade ----
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduce || FEATURED_SCREENS.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FEATURED_SCREENS.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [reduce]);

  // ---- Mouse parallax ----
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 55, damping: 20, mass: 0.7 });
  const my = useSpring(rawY, { stiffness: 55, damping: 20, mass: 0.7 });
  const ctx: ParallaxCtx = useMemo(() => ({ mx, my }), [mx, my]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    rawX.set(e.clientX - (r.left + r.width / 2));
    rawY.set(e.clientY - (r.top + r.height / 2));
  };
  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const current = FEATURED_SCREENS[active] ?? FEATURED_SCREENS[0];

  // Centerpiece tiny parallax (declared once, not per-render inside JSX)
  const centerX = useTransform(mx, (v) => v * 0.012);
  const centerY = useTransform(my, (v) => v * 0.012);

  return (
    <div
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      dir="ltr"
      // overflow-visible so elements can break the grid.
      className="relative isolate w-full select-none [perspective:1600px]"
      aria-label="مساحة عمل رقمية"
      role="img"
    >
      {/* Ambient background: soft radial glow + fine grid, contained. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent)]"
      >
        <div
          className="absolute inset-0 opacity-40 dark:opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute left-1/2 top-1/2 size-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 size-[420px] rounded-full bg-accent/12 blur-3xl" />
      </div>

      {/* Stage — sizes give the centerpiece dominance while allowing overflow. */}
      <div className="relative mx-auto aspect-[5/4] w-full min-h-[520px] sm:min-h-[600px] md:min-h-[680px] lg:min-h-[720px]">
        {/* -------------------- CENTERPIECE: MacBook -------------------- */}
        <motion.div
          className="pointer-events-auto absolute left-1/2 top-[46%] w-[92%] max-w-[720px] -translate-x-1/2 -translate-y-1/2"
          style={{ x: centerX, y: centerY, zIndex: 20 }}
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-linear-to-br from-primary/20 via-accent/12 to-transparent blur-3xl"
          />
          <LaptopFrame>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="size-full"
              >
                <current.Screen />
              </motion.div>
            </AnimatePresence>
          </LaptopFrame>
        </motion.div>

        {/* -------------------- SUPPORTING DEVICE: iPhone -------------------- */}
        <ScatterItem
          ctx={ctx}
          depth={0.05}
          x="-4%"
          y="56%"
          rotate={-6}
          floatY={9}
          duration={12}
          delay={0.3}
          z={30}
        >
          <div className="drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]">
            <PhoneFrame className="w-[150px] sm:w-[170px] md:w-[190px]">
              <MobileAppUI />
            </PhoneFrame>
          </div>
        </ScatterItem>

        {/* -------------------- MINIMAL PRODUCT CARDS -------------------- */}
        {/* Lighthouse — top-left. */}
        <ScatterItem
          ctx={ctx}
          depth={0.055}
          x="-2%"
          y="4%"
          rotate={-2}
          floatY={7}
          duration={11}
          delay={0.15}
          z={35}
        >
          <LighthouseCard />
        </ScatterItem>

        {/* Analytics — top-right. */}
        <ScatterItem
          ctx={ctx}
          depth={0.06}
          x="80%"
          y="8%"
          rotate={3}
          floatY={7}
          duration={10}
          delay={0.4}
          z={35}
        >
          <AnalyticsCard />
        </ScatterItem>

        {/* Small status badge — near the laptop. */}
        <ScatterItem
          ctx={ctx}
          depth={0.03}
          x="38%"
          y="92%"
          rotate={0}
          floatY={3}
          duration={8}
          delay={0.5}
          z={45}
        >
          <div className="flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-[10px] font-medium text-primary ring-1 ring-primary/25 backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            المشروع المميّز
          </div>
        </ScatterItem>
      </div>

      {/* -------------------- CAPTION + PROGRESS -------------------- */}
      <div
        dir="rtl"
        className="mt-6 flex items-baseline justify-between gap-4 px-1"
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

      <div className="mt-3 flex items-center justify-center gap-1.5">
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

      <div className="sr-only" aria-live="polite">
        {current.title}
      </div>
    </div>
  );
}
