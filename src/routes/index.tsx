import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
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
  TestimonialQuote,
  Timeline,
  type Certificate,
  type TimelineItem,
} from "@/components/ds";
import { site } from "@/config/site";
import { projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI, StoreUI, EditorUI } from "@/components/mockups/ui-samples";

/* ---------------- Home-only data ---------------- */

const homeServices = [
  {
    slug: "web-development",
    title: "مواقع أعمال",
    outcome: "مواقع حديثة تحوّل الزوّار إلى عملاء.",
    tags: ["React", "Next.js", "TanStack"],
  },
  {
    slug: "ecommerce",
    title: "متاجر إلكترونية",
    outcome: "متاجر مكتملة، جاهزة للنموّ من اليوم الأول.",
    tags: ["Shopify", "WooCommerce", "Stripe"],
  },
  {
    slug: "ui-ux-design",
    title: "تصميم واجهات وتجربة",
    outcome: "تجارب رقمية يستمتع المستخدمون باستخدامها.",
    tags: ["Figma", "أنظمة تصميم", "بحث UX"],
  },
  {
    slug: "wordpress",
    title: "ووردبريس",
    outcome: "مواقع سريعة، قابلة للتوسّع، وسهلة الإدارة.",
    tags: ["WordPress", "WooCommerce", "SEO"],
  },
];

const workflow = [
  { step: "01", title: "اكتشاف", description: "أفهم أهدافك وجمهورك ومنافسيك قبل أي خط." },
  { step: "02", title: "استراتيجية", description: "نُحدّد النطاق والنتائج وخارطة الطريق." },
  { step: "03", title: "تصميم", description: "واجهة واضحة، ونظام قابل للتوسّع، ومعاينة قابلة للاختبار." },
  { step: "04", title: "تطوير", description: "كود نظيف، أداء عالٍ، وجاهزية للنشر من اليوم الأول." },
  { step: "05", title: "إطلاق", description: "نشر مُراقَب، وضبط SEO، وتتبّع تحليلات فعلي." },
  { step: "06", title: "دعم", description: "متابعة بعد الإطلاق، وتحديثات، وقياس النتائج." },
];

const certificates: Certificate[] = [
  { title: "مطوّر واجهات أمامية — Meta", issuer: "Meta", issuedAt: "2025" },
  { title: "تصميم تجربة المستخدم — Google", issuer: "Google", issuedAt: "2024" },
  { title: "شهادة شريك Shopify", issuer: "Shopify", issuedAt: "2024" },
  { title: "أنماط React المتقدمة", issuer: "Frontend Masters", issuedAt: "2024" },
];

const timeline: TimelineItem[] = [
  {
    date: "2025 — حتى الآن",
    title: "مهندس منتجات مستقل",
    meta: "عمل حر · عن بُعد",
    description:
      "شراكات مع رواد الأعمال لتصميم وإطلاق منتجات ويب متميزة، ومتاجر إلكترونية، وأنظمة تصميم.",
  },
  {
    date: "2024",
    title: "مهندس تصميم",
    meta: "استوديوهات منتجات متخصصة",
    description:
      "قدت أعمال الواجهات عبر لوحات التحكم والمحرّرات والصفحات التسويقية لفرق SaaS في مراحلها المبكرة.",
  },
  {
    date: "2023",
    title: "مطوّر واجهات أمامية",
    meta: "عقود مع وكالات",
    description:
      "أطلقت متاجر Shopify وHeadless لعلامات نمط الحياة والعلامات التجارية المباشرة للمستهلك.",
  },
];

/* Slot component for the featured case studies. Users can later
   swap `<UI />` with `<img src="..." />` to replace the placeholder. */
const featuredMockups: Record<string, React.ComponentType> = {
  "northwind-analytics": DashboardUI,
  "lumen-payments": DashboardUI,
  "atelier-cms": EditorUI,
  "haven-storefront": StoreUI,
};

/* ---------------- Route ---------------- */

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
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <>
      <Hero />

      {/* ================= FEATURED PROJECTS ================= */}
      <Section id="work" className="border-t border-border/60" size="lg">
        <Reveal>
          <SectionTitle
            eyebrow="أعمال مختارة"
            title="منتجات صمّمتها وأطلقتها."
            description="دراسات حالة موجزة لمنتجات حقيقية — من الفكرة إلى الإطلاق."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/work">
                  كل الأعمال
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>

        <div className="mt-16 space-y-24 md:mt-24 md:space-y-40">
          {featured.map((project, i) => {
            const MockupUI = featuredMockups[project.slug] ?? DashboardUI;
            const reversed = i % 2 === 1;
            return (
              <Reveal key={project.slug}>
                <article
                  className={`grid items-center gap-10 lg:gap-16 ${
                    reversed
                      ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
                      : "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
                  }`}
                >
                  {/* Mockup */}
                  <div className={reversed ? "lg:order-2" : ""}>
                    <div className="relative">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-linear-to-br from-primary/12 via-accent/8 to-transparent blur-2xl"
                      />
                      {/* Replace <MockupUI /> below with <img src="..." /> when you have real screenshots. */}
                      {project.cover?.src ? (
                        <BrowserFrame url={new URL(project.liveDemo ?? "https://example.com").host}>
                          <img
                            src={project.cover.src}
                            alt={project.cover.alt}
                            className="size-full object-cover"
                          />
                        </BrowserFrame>
                      ) : (
                        <BrowserFrame
                          url={
                            project.liveDemo
                              ? new URL(project.liveDemo).host
                              : `${project.slug}.app`
                          }
                        >
                          <MockupUI />
                        </BrowserFrame>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={reversed ? "lg:order-1" : ""}>
                    <div className="flex items-center gap-2 text-xs tracking-[0.14em] text-muted-foreground">
                      <span>مشروع {String(i + 1).padStart(2, "0")}</span>
                      <span aria-hidden>·</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                      {project.summary}
                    </p>

                    <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border/60 py-6 text-sm">
                      <div>
                        <dt className="text-xs tracking-[0.14em] text-muted-foreground">
                          نوع العميل
                        </dt>
                        <dd className="mt-1.5 font-medium text-foreground">
                          {project.client ?? "منتج ذاتي"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs tracking-[0.14em] text-muted-foreground">
                          القطاع
                        </dt>
                        <dd className="mt-1.5 font-medium text-foreground">{project.category}</dd>
                      </div>
                    </dl>

                    {project.stack.length ? (
                      <div className="mt-6">
                        <p className="text-xs tracking-[0.14em] text-muted-foreground">
                          التقنيات
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.stack.slice(0, 6).map((s) => (
                            <DSBadge key={s} variant="outline">
                              {s}
                            </DSBadge>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {project.metrics?.length ? (
                      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {project.metrics.slice(0, 3).map((m) => (
                          <li key={m.label}>
                            <p className="text-2xl font-semibold tracking-tight text-foreground">
                              {m.value}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <DSButton asChild variant="primary" size="md">
                        <Link to="/work/$slug" params={{ slug: project.slug }}>
                          دراسة الحالة
                          <ArrowLeft />
                        </Link>
                      </DSButton>
                      {project.liveDemo ? (
                        <DSButton asChild variant="outline" size="md">
                          <a href={project.liveDemo} target="_blank" rel="noreferrer">
                            <ExternalLink />
                            المعاينة الحيّة
                          </a>
                        </DSButton>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ================= SERVICES ================= */}
      <Section id="services" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="الخدمات"
            title="ما الذي أُقدّمه."
            description="خدمات قصيرة الوصف، واضحة النتيجة — لا مصطلحات، ولا وعود مفتوحة."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/services">
                  كل الخدمات
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md" className="mt-12">
            {homeServices.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group block h-full"
              >
                <DSCard
                  variant="surface"
                  padding="lg"
                  className="flex h-full flex-col transition-colors group-hover:border-border"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.outcome}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-8 text-xs font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                    اقرأ التفاصيل
                    <ArrowUpRight className="ms-1 inline size-3.5" aria-hidden />
                  </div>
                </DSCard>
              </Link>
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= HOW I WORK ================= */}
      <Section id="process" className="border-t border-border/60" size="lg">
        <Reveal>
          <SectionTitle
            eyebrow="طريقة العمل"
            title="من فكرة إلى منتج مُطلَق."
            description="عملية مُنظّمة من ستّ مراحل، مُصمّمة للوضوح وسرعة اتّخاذ القرار."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
            {workflow.map((w) => (
              <li key={w.step} className="group flex flex-col bg-background p-8 transition-colors hover:bg-muted/40 md:p-10">
                <div className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
                  {w.step}
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {w.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {w.description}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* ================= EXPERIENCE ================= */}
      <Section id="experience" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="المسيرة"
            title="محطات مختصرة."
            description="نظرة سريعة على الأدوار التي شكّلت طريقتي في العمل."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/career">
                  السيرة الكاملة
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12 max-w-3xl">
            <Timeline items={timeline} />
          </div>
        </Reveal>
      </Section>

      {/* ================= CERTIFICATES ================= */}
      <Section id="certificates" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="الشهادات"
            title="تعلُّم مُستمر."
            description="شهادات مختارة من برامج تُواكب صناعة المنتجات الرقمية."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md" className="mt-12">
            {certificates.map((c) => (
              <CertificateCard key={c.title} certificate={c} />
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= TESTIMONIALS ================= */}
      <Section id="testimonials" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="شهادات"
            title="بكلمات من عملت معهم."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Grid cols={{ base: 1, md: 3 }} gap="md" className="mt-12">
            {featuredTestimonials.map((t) => (
              <TestimonialQuote key={t.author} testimonial={t} />
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= FINAL CTA ================= */}
      <Section className="border-t border-border/60" size="lg">
        <Reveal>
          <Container>
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-20 text-center md:px-16 md:py-28">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] bg-linear-to-b from-primary/12 via-accent/6 to-transparent"
              />
              <p className="text-xs tracking-[0.2em] text-muted-foreground">
                لنبدأ
              </p>
              <h2 className="mt-4 mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-foreground text-balance md:text-6xl">
                لنُطلق معًا شيئًا يستحقّ.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
                محادثة قصيرة تكفي لنعرف إن كنّا الشريكين المناسبين لهذا المشروع.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <DSButton asChild size="lg" variant="primary">
                  <Link to="/contact">
                    تواصل معي
                    <ArrowLeft />
                  </Link>
                </DSButton>
                <DSButton asChild size="lg" variant="outline">
                  <Link to="/work">
                    استعرض الأعمال
                    <ArrowUpRight />
                  </Link>
                </DSButton>
              </div>
              <p className="mt-8 text-xs text-muted-foreground">
                متوسّط الرد · خلال 24 ساعة · {site.location}
              </p>
            </div>
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
