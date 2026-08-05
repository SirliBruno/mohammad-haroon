import { useState, useRef, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Globe,
  Zap,
  ShieldCheck,
  Layout,
  Code2,
  Terminal,
  Layers,
  Cpu,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { buildMeta } from "@/features/seo/build-meta";
import { Section } from "@/components/layout/section";
import { SectionTitle } from "@/components/layout/section-title";
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
import { testimonials as staticTestimonials } from "@/data/testimonials";
import { BrowserFrame } from "@/components/mockups/devices";
import { DashboardUI, StoreUI, EditorUI } from "@/components/mockups/ui-samples";
import { useHomeContent, getHomeText } from "@/lib/cms/home-content";
import { listPublicProjects } from "@/lib/cms/projects-public.functions";
import { listTestimonials } from "@/lib/cms/simple.functions";
import { toProject } from "@/lib/project-adapter";

/* ---------------- Route ---------------- */

export const Route = createFileRoute("/home2")({
  component: Home2Page,
  head: () => ({
    meta: buildMeta({
      title: "محمد هارون — مهندس ومنتج رقمي | الرئيسية 2.0",
      description: site.description,
      path: "/home2",
    }),
  }),
});

/* ---------------- Data & Mockups ---------------- */

const featuredMockups: Record<string, React.ComponentType> = {
  "northwind-analytics": DashboardUI,
  "lumen-payments": DashboardUI,
  "atelier-cms": EditorUI,
  "haven-storefront": StoreUI,
};

const homeServicesData = [
  {
    slug: "web-development",
    title: "مواقع أعمال فاخرة",
    outcome: "واجهات فائقة السرعة، مصممة بأعلى معايير تحويل الزوار إلى عملاء فعليين.",
    tags: ["React", "Next.js", "TanStack"],
    metric: "+40 مشروع مُنجز",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    size: "lg" as const,
  },
  {
    slug: "ecommerce",
    title: "متاجر إلكترونية",
    outcome: "تجربة تسوق سلسة وجاهزة للنمو وتكامل مع بوابات الدفع.",
    tags: ["Shopify", "WooCommerce", "Stripe"],
    metric: "Stripe + WooCommerce",
    iconPath: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    size: "sm" as const,
  },
  {
    slug: "ui-ux-design",
    title: "تصميم واجهات",
    outcome: "أنظمة تصميم متكاملة (Design Systems) وتجارب تضع المستخدم في المركز.",
    tags: ["Figma", "Design Systems", "UX Research"],
    metric: "Figma + Atomic Design",
    iconPath: "M12 2a5 5 0 100 10A5 5 0 0012 2zM2 20s1-3 10-3 10 3 10 3",
    size: "sm" as const,
  },
  {
    slug: "wordpress",
    title: "حلول WordPress",
    outcome: "قوالب مخصصة، أمان عالٍ، وسرعة فائقة بدون تضخم الإضافات.",
    tags: ["WordPress", "Gutenberg", "Headless"],
    metric: "أمان + سرعة 100%",
    iconPath: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 12h10M12 7v10",
    size: "lg" as const,
  },
];

const processSteps = [
  { step: "01", title: "الاكتشاف والتحليل", description: "فهم أهدافك، نيتش الجمهور، والمنافسين لوضع أساس متين." },
  { step: "02", title: "الهندسة والاستراتيجية", description: "تحديد تجربة المستخدم، خريطة الطريق، وتقنيات الحل الأنسب." },
  { step: "03", title: "التصميم والتفاعل", description: "بناء واجهات ناعمة ونماذج أولية تفاعلية بأسلوب عصري." },
  { step: "04", title: "التطوير والتنفيذ", description: "كود نظيف، استجابة تامة، وأداء عالٍ وفق أعلى المعايير." },
  { step: "05", title: "الاختبار والإطلاق", description: "ضمان الجودة، التحقق من الوصولية (WCAG)، وضبط SEO." },
  { step: "06", title: "الدعم والنمو", description: "متابعة بعد الإطلاق لقياس الأداء وإحداث التحسين المستمر." },
];

const techStack = [
  { name: "React 19", category: "Frontend", icon: Code2 },
  { name: "TypeScript", category: "Language", icon: Terminal },
  { name: "Next.js", category: "Framework", icon: Globe },
  { name: "TanStack", category: "Architecture", icon: Layers },
  { name: "Tailwind CSS", category: "Styling", icon: Layout },
  { name: "Figma", category: "Design", icon: Layout },
  { name: "Node.js", category: "Backend", icon: Cpu },
  { name: "Supabase", category: "Database", icon: ShieldCheck },
];

const clientProofLogos = ["Northwind Analytics", "Lumen Payments", "Atelier CMS", "Haven Storefront"];

const certificatesList: Certificate[] = [
  { title: "مطوّر واجهات أمامية — Meta", issuer: "Meta", issuedAt: "2025" },
  { title: "تصميم تجربة المستخدم — Google", issuer: "Google", issuedAt: "2024" },
  { title: "شهادة شريك Shopify", issuer: "Shopify", issuedAt: "2024" },
  { title: "أنماط React المتقدمة", issuer: "Frontend Masters", issuedAt: "2024" },
];

const timelineData: TimelineItem[] = [
  {
    date: "2025 — حتى الآن",
    title: "مهندس منتجات مستقل",
    meta: "عمل حر · عن بُعد",
    description: "شراكات مع الشركات والأنشطة الرقمية لبناء واجهات ومنتجات SaaS ومتاجر عالية التحويل.",
  },
  {
    date: "2024",
    title: "مهندس تصميم واجهات (Design Engineer)",
    meta: "استوديوهات منتجات متخصصة",
    description: "قدت أعمال الواجهات عبر لوحات التحكم والمحرّرات والصفحات التسويقية لفرق SaaS في مراحلها المبكرة.",
  },
  {
    date: "2023",
    title: "مطوّر واجهات أمامية",
    meta: "عقود مع وكالات تقنية",
    description: "أطلقت متاجر Shopify وHeadless لعلامات تجارية متميزة.",
  },
];

/* ---------------- Main Page Component ---------------- */

function Home2Page() {
  const listFn = useServerFn(listPublicProjects);
  const testFn = useServerFn(listTestimonials);

  const featuredQ = useQuery({
    queryKey: ["home2", "featured"],
    queryFn: () => listFn({ data: { featured: true, limit: 3 } }),
    staleTime: 60_000,
  });

  const testimonialsQ = useQuery({
    queryKey: ["home2", "testimonials"],
    queryFn: () => testFn({ data: { featured: true, limit: 3, orderBy: "sort_order", ascending: true } }),
    staleTime: 60_000,
  });

  const cmsFeatured = (featuredQ.data?.rows ?? []).map(toProject);
  const featuredProjects = cmsFeatured.length ? cmsFeatured : staticProjects.filter((p) => p.featured).slice(0, 3);

  const cmsTestimonials = (testimonialsQ.data?.rows ?? []).map((r: any) => ({
    id: r.id,
    quote: r.quote,
    author: r.author_name,
    role: r.author_role ?? "",
    company: r.author_company ?? undefined,
    avatar: r.avatar_url ?? undefined,
  }));
  const featuredTestimonials = cmsTestimonials.length ? cmsTestimonials : staticTestimonials.slice(0, 3);

  const { data: homeRows } = useHomeContent();
  const t = (k: string, fb: string) => getHomeText(homeRows, k, fb);

  return (
    <>
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32 border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-linear-to-b from-primary/10 via-accent/5 to-transparent blur-3xl"
        />

        <div className="container-page flex flex-col items-center text-center">
          <Reveal>
            <DSBadge variant="success" className="animate-pulse">
              متاح لمشاريع جديدة — Q3/Q4 2026
            </DSBadge>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight text-foreground text-balance md:text-7xl">
              أصمّم وأبني منتجات رقمية{" "}
              <span className="text-gradient-brand">تُحقّق نتائج فعلية.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
              مهندس منتجات وواجهات مستخدم متخصص في تحويل المفاهيم المعقدة إلى تجارب ويب فاخرة وسريعة تلفت الانتباه وتزيد المبيعات.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <DSButton asChild size="lg" variant="primary" className="shadow-md">
                <Link to="/work">
                  استعرض الأعمال
                  <ArrowLeft className="ms-1.5 size-4" />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/contact">
                  تواصل معي
                  <ArrowUpRight className="ms-1.5 size-4" />
                </Link>
              </DSButton>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <Grid cols={{ base: 2, sm: 4 }} gap="md" className="mt-16 w-full max-w-4xl">
              <DSCard variant="surface" className="text-center p-6 bg-card/40 backdrop-blur-md">
                <div className="text-3xl font-bold tracking-tight text-foreground tabular-nums">+40</div>
                <div className="mt-1 text-sm text-muted-foreground">مشروع مُنجز</div>
              </DSCard>
              <DSCard variant="surface" className="text-center p-6 bg-card/40 backdrop-blur-md">
                <div className="text-3xl font-bold tracking-tight text-foreground tabular-nums">+25</div>
                <div className="mt-1 text-sm text-muted-foreground">عميل شريك</div>
              </DSCard>
              <DSCard variant="surface" className="text-center p-6 bg-card/40 backdrop-blur-md">
                <div className="text-3xl font-bold tracking-tight text-foreground tabular-nums">98%</div>
                <div className="mt-1 text-sm text-muted-foreground">نسبة الرضا</div>
              </DSCard>
              <DSCard variant="surface" className="text-center p-6 bg-card/40 backdrop-blur-md">
                <div className="text-3xl font-bold tracking-tight text-foreground tabular-nums">+6</div>
                <div className="mt-1 text-sm text-muted-foreground">سنوات خبرة</div>
              </DSCard>
            </Grid>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-16 w-full max-w-4xl border-t border-border/40 pt-8">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">مشاريع ومنتجات شريكة</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
                {clientProofLogos.map((logo) => (
                  <span key={logo} className="text-sm font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= 2. FEATURED WORK ================= */}
      <Section id="work" size="lg">
        <Reveal>
          <SectionTitle
            eyebrow={t("home.featured.eyebrow", "أعمال مختارة")}
            title="مشاريع صُممت لتترك أثراً."
            description="دراسات حالة تفصيلية تبيّن العملية والتنفيذ والأرقام المحققة."
            actions={
              <DSButton asChild variant="ghost" size="sm">
                <Link to="/work">
                  كل الأعمال
                  <ArrowUpRight className="ms-1 size-3.5" />
                </Link>
              </DSButton>
            }
          />
        </Reveal>

        <div className="mt-16 space-y-24 md:mt-24 md:space-y-40">
          {featuredProjects.map((project, idx) => {
            const MockupUI = featuredMockups[project.slug] ?? DashboardUI;
            return (
              <Reveal key={project.slug} delay={idx * 0.1}>
                <article className="mx-auto max-w-6xl">
                  <Link
                    to="/work/$slug"
                    params={{ slug: project.slug }}
                    className="group relative block overflow-hidden rounded-[2.5rem] bg-muted/20"
                    aria-label={project.title}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-linear-to-br from-primary/10 via-accent/5 to-transparent blur-2xl"
                    />
                    <BrowserFrame
                      url={
                        project.liveDemo
                          ? new URL(project.liveDemo).host
                          : `${project.slug}.app`
                      }
                      className="transition-transform duration-700 ease-out group-hover:-translate-y-2"
                    >
                      {project.cover?.src ? (
                        <img
                          src={project.cover.src}
                          alt={project.cover.alt}
                          className="size-full object-cover"
                        />
                      ) : (
                        <MockupUI />
                      )}
                    </BrowserFrame>
                  </Link>

                  <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-end">
                    <div>
                      <div className="flex items-center gap-3">
                        <DSBadge variant="outline">{project.category}</DSBadge>
                        <span className="text-sm text-muted-foreground">{project.year}</span>
                      </div>
                      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                        {project.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                        {project.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <DSButton asChild variant="primary" size="md">
                        <Link to="/work/$slug" params={{ slug: project.slug }}>
                          دراسة الحالة
                          <ArrowLeft className="ms-1.5 size-4" />
                        </Link>
                      </DSButton>
                      {project.liveDemo ? (
                        <DSButton asChild variant="ghost" size="md">
                          <a href={project.liveDemo} target="_blank" rel="noreferrer">
                            معاينة حيّة
                            <ExternalLink className="ms-1.5 size-4" />
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

      {/* ================= 3. SERVICES (BENTO GRID) ================= */}
      <Section id="services" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="الخدمات والحلول"
            title="ما الذي يمكنني القيام به من أجلك."
            description="خدمات مخصصة مبنية للنتائج السريعة والمستدامة."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {homeServicesData.slice(0, 2).map((s, i) => (
              <ServiceBentoCard key={s.slug} service={s as any} prominent={i === 0} />
            ))}
            {homeServicesData.slice(2, 4).map((s, i) => (
              <ServiceBentoCard key={s.slug} service={s as any} prominent={i === 1} />
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ================= 4. HOW I WORK (WORKFLOW) ================= */}
      <Section id="process" className="border-t border-border/60" size="lg">
        <Reveal>
          <SectionTitle
            eyebrow="طريقة العمل"
            title="من فكرة إلى منتج مُطلَق."
            description="مسار شفاف ومحسوب يضمن السرعة والجودة ووضوح القرارات."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="sm" className="mt-16">
            {processSteps.map((step, idx) => (
              <DSCard key={step.step} variant="surface" className="group p-8 transition-colors hover:border-primary/40 hover:bg-muted/30">
                <div className="text-sm font-semibold tracking-widest text-primary/80 group-hover:text-primary">
                  {step.step}
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </DSCard>
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= 5. TECH STACK STRIP ================= */}
      <Section id="stack" className="border-t border-border/60">
        <Reveal>
          <SectionTitle
            eyebrow="أدوات العمل"
            title="التقنيات والأدوات الأساسية."
            description="تقنيات حديثة وموثوقة لضمان أداء عالٍ وسهولة الصيانة."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Grid cols={{ base: 2, sm: 4, lg: 4 }} gap="md" className="mt-12">
            {techStack.map((tech) => {
              const IconComp = tech.icon;
              return (
                <DSCard
                  key={tech.name}
                  variant="surface"
                  padding="sm"
                  className="group flex flex-col items-center gap-4 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-1"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-background text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary/5">
                    <IconComp className="size-6" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground">{tech.name}</div>
                    <div className="text-xs text-muted-foreground">{tech.category}</div>
                  </div>
                </DSCard>
              );
            })}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= 6. SOCIAL PROOF & TESTIMONIALS ================= */}
      <Section id="testimonials" className="border-t border-border/60">
        <Reveal>
          <SectionTitle eyebrow="التقييمات" title="بكلمات من عملت معهم." />
        </Reveal>
        <Reveal delay={0.1}>
          <Grid cols={{ base: 1, md: 3 }} gap="md" className="mt-12">
            {featuredTestimonials.map((tItem) => (
              <TestimonialQuote key={tItem.author} testimonial={tItem} />
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= 7. CAREER & CERTIFICATES ================= */}
      <Section id="career" className="border-t border-border/60">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left Column: Career Timeline */}
          <div className="lg:col-span-7">
            <Reveal>
              <SectionTitle eyebrow="المسيرة" title="محطات مختصرة." />
              <div className="mt-12">
                <Timeline items={timelineData} />
              </div>
            </Reveal>
          </div>

          {/* Right Column: Certificates */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <SectionTitle eyebrow="الاعتمادات" title="تعلُّم مُستمر." />
              <div className="mt-12 space-y-4">
                {certificatesList.map((cert) => (
                  <CertificateCard key={cert.title} certificate={cert} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ================= 8. FINAL CINEMATIC CTA ================= */}
      <Reveal>
        <CTA
          className="border-t border-border/60"
          eyebrow="لنبدأ اليوم"
          title="جاهز لنقل مشروعك للمستوى التالي؟"
          description="محادثة قصيرة تكفي لنستكشف فكرتك ونحدد أفضل السبل لتحقيقها."
          actions={
            <>
              <DSButton asChild size="lg" variant="primary">
                <Link to="/contact">
                  تواصل معي الآن
                  <ArrowLeft className="ms-1.5 size-4" />
                </Link>
              </DSButton>
              <DSButton asChild size="lg" variant="outline">
                <Link to="/work">
                  استعرض الأعمال ↗
                </Link>
              </DSButton>
            </>
          }
        />
      </Reveal>
    </>
  );
}

/* ============================================================
   Service Bento Card Component with Mouse Spotlight (from index.tsx)
   ============================================================ */

type ServiceItem = {
  slug: string;
  title: string;
  outcome: string;
  tags: string[];
  metric?: string;
  size?: "lg" | "sm";
  iconPath?: string;
};

function ServiceBentoCard({
  service,
  prominent = false,
}: {
  service: ServiceItem;
  prominent?: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--spotlight-x", `${x}%`);
    card.style.setProperty("--spotlight-y", `${y}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--spotlight-x", "50%");
    card.style.setProperty("--spotlight-y", "50%");
  }, []);

  return (
    <Link
      ref={cardRef}
      to="/services/$slug"
      params={{ slug: service.slug }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={service.title}
      style={{ "--spotlight-x": "50%", "--spotlight-y": "50%" } as React.CSSProperties}
      className={[
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card",
        "transition-all duration-300 ease-out",
        "active:scale-[0.985]",
        "hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-1",
        "[background-image:radial-gradient(circle_at_var(--spotlight-x)_var(--spotlight-y),color-mix(in_oklab,var(--color-primary)_8%,transparent)_0%,transparent_60%)]",
        prominent ? "lg:row-span-1 min-h-72 lg:min-h-80" : "min-h-60 lg:min-h-64",
        "p-8 sm:p-10",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        {service.iconPath ? (
          <div
            aria-hidden
            className={[
              "flex size-14 shrink-0 items-center justify-center rounded-2xl",
              "border border-border/60 bg-background/80 backdrop-blur-md shadow-sm",
              "transition-all duration-300 ease-out",
              "group-hover:border-primary/40 group-hover:bg-primary/10",
              "motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110",
            ].join(" ")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6 text-muted-foreground transition-colors duration-300 group-hover:text-primary"
              aria-hidden
            >
              <path d={service.iconPath} />
            </svg>
          </div>
        ) : null}

        {service.metric ? (
          <span
            className={[
              "rounded-full border border-border/60 bg-background/80 px-3 py-1.5",
              "text-[11px] font-medium tracking-wide text-muted-foreground backdrop-blur-md shadow-sm",
              "transition-colors duration-300 group-hover:border-primary/40 group-hover:text-foreground",
            ].join(" ")}
          >
            {service.metric}
          </span>
        ) : null}
      </div>

      <div className="mt-8 flex-1">
        <h3 className="relative inline-block text-2xl font-bold tracking-tight text-foreground">
          {service.title}
          <span
            aria-hidden
            className={[
              "absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full",
              "bg-primary transition-transform duration-300 ease-out",
              "group-hover:scale-x-100",
            ].join(" ")}
          />
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {service.outcome}
        </p>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {service.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={[
                "rounded-full border border-border/60 bg-background/60 px-3 py-1",
                "text-xs font-medium text-muted-foreground backdrop-blur-sm shadow-sm",
                "transition-colors duration-200 group-hover:border-primary/30 group-hover:text-foreground",
              ].join(" ")}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          aria-hidden
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            "border border-border/60 bg-background/80 text-muted-foreground backdrop-blur-md shadow-sm",
            "transition-all duration-300 ease-out",
            "group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:text-primary",
            "motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1",
          ].join(" ")}
        >
          <ArrowUpRight className="size-4" />
        </div>
      </div>

      <div
        aria-hidden
        className={[
          "absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 rounded-full",
          "bg-linear-to-r from-primary/60 via-primary/30 to-transparent",
          "transition-transform duration-500 ease-out",
          "group-hover:scale-x-100",
          "@media(hover:none){scale-x-100 opacity-40}",
        ].join(" ")}
      />
    </Link>
  );
}
