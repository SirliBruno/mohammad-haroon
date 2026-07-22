import { Link, createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  ExternalLink,
  Github,
  Layers,
  Quote,
  Sparkles,
  Tag,
  Target,
  User,
  Wrench,
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
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { statusMeta } from "@/lib/project-status";
import { toProject } from "@/lib/project-adapter";
import { normalizeSectionOrder, type ProjectSectionKey } from "@/lib/project-sections";
import {
  getPublicProjectBySlug,
  listPublicProjects,
} from "@/lib/cms/projects-public.functions";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const row = await getPublicProjectBySlug({ data: { slug: params.slug } });
    if (!row) throw notFound();
    const project = toProject(row);
    const [relatedRes, siblingsRes] = await Promise.all([
      listPublicProjects({ data: { category: project.category, limit: 4 } }),
      listPublicProjects({ data: { limit: 12 } }),
    ]);
    const related = relatedRes.rows
      .filter((r) => r.slug !== project.slug)
      .slice(0, 3)
      .map(toProject);
    const siblings = siblingsRes.rows.map(toProject);
    const currentIndex = siblings.findIndex((p) => p.slug === project.slug);
    const next = siblings.length
      ? siblings[(currentIndex + 1) % siblings.length] ?? null
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
        title: project.title,
        description: project.summary,
        path: `/work/${project.slug}`,
        type: "article",
        image: project.cover?.src || undefined,
      }),
      links: [{ rel: "canonical", href: `/work/${project.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.summary,
            author: { "@type": "Person", name: site.name },
            datePublished: String(project.year),
          }),
        },
      ],
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


  return (
    <>
      <header className="relative overflow-hidden border-b border-border/60 pt-28 pb-16 md:pt-36 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-primary/5 via-transparent to-transparent"
        />
        <Container>
          <nav aria-label="مسار التنقل" className="text-sm text-muted-foreground">
            <Link to="/work" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowRight className="size-3.5" /> جميع المشاريع
            </Link>
          </nav>
          <Reveal>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-medium tracking-wider text-foreground backdrop-blur">
                {project.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur">
                <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden />
                {status.label}
              </span>
              {project.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium tracking-wider text-primary backdrop-blur">
                  <Sparkles className="size-3" /> مميّز
                </span>
              ) : null}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {project.summary}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveDemo ? (
                <DSButton asChild size="lg">
                  <a href={project.liveDemo} target="_blank" rel="noreferrer">
                    عرض مباشر <ExternalLink />
                  </a>
                </DSButton>
              ) : null}
              {project.github ? (
                <DSButton asChild size="lg" variant="outline">
                  <a href={project.github} target="_blank" rel="noreferrer">
                    <Github /> الكود المصدري
                  </a>
                </DSButton>
              ) : null}
              <DSButton asChild size="lg" variant="ghost">
                <Link to="/contact">
                  ابدأ مشروعك <ArrowLeft />
                </Link>
              </DSButton>
            </div>
          </Reveal>
        </Container>
      </header>

      <Section className="pt-12 md:pt-16">
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/10 via-card to-accent/10">
            {project.cover?.src ? (
              <img src={project.cover.src} alt={project.cover.alt} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center">
                <span className="text-5xl font-semibold tracking-tight text-foreground/80 md:text-6xl">
                  {project.title.split(" — ")[0]}
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-16">
            <Reveal>
              <SectionHeading eyebrow="نظرة عامة" title="المشروع في لمحة" />
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85">
                {project.description}
              </p>
            </Reveal>

            {normalizeSectionOrder(project.sectionOrder).map((key) => (
              <SectionByKey key={key} sectionKey={key} project={project} />
            ))}

            {project.tags.length ? (
              <Reveal>
                <div className="pt-2">
                  <TagGroup items={project.tags} />
                </div>
              </Reveal>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-xs font-medium tracking-wider text-muted-foreground">تفاصيل المشروع</p>
              <dl className="mt-5 space-y-5 text-sm">
                {project.timeline ? (
                  <SidebarRow icon={Calendar} label="المدة الزمنية" value={project.timeline} />
                ) : null}
                <SidebarRow icon={User} label="الدور" value={project.role} />
                {project.client ? (
                  <SidebarRow icon={User} label="العميل" value={project.client} />
                ) : null}
                <SidebarRow icon={Tag} label="الفئة" value={project.category} />
                <SidebarRow icon={Calendar} label="السنة" value={String(project.year)} />
                {project.tools && project.tools.length ? (
                  <div>
                    <dt className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground">
                      <Wrench className="size-3.5" aria-hidden /> الأدوات
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {project.tools.map((t) => (
                        <span key={t} className="rounded-md border border-border/60 bg-background px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {(project.liveDemo || project.github) ? (
                <div className="mt-6 space-y-2 border-t border-border/60 pt-6">
                  {project.liveDemo ? (
                    <DSButton asChild className="w-full" size="sm">
                      <a href={project.liveDemo} target="_blank" rel="noreferrer">
                        <ExternalLink /> عرض مباشر
                      </a>
                    </DSButton>
                  ) : null}
                  {project.github ? (
                    <DSButton asChild className="w-full" size="sm" variant="outline">
                      <a href={project.github} target="_blank" rel="noreferrer">
                        <Github /> عرض الكود المصدري
                      </a>
                    </DSButton>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 border-t border-border/60 pt-6">
                <DSButton asChild className="w-full" size="sm" variant="ghost">
                  <Link to="/contact">
                    ابدأ مشروعًا <ArrowLeft />
                  </Link>
                </DSButton>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {related.length ? (
        <Section className="border-t border-border/60">
          <SectionHeading eyebrow="مشاريع مشابهة" title={`المزيد من أعمال ${project.category}`} />
          <div className="mt-8">
            <Grid cols={{ base: 1, md: related.length === 2 ? 2 : 3 }} gap="md">
              {related.map((p) => (
                <RelatedCard key={p.slug} project={p} />
              ))}
            </Grid>
          </div>
        </Section>
      ) : null}

      {next && next.slug !== project.slug ? (
        <Section className="border-t border-border/60">
          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="group block overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg md:p-12"
          >
            <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
              المشروع التالي
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-6">
              <div className="min-w-0">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {next.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{next.summary}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-transform group-hover:-translate-x-1">
                متابعة <ArrowLeft className="size-4" />
              </span>
            </div>
          </Link>
        </Section>
      ) : null}
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <SectionTitle eyebrow={eyebrow} title={title} size="sm" />;
}

function SidebarRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground">
        <Icon className="size-3.5" aria-hidden /> {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function RelatedCard({ project }: { project: Project }) {
  return (
    <Link
      to="/work/$slug"
      params={{ slug: project.slug }}
      className="group block overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-linear-to-br from-primary/10 via-muted to-accent/10">
        {project.cover?.src ? (
          <img src={project.cover.src} alt={project.cover.alt} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="grid size-full place-items-center">
            <span className="text-2xl font-semibold tracking-tight text-foreground/70">
              {project.title.split(" — ")[0]}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-muted-foreground">{project.category} · {project.year}</p>
        <h3 className="mt-1 flex items-start justify-between gap-3 text-base font-semibold tracking-tight text-foreground">
          <span className="line-clamp-1">{project.title}</span>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:text-foreground" />
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
      </div>
    </Link>
  );
}

function SectionByKey({ sectionKey, project }: { sectionKey: ProjectSectionKey; project: Project }) {
  switch (sectionKey) {
    case "spotlight":
      return project.spotlight ? (
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-primary/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" aria-hidden /> ميزة مميّزة
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {project.spotlight.title}
              </h3>
              <p className="mt-4 max-w-2xl whitespace-pre-line text-base leading-relaxed text-foreground/85 sm:text-lg">
                {project.spotlight.description}
              </p>
            </div>
          </div>
        </Reveal>
      ) : null;
    case "problem":
      return project.problem ? (
        <Reveal>
          <SectionHeading eyebrow="المشكلة" title="ما الذي كان يستدعي التغيير" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">{project.problem}</p>
        </Reveal>
      ) : null;
    case "goals":
      return project.goals && project.goals.length ? (
        <Reveal>
          <SectionHeading eyebrow="الأهداف" title="ما سعينا لتحقيقه" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.goals.map((g) => (
              <li key={g} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Target className="size-3.5" aria-hidden />
                </span>
                <span className="text-sm text-foreground/85">{g}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null;
    case "research":
      return project.research ? (
        <Reveal>
          <SectionHeading eyebrow="البحث" title="ما تعلّمناه أولًا" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">{project.research}</p>
        </Reveal>
      ) : null;
    case "solution":
      return project.solution ? (
        <Reveal>
          <SectionHeading eyebrow="الحل" title="كيف تعاملنا مع المشكلة" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">{project.solution}</p>
        </Reveal>
      ) : null;
    case "designProcess":
      return project.designProcess && project.designProcess.length ? (
        <Reveal>
          <SectionHeading eyebrow="عملية التصميم" title="من الفكرة حتى الإطلاق" />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {project.designProcess.map((step, i) => (
              <li key={step.title} className="rounded-xl border border-border/60 bg-card p-6">
                <p className="text-xs font-medium tracking-widest text-muted-foreground" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      ) : null;
    case "development":
      return project.development ? (
        <Reveal>
          <SectionHeading eyebrow="التطوير" title="كيف تم البناء" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">{project.development}</p>
        </Reveal>
      ) : null;
    case "stack":
      return project.stack.length ? (
        <Reveal>
          <SectionHeading eyebrow="التقنيات" title="ما يُشغّل المشروع" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground/85">
                <Layers className="size-3 text-primary" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null;
    case "gallery":
      return project.gallery.length ? (
        <Reveal>
          <SectionHeading eyebrow="المعرض" title="شاشات مختارة" />
          <div className="mt-8">
            <MarqueeGallery items={project.gallery} />
          </div>
        </Reveal>
      ) : null;
    case "metrics":
      return project.metrics?.length ? (
        <Reveal>
          <SectionHeading eyebrow="النتائج" title="ما تحقّق فعلًا، بالأرقام" />
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-border/60 bg-card p-6">
                <dt className="text-xs tracking-wider text-muted-foreground">{m.label}</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ) : null;
    case "highlights":
      return project.highlights && project.highlights.length ? (
        <Reveal>
          <SectionHeading eyebrow="أبرز المميزات" title="ما يميّز هذا المشروع" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" aria-hidden />
                </span>
                <span className="text-sm text-foreground/85">{h}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null;
    case "lessons":
      return project.lessons && project.lessons.length ? (
        <Reveal>
          <SectionHeading eyebrow="الدروس المستفادة" title="نقاط للمرة القادمة" />
          <ul className="mt-6 space-y-3">
            {project.lessons.map((l) => (
              <li key={l} className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" aria-hidden />
                </span>
                <span className="text-sm text-foreground/85">{l}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null;
    case "testimonial":
      return project.testimonial ? (
        <Reveal>
          <SectionHeading eyebrow="رأي العميل" title="بكلماتهم" />
          <figure className="mt-6 rounded-2xl border border-border/60 bg-card p-8 md:p-10">
            <Quote className="size-6 text-primary" aria-hidden />
            <blockquote className="mt-4 text-lg leading-relaxed text-foreground/90 md:text-xl">
              «{project.testimonial.quote}»
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-medium text-foreground">{project.testimonial.author}</span>
              {project.testimonial.role ? (
                <span className="text-muted-foreground"> — {project.testimonial.role}</span>
              ) : null}
            </figcaption>
          </figure>
        </Reveal>
      ) : null;
    default:
      return null;
  }
}


function ProjectNotFound() {
  const { slug } = Route.useParams();
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground" dir="ltr">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">لم نعثر على المشروع</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          لا يوجد مشروع باسم «{slug}».
        </p>
        <div className="mt-6">
          <DSButton asChild variant="outline">
            <Link to="/work">العودة إلى المشاريع</Link>
          </DSButton>
        </div>
      </div>
    </Section>
  );
}

function ProjectError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">تعذّر تحميل هذا المشروع</h1>
        <p className="mt-2 text-sm text-muted-foreground">حاول مرّة أخرى أو ارجع إلى قائمة المشاريع.</p>
        <div className="mt-6 flex justify-center gap-2">
          <DSButton
            variant="outline"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            إعادة المحاولة
          </DSButton>
          <DSButton asChild variant="ghost">
            <Link to="/work">جميع المشاريع</Link>
          </DSButton>
        </div>
      </div>
    </Section>
  );
}
