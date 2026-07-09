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
import { AvailabilityBadge } from "@/components/ds/availability-badge";
import { DSButton, Grid, TagGroup } from "@/components/ds";
import { projects } from "@/data/projects";
import type { Project } from "@/features/projects/schema";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: buildMeta({
          title: "Project not found",
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

function statusMeta(status: Project["status"]) {
  switch (status) {
    case "live":
      return { label: "Live", dot: "bg-emerald-500" };
    case "in-progress":
      return { label: "In progress", dot: "bg-amber-500" };
    case "concept":
      return { label: "Concept", dot: "bg-sky-500" };
    case "archived":
      return { label: "Archived", dot: "bg-muted-foreground" };
  }
}


function CaseStudy() {
  const { project } = Route.useLoaderData() as { project: Project };
  const status = statusMeta(project.status);
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const next =
    projects[(currentIndex + 1) % projects.length] ?? null;

  const related = projects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border/60 pt-24 pb-16 md:pt-32 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-primary/5 via-transparent to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.06) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(60% 60% at 50% 0%, black, transparent)",
          }}
        />
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/work" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" /> All projects
            </Link>
          </nav>
          <Reveal>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur">
                {project.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur">
                <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden />
                {status.label}
              </span>
              {project.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary backdrop-blur">
                  <Sparkles className="size-3" /> Featured
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
                    Live demo <ExternalLink />
                  </a>
                </DSButton>
              ) : null}
              {project.github ? (
                <DSButton asChild size="lg" variant="outline">
                  <a href={project.github} target="_blank" rel="noreferrer">
                    <Github /> Source
                  </a>
                </DSButton>
              ) : null}
              <DSButton asChild size="lg" variant="ghost">
                <Link to="/contact">
                  Start a project <ArrowRight />
                </Link>
              </DSButton>
            </div>
          </Reveal>
        </Container>
      </header>

      {/* Cover */}
      <Section className="pt-12 md:pt-16">
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/10 via-card to-accent/10">
            {project.cover?.src ? (
              <img
                src={project.cover.src}
                alt={project.cover.alt}
                className="size-full object-cover"
              />
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

      {/* Body + Sidebar */}
      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-16">
            {/* Overview */}
            <Reveal>
              <SectionHeading eyebrow="Overview" title="The project at a glance" />
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85">
                {project.description}
              </p>
            </Reveal>

            {project.problem ? (
              <Reveal>
                <SectionHeading eyebrow="Problem" title="What needed to change" />
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">
                  {project.problem}
                </p>
              </Reveal>
            ) : null}

            {project.goals && project.goals.length ? (
              <Reveal>
                <SectionHeading eyebrow="Goals" title="What we set out to do" />
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {project.goals.map((g) => (
                    <li
                      key={g}
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-5"
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Target className="size-3.5" aria-hidden />
                      </span>
                      <span className="text-sm text-foreground/85">{g}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {project.research ? (
              <Reveal>
                <SectionHeading eyebrow="Research" title="What we learned first" />
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">
                  {project.research}
                </p>
              </Reveal>
            ) : null}

            {project.solution ? (
              <Reveal>
                <SectionHeading eyebrow="Solution" title="How we approached it" />
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">
                  {project.solution}
                </p>
              </Reveal>
            ) : null}

            {project.designProcess && project.designProcess.length ? (
              <Reveal>
                <SectionHeading eyebrow="Design process" title="From messy to shipped" />
                <ol className="mt-8 grid gap-4 sm:grid-cols-2">
                  {project.designProcess.map((step, i) => (
                    <li
                      key={step.title}
                      className="rounded-xl border border-border/60 bg-card p-6"
                    >
                      <p className="text-xs font-medium tracking-widest text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-3 text-base font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ) : null}

            {project.development ? (
              <Reveal>
                <SectionHeading eyebrow="Development" title="How it was built" />
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">
                  {project.development}
                </p>
              </Reveal>
            ) : null}

            {project.stack.length ? (
              <Reveal>
                <SectionHeading eyebrow="Tech stack" title="What powers it" />
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground/85"
                    >
                      <Layers className="size-3 text-primary" aria-hidden />
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {project.gallery.length ? (
              <Reveal>
                <SectionHeading eyebrow="Gallery" title="Selected screens" />
                <div className="mt-8">
                  <Grid cols={{ base: 1, md: 2 }} gap="md">
                    {project.gallery.map((g, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-card transition-transform duration-500 hover:scale-[1.01]"
                      >
                        <img
                          src={g.src}
                          alt={g.alt}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </Grid>
                </div>
              </Reveal>
            ) : null}

            {project.metrics?.length ? (
              <Reveal>
                <SectionHeading eyebrow="Results" title="What shipped, measured" />
                <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                  {project.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-border/60 bg-card p-6"
                    >
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        {m.label}
                      </dt>
                      <dd className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}

            {project.lessons && project.lessons.length ? (
              <Reveal>
                <SectionHeading eyebrow="Lessons learned" title="Takeaways for next time" />
                <ul className="mt-6 space-y-3">
                  {project.lessons.map((l) => (
                    <li
                      key={l}
                      className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4"
                    >
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3" aria-hidden />
                      </span>
                      <span className="text-sm text-foreground/85">{l}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {project.testimonial ? (
              <Reveal>
                <SectionHeading eyebrow="Client testimonial" title="In their words" />
                <figure className="mt-6 rounded-2xl border border-border/60 bg-card p-8 md:p-10">
                  <Quote className="size-6 text-primary" aria-hidden />
                  <blockquote className="mt-4 text-lg leading-relaxed text-foreground/90 md:text-xl">
                    "{project.testimonial.quote}"
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-medium text-foreground">
                      {project.testimonial.author}
                    </span>
                    {project.testimonial.role ? (
                      <span className="text-muted-foreground"> — {project.testimonial.role}</span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ) : null}

            {project.tags.length ? (
              <Reveal>
                <div className="pt-2">
                  <TagGroup items={project.tags} />
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Project details
              </p>
              <dl className="mt-5 space-y-5 text-sm">
                {project.timeline ? (
                  <SidebarRow icon={Calendar} label="Timeline" value={project.timeline} />
                ) : null}
                <SidebarRow icon={User} label="Role" value={project.role} />
                {project.client ? (
                  <SidebarRow icon={User} label="Client" value={project.client} />
                ) : null}
                <SidebarRow icon={Tag} label="Category" value={project.category} />
                <SidebarRow icon={Calendar} label="Year" value={String(project.year)} />
                {project.tools && project.tools.length ? (
                  <div>
                    <dt className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <Wrench className="size-3.5" aria-hidden /> Tools
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {project.tools.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border/60 bg-background px-2 py-0.5 text-[11px] font-medium text-foreground/80"
                        >
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
                        <ExternalLink /> Live demo
                      </a>
                    </DSButton>
                  ) : null}
                  {project.github ? (
                    <DSButton asChild className="w-full" size="sm" variant="outline">
                      <a href={project.github} target="_blank" rel="noreferrer">
                        <Github /> View source
                      </a>
                    </DSButton>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 border-t border-border/60 pt-6">
                <DSButton asChild className="w-full" size="sm" variant="ghost">
                  <Link to="/contact">
                    Start a project <ArrowRight />
                  </Link>
                </DSButton>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Related projects */}
      {related.length ? (
        <Section className="border-t border-border/60">
          <SectionHeading eyebrow="Related" title={`More ${project.category.toLowerCase()} work`} />
          <div className="mt-8">
            <Grid cols={{ base: 1, md: related.length === 2 ? 2 : 3 }} gap="md">
              {related.map((p) => (
                <RelatedCard key={p.slug} project={p} />
              ))}
            </Grid>
          </div>
        </Section>
      ) : null}

      {/* Next project */}
      {next && next.slug !== project.slug ? (
        <Section className="border-t border-border/60">
          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="group block overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg md:p-12"
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Next project
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-6">
              <div className="min-w-0">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {next.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  {next.summary}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1">
                Continue <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </Section>
      ) : null}
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
    </div>
  );
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
      <dt className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
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
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {project.summary}
        </p>
      </div>
    </Link>
  );
}

function ProjectNotFound() {
  const { slug } = Route.useParams();
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Project not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No project matches "{slug}".
        </p>
        <div className="mt-6">
          <DSButton asChild variant="outline">
            <Link to="/work">Back to projects</Link>
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
        <h1 className="text-xl font-semibold tracking-tight">Couldn't load this project</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back to all projects.</p>
        <div className="mt-6 flex justify-center gap-2">
          <DSButton
            variant="outline"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </DSButton>
          <DSButton asChild variant="ghost">
            <Link to="/work">All projects</Link>
          </DSButton>
        </div>
      </div>
    </Section>
  );
}
