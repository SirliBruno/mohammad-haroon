import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
import { DSButton, Grid, ServiceCard, CTA } from "@/components/ds";
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
        "Web development, WordPress, WooCommerce, UI/UX and graphic design services built for growing businesses.",
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
        title="Design and development, done right"
        description="Seven focused services covering the full lifecycle of a modern web product — from a single landing page to a full e-commerce build and everything in between."
      />

      <Section>
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
          {services.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ServiceCard service={s} className="h-full transition-colors hover:border-primary/40" />
            </Link>
          ))}
        </Grid>
      </Section>

      <Section className="border-t border-border/60">
        <SectionTitle
          eyebrow="Process"
          title="How every engagement runs"
          size="sm"
        />
        <div className="mt-10">
          <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
            {serviceProcess.map((p) => (
              <div key={p.step} className="rounded-2xl border border-border/60 bg-card p-6">
                <p className="text-xs font-medium tracking-widest text-muted-foreground">{p.step}</p>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <SectionTitle
            eyebrow="FAQ"
            title="Common questions"
            description="Not seeing yours? Ask on the contact page."
            size="sm"
          />
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

      <CTA
        eyebrow="Ready to start?"
        title="Have a project in mind?"
        description="Tell me about it — I'll come back with an honest take within 48 hours."
        actions={
          <>
            <DSButton asChild size="lg">
              <Link to="/contact">
                Start a conversation <ArrowRight />
              </Link>
            </DSButton>
            <DSButton asChild size="lg" variant="outline">
              <a href="mailto:hello@example.com">
                <Mail /> Email me
              </a>
            </DSButton>
          </>
        }
      />
    </>
  );
}

