import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Sparkles, ExternalLink, Layers, CheckCircle2, Pencil } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { smoothScrollTo } from "@/components/layout/smooth-scroll";
import { projects as staticProjects } from "@/data/projects";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI, StoreUI, EditorUI } from "@/components/mockups/ui-samples";
import { EditableText } from "@/features/live-edit/editable-text";
import { useLiveEdit } from "@/features/live-edit/live-edit-context";

const mockupBySlug: Record<string, React.ComponentType> = {
  campflow: DashboardUI,
  "haven-storefront": StoreUI,
  "meridian-agency": EditorUI,
};

export function FeaturedWork() {
  const { isEditMode, openDrawer } = useLiveEdit();

  const scrollToContact = () => {
    smoothScrollTo("#contact-form");
  };

  const campflow = staticProjects.find((p) => p.slug === "campflow") || staticProjects[0];
  const haven = staticProjects.find((p) => p.slug === "haven-storefront") || staticProjects[2];
  const meridian = staticProjects.find((p) => p.slug === "meridian-agency") || staticProjects[3];

  const curatedSecondaryProjects = [haven, meridian].filter(Boolean);

  return (
    <SectionReveal id="work" className="relative overflow-hidden border-t border-border/60 py-16 sm:py-24">
      <Container>
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-wider text-accent uppercase">
                <EditableText contentKey="home.work.badge" defaultText="أعمال مختارة" />
              </span>
              <EditableText
                as="h2"
                contentKey="home.work.title"
                defaultText="أعمالي"
                className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              />
              <EditableText
                as="p"
                contentKey="home.work.subtitle"
                multiline
                defaultText="مشاريع فعلية ونماذج عملية جمعت فيها بين التصميم، التطوير، وحل المشكلة."
                className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg"
              />
            </div>

            <Link
              to="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              <EditableText
                contentKey="home.work.all_link"
                defaultText="استكشف جميع الأعمال والدراسات"
              />
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
                    <BrowserFrame url="campflow.app">
                      <DashboardUI />
                    </BrowserFrame>
                  </Link>
                </div>

                {/* Info */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                          <Sparkles className="size-3.5" /> مشروع مميّز (Featured SaaS)
                        </span>
                        <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          SaaS / Web Application
                        </span>
                      </div>

                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => openDrawer("project", campflow.slug, campflow)}
                          className="inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/40 text-accent px-2 py-0.5 text-[11px] font-bold hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer shadow-xs"
                          title="تعديل تفاصيل هذا المشروع"
                        >
                          <Pencil className="size-3" />
                          <span>تعديل</span>
                        </button>
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      <EditableText
                        contentKey={`project.${campflow.slug}.title`}
                        defaultText={campflow.title}
                        groupName="projects"
                      />
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
                      <EditableText
                        contentKey={`project.${campflow.slug}.description`}
                        defaultText={campflow.description}
                        multiline
                        groupName="projects"
                      />
                    </p>

                    {campflow.services && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {campflow.services.map((svc) => (
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

                      <div className="flex items-center gap-2">
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => openDrawer("project", project.slug, project)}
                            className="inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/40 text-accent px-2 py-0.5 text-[11px] font-bold hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer shadow-xs"
                            title="تعديل تفاصيل هذا المشروع"
                          >
                            <Pencil className="size-3" />
                            <span>تعديل</span>
                          </button>
                        )}
                        <span>{project.year}</span>
                      </div>
                    </div>

                    <h3 className="mt-2.5 text-xl font-bold tracking-tight text-foreground">
                      <EditableText
                        contentKey={`project.${project.slug}.title`}
                        defaultText={project.title}
                        groupName="projects"
                      />
                    </h3>

                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                      <EditableText
                        contentKey={`project.${project.slug}.summary`}
                        defaultText={project.summary}
                        multiline
                        groupName="projects"
                      />
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
              شفت شغلي؟ عندك فكرة مشابهة؟
            </h3>
            <p className="text-sm text-foreground/80 max-w-md mx-auto leading-relaxed">
              أرسل فكرتك وسأساعدك في تحديد أنسب مسار لتنفيذها بأعلى كفاءة وبسعر عادل.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-95 hover:shadow-lg"
              >
                خلنا نبنيها
                <ArrowLeft className="size-4" />
              </button>

              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                استكشف جميع الأعمال
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionReveal>
  );
}
