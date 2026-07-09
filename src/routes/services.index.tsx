import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import { DSButton, DSCard, Grid } from "@/components/ds";
import { services, serviceProcess, serviceFaq } from "@/data/services";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: buildMeta({
      title: "Services",
      description:
        "Freelance engagement models with Mohammad Haroon — sprints, retainers, and advisory.",
      path: "/services",
    }),
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Ways to work together"
        description="Focused engagements scoped around a specific outcome — not a calendar. Every project is fixed-price and starts with a real conversation."
      />

      {/* Services */}
      <Section>
        <Grid cols={{ base: 1, md: 3 }} gap="md">
          {services.map((s) => (
            <DSCard key={s.slug} variant="surface" padding="lg" className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {s.engagement}
                </span>
                {s.startingAt ? (
                  <span className="text-xs text-muted-foreground">from {s.startingAt}</span>
                ) : null}
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
              {s.deliverables.length ? (
                <ul className="mt-6 space-y-2 text-sm">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-foreground/80">
                      <ArrowRight aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-8">
                <DSButton asChild size="sm" variant="outline">
                  <Link to="/services/$slug" params={{ slug: s.slug }}>
                    Learn more <ArrowRight />
                  </Link>
                </DSButton>
              </div>
            </DSCard>
          ))}
        </Grid>
      </Section>

      {/* Process */}
      <Section className="border-t border-border/60">
        <div className="max-w-2xl">
          <Eyebrow>Process</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            How every engagement runs
          </h2>
        </div>
        <div className="mt-10">
          <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
            {serviceProcess.map((p) => (
              <div key={p.step} className="rounded-xl border border-border/60 bg-card p-6">
                <p className="text-xs font-medium tracking-widest text-muted-foreground">{p.step}</p>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="border-t border-border/60">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Common questions
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Not seeing yours? Ask on the contact page.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {serviceFaq.map((f, i) => (
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

      {/* CTA */}
      <Section className="border-t border-border/60">
        <div className="rounded-2xl border border-border/60 bg-card px-8 py-14 text-center md:px-16">
          <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
            Ready to talk?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Tell me about the problem — I'll come back with an honest take within 48 hours.
          </p>
          <div className="mt-6">
            <DSButton asChild size="lg">
              <Link to="/contact">
                Start a conversation <ArrowRight />
              </Link>
            </DSButton>
          </div>
        </div>
      </Section>
    </>
  );
}
