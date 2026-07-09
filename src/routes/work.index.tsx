import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Search, X, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Grid, EmptyState, DSButton, DSCard } from "@/components/ds";
import { projects } from "@/data/projects";
import { projectCategories, type Project, type ProjectCategory } from "@/features/projects/schema";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;
const CATEGORY_FILTERS = ["الكل", ...projectCategories] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: buildMeta({
      title: "المشاريع",
      description:
        "أعمال مختارة — مواقع، ومتاجر إلكترونيّة، وواجهات، وهويّات بصريّة، وحملات، وصور.",
      path: "/work",
    }),
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("الكل");
  const [page, setPage] = useState(1);

  const featured = useMemo(() => projects.filter((p) => p.featured), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== "الكل" && p.category !== category) return false;
      if (!q) return true;
      const hay = [
        p.title,
        p.summary,
        p.client ?? "",
        p.category,
        ...p.tags,
        ...p.stack,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, []);

  function updateQuery(v: string) {
    setQuery(v);
    setPage(1);
  }
  function updateCategory(v: CategoryFilter) {
    setCategory(v);
    setPage(1);
  }

  return (
    <>
      <PageHeader
        eyebrow="المشاريع"
        title="أعمال أفتخر بها"
        description="أرشيف حيّ لأعمالي مع العملاء ومشاريعي الخاصّة — منتجات، وتجارة إلكترونيّة، وهويّات، وصور."
      />

      {featured.length ? (
        <Section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.14em] text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" aria-hidden /> مميّز
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                أبرز الأعمال
              </h2>
            </div>
          </div>
          <div className="mt-8">
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
              {featured.slice(0, 3).map((p) => (
                <PremiumProjectCard key={p.slug} project={p} featured />
              ))}
            </Grid>
          </div>
        </Section>
      ) : null}

      <Section className="border-t border-border/60">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
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
                onChange={(e) => updateQuery(e.target.value)}
                placeholder="ابحث بالعنوان أو الوسم أو التقنيّة…"
                aria-label="ابحث في المشاريع"
                className="h-10 w-full rounded-full border border-border/60 bg-card pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => updateQuery("")}
                  aria-label="مسح البحث"
                  className="absolute left-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          <div
            role="radiogroup"
            aria-label="تصفية حسب الفئة"
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORY_FILTERS.map((c) => {
              const active = category === c;
              const count = c === "الكل" ? projects.length : categoryCounts.get(c) ?? 0;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => updateCategory(c)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-border/60 bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {c}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
                      active
                        ? "bg-background/15 text-background"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground" aria-live="polite">
            {filtered.length === 0
              ? "لا توجد مشاريع تُطابق الفلترة."
              : `يظهر ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(
                  safePage * PAGE_SIZE,
                  filtered.length,
                )} من أصل ${filtered.length}`}
          </p>
        </div>

        <div className="mt-8">
          {filtered.length === 0 ? (
            <EmptyState
              title="لا توجد مشاريع مطابقة"
              description="جرّب بحثًا مختلفًا أو أعد ضبط التصفية."
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
              {paginated.map((p) => (
                <PremiumProjectCard key={p.slug} project={p} />
              ))}
            </Grid>
          )}
        </div>

        {totalPages > 1 ? (
          <nav
            aria-label="التنقل بين الصفحات"
            className="mt-12 flex items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="الصفحة السابقة"
              className="grid size-9 place-items-center rounded-full border border-border/60 bg-card text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
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
                    "min-w-9 rounded-full px-3 py-1.5 text-xs font-medium tabular-nums transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "border border-border/60 bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
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
              className="grid size-9 place-items-center rounded-full border border-border/60 bg-card text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
          </nav>
        ) : null}
      </Section>
    </>
  );
}

function statusMeta(status: Project["status"]) {
  switch (status) {
    case "live":
      return { label: "منشور", dot: "bg-emerald-500" };
    case "in-progress":
      return { label: "قيد التنفيذ", dot: "bg-amber-500" };
    case "concept":
      return { label: "تصوّر", dot: "bg-sky-500" };
    case "archived":
      return { label: "مؤرشف", dot: "bg-muted-foreground" };
  }
}

function categoryGradient(category: ProjectCategory) {
  switch (category) {
    case "مواقع إلكترونية":
      return "from-sky-500/25 via-indigo-500/15 to-transparent";
    case "تجارة إلكترونية":
      return "from-emerald-500/25 via-teal-500/15 to-transparent";
    case "تصميم واجهات":
      return "from-fuchsia-500/25 via-purple-500/15 to-transparent";
    case "تصميم جرافيكي":
      return "from-orange-500/25 via-rose-500/15 to-transparent";
    case "تسويق":
      return "from-amber-500/25 via-yellow-500/15 to-transparent";
    case "تصوير":
      return "from-slate-500/25 via-zinc-500/15 to-transparent";
  }
}

function PremiumProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const status = statusMeta(project.status);
  return (
    <DSCard
      variant="surface"
      interactive
      padding="none"
      className="group relative overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:border-foreground/20 hover:shadow-xl motion-safe:hover:-translate-y-1"
    >
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        className="block focus-visible:outline-none"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {project.cover?.src ? (
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className={cn(
                "relative size-full bg-linear-to-br",
                categoryGradient(project.category),
              )}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.08) 1px, transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-4xl font-semibold tracking-tight text-foreground/80 md:text-5xl">
                  {project.title.split(" — ")[0]}
                </span>
              </div>
            </div>
          )}

          {/* Overlay gradient on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* Top-left: category */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-medium tracking-wider text-foreground backdrop-blur">
              {project.category}
            </span>
            {featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium tracking-wider text-primary backdrop-blur">
                <Sparkles className="size-3" /> مميّز
              </span>
            ) : null}
          </div>

          {/* Top-right: status */}
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur">
              <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden />
              {status.label}
            </span>
          </div>

          {/* Arrow */}
          <div className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full border border-border/60 bg-background/90 text-foreground opacity-0 backdrop-blur transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 motion-safe:translate-y-2 motion-safe:group-hover:translate-y-0">
            <ArrowUpRight className="size-4" />
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="tabular-nums">{project.year}</span>
            {project.client ? (
              <>
                <span aria-hidden>·</span>
                <span className="truncate">{project.client}</span>
              </>
            ) : null}
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {project.summary}
          </p>

          {project.tags.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {project.stack.length ? (
            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-4">
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
                التقنيات
              </span>
              {project.stack.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-border/60 bg-card px-1.5 py-0.5 text-[10px] font-medium text-foreground/70"
                >
                  {s}
                </span>
              ))}
              {project.stack.length > 4 ? (
                <span className="text-[10px] text-muted-foreground">
                  +{project.stack.length - 4}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>
    </DSCard>
  );
}
