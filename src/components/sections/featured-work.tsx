import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Sparkles, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { smoothScrollTo } from "@/components/layout/smooth-scroll";
import { projects as staticProjects } from "@/data/projects";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI, StoreUI, EditorUI } from "@/components/mockups/ui-samples";
import { useHomeContent, getHomeText } from "@/lib/cms/home-content";
import { listPublicProjects } from "@/lib/cms/projects-public.functions";
import { toProject } from "@/lib/project-adapter";
import type { Project } from "@/features/projects/schema";

const mockupBySlug: Record<string, React.ComponentType> = {
  campflow: DashboardUI,
  "haven-storefront": StoreUI,
  "meridian-agency": EditorUI,
  "fitness-camp-management": DashboardUI,
  speakup: EditorUI,
  "rent-right": StoreUI,
};

export function FeaturedWork() {
  const scrollToContact = () => {
    smoothScrollTo("#contact-form");
  };

  const { data: homeContent } = useHomeContent();
  const t = (key: string, fallback: string) => getHomeText(homeContent, key, fallback);

  const fetchProjects = useServerFn(listPublicProjects);
  const { data: projectsData } = useQuery({
    queryKey: ["public-featured-projects"],
    queryFn: () => fetchProjects({ data: { featured: true, limit: 12 } }),
    staleTime: 60_000,
  });

  const allProjects: Project[] = useMemo(() => {
    if (projectsData?.rows && projectsData.rows.length > 0) {
      return projectsData.rows.map(toProject);
    }
    return staticProjects;
  }, [projectsData]);

  // Read custom overrides from CMS if configured in /admin/home
  const customFlagshipSlug = t("home.featured.flagship_slug", "").trim();
  const customSecondarySlugs = t("home.featured.secondary_slugs", "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const campflow: Project | undefined = useMemo(() => {
    if (customFlagshipSlug) {
      const found =
        allProjects.find((p) => p.slug === customFlagshipSlug) ||
        staticProjects.find((p) => p.slug === customFlagshipSlug);
      if (found) return found;
    }
    return allProjects.find((p) => p.featured) || allProjects[0] || staticProjects[0];
  }, [allProjects, customFlagshipSlug]);

  const curatedSecondaryProjects: Project[] = useMemo(() => {
    if (customSecondarySlugs.length > 0) {
      const list = customSecondarySlugs
        .map(
          (slug) =>
            allProjects.find((p) => p.slug === slug) ||
            staticProjects.find((p) => p.slug === slug),
        )
        .filter((p): p is Project => Boolean(p));
      if (list.length > 0) return list;
    }
    const remaining = allProjects.filter((p) => p.slug !== campflow?.slug);
    if (remaining.length >= 2) return remaining.slice(0, 2);
    return staticProjects.filter((p) => p.slug !== campflow?.slug).slice(0, 2);
  }, [allProjects, campflow, customSecondarySlugs]);

  return (
    <SectionReveal id="work" className="relative overflow-hidden border-t border-border/60 py-16 sm:py-24">
      <Container>
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-wider text-accent uppercase">
                {t("home.featured.eyebrow", "أعمال مختارة")}
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {t("home.featured.title", "أعمالي")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
                {t("home.featured.description", "مشاريع فعلية ونماذج عملية جمعت فيها بين التصميم، التطوير، وحل المشكلة.")}
              </p>
            </div>

            <Link
              to="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              {t("home.featured.view_all", "استكشف جميع الأعمال والدراسات")}
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </Reveal>

        {/* 1. Flagship Featured Project (CampFlow) */}
        {campflow && (
          <Reveal delay={0.08}>
            <div className="mt-12 overflow-hidden rounded-3xl border border-accent/30 bg-card p-6 sm:p-10 shadow-lg shadow-accent/5">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                {/* Visual Preview */}
                <div className="lg:col-span-7">
                  <Link
                    to="/work/$slug"
                    params={{ slug: campflow.slug }}
                    className="group block overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-md transition-transform duration-500 hover:-translate-y-1"
                  >
                    <BrowserFrame url={campflow.liveDemo ? campflow.liveDemo.replace(/^https?:\/\//, '') : `${campflow.slug}.app`}>
                      {campflow.cover?.src ? (
                        <img
                          src={campflow.cover.src}
                          alt={campflow.cover.alt || campflow.title}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <DashboardUI />
                      )}
                    </BrowserFrame>
                  </Link>
                </div>

                {/* Info */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                        <Sparkles className="size-3.5" /> مشروع مميّز (Featured)
                      </span>
                      {campflow.category && (
                        <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {campflow.category}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {campflow.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
                      {campflow.description || campflow.summary}
                    </p>

                    {(campflow.services || campflow.stack || campflow.tags) && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {(campflow.services || campflow.stack || campflow.tags).slice(0, 6).map((svc) => (
                          <span
                            key={svc}
                            className="rounded-md border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-foreground/90"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to="/work/$slug"
                      params={{ slug: campflow.slug }}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      عرض دراسة الحالة
                      <ArrowLeft className="size-4" />
                    </Link>
                    {campflow.liveDemo && (
                      <a
                        href={campflow.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        <ExternalLink className="size-4 text-muted-foreground" />
                        زيارة المنصة
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* 2 & 3: Best Store + Best Website */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {curatedSecondaryProjects.map((project, idx) => {
            const Mockup = mockupBySlug[project.slug] ?? StoreUI;
            const isStore = project.category === "متاجر";
            return (
              <Reveal key={project.slug} delay={0.12 + idx * 0.06}>
                <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl h-full">
                  <div>
                    {/* Thumbnail / Mockup Frame */}
                    <Link
                      to="/work/$slug"
                      params={{ slug: project.slug }}
                      className="block overflow-hidden rounded-xl border border-border/70 bg-muted/30 aspect-[16/10]"
                    >
                      {project.cover?.src ? (
                        <img
                          src={project.cover.src}
                          alt={project.cover.alt}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="size-full p-2 scale-95 transition-transform duration-500 group-hover:scale-100">
                          <Mockup />
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="mt-5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-accent">{project.category}</span>
                        <span className="rounded-md border border-border/80 bg-muted/70 px-2 py-0.5 text-[10px] text-muted-foreground">
                          {isStore ? "نموذج متجر متكامل" : "نموذج موقع وهوية"}
                        </span>
                      </div>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="mt-2.5 text-xl font-bold tracking-tight text-foreground">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Services / Tags */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {(project.services || project.tags).slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                    <Link
                      to="/work/$slug"
                      params={{ slug: project.slug }}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground transition-colors hover:text-accent"
                    >
                      عرض دراسة المشروع
                      <ArrowLeft className="size-3.5" />
                    </Link>

                    <Link
                      to="/work/$slug"
                      params={{ slug: project.slug }}
                      className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:text-foreground"
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Action Callout after Projects */}
        <Reveal delay={0.2}>
          <div className="mt-12 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-muted/30 to-card p-8 sm:p-10 text-center space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("home.featured.callout_title", "شفت شغلي؟ عندك فكرة مشابهة؟")}
            </h3>
            <p className="text-sm text-foreground/80 max-w-md mx-auto leading-relaxed">
              {t("home.featured.callout_description", "أرسل فكرتك وسأساعدك في تحديد أنسب مسار لتنفيذها بأعلى كفاءة وبسعر عادل.")}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-95 hover:shadow-lg"
              >
                {t("home.featured.callout_cta_primary", "خلنا نبنيها")}
                <ArrowLeft className="size-4" />
              </button>

              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {t("home.featured.callout_cta_secondary", "استكشف جميع الأعمال")}
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionReveal>
  );
}
