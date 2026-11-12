import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  X,
  Folder,
  FolderOpen,
  ArrowLeft,
  ArrowUpRight,
  Eye,
  Maximize2,
  Layers,
  CheckCircle2,
  Images,
  Instagram,
} from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { clientEntities, type ClientEntity, type DeliverableFolder, type DeliverableImage } from "@/data/client-works";
import { listClientWorksPublic, extractInstagramShortcode } from "@/lib/cms/client-works.functions";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/optimized-images";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";
import { EmptyState } from "@/components/ds/states";
import { DSButton } from "@/components/ds/button";

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
  loader: async () => {
    return await listClientWorksPublic();
  },
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
  const [activeGalleryEntity, setActiveGalleryEntity] = useState<ClientEntity | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
    title: string;
    type?: "image" | "instagram";
    shortcode?: string;
    instagramUrl?: string;
  } | null>(null);

  const loaderEntities = Route.useLoaderData();
  const fetchClientWorks = useServerFn(listClientWorksPublic);
  const { data: allEntities = loaderEntities } = useQuery({
    queryKey: ["client-works-public"],
    queryFn: () => fetchClientWorks(),
    initialData: loaderEntities,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const filteredEntities = useMemo(() => {
    return allEntities
      .filter((entity) => {
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
      })
      .sort((a, b) => {
        const aCount = a.totalFiles ?? a.folders.reduce((acc, f) => acc + f.images.length, 0);
        const bCount = b.totalFiles ?? b.folders.reduce((acc, f) => acc + f.images.length, 0);
        return bCount - aCount;
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
              : `يتم عرض ${filteredEntities.length} جهة عمل مصنفة من الأكثر ملفات إلى الأقل.`}
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
                onOpenFullGallery={(ent) => setActiveGalleryEntity(ent)}
                onOpenLightbox={(img, title) =>
                  setLightboxImage({
                    src: img.src,
                    alt: img.alt,
                    title,
                    type: img.type,
                    shortcode: img.shortcode || extractInstagramShortcode(img.src) || undefined,
                    instagramUrl: img.instagramUrl || img.src,
                  })
                }
              />
            ))
          )}
        </div>
      </Section>

      {/* Full Client Gallery Modal */}
      {activeGalleryEntity && (
        <FullGalleryModal
          entity={activeGalleryEntity}
          onClose={() => setActiveGalleryEntity(null)}
          onOpenLightbox={(img, title) =>
            setLightboxImage({
              src: img.src,
              alt: img.alt,
              title,
              type: img.type,
              shortcode: img.shortcode || extractInstagramShortcode(img.src) || undefined,
              instagramUrl: img.instagramUrl || img.src,
            })
          }
        />
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (() => {
        const isInstagram =
          lightboxImage.type === "instagram" ||
          Boolean(lightboxImage.shortcode) ||
          Boolean(extractInstagramShortcode(lightboxImage.src));
        const shortcode =
          lightboxImage.shortcode || extractInstagramShortcode(lightboxImage.src);

        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className={cn(
                "relative max-h-[90vh] w-full flex flex-col items-center",
                isInstagram ? "max-w-xl" : "max-w-5xl",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between text-white mb-3 px-2">
                <div className="flex items-center gap-2 truncate max-w-[75%]">
                  {isInstagram && (
                    <span className="rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1 shrink-0">
                      <Instagram className="size-3" />
                      <span>إنستغرام</span>
                    </span>
                  )}
                  <span className="text-sm font-medium truncate">{lightboxImage.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isInstagram && (
                    <a
                      href={lightboxImage.instagramUrl || lightboxImage.src}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-1 text-xs font-semibold transition-colors"
                    >
                      <Instagram className="size-3.5 text-pink-400" />
                      <span>فتح في التطبيق</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setLightboxImage(null)}
                    className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="إغلاق المعاينة"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 w-full flex items-center justify-center">
                {isInstagram && shortcode ? (
                  <iframe
                    src={`https://www.instagram.com/p/${shortcode}/embed/`}
                    className="w-full h-[620px] max-h-[75vh] border-0 rounded-2xl bg-neutral-950"
                    title={lightboxImage.title}
                    loading="lazy"
                    allowFullScreen
                    scrolling="no"
                  />
                ) : (
                  <img
                    src={getOptimizedImageUrl(lightboxImage.src)}
                    alt={lightboxImage.alt}
                    className="max-h-[80vh] w-auto object-contain rounded-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

function ClientEntityCard({
  entity,
  onOpenFullGallery,
  onOpenLightbox,
}: {
  entity: ClientEntity;
  onOpenFullGallery: (entity: ClientEntity) => void;
  onOpenLightbox: (img: DeliverableImage, title: string) => void;
}) {
  const [activeFolderId, setActiveFolderId] = useState<string>(() => {
    if (entity.cover) {
      const folderWithCover = entity.folders.find(
        (f) => f.cover === entity.cover || f.images.some((img) => img.src === entity.cover),
      );
      if (folderWithCover) return folderWithCover.id;
    }
    return entity.folders[0]?.id || "";
  });

  const activeFolder = useMemo(() => {
    return entity.folders.find((f) => f.id === activeFolderId) || entity.folders[0];
  }, [entity.folders, activeFolderId]);

  // Order images so that the folder cover (or entity cover if in this folder) is always first
  const images = useMemo(() => {
    if (!activeFolder?.images) return [];
    const targetCover = activeFolder.cover || (entity.folders[0]?.id === activeFolder.id ? entity.cover : undefined);
    if (!targetCover) return activeFolder.images;
    const coverImg = activeFolder.images.find((img) => img.src === targetCover);
    if (!coverImg) return activeFolder.images;
    const others = activeFolder.images.filter((img) => img.src !== targetCover);
    return [coverImg, ...others];
  }, [activeFolder, entity.cover]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Automatically reset to the cover image (index 0) whenever the active folder changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeFolderId]);

  const currentImage: DeliverableImage =
    images[activeImageIndex] ||
    (activeFolder?.cover ? { src: activeFolder.cover, alt: activeFolder.title } : undefined) ||
    images[0] ||
    { src: "", alt: activeFolder?.title || "" };
  const isInstagramCurrent =
    currentImage.type === "instagram" ||
    Boolean(currentImage.shortcode) ||
    Boolean(extractInstagramShortcode(currentImage.src));
  const currentShortcode =
    currentImage.shortcode || extractInstagramShortcode(currentImage.src);
  const currentInstagramUrl = currentImage.instagramUrl || currentImage.src;

  const totalFiles = entity.totalFiles ?? entity.folders.reduce((acc, f) => acc + f.images.length, 0);

  return (
    <article className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-foreground/30 shadow-xs">
      {/* Brand Header */}
      <div className="p-5 sm:p-7 border-b border-border/50 bg-muted/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                {totalFiles} ملف وتصميم
              </span>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {entity.tagline}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <button
              type="button"
              onClick={() => onOpenFullGallery(entity)}
              className="inline-flex items-center gap-2 text-xs font-bold text-background bg-foreground hover:bg-foreground/90 transition-all px-4 py-2.5 rounded-xl shadow-xs hover:scale-102 active:scale-98"
            >
              <Images className="size-4 text-accent" />
              <span>معرض التصاميم بالكامل ({totalFiles})</span>
            </button>

            <Link
              to="/work/$slug"
              params={{ slug: entity.mainSlug }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-card border border-border px-3 py-2.5 rounded-xl hover:border-foreground/30"
              title="عرض دراسة الحالة"
            >
              <span>دراسة الحالة</span>
              <ArrowLeft className="size-3" />
            </Link>
          </div>
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
            {isInstagramCurrent && currentShortcode ? (
              <div className="relative w-full rounded-2xl border border-pink-500/30 bg-neutral-950 overflow-hidden shadow-lg flex flex-col">
                {/* Instagram Header Banner */}
                <div className="px-4 py-2.5 bg-gradient-to-r from-purple-950/60 via-pink-950/40 to-neutral-900 border-b border-pink-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-1 text-white shadow-xs">
                      <Instagram className="size-3.5" />
                    </span>
                    <span className="font-bold text-foreground">منشور إنستغرام تفاعلي</span>
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      ({currentImage.alt || activeFolder.title})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={currentInstagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30 px-2.5 py-1 text-[11px] font-semibold transition-colors"
                    >
                      <span>فتح في التطبيق</span>
                      <ArrowUpRight className="size-3" />
                    </a>
                  </div>
                </div>

                {/* Embedded Iframe */}
                <div className="w-full flex justify-center bg-black/95 p-1 sm:p-2">
                  <iframe
                    src={`https://www.instagram.com/p/${currentShortcode}/embed/`}
                    className="w-full max-w-[540px] h-[520px] sm:h-[580px] border-0 rounded-xl bg-neutral-950"
                    title={currentImage.alt || activeFolder.title}
                    loading="lazy"
                    allowFullScreen
                    scrolling="no"
                  />
                </div>
              </div>
            ) : (
              <div
                className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/80 bg-neutral-900 cursor-pointer"
                onClick={() => onOpenLightbox(currentImage, `${entity.name} — ${activeFolder.title}`)}
              >
                <img
                  src={getOptimizedImageUrl(currentImage.src)}
                  alt={currentImage.alt || activeFolder.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-103"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <span className="text-xs text-white/90 font-medium truncate max-w-[70%]">
                    {currentImage.alt || activeFolder.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <Maximize2 className="size-3" />
                    تكبير الصورة
                  </span>
                </div>
              </div>
            )}

            {/* Thumbnail Gallery Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => {
                  const isSelected = idx === activeImageIndex;
                  const isInstagram =
                    img.type === "instagram" ||
                    Boolean(img.shortcode) ||
                    Boolean(extractInstagramShortcode(img.src));

                  return (
                    <button
                      key={img.src + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "relative aspect-[16/10] w-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border transition-all",
                        isSelected
                          ? isInstagram
                            ? "border-pink-500 ring-2 ring-pink-500/40 scale-102"
                            : "border-accent ring-2 ring-accent/40 scale-102"
                          : "border-border/60 opacity-60 hover:opacity-100 hover:border-foreground/30",
                      )}
                    >
                      {isInstagram ? (
                        <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-[#833ab4]/20 via-[#fd1d1d]/15 to-[#fcb045]/15 p-1 text-center">
                          <Instagram className="size-4 text-pink-500" />
                          <span className="text-[9px] font-bold text-foreground mt-0.5">إنستغرام</span>
                        </div>
                      ) : (
                        <img
                          src={getOptimizedImageUrl(img.src)}
                          alt={img.alt}
                          className="size-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      {isInstagram && (
                        <span className="absolute top-1 right-1 rounded-sm bg-gradient-to-tr from-[#f09433] to-[#bc1888] p-0.5 text-white shadow-xs">
                          <Instagram className="size-2.5" />
                        </span>
                      )}
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
              <button
                type="button"
                onClick={() => onOpenFullGallery(entity)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-accent transition-colors"
              >
                <Images className="size-3.5" />
                <span>فتح كامل المعرض</span>
              </button>

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

function FullGalleryModal({
  entity,
  onClose,
  onOpenLightbox,
}: {
  entity: ClientEntity;
  onClose: () => void;
  onOpenLightbox: (img: DeliverableImage, title: string) => void;
}) {
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>("all");

  const totalImages = useMemo(() => {
    return entity.folders.reduce((acc, f) => acc + f.images.length, 0);
  }, [entity.folders]);

  const displayedFolders = useMemo(() => {
    if (selectedFolderFilter === "all") return entity.folders;
    return entity.folders.filter((f) => f.id === selectedFolderFilter);
  }, [entity.folders, selectedFolderFilter]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl max-h-[92vh] w-full bg-card border border-border/80 rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border/60 bg-muted/20 flex flex-col gap-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  معرض أعمال: {entity.name}
                </h3>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {entity.categoryLabel}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                  {totalImages} ملف وتصميم
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                {entity.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background text-muted-foreground transition-colors shrink-0"
              aria-label="إغلاق المعرض"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Sub-Folders Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
            <button
              type="button"
              onClick={() => setSelectedFolderFilter("all")}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                selectedFolderFilter === "all"
                  ? "bg-foreground text-background shadow-xs"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <Layers className="size-3.5" />
              <span>جميع المجلدات ({entity.folders.length})</span>
            </button>

            {entity.folders.map((folder) => {
              const active = selectedFolderFilter === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolderFilter(folder.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all snap-start",
                    active
                      ? "bg-foreground text-background shadow-xs"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active ? (
                    <FolderOpen className="size-3.5 text-accent" />
                  ) : (
                    <Folder className="size-3.5" />
                  )}
                  <span>{folder.title}</span>
                  <span className="rounded-full bg-background/20 px-1.5 text-[10px]">
                    {folder.images.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-10 scrollbar-thin">
          {displayedFolders.map((folder) => {
            const sortedImages: DeliverableImage[] = folder.cover
              ? [
                  ...folder.images.filter((img) => img.src === folder.cover),
                  ...folder.images.filter((img) => img.src !== folder.cover),
                ]
              : folder.images;

            return (
              <section key={folder.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="size-4 text-accent" />
                    <h4 className="text-base sm:text-lg font-bold text-foreground">
                      {folder.title}
                    </h4>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {folder.images.length} صور
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {folder.summary}
                  </p>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedImages.map((img, idx) => {
                    const isCover = folder.cover === img.src;
                    const isInstagram =
                      img.type === "instagram" ||
                      Boolean(img.shortcode) ||
                      Boolean(extractInstagramShortcode(img.src));
                    const shortcode =
                      img.shortcode || extractInstagramShortcode(img.src);

                    return (
                      <div
                        key={img.src + idx}
                        className={cn(
                          "group relative aspect-[16/10] overflow-hidden rounded-2xl border transition-all cursor-pointer hover:shadow-md",
                          isInstagram
                            ? "border-pink-500/40 bg-pink-500/5 hover:border-pink-500"
                            : "border-border/80 bg-neutral-900 hover:border-accent",
                        )}
                        onClick={() =>
                          onOpenLightbox(
                            img,
                            `${entity.name} — ${folder.title} (${idx + 1}/${sortedImages.length})`,
                          )
                        }
                      >
                        {isInstagram ? (
                          <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-[#833ab4]/15 via-[#fd1d1d]/10 to-[#fcb045]/15 p-4 text-center">
                            <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md mb-2 transition-transform duration-300 group-hover:scale-110">
                              <Instagram className="size-5" />
                            </div>
                            <span className="text-xs font-bold text-foreground">
                              منشور إنستغرام تفاعلي
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 dir-ltr truncate max-w-[85%] font-mono">
                              {shortcode ? `/p/${shortcode}` : "منشور إنستغرام"}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={getOptimizedImageUrl(img.src)}
                            alt={img.alt || folder.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 pointer-events-none z-10">
                          <div className="flex items-center gap-1">
                            {isInstagram && (
                              <span className="rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                                <Instagram className="size-3" />
                                <span>إنستغرام</span>
                              </span>
                            )}
                          </div>
                          {isCover && (
                            <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground shadow-sm">
                              غلاف المجلد
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                          <span className="text-xs text-white/90 font-medium truncate max-w-[80%]">
                            {img.alt || folder.title}
                          </span>
                          <span className="grid size-7 place-items-center rounded-lg bg-black/60 text-white backdrop-blur-xs">
                            <Maximize2 className="size-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-border/60 bg-muted/20 flex items-center justify-between shrink-0">
          <Link
            to="/work/$slug"
            params={{ slug: entity.mainSlug }}
            className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-accent transition-colors"
          >
            <span>الانتقال لصفحة تفاصيل المشروع الكاملة</span>
            <ArrowLeft className="size-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            إغلاق المعرض
          </button>
        </div>
      </div>
    </div>
  );
}
