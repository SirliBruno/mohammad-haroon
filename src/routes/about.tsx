import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { AvailabilityBadge } from "@/components/ds/availability-badge";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Coffee,
  Compass,
  Download,
  Figma,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Mountain,
  Music,
  Palette,
  Sparkles,
  Store,
  Target,
  Wrench,
  Zap,
} from "lucide-react";

import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
import {
  DSBadge,
  DSButton,
  DSCard,
  Grid,
  Timeline,
  type TimelineItem,
} from "@/components/ds";
import { profile, values } from "@/data/profile";
import { site } from "@/config/site";
import { personJsonLd } from "@/features/seo/jsonld";

// ------------------------------------------------------------
// Local content
// ------------------------------------------------------------

const careerTimeline: TimelineItem[] = [
  {
    date: "2025 — Present",
    title: "Freelance Product Engineer",
    meta: "Independent · Remote",
    description:
      "Partnering with founders to design and ship premium web products, storefronts, and design systems.",
  },
  {
    date: "2024",
    title: "Design Engineer",
    meta: "Boutique product studios",
    description:
      "Led interface work across dashboards, editors, and marketing surfaces for early-stage SaaS teams.",
  },
  {
    date: "2023",
    title: "Frontend Developer",
    meta: "Agency retainers",
    description:
      "Shipped Shopify and headless storefronts for lifestyle brands and DTC operators.",
  },
  {
    date: "2022",
    title: "First freelance clients",
    meta: "Nights & weekends",
    description:
      "Built landing pages and small stores while studying — the beginning of a habit that stuck.",
  },
];

const education = [
  {
    period: "2022 — Present",
    title: "Bachelor of Information Technology",
    place: "University coursework · in progress",
    detail:
      "Focus on software engineering, human–computer interaction, and web systems.",
  },
  {
    period: "2024",
    title: "Meta Front-End Developer",
    place: "Meta · Coursera",
    detail: "React, accessibility, and modern JavaScript at production scale.",
  },
  {
    period: "2024",
    title: "Google UX Design",
    place: "Google · Coursera",
    detail: "Research, prototyping, and design system fundamentals.",
  },
];

const experiencePillars = [
  {
    icon: Palette,
    title: "Design",
    description:
      "UI, UX, and design systems — from token to shipped component.",
    tags: ["UI", "UX Research", "Design Systems", "Motion"],
  },
  {
    icon: Braces,
    title: "Engineering",
    description:
      "Production-grade frontend in React and TypeScript, end to end.",
    tags: ["React", "TypeScript", "Next.js", "TanStack"],
  },
  {
    icon: Store,
    title: "Commerce",
    description:
      "Shopify and headless stores tuned for conversion and craft.",
    tags: ["Shopify", "Stripe", "Headless CMS", "SEO"],
  },
];

const techStack = [
  {
    group: "Design",
    icon: Palette,
    items: ["Figma", "Framer", "Rive", "Adobe CC"],
  },
  {
    group: "Frontend",
    icon: Braces,
    items: ["React", "TypeScript", "Next.js", "TanStack Start", "Tailwind CSS"],
  },
  {
    group: "Commerce & CMS",
    icon: Store,
    items: ["Shopify", "Sanity", "Contentful", "Stripe"],
  },
  {
    group: "Ops & Tooling",
    icon: Wrench,
    items: ["Vercel", "Cloudflare", "GitHub", "Linear", "Notion"],
  },
];

const workingStyle = [
  {
    icon: Target,
    title: "Small scope, sharp outcomes",
    description:
      "One goal per engagement. If it can't be described in a sentence, it isn't scoped yet.",
  },
  {
    icon: MessageCircle,
    title: "Async by default",
    description:
      "Loom, Linear, and clear writing. Meetings only when they move the work forward.",
  },
  {
    icon: Zap,
    title: "Shipping mindset",
    description:
      "Working software from week one. Momentum beats meetings every time.",
  },
  {
    icon: Layers,
    title: "Systems that outlive me",
    description:
      "Tokens, patterns, and docs so the next hire ships as fast as I did.",
  },
];

const currentFocus = [
  {
    icon: Sparkles,
    title: "Design systems that scale",
    detail: "Fintech tokens & primitives for a Q2 release.",
  },
  {
    icon: Zap,
    title: "Edge-first commerce",
    detail: "Storefronts on TanStack Start + Cloudflare.",
  },
  {
    icon: Compass,
    title: "Motion as a language",
    detail: "Codifying how animation communicates state.",
  },
];

const interests = [
  { icon: BookOpen, label: "Reading essays" },
  { icon: Mountain, label: "Long walks" },
  { icon: Coffee, label: "Specialty coffee" },
  { icon: Music, label: "Ambient music" },
  { icon: Figma, label: "Type & lettering" },
];




// ------------------------------------------------------------
// Route
// ------------------------------------------------------------

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      title: "About",
      description:
        "Mohammad Haroon — IT Student, Web Developer, UI Designer, and Digital Solutions Specialist. Story, mission, and how I work.",
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

      {/* Biography + sidebar */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-foreground/85 md:text-lg">
              <p>
                I'm an IT Student, Web Developer, and UI Designer building
                digital solutions for founders and small teams. I care about
                the details others skip — the two-pixel misalignment, the
                animation that arrives one frame too late, the copy that
                could be shorter.
              </p>
              <p>
                Most of my work sits at the seam between design and code:
                interfaces that feel considered, ship on time, and hold up
                under real users.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <DSCard variant="surface" padding="lg" className="space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Currently
                </p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  {site.availabilityLabel}
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden />
                  Based {site.location} · working globally
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <DSButton asChild size="sm" variant="primary">
                  <Link to="/contact">
                    Get in touch
                    <ArrowRight />
                  </Link>
                </DSButton>
                <DSButton asChild size="sm" variant="outline">
                  <a href="/resume.pdf" download>
                    <Download />
                    Resume
                  </a>
                </DSButton>
              </div>
              <div className="border-t border-border/60 pt-5">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Elsewhere
                </p>
                <ul className="mt-3 space-y-2">
                  {profile.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        rel="noreferrer"
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {s.label}{" "}
                        <span className="text-muted-foreground">— {s.handle}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </DSCard>
          </Reveal>
        </div>
      </Section>

      {/* Professional Story */}
      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Professional story"
            title="A short path, on purpose."
            description="I've stayed narrow so I could go deep. Design and code, held to the same bar."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                year: "The start",
                title: "Curiosity, then craft",
                body:
                  "Started with landing pages while studying IT. Realized I liked the design half as much as the code.",
              },
              {
                year: "The middle",
                title: "Shipping in production",
                body:
                  "Storefronts, dashboards, and marketing sites — with real users, real deadlines, real feedback loops.",
              },
              {
                year: "Now",
                title: "Considered software",
                body:
                  "Chosen engagements only. Focus on interfaces that feel obvious and quietly premium.",
              },
            ].map((chapter) => (
              <DSCard key={chapter.year} variant="surface" padding="lg" className="h-full">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {chapter.year}
                </p>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                  {chapter.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {chapter.body}
                </p>
              </DSCard>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Career Timeline + Education */}
      <Section className="border-t border-border/60">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionTitle
              as="h2"
              eyebrow="Career"
              title="The timeline."
            />
            <DSCard variant="surface" padding="lg" className="mt-8">
              <Timeline items={careerTimeline} />
            </DSCard>
          </Reveal>

          <Reveal delay={0.05}>
            <SectionTitle
              as="h2"
              eyebrow="Education"
              title="Studies & credentials."
            />
            <ul className="mt-8 space-y-4">
              {education.map((e) => (
                <li key={e.title}>
                  <DSCard variant="surface" padding="lg">
                    <div className="flex items-start gap-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border/60 bg-background text-foreground">
                        <GraduationCap className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          {e.period}
                        </p>
                        <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
                          {e.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{e.place}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{e.detail}</p>
                      </div>
                    </div>
                  </DSCard>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Experience */}
      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Experience"
            title="Three disciplines. One bar."
            description="Where I've spent my time and where I add the most value."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              {experiencePillars.map((p) => {
                const Icon = p.icon;
                return (
                  <DSCard key={p.title} variant="surface" padding="lg" className="h-full">
                    <span className="grid size-10 place-items-center rounded-md border border-border/60 bg-background text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <li key={t}>
                          <DSBadge variant="subtle">{t}</DSBadge>
                        </li>
                      ))}
                    </ul>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      {/* Mission & Vision */}
      <Section className="border-t border-border/60">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <DSCard variant="surface" padding="lg" className="relative h-full overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-2xl"
              />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                  Mission
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Help businesses ship digital products people actually enjoy using.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Whether it's a marketing site, a store, or a full product,
                  the mission is the same: quiet interfaces, sharp outcomes,
                  no wasted screens.
                </p>
              </div>
            </DSCard>
          </Reveal>
          <Reveal delay={0.05}>
            <DSCard variant="surface" padding="lg" className="relative h-full overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-accent/10 blur-2xl"
              />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  Vision
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  A studio-quality partner for teams that treat software like craft.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Long-term: build a small, deliberate practice known for
                  the details — the kind of work you can point at without
                  qualifications.
                </p>
              </div>
            </DSCard>
          </Reveal>
        </div>
      </Section>

      {/* Core Values */}
      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Core values"
            title="Principles I hold to."
            description="The compass — the same in year one as in year eight."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              {values.map((v, i) => (
                <DSCard key={v.title} variant="outline" padding="lg" className="h-full">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      0{i + 1}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {v.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {v.description}
                  </p>
                </DSCard>
              ))}
            </Grid>
          </div>
        </Reveal>
      </Section>

      {/* Current Focus */}
      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Now"
            title="What has my attention this quarter."
            description="A short list — updated as things ship."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-10 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60">
            {currentFocus.map((f) => {
              const Icon = f.icon;
              return (
                <li
                  key={f.title}
                  className="flex items-center gap-4 bg-card px-5 py-5 transition-colors hover:bg-muted/40 md:px-6"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border/60 bg-background text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.detail}</p>
                  </div>
                  <DSBadge variant="subtle">In progress</DSBadge>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Section>

      {/* Tech Stack */}
      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Tech stack"
            title="The tools behind the work."
            description="Narrow on purpose. I go deep on a small set of tools instead of shallow on many."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
              {techStack.map((g) => {
                const Icon = g.icon;
                return (
                  <DSCard key={g.group} variant="surface" padding="lg" className="h-full">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        {g.group}
                      </h3>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {g.items.map((item) => (
                        <li key={item}>
                          <DSBadge variant="subtle">{item}</DSBadge>
                        </li>
                      ))}
                    </ul>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      {/* Working Style */}
      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Working style"
            title="How the work actually happens."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              {workingStyle.map((w) => {
                const Icon = w.icon;
                return (
                  <DSCard key={w.title} variant="surface" padding="lg" className="h-full">
                    <div className="flex items-start gap-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border/60 bg-background text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                          {w.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {w.description}
                        </p>
                      </div>
                    </div>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      {/* Personal Interests */}
      <Section className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Off the clock"
            title="Interests that keep the tank full."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {interests.map((i) => {
              const Icon = i.icon;
              return (
                <li key={i.label}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-border hover:text-foreground">
                    <Icon className="size-3.5 text-muted-foreground" aria-hidden />
                    {i.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Section>

      {/* Resume + CTA */}
      <Section className="border-t border-border/60">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-16 md:px-16 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/10 via-accent/5 to-transparent"
            />
            <div className="relative grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Next step
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
                  Read the résumé, or start a conversation.
                </h2>
                <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
                  Grab the PDF if you're evaluating for a role, or drop a note
                  if you have a project in mind.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <DSButton asChild size="lg" variant="primary">
                  <a href="/resume.pdf" download>
                    <Download />
                    Download résumé
                  </a>
                </DSButton>
                <DSButton asChild size="lg" variant="outline">
                  <Link to="/contact">
                    <Mail />
                    Get in touch
                  </Link>
                </DSButton>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
