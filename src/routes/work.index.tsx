import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Search, X, ArrowLeft } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { EmptyState, DSButton } from "@/components/ds";
import { type Project } from "@/features/projects/schema";
import { projects as staticProjects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { toProject } from "@/lib/project-adapter";
import { listPublicProjects } from "@/lib/cms/projects-public.functions";
import { usePageContent, getPageText } from "@/lib/cms/home-content";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";

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

const CATEGORY_ORDER = ["متاجر", "هوية", "مواقع", "أنظمة"];

function WorkIndex() {
  const listFn = useServerFn(listPublicProjects);
  const [query, setQuery] = useState("");

  const listQ = useQuery({
    queryKey: ["work", "list", { query }],
    queryFn: () =>
      listFn({
        data: {
          limit: 100, // Fetch all available public DB projects
          search: query.trim() || undefined,
        },
      }),
    placeholderData: keepPreviousData,
  });

  const allCombined = useMemo(() => {
    const dbProjects = (listQ.data?.rows ?? []).map(toProject);
    const dbSlugs = new Set(dbProjects.map((p) => p.slug));
    const merged = [...dbProjects];

    staticProjects.forEach((sp) => {
      if (!dbSlugs.has(sp.slug)) {
        merged.push(sp);
      }
    });

    return merged.filter((p) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [listQ.data, query]);

  const groupedProjects = useMemo(() => {
    const groups: Record<string, Project[]> = {};
    allCombined.forEach((p) => {
      const cat = p.category || "أخرى";
      // Normalize similar categories
      const normalizedCat = 
        cat === "تجارة إلكترونية" ? "متاجر" :
        cat === "مواقع إلكترونية" ? "مواقع" :
        cat === "تصميم جرافيكي" ? "هوية" : cat;

      if (!groups[normalizedCat]) groups[normalizedCat] = [];
      groups[normalizedCat].push(p);
    });
    return groups;
  }, [allCombined]);

  const { data: workRows } = usePageContent("work");
  const tt = (k: string, fb: string) => getPageText(workRows, k, fb);

  const sortedCategories = Object.keys(groupedProjects).sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a);
    const idxB = CATEGORY_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <>
      <PageHeader
        eyebrow="أعمالي"
        title="مشاريع فعلية ذات أثر حقيقي"
        description="مجموعة مختارة من المواقع والأنظمة والمتاجر الإلكترونية التي صممتها وطورتها — من الفكرة إلى الإطلاق."
      />

      <Section className="border-t border-border/60 pb-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              جميع المشاريع
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              استكشف أعمالي السابقة وتصفح المشاريع في كل تصنيف.
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالعنوان أو الوسم..."
              aria-label="ابحث في المشاريع"
              className="h-11 w-full rounded-2xl border border-border/80 bg-card pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="مسح البحث"
                className="absolute left-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {allCombined.length === 0 ? (
          <EmptyState
            title="لا توجد نتائج مطابقة"
            description="جرب البحث بكلمة أخرى، أو أعد ضبط الفلترة."
            action={
              <DSButton variant="outline" size="sm" onClick={() => setQuery("")}>
                إعادة الضبط
              </DSButton>
            }
          />
        ) : (
          <div className="flex flex-col gap-16 md:gap-20">
            {sortedCategories.map((cat) => (
              <div key={cat} className="group/section">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                    مشاريع {cat}
                  </h3>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {groupedProjects[cat].length} مشروع
                  </span>
                </div>
                
                {/* Horizontal Carousel */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-2 hide-scrollbar">
                  {groupedProjects[cat].map((p) => (
                    <div 
                      key={p.slug} 
                      className="min-w-[85vw] sm:min-w-[340px] md:min-w-[380px] lg:min-w-[420px] snap-start shrink-0"
                    >
                      <WorkProjectCard project={p} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
