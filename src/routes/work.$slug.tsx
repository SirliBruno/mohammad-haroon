import { Link, createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { buildMeta } from "@/features/seo/build-meta";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import { DSButton, Grid, TagGroup, Prose } from "@/components/ds";
import { projects } from "@/data/projects";
import { site } from "@/config/site";

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

function CaseStudy() {
  const { project } = Route.useLoaderData();
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <>
      {/* Hero */}
      <header className="border-b border-border/60 pt-24 pb-16 md:pt-32 md:pb-20">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/work" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" /> All projects
            </Link>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{project.year}</span>
            <span aria-hidden>·</span>
            <span>{project.role}</span>
            {project.client ? (
              <>
                <span aria-hidden>·</span>
                <span>{project.client}</span>
              </>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {project.summary}
          </p>
          {project.tags.length ? (
            <div className="mt-6">
              <TagGroup items={project.tags} />
            </div>
          ) : null}
        </Container>
      </header>

      {/* Cover */}
      <Section className="pt-12 md:pt-16">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/10 via-card to-accent/10">
          {project.cover?.src ? (
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              className="size-full object-cover"
            />
          ) : null}
        </div>
      </Section>

      {/* Overview */}
      <Section className="pt-0">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
          <Prose size="lg">
            <p>{project.description}</p>
          </Prose>
          <aside className="space-y-6">
            {project.metrics?.length ? (
              <div className="rounded-xl border border-border/60 bg-card p-6">
                <Eyebrow>Outcomes</Eyebrow>
                <dl className="mt-4 space-y-4">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="text-xs text-muted-foreground">{m.label}</dt>
                      <dd className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            {project.stack.length ? (
              <div className="rounded-xl border border-border/60 bg-card p-6">
                <Eyebrow>Stack</Eyebrow>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-border/70 bg-background px-2 py-1 text-xs text-muted-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.links?.length ? (
              <div className="rounded-xl border border-border/60 bg-card p-6">
                <Eyebrow>Links</Eyebrow>
                <ul className="mt-4 space-y-2">
                  {project.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label}
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      {/* Gallery */}
      {project.gallery.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>Gallery</Eyebrow>
          <div className="mt-8">
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              {project.gallery.map((g, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-card"
                >
                  <img src={g.src} alt={g.alt} className="size-full object-cover" />
                </div>
              ))}
            </Grid>
          </div>
        </Section>
      ) : null}

      {/* Prev / Next */}
      <Section className="border-t border-border/60">
        <div className="grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link
              to="/work/$slug"
              params={{ slug: prev.slug }}
              className="group rounded-xl border border-border/60 bg-card p-6 transition-colors hover:border-border"
            >
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5" /> Previous
              </p>
              <p className="mt-2 font-medium text-foreground group-hover:text-primary">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to="/work/$slug"
              params={{ slug: next.slug }}
              className="group rounded-xl border border-border/60 bg-card p-6 text-right transition-colors hover:border-border"
            >
              <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                Next <ArrowRight className="size-3.5" />
              </p>
              <p className="mt-2 font-medium text-foreground group-hover:text-primary">
                {next.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border/60">
        <div className="rounded-2xl border border-border/60 bg-card px-8 py-14 text-center md:px-16">
          <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
            Working on something similar?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            I'd love to hear what you're building.
          </p>
          <div className="mt-6">
            <DSButton asChild size="lg">
              <Link to="/contact">
                Start a project <ArrowRight />
              </Link>
            </DSButton>
          </div>
        </div>
      </Section>
    </>
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
