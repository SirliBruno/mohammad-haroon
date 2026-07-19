/**
 * HeroMobile — a handcrafted mobile-first showcase.
 *
 * Vertical hierarchy (below the shared copy block in hero.tsx):
 *   1. Browser mockup — PRIMARY (near full width, big radius, premium shadow)
 *   2. Project card   — SECONDARY (compact meta strip)
 *   3. Phone preview  — TERTIARY (small, complementary, never dominant)
 *
 * All three surfaces represent the same featured project and crossfade
 * together every 7s. Animations are intentionally quiet: slow float on
 * the browser, gentle offset on the phone, soft fade on the card.
 */
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { BrowserFrame, PhoneFrame } from "@/components/mockups/devices";
import {
  DashboardUI,
  EditorUI,
  MobileAppUI,
  StoreUI,
} from "@/components/mockups/ui-samples";
import { listHeroProjectsPublic } from "@/lib/cms/hero.functions";
import { cn } from "@/lib/utils";

type Item = {
  slug: string;
  name: string;
  host: string;
  category: string;
  tech: string;
  year: number;
  status: "مباشر" | "قيد التطوير";
  accent: "emerald" | "amber" | "sky" | "violet";
  Website: (p: { className?: string }) => ReactElement;
  Mobile: (p: { className?: string }) => ReactElement;
};

const FALLBACK: Item[] = [
  {
    slug: "northwind-analytics",
    name: "Northwind",
    host: "northwind.app",
    category: "تصميم واجهات",
    tech: "Next.js",
    year: 2025,
    status: "مباشر",
    accent: "emerald",
    Website: DashboardUI,
    Mobile: MobileAppUI,
  },
  {
    slug: "haven-storefront",
    name: "Haven",
    host: "haven.co",
    category: "تجارة إلكترونية",
    tech: "Shopify",
    year: 2025,
    status: "مباشر",
    accent: "amber",
    Website: StoreUI,
    Mobile: MobileAppUI,
  },
  {
    slug: "atelier-cms",
    name: "Atelier",
    host: "atelier.studio",
    category: "مواقع إلكترونية",
    tech: "React",
    year: 2024,
    status: "مباشر",
    accent: "sky",
    Website: EditorUI,
    Mobile: MobileAppUI,
  },
  {
    slug: "lumen-payments",
    name: "Lumen",
    host: "lumen.finance",
    category: "مواقع إلكترونية",
    tech: "TypeScript",
    year: 2024,
    status: "قيد التطوير",
    accent: "violet",
    Website: DashboardUI,
    Mobile: MobileAppUI,
  },
];

const ACCENT_GLOW: Record<Item["accent"], string> = {
  emerald: "from-emerald-400/25 via-emerald-300/8",
  amber: "from-amber-400/25 via-amber-300/8",
  sky: "from-sky-400/25 via-sky-300/8",
  violet: "from-violet-400/25 via-violet-300/8",
};

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
    return dbHero.map((r, i): Item => {
      const fallback = FALLBACK[i % FALLBACK.length];
      const Cover = (props: { className?: string }) =>
        r.cover_url ? (
          <img
            src={r.cover_url}
            alt={r.title}
            className={cn("size-full object-cover", props.className)}
          />
        ) : (
          <fallback.Website {...props} />
        );
      const Phone = (props: { className?: string }) =>
        r.mobile_url ? (
          <img
            src={r.mobile_url}
            alt={r.title}
            className={cn("size-full object-cover", props.className)}
          />
        ) : (
          <fallback.Mobile {...props} />
        );
      const accent = (["emerald", "amber", "sky", "violet"] as const).includes(
        r.accent as never,
      )
        ? (r.accent as Item["accent"])
        : "emerald";
      return {
        slug: r.id,
        name: r.title,
        host: r.host || fallback.host,
        category: r.category || fallback.category,
        tech: fallback.tech,
        year: r.year ?? fallback.year,
        status: (r.status as Item["status"]) || "مباشر",
        accent,
        Website: Cover,
        Mobile: Phone,
      };
    });
  }, [dbHero]);

  useEffect(() => {
    if (reduce || projects.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % projects.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [reduce, projects.length]);

  useEffect(() => {
    if (active >= projects.length) setActive(0);
  }, [projects.length, active]);

  const current = projects[Math.min(active, projects.length - 1)];
  const isLive = current.status === "مباشر";

  return (
    <div
      dir="rtl"
      className="relative isolate w-full select-none"
      aria-label="عرض المشاريع"
    >
      {/* Accent glow — swaps with active project */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] overflow-hidden [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug + "-glow"}
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute left-1/2 top-2 size-[420px] -translate-x-1/2 rounded-full bg-linear-to-b to-transparent blur-3xl",
              ACCENT_GLOW[current.accent],
            )}
          />
        </AnimatePresence>
      </div>

      {/* -------- PRIMARY · Browser mockup -------- */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 14, repeat: Infinity, ease: "easeInOut" }
          }
          dir="ltr"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5),0_20px_40px_-30px_rgba(0,0,0,0.35)]">
            <BrowserFrame url={current.host} className="!rounded-none !border-0 !shadow-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug + "-m-web"}
                  initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  className="size-full"
                >
                  <current.Website />
                </motion.div>
              </AnimatePresence>
            </BrowserFrame>
          </div>
        </motion.div>
      </motion.div>

      {/* -------- SECONDARY · Project card -------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.slug + "-m-card"}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 rounded-2xl border border-border/60 bg-background/90 p-5 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              <Sparkles className="size-3" aria-hidden />
              مميّز
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                isLive
                  ? "bg-emerald-500/12 text-emerald-600"
                  : "bg-amber-500/12 text-amber-600",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isLive ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              {current.status}
            </span>
          </div>

          <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
            {current.name}
          </h3>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12.5px]">
            <div>
              <dt className="text-muted-foreground">التصنيف</dt>
              <dd className="mt-0.5 text-foreground">{current.category}</dd>
            </div>
            <div className="text-end">
              <dt className="text-muted-foreground">التقنية</dt>
              <dd className="mt-0.5 text-foreground" dir="ltr">
                {current.tech}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">السنة</dt>
              <dd className="mt-0.5 text-foreground" dir="ltr">
                {current.year}
              </dd>
            </div>
            <div className="text-end">
              <dt className="text-muted-foreground">النطاق</dt>
              <dd className="mt-0.5 truncate text-foreground" dir="ltr">
                {current.host}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
            <div className="flex items-center gap-1.5">
              {projects.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`عرض المشروع ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-[width,background-color] duration-500",
                    i === active
                      ? "w-6 bg-foreground/70"
                      : "w-1.5 bg-muted-foreground/30",
                  )}
                />
              ))}
            </div>
            <Link
              to="/work"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground/70 hover:text-primary"
            >
              كل الأعمال
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* -------- TERTIARY · Phone mockup -------- */}
      <div className="mt-8 flex justify-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
            }
            className="opacity-95 drop-shadow-[0_18px_28px_rgba(0,0,0,0.28)]"
          >
            <PhoneFrame className="w-[128px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug + "-m-phone"}
                  initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="size-full"
                >
                  <current.Mobile />
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </motion.div>
        </motion.div>
      </div>

      <div className="sr-only" aria-live="polite">
        {current.name}
      </div>
    </div>
  );
}
