import { useMemo, useState } from "react";
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
} from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/features/projects/schema";

// Icon per category — kept subtle, sits in a rounded chip
function CategoryIcon({ category }: { category: string }) {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    "مواقع إلكترونية": Globe,
    "تصميم واجهات": LayoutDashboard,
    "تجارة إلكترونية": ShoppingBag,
    "تصميم جرافيك": Palette,
    "تطبيقات": Smartphone,
    "تصوير": FileText,
  };
  const Icon = map[category] ?? LayoutDashboard;
  return <Icon className="size-4" />;
}

// Faux browser/dashboard preview surface inside each card
function CardPreview({ project, index }: { project: Project; index: number }) {
  // Vary preview style per index so the trio feels distinct like the reference
  const variant = index % 3;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-950 to-black">
      {/* traffic dots */}
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/20" />
      </div>

      {variant === 0 && (
        // Landing / hero mock
        <div className="grid h-[calc(100%-1.75rem)] grid-cols-5 gap-2 p-3">
          <div className="col-span-3 space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-white/25" />
            <div className="h-2 w-1/2 rounded-full bg-white/15" />
            <div className="mt-2 h-14 w-full rounded-md bg-linear-to-br from-primary/40 to-primary/10" />
            <div className="h-2 w-16 rounded-full bg-primary/70" />
          </div>
          <div className="col-span-2 rounded-md bg-white/5" />
        </div>
      )}

      {variant === 1 && (
        // Dashboard mock
        <div className="grid h-[calc(100%-1.75rem)] grid-cols-[28%_1fr] gap-1.5 p-2">
          <div className="space-y-1 rounded-md bg-white/[0.04] p-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-1.5 w-full rounded-full bg-white/10" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-md bg-white/[0.04] p-1.5">
                <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
                <div className="mt-1 h-4 w-2/3 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 2 && (
        // E-commerce grid mock
        <div className="grid h-[calc(100%-1.75rem)] grid-cols-3 gap-1.5 p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-white/10 bg-white/[0.03] p-1.5"
            >
              <div className="aspect-square rounded bg-linear-to-br from-white/10 to-white/[0.02]" />
              <div className="mt-1 h-1.5 w-3/4 rounded-full bg-white/15" />
              <div className="mt-1 h-1.5 w-1/2 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40"
      />
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
  position: "left" | "center" | "right";
  index: number;
}) {
  const isCenter = position === "center";

  const transform =
    position === "left"
      ? "perspective(1400px) rotateY(22deg) translateX(4%) scale(0.86)"
      : position === "right"
        ? "perspective(1400px) rotateY(-22deg) translateX(-4%) scale(0.86)"
        : "perspective(1400px) rotateY(0deg) scale(1)";

  return (
    <motion.article
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: isCenter ? 1 : 0.55 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={[
        "relative rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/90 p-4 shadow-2xl backdrop-blur-md",
        isCenter ? "z-20 w-[62%]" : "z-10 w-[38%] blur-[0.5px]",
      ].join(" ")}
      dir="rtl"
    >
      {/* Glow ring on center */}
      {isCenter && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-primary/25"
        />
      )}

      <CardPreview project={project} index={index} />

      {/* Body */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-white md:text-base">
          {project.title.split("—")[0].trim()}
        </h3>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
          <CategoryIcon category={project.category} />
        </span>
      </div>
      <p className="mt-1 text-[11px] text-white/50 md:text-xs">
        {project.category}
      </p>

      {isCenter && (
        <>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/70 md:text-sm">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {project.stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/80 md:text-xs"
              >
                {tech}
              </span>
            ))}
            <Link
              to="/work/$slug"
              params={{ slug: project.slug }}
              aria-label={`فتح مشروع ${project.title}`}
              className="mr-auto grid size-7 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </>
      )}
    </motion.article>
  );
}

export function ProjectsShowcase3D() {
  const reduce = useReducedMotion();
  const featured = useMemo(() => projects.filter((p) => p.featured).slice(0, 6), []);
  const [active, setActive] = useState(0);

  if (featured.length < 3) return null;

  const total = featured.length;
  const leftIdx = (active - 1 + total) % total;
  const rightIdx = (active + 1) % total;

  const trio = [
    { project: featured[leftIdx], position: "left" as const, index: leftIdx },
    { project: featured[active], position: "center" as const, index: active },
    { project: featured[rightIdx], position: "right" as const, index: rightIdx },
  ];

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + total) % total);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate w-full"
      dir="ltr"
    >
      {/* Section eyebrow — mimics the reference top-right pill */}
      <div className="mb-6 flex items-center justify-end gap-2 pr-2 text-xs text-white/70" dir="rtl">
        <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary.DEFAULT)]" />
        <span>أحدث المشاريع</span>
      </div>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-linear-to-br from-primary/20 via-accent/10 to-transparent blur-3xl"
      />

      {/* Stage */}
      <div className="relative flex items-center justify-center">
        {/* Prev */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="المشروع السابق"
          className="absolute left-0 z-30 grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white md:-left-4"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex w-full items-stretch justify-center gap-[-2%] px-8 [&>*:not(:first-child)]:-ml-6">
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

        {/* Next */}
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="المشروع التالي"
          className="absolute right-0 z-30 grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white md:-right-4"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {featured.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`عرض المشروع ${i + 1}`}
            className={[
              "h-1.5 rounded-full transition-all",
              i === active ? "w-6 bg-primary" : "w-1.5 bg-white/25 hover:bg-white/40",
            ].join(" ")}
          />
        ))}
      </div>
    </motion.div>
  );
}
