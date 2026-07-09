import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Mail,
  Sparkles,
  Globe,
  Layout,
  ShoppingBag,
  Palette,
  Rocket,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import { DSButton } from "@/components/ds";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { services } from "@/data/services";
import type { Service } from "@/features/services/schema";
import { site } from "@/config/site";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Layout,
  ShoppingBag,
  Sparkles,
  Palette,
  Rocket,
  Wrench,
};

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

function ServiceIllustration({ service }: { service: Service }) {
  const Icon = service.icon ? iconMap[service.icon] ?? Sparkles : Sparkles;
  return (
    <div
      aria-hidden
      className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl border border-border/60 bg-card"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid size-24 place-items-center rounded-2xl border border-border/60 bg-background/80 text-primary shadow-sm backdrop-blur">
          <Icon className="size-10" />
        </div>
      </div>
      <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-40 rounded-full bg-accent/10 blur-3xl" />
    </div>
  );
}

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
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <Eyebrow>Service</Eyebrow>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
                {service.summary}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {service.timeline ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1">
                    <Clock className="size-3.5" /> {service.timeline}
                  </span>
                ) : null}
                {service.startingAt ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1">
                    From {service.startingAt}
                  </span>
                ) : null}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <DSButton asChild size="lg">
                  <Link to="/contact">
                    Contact me <ArrowRight />
                  </Link>
                </DSButton>
                <DSButton asChild size="lg" variant="outline">
                  <Link to="/services">See all services</Link>
                </DSButton>
              </div>
            </div>
            <ServiceIllustration service={service} />
          </div>
        </Container>
      </header>

      {service.overview ? (
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <Eyebrow>Overview</Eyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                What this service is
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-foreground/85">{service.overview}</p>
          </div>
        </Section>
      ) : null}

      {service.benefits.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>Benefits</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
            Why teams choose this
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-5"
              >
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3.5" aria-hidden />
                </span>
                <span className="text-sm text-foreground/85">{b}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {service.features.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>Features</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
            What's included
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4"
              >
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span className="text-sm text-foreground/85">{f}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {service.workflow.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>Workflow</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
            How we'll work together
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.workflow.map((w) => (
              <li
                key={w.step}
                className="rounded-xl border border-border/60 bg-card p-6"
              >
                <p className="text-xs font-medium tracking-widest text-muted-foreground">
                  {w.step}
                </p>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section className="border-t border-border/60">
        <div className="grid gap-10 md:grid-cols-2">
          {service.timeline ? (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <Eyebrow>Timeline</Eyebrow>
              <p className="mt-4 flex items-center gap-3 text-2xl font-semibold tracking-tight">
                <Clock className="size-5 text-primary" aria-hidden />
                {service.timeline}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Estimate depends on scope and dependencies. Confirmed after discovery.
              </p>
            </div>
          ) : null}
          {service.technologies.length ? (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <Eyebrow>Technologies</Eyebrow>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.technologies.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-foreground/80"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      {service.deliverables.length ? (
        <Section className="border-t border-border/60">
          <Eyebrow>Deliverables</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
            What you get
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
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
        </Section>
      ) : null}

      {service.faq.length ? (
        <Section className="border-t border-border/60">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                Questions & answers
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {service.faq.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      ) : null}

      <Section className="border-t border-border/60">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-8 py-14 text-center md:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/8 to-transparent"
          />
          <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
            Ready to start on {service.title.toLowerCase()}?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Tell me what you're building — I'll come back with an honest take within 48 hours.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <DSButton asChild size="lg">
              <Link to="/contact">
                Contact me <ArrowRight />
              </Link>
            </DSButton>
            <DSButton asChild size="lg" variant="outline">
              <a href="mailto:hello@example.com">
                <Mail /> Email me
              </a>
            </DSButton>
          </div>
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
