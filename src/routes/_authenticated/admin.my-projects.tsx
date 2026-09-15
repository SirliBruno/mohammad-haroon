import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Upload, ExternalLink, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import { projects as staticProjects } from "@/data/projects";
import { createProject, adminListProjects } from "@/lib/cms/projects.functions";
import type { Project } from "@/features/projects/schema";

export const Route = createFileRoute("/_authenticated/admin/my-projects")({
  component: MyProjectsPage,
  head: () => ({ meta: [{ title: "استيراد أعمالي" }] }),
});

function buildPayload(p: Project) {
  return {
    slug: p.slug,
    title: p.title,
    summary: p.summary ?? "",
    description: p.description ?? p.summary ?? "",
    category: p.category ?? "هوية",
    year: p.year ?? new Date().getFullYear(),
    role: p.role ?? "",
    client: p.client ?? p.title,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timeline: (p as any).timeline ?? null,
    cover_url: p.cover?.src ?? null,
    live_url: p.liveDemo ?? p.liveUrl ?? null,
    github_url: p.github ?? null,
    status: "live" as const,
    content_status: "published" as const,
    featured: p.featured ?? false,
    sort_order: 0,
    tags: p.tags ?? [],
    technologies: p.technologies ?? p.stack ?? [],
    tools: p.tools ?? [],
    problem: p.problem ?? null,
    goals: [] as string[],
    research: null as string | null,
    solution: p.solution ?? null,
    design_process: null as string | null,
    development: null as string | null,
    lessons: [] as string[],
    highlights: (p.highlights ?? []) as string[],
    spotlight: null,
    metrics: [] as unknown[],
    gallery: (p.gallery ?? []).map((g) => ({ src: g.src, alt: g.alt })),
    testimonial: null,
    section_order: [] as string[],
  };
}

function StatusBadge({ status }: { status: "idle" | "loading" | "success" | "error" }) {
  if (status === "idle")
    return <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">لم يُرفع</span>;
  if (status === "loading")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-600 dark:text-blue-400">
        <Loader2 className="size-3 animate-spin" />جارٍ الرفع…
      </span>
    );
  if (status === "success")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
        <Check className="size-3" />تم الرفع
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] text-red-600 dark:text-red-400">
      <AlertCircle className="size-3" />خطأ
    </span>
  );
}

function MyProjectsPage() {
  const createFn = useServerFn(createProject);
  const listFn = useServerFn(adminListProjects);

  const { data: dbData, refetch } = useQuery({
    queryKey: ["admin", "my-projects", "db-slugs"],
    queryFn: () => listFn({ data: { limit: 200 } }),
    staleTime: 10_000,
  });

  const dbSlugs = new Set((dbData?.rows ?? []).map((r: { slug: string }) => r.slug));
  const [statuses, setStatuses] = useState<Record<string, "idle" | "loading" | "success" | "error">>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const uploadOne = async (p: Project) => {
    setStatuses((s) => ({ ...s, [p.slug]: "loading" }));
    try {
      await createFn({ data: buildPayload(p) as never });
      setStatuses((s) => ({ ...s, [p.slug]: "success" }));
      void refetch();
    } catch (e: unknown) {
      setStatuses((s) => ({ ...s, [p.slug]: "error" }));
      const msg = e instanceof Error ? e.message : String(e);
      setErrors((s) => ({ ...s, [p.slug]: msg }));
    }
  };

  const pendingCount = staticProjects.filter(
    (p) => !dbSlugs.has(p.slug) && statuses[p.slug] !== "success",
  ).length;

  const uploadAllMutation = useMutation({
    mutationFn: async () => {
      const pending = staticProjects.filter(
        (p) => !dbSlugs.has(p.slug) && statuses[p.slug] !== "success",
      );
      for (const p of pending) {
        await uploadOne(p);
        await new Promise((r) => setTimeout(r, 300));
      }
    },
  });

  return (
    <AdminShell
      title="استيراد أعمالي"
      description={"ارفع مشاريعك المحلية (" + String(staticProjects.length) + ") إلى قاعدة البيانات لتتمكن من تعديلها من لوحة الإدارة."}
      actions={
        <button
          type="button"
          disabled={pendingCount === 0 || uploadAllMutation.isPending}
          onClick={() => uploadAllMutation.mutate()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {uploadAllMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          رفع الكل ({pendingCount})
        </button>
      }
    >
      <div className="space-y-3">
        {staticProjects.map((p) => {
          const inDb = dbSlugs.has(p.slug);
          const status = inDb ? "success" : (statuses[p.slug] ?? "idle");
          const isDisabled = inDb || status === "loading" || status === "success";
          return (
            <div
              key={p.slug}
              className={cn(
                "flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors",
                status === "success" && "border-emerald-500/30 bg-emerald-500/5",
                status === "error" && "border-red-500/30 bg-red-500/5",
              )}
            >
              <div className="shrink-0">
                {p.cover?.src ? (
                  <img src={p.cover.src} alt={p.title} className="h-14 w-20 rounded-lg border border-border object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-border bg-muted">
                    <ImageIcon className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground truncate">{p.title}</span>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{p.category}</span>
                  <span className="text-[11px] text-muted-foreground">{p.year}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">{p.summary}</p>
                {errors[p.slug] && <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 line-clamp-1">{errors[p.slug]}</p>}
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <StatusBadge status={status} />
                  {(p.gallery?.length ?? 0) > 0 && <span className="text-[11px] text-muted-foreground">{p.gallery?.length} صور</span>}
                  <span className="text-[11px] text-muted-foreground font-mono" dir="ltr">/{p.slug}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a href={"/work/" + p.slug} target="_blank" rel="noreferrer" className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                  <ExternalLink className="size-3.5" />
                </a>
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => uploadOne(p)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  {status === "loading" ? <Loader2 className="size-3 animate-spin" /> : (status === "success" || inDb) ? <Check className="size-3" /> : <Upload className="size-3" />}
                  {(status === "success" || inDb) ? "مكتمل" : "رفع"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
