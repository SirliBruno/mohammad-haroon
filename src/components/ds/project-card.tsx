import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { DSCard } from "./card";
import { TagGroup } from "./tag";
import { cn } from "@/lib/utils";
import type { Project } from "@/features/projects/schema";

export function ProjectCard({
  project,
  className,
}: {
  project: Pick<Project, "slug" | "title" | "summary" | "year" | "tags" | "cover">;
  className?: string;
}) {
  return (
    <DSCard variant="surface" interactive padding="none" className={cn("overflow-hidden", className)}>
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {project.cover?.src ? (
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="size-full bg-linear-to-br from-muted to-secondary" />
          )}
        </div>
        <div className="flex items-start justify-between gap-4 p-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{project.year}</span>
              {project.tags.length ? <span aria-hidden>·</span> : null}
              <TagGroup items={project.tags.slice(0, 3)} />
            </div>
            <h3 className="mt-2 truncate text-base font-semibold tracking-tight text-foreground">
              {project.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
          </div>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-y-[-2px] rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
      </Link>
    </DSCard>
  );
}
