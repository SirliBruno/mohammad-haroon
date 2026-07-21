import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { buildMeta } from "@/features/seo/build-meta";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";

import { Hero } from "@/components/sections/hero";
import {
  CertificateCard,
  CTA,
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
import { projects as staticProjects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI, StoreUI, EditorUI } from "@/components/mockups/ui-samples";
import { useHomeContent, getHomeText, getHomeList } from "@/lib/cms/home-content";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPublicProjects } from "@/lib/cms/projects-public.functions";
import { toProject } from "@/lib/project-adapter";

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
  const listFn = useServerFn(listPublicProjects);
  const featuredQ = useQuery({
    queryKey: ["home", "featured"],
    queryFn: () => listFn({ data: { featured: true, limit: 3 } }),
    staleTime: 60_000,
  });
  const cmsFeatured = (featuredQ.data?.rows ?? []).map(toProject);
  const featured = cmsFeatured.length
    ? cmsFeatured
    : staticProjects.filter((p) => p.featured).slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);
  const { data: homeRows } = useHomeContent();
  const t = (k: string, fb: string) => getHomeText(homeRows, k, fb);
  const homeServicesLive = getHomeList<(typeof homeServices)[number]>(
    homeRows,
    "home.services.items",
    homeServices,
  );
  const workflowLive = getHomeList<(typeof workflow)[number]>(
    homeRows,
    "home.process.steps",
    workflow,
  );
  const certsLive = getHomeList<Certificate>(
    homeRows,
    "home.certificates.items",
    certificates,
  );

  return (
    <>
      <Hero />

      {/* ================= FEATURED PROJECTS ================= */}
      <Section id="work" className="border-t border-border/60" size="lg">
        <Reveal>
          <SectionTitle
            eyebrow={t("home.featured.eyebrow", "أعمال مختارة")}
            title={t("home.featured.title", "مختـــــــارات من شغـــــــــلي.")}
            description={t(
              "home.featured.description",
              "مشاريع وانظمة برمجية صُممت لتحقيق أهداف فعلية، لا مجرد مظهر جميل.",
            )}
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/work">
                  {t("home.featured.view_all", "كل الأعمال")}
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>

        <div className="mt-24 space-y-32 md:mt-32 md:space-y-56">
          {featured.map((project) => {
            const MockupUI = featuredMockups[project.slug] ?? DashboardUI;
            return (
              <Reveal key={project.slug}>
                <article className="mx-auto max-w-7xl">


                  {/* Screenshot — the hero of the section */}
                  <Link
                    to="/work/$slug"
                    params={{ slug: project.slug }}
                    className="group relative block"
                    aria-label={project.title}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-linear-to-br from-primary/12 via-accent/8 to-transparent blur-3xl"
                    />
                    {/* Replace this <BrowserFrame> content with <img src="..." /> when a real screenshot exists. */}
                    {project.cover?.src ? (
                      <BrowserFrame
                        url={
                          project.liveDemo
                            ? new URL(project.liveDemo).host
                            : `${project.slug}.app`
                        }
                        className="transition-transform duration-700 ease-out group-hover:-translate-y-1"
                      >
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
                        className="transition-transform duration-700 ease-out group-hover:-translate-y-1"
                      >
                        <MockupUI />
                      </BrowserFrame>
                    )}
                  </Link>

                  {/* Minimal caption */}
                  <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end md:gap-16">
                    <div className="min-w-0">
                      <h3 className="text-3xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">
                        {project.title}
                      </h3>
                      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                        {project.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <DSButton asChild variant="primary" size="md">
                        <Link to="/work/$slug" params={{ slug: project.slug }}>
                          دراسة الحالة
                          <ArrowLeft />
                        </Link>
                      </DSButton>
                      {project.liveDemo ? (
                        <DSButton asChild variant="ghost" size="md">
                          <a href={project.liveDemo} target="_blank" rel="noreferrer">
                            <ExternalLink />
                            معاينة حيّة
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
            eyebrow={t("home.services.eyebrow", "الخدمات")}
            title={t("home.services.title", "ما الذي أُقدّمه.")}
            description={t(
              "home.services.description",
              "خدمات قصيرة الوصف، واضحة النتيجة — لا مصطلحات، ولا وعود مفتوحة.",
            )}
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/services">
                  {t("home.services.view_all", "كل الخدمات")}
                  <ArrowUpRight />
                </Link>
              </DSButton>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md" className="mt-12">
            {homeServicesLive.map((s) => (
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
            eyebrow={t("home.process.eyebrow", "طريقة العمل")}
            title={t("home.process.title", "من فكرة إلى منتج مُطلَق.")}
            description={t(
              "home.process.description",
              "عملية مُنظّمة من ستّ مراحل، مُصمّمة للوضوح وسرعة اتّخاذ القرار.",
            )}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
            {workflowLive.map((w) => (
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
            eyebrow={t("home.experience.eyebrow", "المسيرة")}
            title={t("home.experience.title", "محطات مختصرة.")}
            description={t(
              "home.experience.description",
              "نظرة سريعة على الأدوار التي شكّلت طريقتي في العمل.",
            )}
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/career">
                  {t("home.experience.view_all", "السيرة الكاملة")}
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
            eyebrow={t("home.certificates.eyebrow", "الشهادات")}
            title={t("home.certificates.title", "تعلُّم مُستمر.")}
            description={t(
              "home.certificates.description",
              "شهادات مختارة من برامج تُواكب صناعة المنتجات الرقمية.",
            )}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md" className="mt-12">
            {certsLive.map((c) => (
              <CertificateCard key={c.title} certificate={c} />
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= TESTIMONIALS ================= */}
      <Section id="testimonials" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow={t("home.testimonials.eyebrow", "شهادات")}
            title={t("home.testimonials.title", "بكلمات من عملت معهم.")}
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
      <Reveal>
        <CTA
          className="border-t border-border/60"
          eyebrow={t("home.cta.eyebrow", "لنبدأ")}
          title={t("home.cta.title", "لنُطلق معًا شيئًا يستحقّ.")}
          description={t(
            "home.cta.description",
            "محادثة قصيرة تكفي لنعرف إن كنّا الشريكين المناسبين لهذا المشروع.",
          )}
          actions={
            <>
              <DSButton asChild size="lg" variant="primary">
                <Link to="/contact">
                  {t("home.cta.primary_label", "تواصل معي")}
                  <ArrowLeft />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/work">
                  {t("home.cta.secondary_label", "استعرض الأعمال")}
                  <ArrowUpRight />
                </Link>
              </DSButton>
            </>
          }
        />
      </Reveal>
    </>
  );
}
