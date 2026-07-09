import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Braces,
  Compass,
  Figma,
  Layers,
  Lightbulb,
  Palette,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  Wrench,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { buildMeta } from "@/features/seo/build-meta";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
import { Container } from "@/components/layout/container";
import { Hero } from "@/components/sections/hero";
import {
  CertificateCard,
  DSButton,
  DSCard,
  DSBadge,
  Grid,
  ProjectCard,
  ServiceCard,
  TestimonialQuote,
  Timeline,
  type Certificate,
  type TimelineItem,
} from "@/components/ds";
import { site } from "@/config/site";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { articles } from "@/data/writing";

// ------------------------------------------------------------
// Local content — kept alongside the composition, easy to tune.
// ------------------------------------------------------------

const trustedCompanies = [
  "Northwind",
  "Lumen",
  "Atelier",
  "Meridian",
  "Halcyon",
  "Kinfolk",
  "Vantage",
  "Onyx",
];

const statistics = [
  { value: "5+", label: "Websites shipped", hint: "Marketing & product" },
  { value: "10+", label: "E-commerce stores", hint: "Shopify · custom" },
  { value: "Multi", label: "Companies served", hint: "Startups → agencies" },
  { value: "Open", label: "For freelance", hint: "Q1 slots remain" },
];

const skillGroups = [
  {
    title: "Design",
    icon: Palette,
    items: ["UI Design", "UX Research", "Design Systems", "Prototyping", "Motion"],
  },
  {
    title: "Frontend",
    icon: Braces,
    items: ["React", "TypeScript", "Next.js", "TanStack", "Tailwind CSS"],
  },
  {
    title: "Commerce",
    icon: Store,
    items: ["Shopify", "Stripe", "Headless CMS", "SEO", "Analytics"],
  },
  {
    title: "Tooling",
    icon: Wrench,
    items: ["Figma", "Framer", "Git", "Linear", "Vercel"],
  },
];

const certificates: Certificate[] = [
  { title: "Meta Front-End Developer", issuer: "Meta", issuedAt: "2025" },
  { title: "Google UX Design", issuer: "Google", issuedAt: "2024" },
  { title: "Shopify Partner Academy", issuer: "Shopify", issuedAt: "2024" },
  { title: "Advanced React Patterns", issuer: "Frontend Masters", issuedAt: "2024" },
  { title: "Figma for Product Design", issuer: "Config", issuedAt: "2023" },
  { title: "Design Systems in Practice", issuer: "Interaction Design", issuedAt: "2023" },
];

const timeline: TimelineItem[] = [
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
    title: "IT Studies — start",
    meta: "Bachelor of Information Technology",
    description:
      "Began formal studies while freelancing on the side. Design and code, in that order.",
  },
];

const currentFocus = [
  {
    icon: Zap,
    title: "Design systems that scale",
    description:
      "Building the tokens, primitives, and patterns behind a fintech product's next release.",
  },
  {
    icon: Server,
    title: "Edge-first commerce",
    description:
      "Prototyping storefronts on TanStack Start and Cloudflare — faster carts, cleaner code.",
  },
  {
    icon: Sparkles,
    title: "Motion as a language",
    description:
      "Codifying a motion system so animation communicates state instead of decorating it.",
  },
];

const ideas = [
  {
    icon: Lightbulb,
    tag: "Experiment",
    title: "Quiet analytics",
    description:
      "A dashboard that tells you what changed — in one sentence — instead of dumping charts.",
  },
  {
    icon: Compass,
    tag: "Concept",
    title: "Founder OS",
    description:
      "A single surface for the three things a founder actually does: talk to users, ship, decide.",
  },
  {
    icon: Layers,
    tag: "Prototype",
    title: "Component recipes",
    description:
      "A library of pre-composed shadcn recipes — copy, paste, ship. No boilerplate rewrite.",
  },
];

// ------------------------------------------------------------
// Motion helpers
// ------------------------------------------------------------

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ------------------------------------------------------------
// Route
// ------------------------------------------------------------

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
  const recentPosts = articles.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <>
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Trusted companies */}
      <section aria-labelledby="trusted-heading" className="border-t border-border/60 py-14">
        <Container>
          <Reveal>
            <p
              id="trusted-heading"
              className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
            >
              Trusted by teams shipping serious product
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <ul
              role="list"
              className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 opacity-80 sm:grid-cols-4 md:grid-cols-8"
            >
              {trustedCompanies.map((name) => (
                <li
                  key={name}
                  className="text-center text-sm font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
                >
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* 3 — Statistics */}
      <Section id="stats" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="By the numbers"
            title="A quiet track record."
            description="Small numbers, sharp results. Each engagement is scoped to move a specific outcome."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-4">
            {statistics.map((s) => (
              <div
                key={s.label}
                className="group bg-background p-6 transition-colors hover:bg-muted/40 md:p-8"
              >
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {s.value}
                </dd>
                <p className="mt-2 text-xs text-muted-foreground">{s.hint}</p>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* 4 — Featured Services */}
      <Section id="services" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Services"
            title="Ways we can work together."
            description="Sprints, retainers, and advisory — each scoped to move a specific outcome, not to fill a calendar."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/services">
                  All services
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              {topServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </Grid>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex justify-center">
            <DSButton asChild variant="outline" size="lg">
              <Link to="/services">
                Explore all services
                <ArrowRight />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      {/* 5 — Featured Projects */}
      <Section id="work" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Selected work"
            title="Projects worth studying."
            description="A handful of engagements where the details compounded into real outcomes."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/work">
                  All projects
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
              {featured.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </Grid>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <DSButton asChild variant="outline" size="lg">
              <Link to="/work">
                See every project
                <ArrowRight />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      {/* 6 — Experience Timeline Preview */}
      <Section id="experience" className="border-t border-border/60">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <Reveal>
            <SectionTitle
              as="h2"
              eyebrow="Experience"
              title="A short, deliberate path."
              description="I've kept the résumé lean on purpose — each stop was chosen for the depth of work, not the logo."
            />
            <div className="mt-8">
              <DSButton asChild variant="outline" size="md">
                <Link to="/about">
                  Read the full story
                  <ArrowRight />
                </Link>
              </DSButton>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <DSCard variant="surface" padding="lg">
              <Timeline items={timeline} />
            </DSCard>
          </Reveal>
        </div>
      </Section>

      {/* 7 — Skills */}
      <Section id="skills" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Skills"
            title="The stack behind the work."
            description="Design and engineering, held to the same bar. I stay narrow so I can go deep."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12">
            <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
              {skillGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <DSCard key={group.title} variant="surface" padding="lg" className="h-full">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
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
        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <DSButton asChild variant="ghost" size="md">
              <Link to="/about">
                See the full toolkit
                <ArrowUpRight />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      {/* 8 — Certificates */}
      <Section id="certificates" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Certificates"
            title="Learning, on the record."
            description="Formal credentials from teams whose work I respect."
            actions={
              <span className="hidden items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground md:inline-flex">
                <Award className="size-3.5" aria-hidden />
                {certificates.length} verified
              </span>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="md">
              {certificates.map((c) => (
                <CertificateCard key={c.title} certificate={c} />
              ))}
            </Grid>
          </div>
        </Reveal>
      </Section>

      {/* 9 — Testimonials */}
      <Section id="testimonials" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Testimonials"
            title="What partners say."
            description="A few kind words from the people I've shipped alongside."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12">
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
              {featuredTestimonials.map((t) => (
                <TestimonialQuote key={t.id} testimonial={t} />
              ))}
            </Grid>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <DSButton asChild variant="outline" size="md">
              <Link to="/contact">
                Become the next case study
                <ArrowRight />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      {/* 10 — Current Focus */}
      <Section id="now" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Now"
            title="What I'm focused on this quarter."
            description="A short, updated list — three problems getting my time and attention right now."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              {currentFocus.map((item) => {
                const Icon = item.icon;
                return (
                  <DSCard
                    key={item.title}
                    variant="surface"
                    padding="lg"
                    className="relative h-full overflow-hidden"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-2xl"
                    />
                    <div className="relative">
                      <span className="grid size-10 place-items-center rounded-md border border-border/60 bg-background text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      {/* 11 — Ideas Lab */}
      <Section id="ideas" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Ideas Lab"
            title="Half-formed things, in the open."
            description="Concepts, experiments, and prototypes I'm exploring — some will ship, most won't."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/ideas">
                  Browse the lab
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10">
            <Grid cols={{ base: 1, md: 3 }} gap="md">
              {ideas.map((idea) => {
                const Icon = idea.icon;
                return (
                  <DSCard
                    key={idea.title}
                    variant="outline"
                    padding="lg"
                    className="group h-full transition-colors hover:border-border"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <DSBadge variant="subtle">{idea.tag}</DSBadge>
                    </div>
                    <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                      {idea.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{idea.description}</p>
                    <Link
                      to="/ideas"
                      className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      Follow along
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </DSCard>
                );
              })}
            </Grid>
          </div>
        </Reveal>
      </Section>

      {/* 12 — Latest Articles */}
      <Section id="writing" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="Writing"
            title="Latest essays."
            description="Short notes on design, engineering, and the practice of shipping."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/blog">
                  All essays
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
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
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex justify-center">
            <DSButton asChild variant="outline" size="md">
              <Link to="/blog">
                Read the blog
                <ArrowRight />
              </Link>
            </DSButton>
          </div>
        </Reveal>
      </Section>

      {/* 13 — Contact CTA */}
      <Section className="border-t border-border/60">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-16 md:px-16 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/10 via-accent/5 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-accent/20 blur-3xl"
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                <ShieldCheck className="size-3.5" aria-hidden />
                Booking new engagements for this quarter
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">
                Let's build something worth shipping.
              </h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                Whether you're launching, redesigning, or scaling — start with a short
                conversation. If we're not a fit, I'll tell you.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <DSButton asChild size="lg" variant="primary">
                  <Link to="/contact">
                    Start a project
                    <ArrowRight />
                  </Link>
                </DSButton>
                <DSButton asChild size="lg" variant="outline">
                  <Link to="/services">
                    <Figma />
                    See services
                  </Link>
                </DSButton>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Typical reply time · within 24 hours · {site.location}
              </p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
