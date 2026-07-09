import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import { DSButton } from "@/components/ds";
import { services, serviceProcess } from "@/data/services";
import type { Service } from "@/features/services/schema";
import { site } from "@/config/site";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: buildMeta({
          title: "Service not found",
          path: `/services/${params.slug}`,
          noindex: true,
        }),
      };
    }
    const { service } = loaderData;
    return {
      meta: buildMeta({
        title: service.title,
        description: service.summary,
        path: `/services/${service.slug}`,
      }),
      links: [{ rel: "canonical", href: `/services/${service.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.summary,
            provider: { "@type": "Person", name: site.name },
            areaServed: "Global",
          }),
        },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData() as { service: Service };

  return (
    <>
      <header className="border-b border-border/60 pt-24 pb-16 md:pt-32 md:pb-20">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/services" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" /> All services
            </Link>
          </nav>
          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {service.engagement}
            </span>
            {service.startingAt ? (
              <span className="text-xs text-muted-foreground">from {service.startingAt}</span>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {service.summary}
          </p>
        </Container>
      </header>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-12">
            {service.deliverables.length ? (
              <div>
                <Eyebrow>What's included</Eyebrow>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4"
                    >
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3" aria-hidden />
                      </span>
                      <span className="text-sm text-foreground/85">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <Eyebrow>Process</Eyebrow>
              <ol className="mt-6 space-y-4">
                {serviceProcess.map((p) => (
                  <li
                    key={p.step}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-lg border border-border/60 bg-card p-5"
                  >
                    <span className="text-xs font-medium tracking-widest text-muted-foreground">
                      {p.step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Get started
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                {service.startingAt ?? "Let's talk"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fixed scope, fixed price. No hourly billing.
              </p>
              <div className="mt-6 space-y-2">
                <DSButton asChild size="lg" className="w-full">
                  <Link to="/contact">
                    Request a proposal <ArrowRight />
                  </Link>
                </DSButton>
                <DSButton asChild size="lg" variant="outline" className="w-full">
                  <Link to="/services">See all services</Link>
                </DSButton>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

function ServiceNotFound() {
  const { slug } = Route.useParams();
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Service not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No service matches "{slug}".
        </p>
        <div className="mt-6">
          <DSButton asChild variant="outline">
            <Link to="/services">All services</Link>
          </DSButton>
        </div>
      </div>
    </Section>
  );
}
