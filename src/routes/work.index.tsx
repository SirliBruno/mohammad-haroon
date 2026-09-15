import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Search, X, Sparkles, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Grid, EmptyState, DSButton, DSCard } from "@/components/ds";
import { type Project } from "@/features/projects/schema";
import { projects as staticProjects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { statusMeta } from "@/lib/project-status";
import { toProject } from "@/lib/project-adapter";
import {
  listPublicProjects,
  getProjectFacets,
} from "@/lib/cms/projects-public.functions";
import { usePageContent, getPageText } from "@/lib/cms/home-content";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";

const PAGE_SIZE = 6;
const CATEGORY_FILTERS = ["الكل", "أنظمة", "مواقع", "متاجر", "UI/UX", "هوية"] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export const Route = createFileRoute("/work/")({
  errorComponent: ({ reset }) => <RouteErrorBoundary reset={reset} eyebrow="المشاريع" />,
  notFoundComponent: () => <RouteNotFoundBoundary eyebrow="المشاريع" />,
  head: () => ({
    meta: buildMeta({
      title: "أعمالي | مشاريع وأنظمة رقمية",
      description:
        "مشاريع فعلية جمعت فيها بين التصميم، التطوير، وحل المشكلة — مواقع، أنظمة، ومتاجر إلكترونية.",
      path: "/work",
    }),
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  const listFn = useServerFn(listPublicProjects);
  const facetsFn = useServerFn(getProjectFacets);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("الكل");
  const [page, setPage] = useState(1);

  const facetsQ = useQuery({
    queryKey: ["work", "facets"],
    queryFn: () => facetsFn(),
    staleTime: 60_000,
  });

  const listQ = useQuery({
    queryKey: ["work", "list-all"],
    queryFn: () => listFn({ data: { limit: 100 } }),
    staleTime: 60_000,
  });

  const fromDb = (listQ.data?.rows ?? []).map(toProject);

  const allFiltered = useMemo(() => {
    const dbSlugs = new Set(fromDb.map((p) => p.slug));
    const merged = [...fromDb, ...staticProjects.filter((p) => !dbSlugs.has(p.slug))];

    return merged
      .filter((p) => {
        const matchCat =
          category === "الكل" ||
          p.category === category ||
          (category === "مواقع" && p.category === "مواقع إلكترونية") ||
          (category === "متاجر" && p.category === "تجارة إلكترونية") ||
          (category === "UI/UX" && p.category === "تصميم واجهات") ||
          (category === "هوية" && (p.category === "تصميم جرافيكي" || p.category === "هوية"));

        const matchQuery =
          !query.trim() ||
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.summary.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

        return matchCat && matchQuery;
      })
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }, [fromDb, category, query]);

  const total = allFiltered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const projectsToDisplay = allFiltered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const { data: workRows } = usePageContent("work");
  const tt = (k: string, fb: string) => getPageText(workRows, k, fb);

  return (
    <>
      <PageHeader
        eyebrow="أعمالي"
        title="مشاريع فعلية ذات أثر حقيقي"
        description="مجموعة مختارة من المواقع والأنظمة والمتاجر الإلكترونية التي صممتها وطورتها — من الفكرة إلى الإطلاق."
      />

      <Section className="border-t border-border/60">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              جميع المشاريع
            </h2>
            <div className="relative w-full md:max-w-sm">
              <Search
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="ابحث بالعنوان أو الوسم أو التقنية…"
                aria-label="ابحث في المشاريع"
                className="h-11 w-full rounded-2xl border border-border/80 bg-card pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                  aria-label="مسح البحث"
                  className="absolute left-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div
            role="radiogroup"
            aria-label="تصفية حسب الفئة"
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORY_FILTERS.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setCategory(c);
                    setPage(1);
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all",
                    active
                      ? "bg-foreground text-background shadow-xs"
                      : "border border-border/70 bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground" aria-live="polite">
            {total === 0
              ? "لا توجد مشاريع مطابقة للبحث."
              : `يظهر ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(
                  safePage * PAGE_SIZE,
                  total,
                )} من أصل ${total} مشروع`}
          </p>
        </div>

        <div className="mt-10">
          {total === 0 ? (
            <EmptyState
              title="لا توجد نتائج مطابقة"
              description="جرب البحث بكلمة أخرى، أو أعد ضبط الفلترة."
              action={
                <DSButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setCategory("الكل");
                    setPage(1);
                  }}
                >
                  إعادة الضبط
                </DSButton>
              }
            />
          ) : (
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
              {projectsToDisplay.map((p) => (
                <WorkProjectCard key={p.slug} project={p} />
              ))}
            </Grid>
          )}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="التنقل بين الصفحات"
            className="mt-12 flex items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="الصفحة السابقة"
              className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const active = n === safePage;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "min-w-9 rounded-xl px-3 py-1.5 text-xs font-semibold tabular-nums transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {n}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="الصفحة التالية"
              className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
          </nav>
        )}
      </Section>
    </>
  );
}

function WorkProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl h-full">
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        className="block aspect-[16/10] overflow-hidden bg-muted/40 relative"
      >
        {project.cover?.src ? (
          <img
            src={project.cover.src}
            alt={project.cover.alt || project.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/50">
            لا توجد صورة
          </div>
        )}
      </Link>
      
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="font-semibold text-accent">{project.category}</span>
          <span>{project.year}</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-foreground line-clamp-1">
          {project.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {project.summary}
        </p>

        {project.services && (
          <div className="mt-4 flex flex-wrap gap-1">
            {project.services.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground transition-colors hover:text-accent"
          >
            عرض المشروع
            <ArrowLeft className="size-3.5" />
          </Link>
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:text-foreground"
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
