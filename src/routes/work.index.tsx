import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Grid, ProjectCard, EmptyState, DSButton } from "@/components/ds";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: buildMeta({
      title: "Projects",
      description:
        "Selected projects and case studies by Mohammad Haroon — SaaS, fintech, developer tools.",
      path: "/work",
    }),
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tags))).sort(),
    [],
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Selected work"
        description="A curated look at recent projects — the problem, the role I played, and what shipped."
      />
      <Section>
        {allTags.length ? (
          <div
            className="flex flex-wrap items-center gap-2"
            role="radiogroup"
            aria-label="Filter projects by tag"
          >
            <FilterChip
              active={activeTag === null}
              onClick={() => setActiveTag(null)}
            >
              All
            </FilterChip>
            {allTags.map((tag) => (
              <FilterChip
                key={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </FilterChip>
            ))}
          </div>
        ) : null}

        <div className="mt-10">
          {filtered.length === 0 ? (
            <EmptyState
              title="No projects match that filter"
              description="Try clearing the filter to see everything."
              action={
                <DSButton variant="outline" size="sm" onClick={() => setActiveTag(null)}>
                  Reset filter
                </DSButton>
              }
            />
          ) : (
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
              {filtered.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </Grid>
          )}
        </div>
      </Section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
