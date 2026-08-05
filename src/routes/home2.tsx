import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Code2,
  Globe,
  Layers,
  Zap,
  ShieldCheck,
  Layout,
  Briefcase,
  Award,
  Star,
  Terminal,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Wrench,
  MessagesSquare,
  Cpu,
  type LucideIcon,
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
import { useHomeContent, getHomeText, getHomeList } from "@/lib/cms/home-content";
import { listPublicProjects } from "@/lib/cms/projects-public.functions";
import { listTestimonials } from "@/lib/cms/simple.functions";
import { toProject } from "@/lib/project-adapter";

/* ---------------- Route ---------------- */

export const Route = createFileRoute("/home2")({
  component: Home2Page,
  head: () => ({
    meta: buildMeta({
      title: "محمد هارون — مهندس ومنتج رقمي | الصفحة الرئيسية 2.0",
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
    icon: Globe,
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    slug: "ecommerce",
    title: "متاجر إلكترونية عالية الأداء",
    outcome: "تجربة تسوق سلسة وجاهزة للنمو وتكامل تام مع بوابات الدفع العالمية والمحلية.",
    tags: ["Shopify", "WooCommerce", "Stripe"],
    metric: "Stripe + WooCommerce",
    icon: Zap,
    iconPath: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  },
  {
    slug: "ui-ux-design",
    title: "تصميم واجهات وتجربة المستخدم",
    outcome: "أنظمة تصميم متكاملة (Design Systems) وتجارب تفاعلية تضع المستخدم في المركز.",
    tags: ["Figma", "Design Systems", "UX Research"],
    metric: "Figma + Atomic Design",
    icon: Layout,
    iconPath: "M12 2a5 5 0 100 10A5 5 0 0012 2zM2 20s1-3 10-3 10 3 10 3",
  },
  {
    slug: "wordpress",
    title: "حلول WordPress المخصصة",
    outcome: "قوالب وكتل Gutenberg مخصصة، أمان عالٍ، وسرعة فائقة بدون تضخم الإضافات.",
    tags: ["WordPress", "Gutenberg", "Headless"],
    metric: "أمان + سرعة 100%",
    icon: ShieldCheck,
    iconPath: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 12h10M12 7v10",
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

  // Active project index for Scrollytelling on Desktop
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  return (
    <>
      {/* Native Scroll Progress Indicator */}
      <div className="home2-scroll-progress" aria-hidden />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Ambient Subtle Background Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-linear-to-b from-primary/10 via-accent/5 to-transparent blur-3xl"
        />

        <div className="container-page flex flex-col items-center text-center">
          {/* Availability Badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md shadow-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>متاح لمشاريع جديدة — Q3/Q4 2026</span>
            </div>
          </Reveal>

          {/* Main Headline */}
          <Reveal delay={0.08}>
            <h1 className="mt-8 max-w-4xl text-4xl font-bold tracking-tight text-foreground text-balance md:text-6xl lg:text-7xl">
              أصمّم وأبني منتجات رقمية{" "}
              <span className="text-gradient-brand">تُحقّق نتائج فعلية.</span>
            </h1>
          </Reveal>

          {/* Subtitle Pitch */}
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty md:text-xl">
              مهندس منتجات وواجهات مستخدم متخصص في تحويل المفاهيم المعقدة إلى تجارب ويب فاخرة وسريعة تلفت الانتباه وتزيد المبيعات.
            </p>
          </Reveal>

          {/* CTAs & Social Proof Metrics */}
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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

          {/* Hero Metrics Pill */}
          <Reveal delay={0.25}>
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 text-start backdrop-blur-sm sm:grid-cols-4 sm:gap-8 sm:px-8">
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">+40</div>
                <div className="text-xs text-muted-foreground">مشروع مُنجز</div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">+25</div>
                <div className="text-xs text-muted-foreground">عميل شريك</div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">98%</div>
                <div className="text-xs text-muted-foreground">نسبة الرضا</div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">+6</div>
                <div className="text-xs text-muted-foreground">سنوات خبرة</div>
              </div>
            </div>
          </Reveal>

          {/* Client Proof Marquee */}
          <Reveal delay={0.3}>
            <div className="mt-14 w-full max-w-4xl border-t border-border/40 pt-8">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">مشاريع ومنتجات شريكة</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-6 opacity-75 md:gap-12">
                {clientProofLogos.map((logo) => (
                  <span key={logo} className="text-sm font-semibold tracking-tight text-foreground/80 hover:opacity-100 transition-opacity">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= 2. FEATURED WORK (SCROLLYTELLING & CAROUSEL) ================= */}
      <Section id="work" className="border-t border-border/60" size="lg">
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

        {/* Desktop Pinned Scrollytelling / Mobile Horizontal Snap Carousel */}
        <div className="mt-12">
          {/* Mobile Snap Carousel */}
          <div className="flex gap-4 overflow-x-auto pb-6 home2-snap-carousel lg:hidden">
            {featuredProjects.map((project) => {
              const MockupUI = featuredMockups[project.slug] ?? DashboardUI;
              return (
                <div key={project.slug} className="min-w-[85vw] shrink-0 home2-snap-item">
                  <DSCard variant="surface" padding="none" className="overflow-hidden border border-border/60">
                    <Link to="/work/$slug" params={{ slug: project.slug }}>
                      <BrowserFrame url={project.liveDemo ? new URL(project.liveDemo).host : `${project.slug}.app`}>
                        {project.cover?.src ? (
                          <img src={project.cover.src} alt={project.cover.alt} className="size-full object-cover" />
                        ) : (
                          <MockupUI />
                        )}
                      </BrowserFrame>
                    </Link>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">{project.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                        <span className="text-xs text-muted-foreground">{project.category}</span>
                        <DSButton asChild variant="ghost" size="sm">
                          <Link to="/work/$slug" params={{ slug: project.slug }}>
                            عرض الدراسة <ArrowLeft className="ms-1 size-3.5" />
                          </Link>
                        </DSButton>
                      </div>
                    </div>
                  </DSCard>
                </div>
              );
            })}
          </div>

          {/* Desktop Interactive Layout (Sticky Preview + Interactive List) */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
            {/* Left Column: Pinned Mockup Showcase */}
            <div className="sticky top-24 lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-card p-2 shadow-lg transition-all duration-500">
                {featuredProjects.map((project, idx) => {
                  if (idx !== activeProjectIndex) return null;
                  const MockupUI = featuredMockups[project.slug] ?? DashboardUI;
                  return (
                    <div key={project.slug} className="animate-fade-in">
                      <BrowserFrame url={project.liveDemo ? new URL(project.liveDemo).host : `${project.slug}.app`}>
                        {project.cover?.src ? (
                          <img src={project.cover.src} alt={project.cover.alt} className="size-full object-cover" />
                        ) : (
                          <MockupUI />
                        )}
                      </BrowserFrame>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Project Selection Cards */}
            <div className="space-y-4 lg:col-span-5">
              {featuredProjects.map((project, idx) => {
                const isActive = idx === activeProjectIndex;
                return (
                  <div
                    key={project.slug}
                    onClick={() => setActiveProjectIndex(idx)}
                    className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                      isActive
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/60 bg-card hover:border-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {project.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{project.year}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{project.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{project.summary}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 2).map((t) => (
                          <span key={t} className="rounded-md border border-border/60 bg-background px-2 py-0.5 text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                      <DSButton asChild variant="ghost" size="sm">
                        <Link to="/work/$slug" params={{ slug: project.slug }}>
                          التفاصيل <ArrowLeft className="ms-1 size-3.5" />
                        </Link>
                      </DSButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ================= 3. SERVICES (BENTO GRID WITH CONTAINER QUERIES) ================= */}
      <Section id="services" className="border-t border-border/60 home2-section-lazy">
        <Reveal>
          <SectionTitle
            eyebrow="الخدمات والحلول"
            title="ما الذي يمكنني القيام به من أجلك."
            description="خدمات مخصصة مبنية للنتائج السريعة والمستدامة."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {homeServicesData.map((s, idx) => (
              <ServiceBentoCardNew key={s.slug} service={s} featured={idx === 0 || idx === 3} />
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ================= 4. HOW I WORK (WORKFLOW STEPPER) ================= */}
      <Section id="process" className="border-t border-border/60 home2-section-lazy">
        <Reveal>
          <SectionTitle
            eyebrow="طريقة العمل"
            title="خطوات منظمة لنقل الفكرة إلى الواقع."
            description="مسار شفاف ومحسوب يضمن السرعة والجودة ووضوح القرارات."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.step} className="group flex flex-col bg-card p-8 transition-colors hover:bg-muted/40">
                <div className="text-xs font-semibold tracking-widest text-primary">{step.step}</div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ================= 5. SOCIAL PROOF & TESTIMONIALS ================= */}
      <Section id="testimonials" className="border-t border-border/60 home2-section-lazy">
        <Reveal>
          <SectionTitle eyebrow="التقييمات" title="آراء وشهدات شركاء النجاح." />
        </Reveal>
        <Reveal delay={0.05}>
          <Grid cols={{ base: 1, md: 3 }} gap="md" className="mt-12">
            {featuredTestimonials.map((tItem) => (
              <TestimonialQuote key={tItem.author} testimonial={tItem} />
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= 6. CAREER & CERTIFICATES ================= */}
      <Section id="career" className="border-t border-border/60 home2-section-lazy">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Career Timeline */}
          <div className="lg:col-span-7">
            <Reveal>
              <SectionTitle eyebrow="المسيرة" title="خبرات ومحطات مهنية." />
              <div className="mt-8">
                <Timeline items={timelineData} />
              </div>
            </Reveal>
          </div>

          {/* Right Column: Certificates */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <SectionTitle eyebrow="الاعتمادات" title="الشهادات والتعلم المستمر." />
              <div className="mt-8 space-y-3">
                {certificatesList.map((cert) => (
                  <CertificateCard key={cert.title} certificate={cert} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ================= 7. TECH STACK STRIP ================= */}
      <Section id="stack" className="border-t border-border/60 home2-section-lazy">
        <Reveal>
          <SectionTitle eyebrow="أدوات العمل" title="التقنيات والأدوات الأساسية." description="تقنيات حديثة وموثوقة لضمان أداء عالٍ وسهولة الصيانة." />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
            {techStack.map((tech) => {
              const IconComp = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="grid size-9 place-items-center rounded-lg border border-border/60 bg-background text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                    <IconComp className="size-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{tech.name}</div>
                    <div className="text-[10px] text-muted-foreground">{tech.category}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
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
   Service Bento Card Component with Mouse Spotlight
   ============================================================ */

function ServiceBentoCardNew({
  service,
  featured = false,
}: {
  service: typeof homeServicesData[number];
  featured?: boolean;
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

  return (
    <Link
      ref={cardRef}
      to="/services/$slug"
      params={{ slug: service.slug }}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-7 transition-all duration-300 active:scale-[0.985] hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-1 home2-spotlight-card ${
        featured ? "lg:min-h-72" : "lg:min-h-60"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="grid size-11 place-items-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d={service.iconPath} />
            </svg>
          </div>
          <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-sm group-hover:text-foreground">
            {service.metric}
          </span>
        </div>

        <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground home2-balance">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground home2-pretty">
          {service.outcome}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {service.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border/60 bg-background/50 px-2.5 py-0.5 text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}
