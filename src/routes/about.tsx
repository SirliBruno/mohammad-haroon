import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { DSButton, Grid } from "@/components/ds";
import { Eyebrow } from "@/components/typography/eyebrow";
import { profile, values, highlights } from "@/data/profile";
import { site } from "@/config/site";
import { personJsonLd } from "@/features/seo/jsonld";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      title: "About",
      description:
        "Mohammad Haroon — product engineer and designer. The story, principles, and how I work.",
      path: "/about",
      type: "profile",
    }),
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(personJsonLd()),
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={`I'm ${site.shortName}. I design and build software with taste.`}
        description={profile.bio}
      />

      {/* Story */}
      <Section>
        <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6 text-base leading-relaxed text-foreground/85 md:text-lg">
            <p>
              I've spent the last eight years shipping products — as a founding
              designer, a solo consultant, and an embedded design engineer.
              Along the way I've learned that the interesting problems are
              almost never about pixels. They're about deciding what to build,
              and having the discipline to leave the rest out.
            </p>
            <p>
              I work best with founders and small product teams who care about
              craft the way I do — where a two-pixel misalignment is worth a
              conversation and shipping something you're proud of matters more
              than shipping something on Tuesday.
            </p>
            <p>
              Outside of client work I write, tinker on side projects, and
              occasionally advise on hiring and design systems. When I'm
              offline I'm probably reading, running, or looking for good
              coffee.
            </p>
          </div>
          <aside className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Currently
              </p>
              <p className="mt-3 text-sm text-foreground">{site.availabilityLabel}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Based {site.location}, working globally.
              </p>
              <div className="mt-6">
                <DSButton asChild size="sm" variant="outline">
                  <Link to="/contact">
                    Get in touch
                    <ArrowRight />
                  </Link>
                </DSButton>
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Elsewhere
              </p>
              <ul className="mt-3 space-y-2">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      rel="noreferrer"
                    >
                      {s.label} <span className="text-muted-foreground">— {s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      {/* Highlights */}
      <Section className="border-t border-border/60">
        <Eyebrow>By the numbers</Eyebrow>
        <div className="mt-8">
          <Grid cols={{ base: 2, md: 4 }} gap="md">
            {highlights.map((h) => (
              <div key={h.label} className="rounded-xl border border-border/60 bg-card p-6">
                <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {h.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{h.label}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      {/* Values */}
      <Section className="border-t border-border/60">
        <div className="max-w-2xl">
          <Eyebrow>Principles</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            How I work
          </h2>
        </div>
        <div className="mt-10">
          <Grid cols={{ base: 1, md: 2 }} gap="lg">
            {values.map((v) => (
              <article key={v.title} className="rounded-xl border border-border/60 bg-card p-8">
                <h3 className="text-lg font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {v.description}
                </p>
              </article>
            ))}
          </Grid>
        </div>
      </Section>
    </>
  );
}
