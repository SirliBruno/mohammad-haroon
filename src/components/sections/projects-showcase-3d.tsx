import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  ShoppingBag,
  Globe,
  Palette,
  Smartphone,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/features/projects/schema";

// Module-scope maps — hoisted to avoid re-creation per render.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "مواقع إلكترونية": Globe,
  "تصميم واجهات": LayoutDashboard,
  "تجارة إلكترونية": ShoppingBag,
  "تصميم جرافيك": Palette,
  "تطبيقات": Smartphone,
  "تصوير": FileText,
};

function CategoryIcon({ category }: { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? LayoutDashboard;
  return <Icon className="size-4" aria-hidden />;
}

// Faux preview surface inside each card — uses design tokens so it adapts to theme.
function CardPreview({ project, index }: { project: Project; index: number }) {
  const variant = index % 3;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/60 bg-linear-to-br from-muted/70 to-muted/30">
      {/* traffic dots */}
      <div className="flex items-center gap-1.5 border-b border-border/60 px-3 py-2" dir="ltr">
        <span className="size-1.5 rounded-full bg-foreground/20" />
        <span className="size-1.5 rounded-full bg-foreground/20" />
        <span className="size-1.5 rounded-full bg-foreground/20" />
      </div>

      {variant === 0 && (
        <div className="grid h-[calc(100%-1.75rem)] grid-cols-5 gap-2 p-3">
          <div className="col-span-3 space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-foreground/25" />
            <div className="h-2 w-1/2 rounded-full bg-foreground/15" />
            <div className="mt-2 h-14 w-full rounded-md bg-linear-to-br from-primary/40 to-primary/10" />
            <div className="h-2 w-16 rounded-full bg-primary/70" />
          </div>
          <div className="col-span-2 rounded-md bg-foreground/5" />
        </div>
      )}

      {variant === 1 && (
        <div className="grid h-[calc(100%-1.75rem)] grid-cols-[28%_1fr] gap-1.5 p-2">
          <div className="space-y-1 rounded-md bg-foreground/[0.04] p-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-1.5 w-full rounded-full bg-foreground/10" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-md bg-foreground/[0.04] p-1.5">
                <div className="h-1.5 w-1/2 rounded-full bg-foreground/20" />
                <div className="mt-1 h-4 w-2/3 rounded-full bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 2 && (
        <div className="grid h-[calc(100%-1.75rem)] grid-cols-3 gap-1.5 p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-border/60 bg-foreground/[0.03] p-1.5"
            >
              <div className="aspect-square rounded bg-linear-to-br from-foreground/10 to-foreground/[0.02]" />
              <div className="mt-1 h-1.5 w-3/4 rounded-full bg-foreground/15" />
              <div className="mt-1 h-1.5 w-1/2 rounded-full bg-foreground/10" />
            </div>
          ))}
        </div>
      )}

      <span className="sr-only">{project.title}</span>
    </div>
  );
}

function ProjectCard3D({
  project,
  position,
  index,
}: {
  project: Project;
  position: "start" | "center" | "end";
  index: number;
}) {
  const isCenter = position === "center";

  // "start" = leading edge in reading direction (right in RTL, left in LTR).
  // "end"   = trailing edge.
  const transform =
    position === "start"
      ? "perspective(1600px) rotateY(-20deg) translateX(-6%) scale(0.9)"
      : position === "end"
        ? "perspective(1600px) rotateY(20deg) translateX(6%) scale(0.9)"
        : "perspective(1600px) rotateY(0deg) scale(1)";

  return (
    <motion.article
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: isCenter ? 1 : 0.55 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={[
        "relative rounded-2xl border border-border/60 bg-card p-5 shadow-lg backdrop-blur-md",
        isCenter ? "z-20 w-[68%] shadow-2xl" : "z-10 w-[44%]",
      ].join(" ")}
    >
      {isCenter && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-primary/25"
        />
      )}

      <CardPreview project={project} index={index} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground md:text-base">
          {project.title.split("—")[0].trim()}
        </h3>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
          <CategoryIcon category={project.category} />
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{project.category}</p>

      {isCenter && (
        <>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {project.stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-foreground/80"
                dir="ltr"
              >
                {tech}
              </span>
            ))}
            <Link
              to="/work/$slug"
              params={{ slug: project.slug }}
              aria-label={`فتح مشروع ${project.title}`}
              className="ms-auto grid size-7 place-items-center rounded-full border border-border/60 bg-muted/40 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          </div>
        </>
      )}
    </motion.article>
  );
}

export function ProjectsShowcase3D() {
  const reduce = useReducedMotion();
  const featured = useMemo(
    () => projects.filter((p) => p.featured).slice(0, 6),
    [],
  );
  const [active, setActive] = useState(0);

  if (featured.length < 3) return null;

  const total = featured.length;
  const startIdx = (active - 1 + total) % total;
  const endIdx = (active + 1) % total;

  const trio = [
    { project: featured[startIdx], position: "start" as const, index: startIdx },
    { project: featured[active], position: "center" as const, index: active },
    { project: featured[endIdx], position: "end" as const, index: endIdx },
  ];

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + total) % total);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate w-full"
      aria-roledescription="عرض شرائح"
      aria-label="أحدث المشاريع"
    >
      {/* Eyebrow */}
      <div className="mb-6 flex items-center justify-end gap-2 pe-2 text-xs text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary" />
        <span>أحدث المشاريع</span>
      </div>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-linear-to-br from-primary/15 via-accent/10 to-transparent blur-3xl"
      />

      {/* Stage */}
      <div className="relative flex items-center justify-center">
        {/* Previous (start edge) — chevron points toward reading start */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="المشروع السابق"
          className="absolute start-0 z-30 grid size-9 place-items-center rounded-full border border-border/60 bg-card/80 text-foreground/80 backdrop-blur transition-colors hover:bg-card hover:text-foreground md:-start-4"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>

        <div className="flex w-full items-stretch justify-center px-8 [&>*:not(:first-child)]:-ms-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {trio.map((slot) => (
              <ProjectCard3D
                key={`${slot.position}-${slot.project.slug}`}
                project={slot.project}
                position={slot.position}
                index={slot.index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Next (end edge) */}
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="المشروع التالي"
          className="absolute end-0 z-30 grid size-9 place-items-center rounded-full border border-border/60 bg-card/80 text-foreground/80 backdrop-blur transition-colors hover:bg-card hover:text-foreground md:-end-4"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2" role="tablist">
        {featured.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-current={i === active ? "true" : undefined}
            onClick={() => setActive(i)}
            aria-label={`عرض المشروع ${i + 1}`}
            className={[
              "h-1.5 rounded-full transition-[width,background-color]",
              i === active
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/40",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        {featured[active]?.title}
      </div>
    </motion.div>
  );
}
