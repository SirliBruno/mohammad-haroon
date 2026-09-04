import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { listIdeas } from "@/lib/cms/simple.functions";
import { Lightbulb, Tag } from "lucide-react";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";

export const Route = createFileRoute("/ideas")({
  errorComponent: ({ reset }) => <RouteErrorBoundary reset={reset} eyebrow="المختبر" />,
  notFoundComponent: () => <RouteNotFoundBoundary eyebrow="المختبر" />,
  head: () => ({
    meta: buildMeta({
      title: "مختبر الأفكار | محمد هارون",
      description: "مختبر لأفكار مستقبليّة، ونماذج أوّليّة، واستكشافات مفتوحة.",
      path: "/ideas",
    }),
  }),
  component: IdeasPage,
});

type Idea = {
  id: string;
  title: string;
  summary: string | null;
  stage: string | null;
  tags: string[] | null;
  created_at: string;
};

const STAGE_COLOR: Record<string, string> = {
  "بذرة": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "قيد التطوير": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "جاهزة": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

function IdeasPage() {
  const listFn = useServerFn(listIdeas);

  const q = useQuery({
    queryKey: ["public", "ideas"],
    queryFn: () => listFn({ data: { limit: 60, offset: 0 } }),
    staleTime: 60_000,
  });

  const rows = ((q.data as { rows?: Idea[] })?.rows ?? []) as Idea[];

  return (
    <>
      <PageHeader
        eyebrow="المختبر"
        title="الأفكار"
        description="أفكار مفتوحة ونماذج أولية واستكشافات — بعضها قيد التطوير وبعضها مجرد بذرة."
      />

      <Section>
        <Container>
          {q.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-2xl border border-border bg-muted animate-pulse" />
              ))}
            </div>
          ) : q.isError ? (
            <p className="text-sm text-red-600">تعذّر تحميل الأفكار. جرّب مجدداً.</p>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
              <Lightbulb className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">لا توجد أفكار منشورة حتى الآن. تابع قريباً!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((idea, i) => (
                <Reveal key={idea.id} delay={i * 0.04}>
                  <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug">{idea.title}</h3>
                      {idea.stage && (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STAGE_COLOR[idea.stage] ?? "bg-neutral-100 text-muted-foreground dark:bg-neutral-800"}`}
                        >
                          {idea.stage}
                        </span>
                      )}
                    </div>
                    {idea.summary && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {idea.summary}
                      </p>
                    )}
                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                        {idea.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
