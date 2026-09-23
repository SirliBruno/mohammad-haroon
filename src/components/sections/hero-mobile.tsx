import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI, StoreUI, EditorUI } from "@/components/mockups/ui-samples";
import { listHeroProjectsPublic } from "@/lib/cms/hero.functions";
import { listPublicProjects } from "@/lib/cms/projects-public.functions";
import { projects as staticProjects } from "@/data/projects";
import { getOptimizedImageUrl } from "@/lib/optimized-images";
import { cn } from "@/lib/utils";

type MobileHeroItem = {
  id: string;
  title: string;
  category: string;
  year?: number | null;
  status: string;
  accent: string;
  coverUrl?: string | null;
  mobileUrl?: string | null;
  host?: string | null;
  slug?: string | null;
  summary?: string | null;
  liveUrl?: string | null;
};

function matchSlug(
  title: string,
  host: string | null | undefined,
  publicProjects?: { slug: string; title: string; live_url?: string | null }[],
): { slug: string | null; liveUrl: string | null } {
  if (!publicProjects || publicProjects.length === 0) {
    const t = title.toLowerCase();
    if (t.includes("rent") || t.includes("استأجر") || t.includes("إستاجر")) return { slug: "rent-right", liveUrl: "https://rent-right-xz.lovable.app" };
    if (t.includes("speak") || t.includes("habits")) return { slug: "speakup", liveUrl: "https://speak-up-en.lovable.app/" };
    if (t.includes("معسكر") || t.includes("لياقة") || t.includes("fitness") || t.includes("campflow")) return { slug: "fitness-camp-management", liveUrl: null };
    return { slug: null, liveUrl: null };
  }

  const t = title.toLowerCase();
  for (const p of publicProjects) {
    const pSlug = p.slug.toLowerCase();
    const pTitle = p.title.toLowerCase();
    if (t.includes(pSlug) || pSlug.includes(t) || pTitle.includes(t) || t.includes(pTitle)) {
      return { slug: p.slug, liveUrl: p.live_url || null };
    }
  }

  // Fallback heuristics
  if (t.includes("rent") || t.includes("استأجر") || t.includes("إستاجر")) {
    const found = publicProjects.find((p) => p.slug === "rent-right");
    return { slug: found?.slug ?? "rent-right", liveUrl: found?.live_url ?? "https://rent-right-xz.lovable.app" };
  }
  if (t.includes("speak") || t.includes("habits")) {
    const found = publicProjects.find((p) => p.slug === "speakup");
    return { slug: found?.slug ?? "speakup", liveUrl: found?.live_url ?? "https://speak-up-en.lovable.app/" };
  }
  if (t.includes("معسكر") || t.includes("لياقة") || t.includes("fitness")) {
    const found = publicProjects.find((p) => p.slug === "fitness-camp-management");
    return { slug: found?.slug ?? "fitness-camp-management", liveUrl: found?.live_url ?? null };
  }

  return { slug: publicProjects[0]?.slug ?? null, liveUrl: publicProjects[0]?.live_url ?? null };
}

function FallbackMockup({ slug, category }: { slug?: string | null; category?: string }) {
  if (slug === "rent-right" || (category && category.includes("تجار"))) {
    return <StoreUI />;
  }
  if (slug === "speakup" || (category && category.includes("SaaS"))) {
    return <EditorUI />;
  }
  return <DashboardUI />;
}

export function HeroMobile() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const isDragging = useRef(false);
  const isHovered = useRef(false);

  const fetchHero = useServerFn(listHeroProjectsPublic);
  const { data: dbHero } = useQuery({
    queryKey: ["hero-projects-public"],
    queryFn: () => fetchHero(),
    staleTime: 60_000,
  });

  const fetchProjects = useServerFn(listPublicProjects);
  const { data: projectsData } = useQuery({
    queryKey: ["public-projects-mobile-hero"],
    queryFn: () => fetchProjects({ data: { limit: 10 } }),
    staleTime: 60_000,
  });

  const items: MobileHeroItem[] = useMemo(() => {
    const pubList = projectsData?.rows ?? [];

    if (dbHero && dbHero.length > 0) {
      return dbHero.map((r) => {
        const { slug, liveUrl } = matchSlug(r.title, r.host, pubList);
        const matchedPub = pubList.find((p) => p.slug === slug);
        return {
          id: r.id,
          title: r.title,
          category: r.category || matchedPub?.category || "مشروع مميز",
          year: r.year ?? matchedPub?.year ?? 2026,
          status: r.status || "مباشر",
          accent: r.accent || "emerald",
          coverUrl: r.cover_url,
          mobileUrl: r.mobile_url,
          host: r.host || (liveUrl ? liveUrl.replace(/^https?:\/\//, "") : undefined),
          slug,
          summary: matchedPub?.summary || undefined,
          liveUrl: liveUrl || (r.host ? `https://${r.host}` : null),
        };
      });
    }

    if (pubList.length > 0) {
      return pubList.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category || "مشروع مميز",
        year: p.year ?? 2026,
        status: p.status === "in_progress" ? "قيد التطوير" : "مباشر",
        accent: "emerald",
        coverUrl: p.cover_url,
        mobileUrl: null,
        host: p.live_url ? p.live_url.replace(/^https?:\/\//, "") : `${p.slug}.app`,
        slug: p.slug,
        summary: p.summary || undefined,
        liveUrl: p.live_url,
      }));
    }

    return staticProjects.map((p) => ({
      id: p.id || p.slug,
      title: p.title,
      category: p.category || "مشروع مميز",
      year: p.year,
      status: "مباشر",
      accent: "emerald",
      coverUrl: p.cover?.src || null,
      mobileUrl: null,
      host: p.liveDemo ? p.liveDemo.replace(/^https?:\/\//, "") : `${p.slug}.app`,
      slug: p.slug,
      summary: p.summary,
      liveUrl: p.liveDemo,
    }));
  }, [dbHero, projectsData]);

  // Auto-advance every 6s unless reduced motion or interacted
  useEffect(() => {
    if (reduce || items.length <= 1) return;
    const interval = window.setInterval(() => {
      if (isDragging.current || isHovered.current) return;
      setActive((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [reduce, items.length]);

  useEffect(() => {
    if (active >= items.length) setActive(0);
  }, [items.length, active]);

  const go = useCallback(
    (delta: number) => {
      setActive((prev) => (prev + delta + items.length) % items.length);
    },
    [items.length],
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    isDragging.current = false;
    const threshold = 40;
    // In RTL, dragging right (positive x) moves to previous, dragging left (negative x) moves to next
    if (info.offset.x > threshold) {
      go(-1);
    } else if (info.offset.x < -threshold) {
      go(1);
    }
  };

  const current = items[Math.min(active, items.length - 1)];
  if (!current) return null;

  const isLive = current.status === "مباشر";
  const displayImage = getOptimizedImageUrl(current.coverUrl || current.mobileUrl, current.slug);
  const hostName = current.host || (current.slug ? `${current.slug}.app` : "project.preview");

  return (
    <div
      className="relative mt-8 select-none"
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
      onTouchStart={() => (isHovered.current = true)}
      onTouchEnd={() => (isHovered.current = false)}
    >
      {/* Outer iOS glassmorphism card */}
      <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-border/80 glass-card glass-specular p-4 shadow-xl shadow-black/5">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                isLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500",
              )}
            />
            <span dir="auto" className="truncate text-xs font-bold text-foreground">
              {current.title.split("—")[0].trim()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                isLive
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
              )}
            >
              {current.category}
            </span>
          </div>
        </div>

        {/* Swipeable Interactive Preview Area */}
        <motion.div
          className="mt-3 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => (isDragging.current = true)}
          onDragEnd={handleDragEnd}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-muted/30 shadow-inner">
            <BrowserFrame url={hostName}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id || current.title}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-background/50"
                >
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={current.title}
                      className="size-full object-cover object-top transition-transform duration-500"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="size-full">
                      <FallbackMockup slug={current.slug} category={current.category} />
                    </div>
                  )}

                  {/* Specular glass reflection */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-white/20 to-transparent"
                  />
                </motion.div>
              </AnimatePresence>
            </BrowserFrame>
          </div>
        </motion.div>

        {/* Project Description Line */}
        {current.summary && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {current.summary}
          </p>
        )}

        {/* Actions & Case Study Link */}
        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
          <div className="flex items-center gap-2">
            {current.slug ? (
              <Link
                to="/work/$slug"
                params={{ slug: current.slug }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-xs transition-transform active:scale-95"
              >
                <span>دراسة الحالة</span>
                <ArrowLeft className="size-3.5" />
              </Link>
            ) : (
              <Link
                to="/work"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-xs transition-transform active:scale-95"
              >
                <span>استعراض العمل</span>
                <ArrowLeft className="size-3.5" />
              </Link>
            )}

            {current.liveUrl && (
              <a
                href={current.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background/60 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                aria-label={`معاينة مباشرة لـ ${current.title}`}
              >
                <ExternalLink className="size-3 text-muted-foreground" />
                <span>معاينة</span>
              </a>
            )}
          </div>

          {/* Carousel Next / Prev Controls */}
          {items.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="المشروع السابق"
                className="grid size-7 place-items-center rounded-lg border border-border/60 bg-muted/40 text-foreground/80 transition-colors hover:bg-muted active:scale-90"
              >
                <ChevronRight className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="المشروع التالي"
                className="grid size-7 place-items-center rounded-lg border border-border/60 bg-muted/40 text-foreground/80 transition-colors hover:bg-muted active:scale-90"
              >
                <ChevronLeft className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Pagination Dots */}
        {items.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-border/40 pt-2.5">
            {items.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`الانتقال إلى مشروع ${item.title}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === active
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

