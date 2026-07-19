/**
 * HeroMobile — a bespoke, mobile-only presentation of the featured
 * projects. Completely independent from HeroWorkspace: no floating
 * windows, no parallax, no boundary breaking. Instead: a single
 * dominant phone mockup, a compact browser preview underneath, and
 * a project meta strip. Every 6s all pieces crossfade to the next
 * featured project.
 */
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
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
    year: 2024,
    status: "قيد التطوير",
    accent: "violet",
    Website: DashboardUI,
    Mobile: MobileAppUI,
  },
];

const ACCENT_GLOW: Record<Item["accent"], string> = {
  emerald: "from-emerald-400/25 via-emerald-300/10",
  amber: "from-amber-400/25 via-amber-300/10",
  sky: "from-sky-400/25 via-sky-300/10",
  violet: "from-violet-400/25 via-violet-300/10",
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
    }, 6000);
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
      {/* Ambient accent glow — swaps with active project */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(70%_60%_at_50%_35%,black,transparent)]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug + "-glow"}
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute left-1/2 top-10 size-[380px] -translate-x-1/2 rounded-full bg-linear-to-b to-transparent blur-3xl",
              ACCENT_GLOW[current.accent],
            )}
          />
        </AnimatePresence>
      </div>

      {/* Phone centerpiece */}
      <div className="relative mx-auto flex justify-center pt-2">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="drop-shadow-[0_28px_40px_rgba(0,0,0,0.35)]"
        >
          <PhoneFrame className="w-[210px]">
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

        {/* Floating live badge */}
        <div
          dir="ltr"
          className="absolute right-4 top-4 z-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug + "-badge"}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium backdrop-blur-md",
                isLive
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-600",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isLive ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              {current.status}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Browser preview strip */}
      <div className="mx-auto mt-6 w-[92%] max-w-[380px]" dir="ltr">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug + "-m-web"}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrowserFrame url={current.host} className="w-full">
              <current.Website />
            </BrowserFrame>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Meta row */}
      <div className="mx-auto mt-5 flex w-[92%] max-w-[380px] items-baseline justify-between gap-3">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.h3
              key={current.slug + "-m-title"}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
              className="truncate text-[15px] font-semibold tracking-tight text-foreground"
            >
              {current.name}
            </motion.h3>
          </AnimatePresence>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {current.category} · <span dir="ltr">{current.year}</span>
          </div>
        </div>
        <Link
          to="/work"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/70 hover:text-primary"
        >
          الأعمال
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
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
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
            )}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite">
        {current.name}
      </div>
    </div>
  );
}
