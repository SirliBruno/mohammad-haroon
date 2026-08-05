import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Globe,
  Zap,
  ShieldCheck,
  Layout,
  Code2,
  Terminal as TerminalIcon,
  Layers,
  Cpu,
  Sparkles,
  Command,
  Check,
  Copy,
  Smartphone,
  CheckCircle2,
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

// Register GSAP plugins safely on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ---------------- Route Definition ---------------- */

export const Route = createFileRoute("/home2")({
  component: Home2RadicalPage,
  head: () => ({
    meta: buildMeta({
      title: "محمد هارون — مهندس ومنتج رقمي | التجربة التفاعلية 2.0",
      description: site.description,
      path: "/home2",
    }),
  }),
});

/* ---------------- Mockup Mapping & Constant Data ---------------- */

const featuredMockups: Record<string, React.ComponentType> = {
  "northwind-analytics": DashboardUI,
  "lumen-payments": DashboardUI,
  "atelier-cms": EditorUI,
  "haven-storefront": StoreUI,
};

const rotatingTitles = [
  "مواقع أعمال فائقة الأداء",
  "متاجر إلكترونية عالية التحويل",
  "منتجات SaaS وفاخرة",
  "أنظمة تصميم متكاملة",
];

const homeServicesData = [
  {
    slug: "web-development",
    title: "مواقع أعمال وتجارب رقمية",
    outcome: "واجهات فائقة السرعة بـ React 19 و Next.js مصممة بأعلى معايير تحويل الزوار إلى عملاء.",
    tags: ["React 19", "Next.js", "TanStack"],
    metric: "+40 مشروع مُنجز",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    size: "lg" as const,
  },
  {
    slug: "ecommerce",
    title: "متاجر إلكترونية عالمية",
    outcome: "تجربة تسوق سلسة جاهزة للنمو وتكامل تام مع بوابات الدفع المحلية والعالمية.",
    tags: ["Shopify", "WooCommerce", "Stripe"],
    metric: "Stripe + WooCommerce",
    iconPath: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    size: "sm" as const,
  },
  {
    slug: "ui-ux-design",
    title: "تصميم أنظمة الواجهات (Design Systems)",
    outcome: "أنظمة مكونات ذرية (Atomic Design) وتجارب مستخدم فائقة الاستجابة.",
    tags: ["Figma", "Atomic Systems", "UX Research"],
    metric: "Figma + OKLCH Tokens",
    iconPath: "M12 2a5 5 0 100 10A5 5 0 0012 2zM2 20s1-3 10-3 10 3 10 3",
    size: "sm" as const,
  },
  {
    slug: "wordpress",
    title: "حلول WordPress المخصصة",
    outcome: "قوالب وكتل Gutenberg مخصصة، أمان عالٍ، وسرعة خرافية بدون بطء الإضافات.",
    tags: ["WordPress", "Gutenberg", "Headless"],
    metric: "أمان + سرعة 100%",
    iconPath: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 12h10M12 7v10",
    size: "lg" as const,
  },
];

const processSteps = [
  { step: "01", title: "الاكتشاف والاستراتيجية", description: "تحليل شامل للأهداف والجمهور والمنافسين لرسم خارطة الطريق." },
  { step: "02", title: "الهندسة والمعمارية", description: "تحديد هيكلية البيانات، الأداء، واختيار المكتبات والحلول التقنية." },
  { step: "03", title: "التصميم والتفاعل", description: "بناء أنظمة المكونات وتجارب التفاعل الناعمة بأسلوب عصري." },
  { step: "04", title: "التطوير والتنفيذ", description: "كود نظيف استجابة كاملة وأعلى جودة برمجية متوافقة مع الأجهزة." },
  { step: "05", title: "الاختبار والإطلاق", description: "ضمان سرعة التحميل، معايير الوصولية WCAG، واختبار الأمان." },
  { step: "06", title: "المتابعة والنمو", description: "قياس الأداء الفعلي بعد الإطلاق والتطوير المستمر." },
];

const techStackData = [
  { name: "React 19", category: "Frontend", icon: Code2, desc: "تطوير واجهات حية بـ Server Components" },
  { name: "TypeScript", category: "Language", icon: TerminalIcon, desc: "كود برمجي موثوق وخالٍ من الأخطاء" },
  { name: "Next.js 15", category: "Framework", icon: Globe, desc: "سرعة تحميل خارقة وتهيئة ممتازة للـ SEO" },
  { name: "TanStack", category: "Architecture", icon: Layers, desc: "إدارة البيانات والروابط بأعلى كفاءة" },
  { name: "Tailwind CSS v4", category: "Styling", icon: Layout, desc: "تنسيق ناتيف فائق الأداء والسرعة" },
  { name: "Figma", category: "Design", icon: Layout, desc: "أنظمة تصميم ثنائية وثلاثية الأبعاد" },
  { name: "Node.js", category: "Backend", icon: Cpu, desc: "خوادم خلفية سريعة وقابلة للتوسع" },
  { name: "Supabase", category: "Database", icon: ShieldCheck, desc: "قواعد بيانات وأمان فوري متكامل" },
];

const certificatesList: Certificate[] = [
  { title: "مطوّر واجهات أمامية — Meta", issuer: "Meta", issuedAt: "2025" },
  { title: "تصميم تجربة المستخدم — Google", issuer: "Google", issuedAt: "2024" },
  { title: "شهادة شريك Shopify الرسمي", issuer: "Shopify", issuedAt: "2024" },
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

function Home2RadicalPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Rotating Word Index
  const [titleIdx, setTitleIdx] = useState(0);

  // Command Palette Terminal Tabs
  const [activeTerminalTab, setActiveTerminalTab] = useState<"overview" | "metrics" | "code">("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  // Tech Stack Filter State
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>("All");

  // CMS Server Data
  const listFn = useServerFn(listPublicProjects);
  const testFn = useServerFn(listTestimonials);

  const featuredQ = useQuery({
    queryKey: ["home2_radical", "featured"],
    queryFn: () => listFn({ data: { featured: true, limit: 3 } }),
    staleTime: 60_000,
  });

  const testimonialsQ = useQuery({
    queryKey: ["home2_radical", "testimonials"],
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

  // Active Project for Desktop Split Showcase
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  // Rotate Hero Title Word
  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % rotatingTitles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // GSAP Animations
  useGSAP(
    () => {
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll(".gsap-anim-item"), {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        });
      }
    },
    { scope: containerRef }
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`npx create-haroon-app@latest my-product --template=saas`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredTech = selectedTechCategory === "All"
    ? techStackData
    : techStackData.filter((t) => t.category.toLowerCase() === selectedTechCategory.toLowerCase());

  return (
    <div ref={containerRef} className="relative min-h-[100dvh] overflow-hidden bg-[#07080a] text-foreground font-sans">
      {/* Dynamic Background Light Orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-linear-to-b from-primary/15 via-accent/10 to-transparent blur-[120px]"
      />

      {/* ================= 1. RADICAL HERO SECTION ================= */}
      <section ref={heroRef} className="relative overflow-hidden pt-12 pb-24 md:pt-28 md:pb-36 border-b border-border/40">
        <div className="container-page flex flex-col items-center text-center">
          {/* Availability Pill */}
          <div className="gsap-anim-item inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>متاح لاستلام مشاريع جديدة — Q3/Q4 2026</span>
          </div>

          {/* Main H1 with Word Rotator */}
          <h1 className="gsap-anim-item mt-8 max-w-5xl text-5xl font-extrabold tracking-tight text-foreground text-balance md:text-7xl lg:text-8xl">
            أبني وأبتكر{" "}
            <span className="inline-block min-w-[320px] text-gradient-brand transition-all duration-500">
              {rotatingTitles[titleIdx]}
            </span>
          </h1>

          <p className="gsap-anim-item mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
            مهندس منتجات وواجهات مستخدم متخصص في تحويل المفاهيم الرائدة إلى واجهات ويب فائقة السرعة والانقاد تضاعف نمو الأعمال.
          </p>

          {/* Action CTAs */}
          <div className="gsap-anim-item mt-10 flex flex-wrap items-center justify-center gap-4">
            <DSButton asChild size="lg" variant="primary" className="shadow-lg shadow-primary/20">
              <Link to="/work">
                استعرض الأعمال
                <ArrowLeft className="ms-2 size-4" />
              </Link>
            </DSButton>
            <DSButton asChild size="lg" variant="outline" className="border-border/80">
              <Link to="/contact">
                تواصل معي مباشرة
                <ArrowUpRight className="ms-2 size-4" />
              </Link>
            </DSButton>
          </div>

          {/* Raycast-style Command Palette Terminal */}
          <div className="gsap-anim-item mt-16 w-full max-w-4xl overflow-hidden rounded-2xl border border-border/80 bg-card/70 p-1 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-rose-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
                <span className="ms-2 text-xs font-mono text-muted-foreground">haroon-terminal // v2.0</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTerminalTab("overview")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    activeTerminalTab === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  نظرة عامة
                </button>
                <button
                  onClick={() => setActiveTerminalTab("metrics")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    activeTerminalTab === "metrics" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  الأرقام
                </button>
                <button
                  onClick={() => setActiveTerminalTab("code")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    activeTerminalTab === "code" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  الأمر السريع
                </button>
              </div>
            </div>

            <div className="p-6 text-start font-mono text-sm leading-relaxed">
              {activeTerminalTab === "overview" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    <span>جاهزية النظام: 100% | خالي من الأخطاء النحوية</span>
                  </div>
                  <p className="text-muted-foreground">
                    تخصص هندسي كامل في بناء واجهات React 19، Next.js، وأنظمة تصميم مخصصة تضمن سرعة تحميل أقل من 1.2 ثانية.
                  </p>
                </div>
              )}

              {activeTerminalTab === "metrics" && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <div className="text-2xl font-bold text-foreground tabular-nums">+40</div>
                    <div className="text-xs text-muted-foreground mt-1">مشروع مُنجز</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <div className="text-2xl font-bold text-foreground tabular-nums">+25</div>
                    <div className="text-xs text-muted-foreground mt-1">عميل شريك</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <div className="text-2xl font-bold text-foreground tabular-nums">98%</div>
                    <div className="text-xs text-muted-foreground mt-1">رضا العملاء</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <div className="text-2xl font-bold text-foreground tabular-nums">+6</div>
                    <div className="text-xs text-muted-foreground mt-1">سنوات خبرة</div>
                  </div>
                </div>
              )}

              {activeTerminalTab === "code" && (
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 p-4">
                  <span className="text-primary dir-ltr font-mono">
                    $ npx create-haroon-app@latest my-product
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted px-3 py-1.5 text-xs transition-colors hover:bg-muted/80"
                  >
                    {copiedCode ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    <span>{copiedCode ? "تم النسخ" : "نسخ"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. SPLIT-SCREEN INTERACTIVE FEATURED SHOWCASE ================= */}
      <Section id="work" size="lg" className="border-b border-border/40">
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

        {/* Desktop Split Showcase */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center">
          {/* Left Side: Pinned Interactive Browser frame */}
          <div className="sticky top-28 lg:col-span-7">
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-card p-3 shadow-2xl transition-all duration-500">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-linear-to-br from-primary/20 via-accent/10 to-transparent blur-3xl"
              />
              {featuredProjects.map((project, idx) => {
                if (idx !== activeProjectIdx) return null;
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

          {/* Right Side: Interactive Project Selectors */}
          <div className="space-y-4 lg:col-span-5">
            {featuredProjects.map((project, idx) => {
              const isActive = idx === activeProjectIdx;
              return (
                <div
                  key={project.slug}
                  onMouseEnter={() => setActiveProjectIdx(idx)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border/60 bg-card/60 hover:border-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <DSBadge variant={isActive ? "brand" : "outline"}>{project.category}</DSBadge>
                    <span className="text-xs text-muted-foreground">{project.year}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{project.summary}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded-md border border-border/60 bg-background px-2.5 py-0.5 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <DSButton asChild variant="ghost" size="sm">
                      <Link to="/work/$slug" params={{ slug: project.slug }}>
                        عرض الدراسة <ArrowLeft className="ms-1 size-3.5" />
                      </Link>
                    </DSButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Horizontal Snap Layout */}
        <div className="mt-12 flex gap-4 overflow-x-auto pb-6 lg:hidden home2-snap-carousel">
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
                    <DSBadge variant="outline">{project.category}</DSBadge>
                    <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">{project.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                      <DSButton asChild variant="ghost" size="sm">
                        <Link to="/work/$slug" params={{ slug: project.slug }}>
                          التفاصيل <ArrowLeft className="ms-1 size-3.5" />
                        </Link>
                      </DSButton>
                    </div>
                  </div>
                </DSCard>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ================= 3. SERVICES (INTERACTIVE BENTO SANDBOX) ================= */}
      <Section id="services" className="border-b border-border/40">
        <Reveal>
          <SectionTitle
            eyebrow="الخدمات والحلول"
            title="ما الذي يمكنني القيام به من أجلك."
            description="خدمات مخصصة مبنية للنتائج السريعة والمستدامة."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {homeServicesData.map((s, idx) => (
              <BentoSandboxCard key={s.slug} service={s} featured={idx === 0 || idx === 3} />
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ================= 4. HOW I WORK (PIPELINE TIMELINE) ================= */}
      <Section id="process" className="border-b border-border/40" size="lg">
        <Reveal>
          <SectionTitle
            eyebrow="طريقة العمل"
            title="من فكرة إلى منتج مُطلَق."
            description="مسار شفاف ومحسوب يضمن السرعة والجودة ووضوح القرارات."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="sm" className="mt-16">
            {processSteps.map((step) => (
              <DSCard key={step.step} variant="surface" className="group p-8 transition-all duration-300 hover:border-primary/40 hover:bg-muted/30">
                <div className="text-sm font-semibold tracking-widest text-primary/80 group-hover:text-primary">
                  {step.step}
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
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

      {/* ================= 5. INTERACTIVE FILTERABLE TECH STACK ================= */}
      <Section id="stack" className="border-b border-border/40">
        <Reveal>
          <SectionTitle
            eyebrow="أدوات العمل"
            title="التقنيات والأدوات الأساسية."
            description="تقنيات حديثة وموثوقة لضمان أداء عالٍ وسهولة الصيانة."
          />
        </Reveal>

        {/* Filter Pills */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {["All", "Frontend", "Language", "Framework", "Backend", "Design", "Database"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTechCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedTechCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border/60 bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "All" ? "الكل" : cat}
              </button>
            ))}
          </div>

          <Grid cols={{ base: 2, sm: 4, lg: 4 }} gap="md" className="mt-8">
            {filteredTech.map((tech) => {
              const IconComp = tech.icon;
              return (
                <DSCard
                  key={tech.name}
                  variant="surface"
                  padding="sm"
                  className="group flex flex-col items-center gap-3 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-1"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-background text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                    <IconComp className="size-6" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-foreground">{tech.name}</div>
                    <div className="text-[11px] text-muted-foreground">{tech.category}</div>
                  </div>
                </DSCard>
              );
            })}
          </Grid>
        </Reveal>
      </Section>

      {/* ================= 6. TESTIMONIALS & SOCIAL PROOF ================= */}
      <Section id="testimonials" className="border-b border-border/40">
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
      <Section id="career" className="border-b border-border/40">
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

      {/* ================= 8. CINEMATIC FULL-VIEWPORT CTA ================= */}
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
    </div>
  );
}

/* ============================================================
   Bento Sandbox Card Component with Custom Mouse Spotlight
   ============================================================ */

function BentoSandboxCard({
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
      style={{ "--spotlight-x": "50%", "--spotlight-y": "50%" } as React.CSSProperties}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-xl ${
        featured ? "lg:min-h-80" : "lg:min-h-64"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/80 text-muted-foreground backdrop-blur-md shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <path d={service.iconPath} />
          </svg>
        </div>
        <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          {service.metric}
        </span>
      </div>

      <div className="mt-8 flex-1">
        <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{service.outcome}</p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Link>
  );
}
