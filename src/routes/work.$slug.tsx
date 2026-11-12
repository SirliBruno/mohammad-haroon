import { Link, createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  ExternalLink,
  Github,
  Layers,
  Sparkles,
  Tag,
  Target,
  User,
  Wrench,
  HelpCircle,
  Lightbulb,
  Award,
} from "lucide-react";
import { useEffect } from "react";
import { buildMeta } from "@/features/seo/build-meta";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
import { Reveal } from "@/components/motion/reveal";
import { DSButton, Grid, TagGroup } from "@/components/ds";
import { MarqueeGallery } from "@/components/ds/marquee-gallery";
import type { Project } from "@/features/projects/schema";
import { projects as staticProjects } from "@/data/projects";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { statusMeta } from "@/lib/project-status";
import { getOptimizedImageUrl } from "@/lib/optimized-images";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI, StoreUI, EditorUI } from "@/components/mockups/ui-samples";
import {
  getPublicProjectBySlug,
  listPublicProjects,
} from "@/lib/cms/projects-public.functions";
import { toProject } from "@/lib/project-adapter";

const mockupBySlug: Record<string, React.ComponentType> = {
  campflow: DashboardUI,
  "northwind-analytics": DashboardUI,
  "haven-storefront": StoreUI,
  "meridian-agency": EditorUI,
  "sable-restaurant": StoreUI,
  "orbit-apparel": StoreUI,
};

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    let project: Project | null = null;
    try {
      const row = await getPublicProjectBySlug({ data: { slug: params.slug } });
      if (row) {
        project = toProject(row);
      }
    } catch {
      // ignore db error, fallback to static
    }

    if (!project) {
      project = staticProjects.find((p) => p.slug === params.slug) ?? null;
    }

    if (!project) throw notFound();

    // Enrich with dynamic client works data if customized via admin dashboard
    try {
      const { listClientWorksPublic } = await import("@/lib/cms/client-works.functions");
      const clientWorks = await listClientWorksPublic();
      const clientWork = clientWorks.find(
        (cw) => cw.id === params.slug || cw.mainSlug === params.slug,
      );
      if (clientWork && clientWork.folders.length > 0) {
        const primaryFolder = clientWork.folders[0];
        const validCover = [
          clientWork.cover,
          primaryFolder?.cover,
          ...clientWork.folders.flatMap((f) => f.images.map((img) => img.src)),
        ].find((src) => src && !src.includes("instagram.com"));

        const allImages = clientWork.folders.flatMap((f) =>
          f.images
            .filter((img) => img.type !== "instagram" && !img.src.includes("instagram.com"))
            .map((img) => ({
              src: getOptimizedImageUrl(img.src),
              alt: img.alt || f.title,
            })),
        );
        project = {
          ...project,
          title: clientWork.name || project.title,
          cover: validCover ? { src: getOptimizedImageUrl(validCover), alt: project.title } : project.cover,
          gallery: allImages.length > 0 ? allImages : project.gallery,
        };
      }
    } catch {
      // fallback to original project
    }

    const related = staticProjects
      .filter((p) => p.slug !== project?.slug && (p.category === project?.category || p.featured))
      .slice(0, 3);

    const currentIndex = staticProjects.findIndex((p) => p.slug === project?.slug);
    const next =
      staticProjects.length > 0
        ? staticProjects[(currentIndex + 1) % staticProjects.length] ?? null
        : null;

    return { project, related, next };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: buildMeta({
          title: "المشروع غير موجود",
          path: `/work/${params.slug}`,
          noindex: true,
        }),
      };
    }
    const { project } = loaderData;
    return {
      meta: buildMeta({
        title: `${project.title} | دراسة حالة`,
        description: project.summary,
        path: `/work/${project.slug}`,
        type: "article",
        image: project.cover?.src || undefined,
      }),
      links: [{ rel: "canonical", href: `/work/${project.slug}` }],
    };
  },
  notFoundComponent: ProjectNotFound,
  errorComponent: ProjectError,
  component: CaseStudy,
});

function CaseStudy() {
  const { project, related, next } = Route.useLoaderData() as {
    project: Project;
    related: Project[];
    next: Project | null;
  };
  const status = statusMeta(project.status);
  const Mockup = mockupBySlug[project.slug] ?? DashboardUI;

  return (
    <>
      {/* 1. Project Hero */}
      <header className="relative overflow-hidden border-b border-border/60 pt-28 pb-16 md:pt-36 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-accent/5 via-transparent to-transparent"
        />
        <Container>
          <nav aria-label="مسار التنقل" className="text-sm text-muted-foreground">
            <Link to="/work" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <ArrowRight className="size-3.5" /> جميع المشاريع
            </Link>
          </nav>

          <Reveal>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-semibold text-accent backdrop-blur">
                {project.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden />
                {status.label}
              </span>
              {project.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent backdrop-blur">
                  <Sparkles className="size-3" /> مميّز
                </span>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 max-w-3xl text-base text-muted-foreground leading-relaxed sm:text-lg">
              {project.summary}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90"
                >
                  زيارة المشروع
                  <ExternalLink className="size-4" />
                </a>
              )}
              <a
                href="/#contact-form"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                عندك مشروع مشابه؟ ابدأ الآن
                <ArrowLeft className="size-4" />
              </a>
            </div>
          </Reveal>
        </Container>
      </header>

      {/* Main Visual / Cover */}
      <Section className="pt-10 md:pt-14">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20 shadow-xl">
            {project.cover?.src ? (
              <img
                src={project.cover.src}
                alt={project.cover.alt}
                className="size-full object-cover"
                loading="lazy"
              />
            ) : (
              <BrowserFrame url={project.liveDemo ? new URL(project.liveDemo).host : `${project.slug}.app`}>
                <Mockup />
              </BrowserFrame>
            )}
          </div>
        </Reveal>
      </Section>

      {/* Case Study Content Grid */}
      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-16">
            {/* Overview */}
            <Reveal>
              <div>
                <SectionTitle eyebrow="نظرة عامة" title="عن المشروع" size="sm" />
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-foreground/85">
                  {project.description}
                </p>
              </div>
            </Reveal>

            {/* 2. المشكلة (Problem / Challenge) */}
            {(project.problem || project.challenge) && (
              <Reveal>
                <div className="rounded-2xl border border-border/70 bg-card p-7 sm:p-8">
                  <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
                    <HelpCircle className="size-4" />
                    المشكلة والتحدي
                  </div>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                    ما المشكلة التي كان المشروع يحلها؟
                  </h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/80">
                    {project.problem || project.challenge}
                  </p>
                </div>
              </Reveal>
            )}

            {/* 3. الحل (Solution) */}
            {project.solution && (
              <Reveal>
                <div className="rounded-2xl border border-accent/30 bg-accent/5 p-7 sm:p-8">
                  <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
                    <Lightbulb className="size-4" />
                    الحل البرمجي والتصميمي
                  </div>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                    كيف تم تحويل المشكلة إلى منتج رقمي؟
                  </h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                    {project.solution}
                  </p>
                </div>
              </Reveal>
            )}

            {/* 4. ما تم تنفيذه (Executed Services Cards) */}
            {(project.services || project.highlights) && (
              <Reveal>
                <div>
                  <SectionTitle eyebrow="التنفيذ" title="ما تم تنفيذه في المشروع" size="sm" />
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(project.services ?? ["UI/UX", "Frontend", "Backend", "Database", "Dashboard", "Authentication"]).map((svc) => (
                      <div
                        key={svc}
                        className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-4 text-sm font-semibold text-foreground shadow-2xs"
                      >
                        <CheckCircle2 className="size-4 text-accent shrink-0" />
                        <span>{svc}</span>
                      </div>
                    ))}
                  </div>

                  {project.highlights && (
                    <ul className="mt-6 space-y-2.5">
                      {project.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            )}

            {/* 5. Screenshots / Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <Reveal>
                <div>
                  <SectionTitle eyebrow="المعرض" title="شاشات وواجهات المشروع" size="sm" />
                  <div className="mt-6">
                    <MarqueeGallery items={project.gallery} />
                  </div>
                </div>
              </Reveal>
            )}

            {/* 6. النتيجة (Result / Metrics) */}
            {(project.result || (project.metrics && project.metrics.length > 0)) && (
              <Reveal>
                <div>
                  <SectionTitle eyebrow="النتائج والأثر" title="ما تم تحقيقه بالأرقام" size="sm" />
                  {project.result && (
                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/80">
                      {project.result}
                    </p>
                  )}
                  {project.metrics && (
                    <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="rounded-2xl border border-border/70 bg-card p-5">
                          <dt className="text-xs text-muted-foreground">{m.label}</dt>
                          <dd className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-accent">
                            {m.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </Reveal>
            )}

            {/* Stack Tags */}
            {project.stack && project.stack.length > 0 && (
              <Reveal>
                <div className="border-t border-border/60 pt-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    التقنيات المستخدمة
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <li
                        key={s}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
                      >
                        <Layers className="size-3 text-accent" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {/* 7. Case Study CTA Banner */}
            <Reveal>
              <div className="rounded-3xl border border-accent/40 bg-linear-to-br from-card via-muted/30 to-accent/10 p-8 sm:p-10 text-center space-y-4">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-accent">
                  <Sparkles className="size-3.5" /> هل تبحث عن نتيجة مشابهة؟
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  عندك مشروع مشابه؟
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  دعنا نناقش فكرتك ونحولها إلى نظام أو موقع متكامل يحقق أهدافك بأعلى جودة.
                </p>
                <div className="pt-2">
                  <a
                    href="/#contact-form"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-opacity hover:opacity-90"
                  >
                    ابدأ مشروعك الآن
                    <ArrowLeft className="size-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                بطاقة المشروع
              </p>

              <dl className="mt-5 space-y-4 text-xs sm:text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">التصنيف</dt>
                  <dd className="mt-1 font-semibold text-foreground">{project.category}</dd>
                </div>

                {project.timeline && (
                  <div>
                    <dt className="text-xs text-muted-foreground">المدة الزمنية</dt>
                    <dd className="mt-1 font-semibold text-foreground">{project.timeline}</dd>
                  </div>
                )}

                <div>
                  <dt className="text-xs text-muted-foreground">الدور</dt>
                  <dd className="mt-1 font-semibold text-foreground">{project.role}</dd>
                </div>

                {project.client && (
                  <div>
                    <dt className="text-xs text-muted-foreground">العميل</dt>
                    <dd className="mt-1 font-semibold text-foreground">{project.client}</dd>
                  </div>
                )}

                <div>
                  <dt className="text-xs text-muted-foreground">السنة</dt>
                  <dd className="mt-1 font-semibold text-foreground">{project.year}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-border/60 pt-6 space-y-2.5">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
                  >
                    <ExternalLink className="size-3.5" />
                    زيارة المشروع الحقيقي
                  </a>
                )}
                <a
                  href="/#contact-form"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  طلب مشروع مشابه
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Related Projects */}
      {related.length > 0 && (
        <Section className="border-t border-border/60">
          <SectionTitle eyebrow="مشاريع أخرى" title="شاهد أيضًا" size="sm" />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/work/$slug"
                params={{ slug: p.slug }}
                className="group block rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"
              >
                <span className="text-[11px] font-semibold text-accent">{p.category}</span>
                <h4 className="mt-1 text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  {p.title}
                </h4>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{p.summary}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function ProjectNotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-md text-center py-16">
        <p className="text-xs font-semibold tracking-wider text-accent uppercase">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">لم نعثر على هذا المشروع</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          المشروع الذي تبحث عنه غير متاح حاليًا أو تم نقله.
        </p>
        <div className="mt-6">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            العودة لجميع المشاريع
          </Link>
        </div>
      </div>
    </Section>
  );
}

function ProjectError({ reset }: ErrorComponentProps) {
  return (
    <Section>
      <div className="mx-auto max-w-md text-center py-16">
        <h1 className="text-xl font-bold text-foreground">تعذّر تحميل دراسة الحالة</h1>
        <p className="mt-2 text-sm text-muted-foreground">حاول مرة أخرى أو ارجع إلى المشاريع.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            إعادة المحاولة
          </button>
          <Link
            to="/work"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            جميع المشاريع
          </Link>
        </div>
      </div>
    </Section>
  );
}
