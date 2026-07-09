import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Languages as LanguagesIcon,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
import { Eyebrow } from "@/components/typography/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { AvailabilityBadge } from "@/components/ds/availability-badge";
import { DSButton, DSCard, Grid } from "@/components/ds";
import { site } from "@/config/site";
import { socials } from "@/config/socials";
import {
  awards,
  certificates,
  education,
  experience,
  languages,
  resumeMeta,
  skillGroups,
  type ExperienceItem,
} from "@/data/career";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: buildMeta({
      title: "Career — Experience, Education & Resume",
      description: `${site.name}'s professional experience, education, certificates, skills, languages and awards. Download the latest resume — ${site.availabilityLabel.toLowerCase()}.`,
      path: "/career",
      type: "profile",
    }),
    links: [{ rel: "canonical", href: "/career" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.name,
          jobTitle: site.role,
          description: site.description,
          url: `${site.url}/career`,
          email: site.email,
          address: { "@type": "PostalAddress", addressLocality: site.location },
          knowsLanguage: languages.map((l) => l.name),
          alumniOf: education.map((e) => ({
            "@type": "EducationalOrganization",
            name: e.school,
          })),
          worksFor: experience.slice(0, 3).map((e) => ({
            "@type": "Organization",
            name: e.company,
          })),
          hasCredential: certificates.map((c) => ({
            "@type": "EducationalOccupationalCredential",
            name: c.name,
            credentialCategory: "certificate",
            recognizedBy: { "@type": "Organization", name: c.issuer },
          })),
          award: awards.map((a) => a.title),
          sameAs: socials
            .filter((s) => s.href.startsWith("http"))
            .map((s) => s.href),
        }),
      },
    ],
  }),
  component: CareerPage,
});

function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <SectionTitle eyebrow={eyebrow} title={title} size="sm" id={id} className="scroll-mt-24" />
  );
}


function CareerPage() {
  const linkedin = socials.find((s) => s.label.toLowerCase() === "linkedin");
  const emailContact = socials.find((s) => s.label.toLowerCase() === "email");

  return (
    <>
      <PageHeader
        eyebrow="Career"
        title="Experience, education and everything in between"
        description={`${site.role} with a track record of shipping premium, considered products. Built for recruiters — quick to scan, easy to verify, ready to download.`}
      />

      {/* Availability + quick actions */}
      <Section className="pt-10 md:pt-12">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                {site.available ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex size-2">
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    {site.availabilityLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    Not currently available
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden /> {site.location}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" aria-hidden /> Resume updated {resumeMeta.updated}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground md:text-xl">
                {site.name} — {site.role}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {site.tagline}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DSButton asChild size="lg">
                <a href={resumeMeta.href} download={resumeMeta.fileName}>
                  <Download /> Download resume
                </a>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/contact">
                  <Mail /> Contact me
                </Link>
              </DSButton>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Body + Sticky Recruiter Sidebar */}
      <Section className="pt-8 md:pt-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-16">
            {/* Experience Timeline */}
            <Reveal>
              <SectionHeading
                id="experience"
                eyebrow="Experience"
                title="Professional timeline"
              />
              <ol className="mt-8 relative border-s border-border/60 ps-6 md:ps-8">
                {experience.map((item, i) => (
                  <ExperienceEntry key={`${item.company}-${i}`} item={item} />
                ))}
              </ol>
            </Reveal>

            {/* Education */}
            <Reveal>
              <SectionHeading
                id="education"
                eyebrow="Education"
                title="Where I studied"
              />
              <div className="mt-8">
                <Grid cols={{ base: 1, md: 2 }} gap="md">
                  {education.map((e) => (
                    <DSCard
                      key={e.school + e.degree}
                      variant="surface"
                      padding="lg"
                      className="flex h-full flex-col"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid size-10 place-items-center rounded-lg border border-border/60 bg-muted/50 text-primary">
                          <GraduationCap className="size-5" aria-hidden />
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {e.period}
                        </span>
                      </div>
                      <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                        {e.degree}
                      </h3>
                      <p className="mt-1 text-sm text-foreground/80">{e.school}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{e.location}</p>
                      {e.detail ? (
                        <p className="mt-4 text-sm text-muted-foreground">{e.detail}</p>
                      ) : null}
                    </DSCard>
                  ))}
                </Grid>
              </div>
            </Reveal>

            {/* Certificates */}
            <Reveal>
              <SectionHeading
                id="certificates"
                eyebrow="Certificates"
                title="Verified credentials"
              />
              <div className="mt-8">
                <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
                  {certificates.map((c) => (
                    <DSCard
                      key={c.name + c.issuer}
                      variant="surface"
                      padding="lg"
                      className="flex h-full flex-col"
                    >
                      <div className="flex items-center justify-between">
                        <span className="grid size-9 place-items-center rounded-lg border border-border/60 bg-muted/50 text-primary">
                          <Award className="size-4" aria-hidden />
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {c.year}
                        </span>
                      </div>
                      <h3 className="mt-4 text-sm font-semibold tracking-tight text-foreground">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">{c.issuer}</p>
                      {c.credentialId ? (
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          ID: {c.credentialId}
                        </p>
                      ) : null}
                      {c.href ? (
                        <a
                          href={c.href}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          Verify <ExternalLink className="size-3" aria-hidden />
                        </a>
                      ) : null}
                    </DSCard>
                  ))}
                </Grid>
              </div>
            </Reveal>

            {/* Skills */}
            <Reveal>
              <SectionHeading
                id="skills"
                eyebrow="Skills"
                title="What I bring to the table"
              />
              <div className="mt-8">
                <Grid cols={{ base: 1, md: 2 }} gap="md">
                  {skillGroups.map((group) => (
                    <DSCard
                      key={group.title}
                      variant="surface"
                      padding="lg"
                      className="flex h-full flex-col"
                    >
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {group.title}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {group.items.map((s) => (
                          <li
                            key={s}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground/85"
                          >
                            <CheckCircle2 className="size-3 text-primary" aria-hidden />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </DSCard>
                  ))}
                </Grid>
              </div>
            </Reveal>

            {/* Languages */}
            <Reveal>
              <SectionHeading
                id="languages"
                eyebrow="Languages"
                title="How I communicate"
              />
              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {languages.map((l) => (
                  <li
                    key={l.name}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4"
                  >
                    <span
                      aria-hidden
                      className="grid size-10 place-items-center rounded-lg border border-border/60 bg-muted/50 text-xs font-semibold tracking-wider text-foreground"
                    >
                      {l.code ?? <LanguagesIcon className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.level}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Awards */}
            <Reveal>
              <SectionHeading
                id="awards"
                eyebrow="Awards"
                title="Recognition"
              />
              <ol className="mt-8 space-y-3">
                {awards.map((a) => (
                  <li
                    key={a.title + a.year}
                    className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border/60 bg-muted/50 text-primary">
                      <Sparkles className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {a.title}
                        </h3>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {a.year}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{a.issuer}</p>
                      {a.description ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {a.description}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* Resume + Recruiter CTA */}
            <Reveal>
              <div
                id="resume"
                className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 md:p-10"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/8 to-transparent"
                />
                <Eyebrow>For recruiters &amp; hiring managers</Eyebrow>
                <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
                  Everything you need in one page
                </h2>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
                  Download a printer-friendly resume, book a short intro call, or reach out with a role — I reply to every message within 48 hours.
                </p>
                <ul className="mt-6 grid gap-2 text-sm text-foreground/85 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" aria-hidden />
                    Open to full-time &amp; contract
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" aria-hidden />
                    Remote-first, flexible with time zones
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" aria-hidden />
                    References available on request
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" aria-hidden />
                    Notice period: 2 weeks
                  </li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-2">
                  <DSButton asChild size="lg">
                    <a href={resumeMeta.href} download={resumeMeta.fileName}>
                      <Download /> Download resume (PDF)
                    </a>
                  </DSButton>
                  <DSButton asChild size="lg" variant="outline">
                    <Link to="/contact">
                      Send a role <ArrowRight />
                    </Link>
                  </DSButton>
                  {linkedin ? (
                    <DSButton asChild size="lg" variant="ghost">
                      <a href={linkedin.href} target="_blank" rel="noreferrer">
                        LinkedIn <ExternalLink />
                      </a>
                    </DSButton>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sticky Recruiter Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Quick facts
              </p>
              <dl className="mt-5 space-y-4 text-sm">
                <SidebarRow icon={Briefcase} label="Role" value={site.role} />
                <SidebarRow icon={MapPin} label="Location" value={site.location} />
                <SidebarRow
                  icon={Building2}
                  label="Availability"
                  value={site.available ? site.availabilityLabel : "Not available"}
                />
                <SidebarRow
                  icon={Calendar}
                  label="Notice period"
                  value="2 weeks"
                />
                <SidebarRow
                  icon={FileText}
                  label="Resume updated"
                  value={resumeMeta.updated}
                />
              </dl>

              <div className="mt-6 space-y-2 border-t border-border/60 pt-6">
                <DSButton asChild className="w-full" size="sm">
                  <a href={resumeMeta.href} download={resumeMeta.fileName}>
                    <Download /> Download resume
                  </a>
                </DSButton>
                {emailContact ? (
                  <DSButton asChild className="w-full" size="sm" variant="outline">
                    <a href={emailContact.href}>
                      <Mail /> Email me
                    </a>
                  </DSButton>
                ) : null}
                {linkedin ? (
                  <DSButton asChild className="w-full" size="sm" variant="ghost">
                    <a href={linkedin.href} target="_blank" rel="noreferrer">
                      LinkedIn <ExternalLink />
                    </a>
                  </DSButton>
                ) : null}
              </div>

              <nav
                aria-label="On this page"
                className="mt-6 border-t border-border/60 pt-6"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  On this page
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {[
                    { href: "#experience", label: "Experience" },
                    { href: "#education", label: "Education" },
                    { href: "#certificates", label: "Certificates" },
                    { href: "#skills", label: "Skills" },
                    { href: "#languages", label: "Languages" },
                    { href: "#awards", label: "Awards" },
                    { href: "#resume", label: "Resume" },
                  ].map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </Section>
    </>
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

function ExperienceEntry({ item }: { item: ExperienceItem }) {
  return (
    <li className="relative pb-10 last:pb-0">
      <span
        aria-hidden
        className="absolute -start-[33px] top-1 grid size-6 place-items-center rounded-full border border-border/60 bg-background md:-start-[41px]"
      >
        <span className="size-2 rounded-full bg-primary" />
      </span>
      <div className="rounded-xl border border-border/60 bg-card p-6 transition-colors hover:border-foreground/20">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="tabular-nums">{item.period}</span>
          <span aria-hidden>·</span>
          <span>{item.location}</span>
          <span aria-hidden>·</span>
          <span className="rounded-full border border-border/60 bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
            {item.type}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          {item.role}
        </h3>
        <p className="mt-0.5 text-sm text-foreground/80">{item.company}</p>
        <p className="mt-3 text-sm text-muted-foreground">{item.summary}</p>
        {item.highlights.length ? (
          <ul className="mt-4 space-y-2">
            {item.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle2
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                  aria-hidden
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {item.stack?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
            {item.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground/70"
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}
