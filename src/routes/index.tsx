import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import { Hero } from "@/components/sections/hero";
import { DSButton, Grid, ProjectCard, ServiceCard, TestimonialQuote } from "@/components/ds";
import { site } from "@/config/site";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { articles } from "@/data/writing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildMeta({
      description: site.description,
      path: "/",
    }),
  }),
  component: Home,
});

function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const topServices = services.slice(0, 3);
  const topTestimonial = testimonials[0];
  const recentPosts = articles.slice(0, 3);

  return (
    <>
      <Hero />


      {/* Selected work */}
      <Section id="work" className="border-t border-border/60 pt-16 md:pt-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Recent projects
            </h2>
          </div>
          <Link
            to="/work"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex md:items-center md:gap-1"
          >
            All projects
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10">
          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </Grid>
        </div>
      </Section>

      {/* Services */}
      <Section id="services" className="border-t border-border/60">
        <div className="max-w-2xl">
          <Eyebrow>Services</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Ways we can work together
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Sprints, retainers, and advisory — each scoped to move a specific
            outcome, not to fill a calendar.
          </p>
        </div>
        <div className="mt-10">
          <Grid cols={{ base: 1, md: 3 }} gap="md">
            {topServices.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </Grid>
        </div>
        <div className="mt-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            See all services
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Section>

      {/* Testimonial */}
      {topTestimonial ? (
        <Section className="border-t border-border/60">
          <div className="mx-auto max-w-3xl">
            <TestimonialQuote testimonial={topTestimonial} />
          </div>
        </Section>
      ) : null}

      {/* Latest writing */}
      <Section id="writing" className="border-t border-border/60">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Writing</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Latest essays
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex md:items-center md:gap-1"
          >
            All essays
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 divide-y divide-border/60 border-y border-border/60">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {post.readingTime} min read
                  </p>
                  <h3 className="mt-1 text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border/60">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-8 py-16 md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/8 to-transparent"
          />
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <Eyebrow>Have a project in mind?</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                Let's build something worth shipping.
              </h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                I take a small number of engagements each quarter. If you're
                serious about craft, I'd love to hear from you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <DSButton asChild size="lg" variant="primary">
                <Link to="/contact">
                  Start a project
                  <ArrowRight />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/services">See services</Link>
              </DSButton>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
