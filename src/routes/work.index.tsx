import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  X,
  Folder,
  FolderOpen,
  ArrowLeft,
  ArrowUpRight,
  Eye,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Maximize2,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { EmptyState, DSButton } from "@/components/ds";
import { clientEntities, type ClientEntity, type DeliverableFolder } from "@/data/client-works";
import { cn } from "@/lib/utils";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";

const CATEGORY_FILTERS = [
  "الكل",
  "هوية",
  "متاجر",
  "مواقع",
  "أنظمة",
  "مطبوعات",
  "تسويق",
] as const;

type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  "الكل": "جميع الأعمال",
  "هوية": "هوية وشعارات",
  "متاجر": "متاجر إلكترونية",
  "مواقع": "مواقع وتطبيقات",
  "أنظمة": "أنظمة ولوحات تحكم",
  "مطبوعات": "مطبوعات وتغليف",
  "تسويق": "إعلانات وسوشيال ميديا",
};

export const Route = createFileRoute("/work/")({
  errorComponent: ({ reset }) => <RouteErrorBoundary reset={reset} eyebrow="المشاريع" />,
  notFoundComponent: () => <RouteNotFoundBoundary eyebrow="المشاريع" />,
  head: () => ({
    meta: buildMeta({
      title: "أعمالي | مشاريع مصنفة حسب الجهات والعملاء",
      description:
        "استعرض مشاريعي السابقة مصنفة حسب اسم كل جهة وعميل مع مجلدات الهوية البصرية، البروفايل، تصاميم السوشيال ميديا، والمتاجر.",
      path: "/work",
    }),
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("الكل");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  const filteredEntities = useMemo(() => {
    return clientEntities.filter((entity) => {
      const matchCat =
        category === "الكل" ||
        entity.category === category ||
        entity.folders.some((f) => f.category === category);

      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        entity.name.toLowerCase().includes(q) ||
        entity.tagline.toLowerCase().includes(q) ||
        entity.description.toLowerCase().includes(q) ||
        entity.services.some((s) => s.toLowerCase().includes(q)) ||
        entity.folders.some(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.summary.toLowerCase().includes(q),
        );

      return matchCat && matchQuery;
    });
  }, [category, query]);

  const totalFolders = useMemo(() => {
    return filteredEntities.reduce((acc, curr) => acc + curr.folders.length, 0);
  }, [filteredEntities]);

  return (
    <>
      <PageHeader
        eyebrow="أعمالي وسجل المشاريع"
        title="أعمال مصنفة حسب الجهات والمجلدات"
        description="تصفح جميع أعمالي وتصاميمي السابقة مقسمة ومصنفة بحسب اسم كل جهة، مع إمكانية استعراض مجلدات الهوية البصرية، البروفايل، تصاميم السوشيال ميديا، والمتاجر الإلكترونية بكل سلاسة."
      />

      <Section className="border-t border-border/60">
        <div className="flex flex-col gap-6">
          {/* Search & Top Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                جهات العمل والمشاريع
              </h2>
              <span className="hidden sm:inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                {filteredEntities.length} جهة • {totalFolders} مجلد عمل
              </span>
            </div>

            <div className="relative w-full md:max-w-md">
              <Search
                aria-hidden
                className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث باسم الجهة، المشروع، أو نوع التصميم…"
                aria-label="ابحث في المشاريع والجهات"
                className="h-11 w-full rounded-2xl border border-border/80 bg-card pr-10 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="مسح البحث"
                  className="absolute left-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div
            role="radiogroup"
            aria-label="تصفية حسب نوع العمل"
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
                  onClick={() => setCategory(c)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all",
                    active
                      ? "bg-foreground text-background shadow-sm"
                      : "border border-border/70 bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {CATEGORY_LABELS[c]}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground" aria-live="polite">
            {filteredEntities.length === 0
              ? "لا توجد نتائج مطابقة لبحثك."
              : `يتم عرض ${filteredEntities.length} جهة عمل تحتوي على ${totalFolders} مجلد تصميم.`}
          </p>
        </div>

        {/* Client Entities List */}
        <div className="mt-8 space-y-10 sm:space-y-12">
          {filteredEntities.length === 0 ? (
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
                  }}
                >
                  إعادة الضبط
                </DSButton>
              }
            />
          ) : (
            filteredEntities.map((entity) => (
              <ClientEntityCard
                key={entity.id}
                entity={entity}
                onOpenLightbox={(img, title) =>
                  setLightboxImage({ src: img.src, alt: img.alt, title })
                }
              />
            ))
          )}
        </div>
      </Section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white mb-3 px-2">
              <span className="text-sm font-medium">{lightboxImage.title}</span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="إغلاق المعاينة"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="max-h-[80vh] w-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ClientEntityCard({
  entity,
  onOpenLightbox,
}: {
  entity: ClientEntity;
  onOpenLightbox: (img: { src: string; alt: string }, title: string) => void;
}) {
  const [activeFolderId, setActiveFolderId] = useState<string>(entity.folders[0]?.id || "");
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const activeFolder = useMemo(() => {
    return entity.folders.find((f) => f.id === activeFolderId) || entity.folders[0];
  }, [entity.folders, activeFolderId]);

  const images = activeFolder?.images || [];
  const currentImage = images[activeImageIndex] || images[0] || { src: activeFolder?.cover, alt: activeFolder?.title };

  return (
    <article className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-foreground/30 shadow-xs">
      {/* Brand Header */}
      <div className="p-5 sm:p-7 border-b border-border/50 bg-muted/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background font-bold text-lg shadow-sm">
              {entity.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {entity.name}
                </h3>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {entity.categoryLabel}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {entity.year}
                </span>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {entity.tagline}
              </p>
            </div>
          </div>

          {/* Quick Details link */}
          <Link
            to="/work/$slug"
            params={{ slug: entity.mainSlug }}
            className="inline-flex items-center gap-2 self-start md:self-center text-xs font-bold text-foreground hover:text-accent transition-colors bg-card border border-border px-3.5 py-2 rounded-xl"
          >
            <span>عرض دراسة الحالة</span>
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>

        {/* Deliverable Folders Navigation (Tabs) */}
        <div className="mt-6 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
            مجلدات وأقسام العمل للجهة:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {entity.folders.map((folder) => {
              const isActive = folder.id === activeFolder?.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => {
                    setActiveFolderId(folder.id);
                    setActiveImageIndex(0);
                  }}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all snap-start",
                    isActive
                      ? "bg-foreground text-background shadow-xs ring-2 ring-foreground/20"
                      : "border border-border/80 bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {isActive ? (
                    <FolderOpen className="size-3.5 text-accent" />
                  ) : (
                    <Folder className="size-3.5" />
                  )}
                  <span>{folder.title}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      isActive ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {folder.images.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Folder Content Canvas */}
      {activeFolder && (
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visual Display */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div
              className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/80 bg-neutral-900 cursor-pointer"
              onClick={() => onOpenLightbox(currentImage, `${entity.name} — ${activeFolder.title}`)}
            >
              <img
                src={currentImage.src}
                alt={currentImage.alt || activeFolder.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-103"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="text-xs text-white/90 font-medium">
                  {currentImage.alt || activeFolder.title}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  <Maximize2 className="size-3" />
                  تكبير الصورة
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => {
                  const isSelected = idx === activeImageIndex;
                  return (
                    <button
                      key={img.src + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "relative aspect-[16/10] w-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border transition-all",
                        isSelected
                          ? "border-accent ring-2 ring-accent/40 scale-102"
                          : "border-border/60 opacity-60 hover:opacity-100 hover:border-foreground/30",
                      )}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Folder Details & Scope */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <Layers className="size-3.5" />
                <span>تفاصيل المجلد: {activeFolder.title}</span>
              </div>

              <h4 className="mt-2 text-lg font-bold text-foreground">
                {activeFolder.summary}
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {entity.description}
              </p>

              <div className="mt-5 space-y-2">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  الخدمات المقدمة في هذا العمل:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {entity.services.map((srv) => (
                    <span
                      key={srv}
                      className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground"
                    >
                      <CheckCircle2 className="size-3 text-accent" />
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <Link
                to="/work/$slug"
                params={{ slug: entity.mainSlug }}
                className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-accent transition-colors"
              >
                <span>دراسة الحالة كاملة</span>
                <ArrowUpRight className="size-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => onOpenLightbox(currentImage, `${entity.name} — ${activeFolder.title}`)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eye className="size-3.5" />
                <span>معاينة مكبرة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
