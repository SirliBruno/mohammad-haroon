import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  animate,
  type PanInfo,
} from "motion/react";
import {
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
} from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/features/projects/schema";
import { statusMeta } from "@/lib/project-status";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Card preview — token-driven, adaptive placeholder screenshot        */
/* ------------------------------------------------------------------ */

function ProjectPreview({ project, index }: { project: Project; index: number }) {
  const variant = index % 4;

  return (
    <div className="relative h-full w-full overflow-hidden bg-linear-to-br from-muted/60 via-muted/30 to-background">
      {/* subtle gradient wash tinted by primary */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%), radial-gradient(120% 80% at 0% 100%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 55%)",
        }}
      />
      {/* fine grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* faux browser chrome */}
      <div
        dir="ltr"
        className="absolute inset-x-0 top-0 flex items-center gap-1.5 border-b border-border/40 bg-background/40 px-3 py-2 backdrop-blur-sm"
      >
        <span className="size-1.5 rounded-full bg-foreground/25" />
        <span className="size-1.5 rounded-full bg-foreground/20" />
        <span className="size-1.5 rounded-full bg-foreground/15" />
      </div>

      {/* screenshot placeholder body */}
      <div className="absolute inset-x-4 top-10 bottom-4">
        {variant === 0 && (
          <div className="grid h-full grid-cols-6 gap-2">
            <div className="col-span-4 space-y-2">
              <div className="h-2 w-2/3 rounded-full bg-foreground/25" />
              <div className="h-2 w-1/2 rounded-full bg-foreground/15" />
              <div className="mt-2 h-24 rounded-lg bg-linear-to-br from-primary/50 to-primary/10" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-10 rounded-md bg-foreground/[0.06]" />
                <div className="h-10 rounded-md bg-foreground/[0.06]" />
                <div className="h-10 rounded-md bg-foreground/[0.06]" />
              </div>
            </div>
            <div className="col-span-2 rounded-lg bg-foreground/[0.05] p-2">
              <div className="h-1.5 w-3/4 rounded-full bg-foreground/20" />
              <div className="mt-2 space-y-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-full rounded-full bg-foreground/10"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {variant === 1 && (
          <div className="grid h-full grid-cols-[32%_1fr] gap-2">
            <div className="space-y-1.5 rounded-lg bg-foreground/[0.05] p-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-1.5 w-full rounded-full bg-foreground/10" />
              ))}
            </div>
            <div className="grid grid-rows-[auto_1fr] gap-2">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-md bg-foreground/[0.05] p-2">
                    <div className="h-1.5 w-1/2 rounded-full bg-foreground/20" />
                    <div className="mt-1.5 h-4 w-2/3 rounded-full bg-foreground/10" />
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-linear-to-br from-primary/40 via-accent/20 to-transparent" />
            </div>
          </div>
        )}
        {variant === 2 && (
          <div className="grid h-full grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-md border border-border/40 bg-foreground/[0.03]"
              >
                <div className="aspect-square bg-linear-to-br from-foreground/15 to-foreground/[0.02]" />
                <div className="space-y-1 p-1.5">
                  <div className="h-1.5 w-3/4 rounded-full bg-foreground/20" />
                  <div className="h-1.5 w-1/2 rounded-full bg-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        )}
        {variant === 3 && (
          <div className="flex h-full flex-col gap-2">
            <div className="h-2 w-1/3 rounded-full bg-foreground/25" />
            <div className="h-2 w-1/2 rounded-full bg-foreground/15" />
            <div className="mt-1 grid flex-1 grid-cols-2 gap-2">
              <div className="rounded-lg bg-linear-to-br from-primary/45 to-primary/5" />
              <div className="grid grid-rows-3 gap-2">
                <div className="rounded-md bg-foreground/[0.06]" />
                <div className="rounded-md bg-linear-to-br from-accent/40 to-accent/5" />
                <div className="rounded-md bg-foreground/[0.06]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* soft top highlight for glass reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/25 to-transparent dark:from-white/10"
      />
      <span className="sr-only">{project.title}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Single card                                                         */
/* ------------------------------------------------------------------ */

function HeroProjectCard({
  project,
  index,
  isActive,
  onSelect,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Cursor tilt (disabled under reduced motion)
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 8); // rotateY
    rx.set(-py * 6); // rotateX
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const shortTitle = project.title.split("—")[0].trim();

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onSelect}
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={
        reduce
          ? undefined
          : {
              duration: 7 + (index % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.35,
            }
      }
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative block h-full w-full overflow-hidden rounded-[28px] border border-border/50 bg-card/60 shadow-[0_30px_80px_-32px_rgb(9_9_11_/_0.30)] backdrop-blur-xl transition-[box-shadow,border-color,opacity,transform] duration-500",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_40px_100px_-30px_color-mix(in_oklab,var(--primary)_35%,transparent)]",
        !isActive && "opacity-60",
      )}
    >
      {/* Soft glow ring */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[28px] ring-1 transition-colors duration-500",
          isActive ? "ring-primary/25" : "ring-transparent",
          "group-hover:ring-primary/30",
        )}
      />

      {/* Screenshot — dominates the card. Replace <ProjectPreview /> with
          <img src={project.cover.src} alt={project.cover.alt} className="size-full object-cover" />
          when a real screenshot exists. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ProjectPreview project={project} index={index} />

        {/* Live-demo action — floats over the image so nothing steals room from it */}
        {project.liveDemo ? (
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            aria-label={`عرض مباشر لـ ${shortTitle}`}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/25 bg-background/70 text-foreground/90 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ExternalLink className="size-4" aria-hidden />
          </a>
        ) : null}
      </div>

      {/* Minimal caption — title + category, nothing else */}
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        onClick={(e) => e.stopPropagation()}
        className="flex items-baseline justify-between gap-3 border-t border-border/40 px-5 py-4"
      >
        <h3 className="truncate text-base font-medium tracking-tight text-foreground md:text-lg">
          {shortTitle}
        </h3>
        <span className="shrink-0 text-xs text-muted-foreground">
          {project.category}
        </span>
      </Link>
    </motion.div>
  );
}


/* ------------------------------------------------------------------ */
/* Carousel                                                            */
/* ------------------------------------------------------------------ */

export function HeroProjectsCarousel() {
  const reduce = useReducedMotion();
  const items = useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    return (featured.length >= 4 ? featured : projects).slice(0, 6);
  }, []);

  const [active, setActive] = useState(1);
  const [step, setStep] = useState(360); // card width + gap
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const isHovering = useRef(false);

  // Measure the card step from the first card element.
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current?.querySelector<HTMLElement>("[data-hero-card]");
      if (!el || !trackRef.current) return;
      const rect = el.getBoundingClientRect();
      // gap-6 = 24px in Tailwind
      setStep(rect.width + 24);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Animate x to the active card, keeping it centered.
  useEffect(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.getBoundingClientRect().width;
    const cardEl = trackRef.current?.querySelector<HTMLElement>("[data-hero-card]");
    const cardW = cardEl?.getBoundingClientRect().width ?? step - 24;
    // Center of container - center of active card
    const target = containerW / 2 - (active * step + cardW / 2);
    const controls = animate(x, target, {
      type: "spring",
      stiffness: 120,
      damping: 22,
      mass: 0.6,
    });
    return () => controls.stop();
  }, [active, step, x]);

  // Auto-advance
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (isDragging.current || isHovering.current) return;
      setActive((a) => (a + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [items.length, reduce]);

  const go = useCallback(
    (dir: 1 | -1) =>
      setActive((a) => (a + dir + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(-1);
      else if (e.key === "ArrowLeft") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    isDragging.current = false;
    const threshold = step * 0.22;
    const delta = info.offset.x + info.velocity.x * 0.15;
    if (delta < -threshold) setActive((a) => Math.min(items.length - 1, a + 1));
    else if (delta > threshold) setActive((a) => Math.max(0, a - 1));
    else setActive((a) => a); // spring back
  };

  return (
    <div
      className="relative isolate w-full select-none"
      aria-roledescription="عرض شرائح"
      aria-label="أعمال مختارة"
      onMouseEnter={() => (isHovering.current = true)}
      onMouseLeave={() => (isHovering.current = false)}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-16 -z-10 rounded-[3rem] bg-linear-to-br from-primary/15 via-accent/10 to-transparent blur-3xl"
      />

      {/* Stage with edge fade masks (LTR-scoped so masks apply left/right visually) */}
      <div
        ref={containerRef}
        dir="ltr"
        className="relative overflow-hidden py-6"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <motion.div
          ref={trackRef}
          className="flex items-stretch gap-6 will-change-transform"
          style={{ x }}
          drag="x"
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => (isDragging.current = true)}
          onDragEnd={onDragEnd}
        >
          {items.map((p, i) => (
            <div
              key={p.slug}
              data-hero-card
              className="w-[280px] shrink-0 sm:w-[320px] md:w-[340px] lg:w-[360px]"
              dir="rtl"
            >
              <HeroProjectCard
                project={p}
                index={i}
                isActive={i === active}
                onSelect={() => setActive(i)}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2" role="tablist">
          {items.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`عرض المشروع ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300",
                i === active
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="المشروع السابق"
            className="grid size-9 place-items-center rounded-full border border-border/60 bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="المشروع التالي"
            className="grid size-9 place-items-center rounded-full border border-border/60 bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Live region */}
      <div className="sr-only" aria-live="polite">
        {items[active]?.title}
      </div>
    </div>
  );
}

