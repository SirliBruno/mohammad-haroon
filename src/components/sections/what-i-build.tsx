import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import {
  Globe,
  ShoppingBag,
  LayoutDashboard,
  Palette,
  ArrowLeft,
  Check,
  HelpCircle,
  ArrowUpRight,
  FileCheck,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ServiceData {
  id: string;
  slug: string;
  category: string;
  projectType: string;
  problemType: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  imageAlt: string;
  number: string;
  title: string;
  summary: string;
  target: string;
  bullets: string[];
  deliverables: string[];
  timeline: string;
  cta: string;
}

const services: ServiceData[] = [
  {
    id: "websites",
    slug: "website-development",
    category: "مواقع ومنصات",
    projectType: "موقع",
    problemType: "ما عندي موقع أو صفحة واضحة",
    icon: Globe,
    image: "/images/services/service-web.webp",
    imageAlt: "تصميم وتطوير مواقع ومنصات رقمية متجاوبة وسريعة",
    number: "01",
    title: "موقعك لازم يشتغل كموظف مبيعات — مو مجرد رابط.",
    summary:
      "أبني لك موقعًا احترافيًا يشرح خدماتك بوضوح، يعرض أعمالك، ويسهّل تواصل العملاء معك مباشرة.",
    target: "أصحاب الخدمات، الشركات الناشئة، والمكاتب المهنية.",
    bullets: [
      "مواقع تعريفية وصفحات هبوط (Landing Pages) سريعة",
      "تصميم متجاوب وسهل التصفح على الجوال",
      "ربط مباشر مع WhatsApp ونماذج التواصل وتهيئة SEO",
    ],
    deliverables: [
      "تصميم متجاوب وسريع على كل الشاشات",
      "تهيئة لمحركات البحث (SEO) وسرعة تصفح عالية",
      "ربط مباشر مع WhatsApp ونماذج التواصل",
      "لوحة تحكم ميسرة لإدارة المحتوى عند الحاجة",
    ],
    timeline: "5 – 14 يومًا",
    cta: "أبغى موقع يوضح خدمتي",
  },
  {
    id: "ecommerce",
    slug: "woocommerce",
    category: "متاجر إلكترونية",
    projectType: "متجر",
    problemType: "متجري يحتاج تحسين",
    icon: ShoppingBag,
    image: "/images/services/service-store.webp",
    imageAlt: "تطوير وتخصيص متاجر إلكترونية احترافية وتسهيل الدفع",
    number: "02",
    title: "منتجاتك تستحق متجرًا يسهّل قرار الشراء.",
    summary:
      "أصمم أو أطور متجرًا يبرز تفاصيل المنتجات ويجعل مسار التصفح والشراء خفيفًا وسريعًا من الجوال.",
    target: "أصحاب المتاجر والبراندات لرفع كفاءة وتجربة الشراء.",
    bullets: [
      "تخصيص متكامل لمتاجر سلة (Salla) أو WooCommerce",
      "صفحات منتجات مقنعة توضح المزايا والتفاصيل",
      "تبسيط خطوات السلة والدفع لتقليل التردد",
    ],
    deliverables: [
      "تصميم صفحات منتجات توضح التفاصيل والمميزات",
      "تبسيط خطوات السلة ومسار الدفع",
      "تحسين سرعة التصفح وتجربة الجوال",
      "تنسيق الأقسام والبانرات الترويجية",
    ],
    timeline: "1 – 3 أسابيع",
    cta: "أبغى متجر يسهّل الشراء",
  },
  {
    id: "systems",
    slug: "systems-solutions",
    category: "أنظمة وحلول رقمية",
    projectType: "نظام",
    problemType: "أتابع الشغل يدويًا بين واتساب وExcel",
    icon: LayoutDashboard,
    image: "/images/services/service-systems.webp",
    imageAlt: "بناء أنظمة إدارية ولوحات تحكم سحابية وقواعد بيانات",
    number: "03",
    title: "لما يكبر الشغل، Excel وواتساب ما يكفون.",
    summary:
      "أحوّل مهامك اليومية المتكررة إلى نظام أو لوحة تحكم سحابية تجمع بياناتك وتسهّل المتابعة.",
    target: "الأنشطة التي تعاني من ضغط المتابعة اليدوية وتشتت البيانات.",
    bullets: [
      "لوحات تحكم إدارية (Dashboards) تفاعلية وسريعة",
      "أنظمة إدارة المشتركين والعملاء والحجوزات اليومية",
      "قواعد بيانات سحابية آمنة مع صلاحيات مخصصة",
    ],
    deliverables: [
      "لوحة تحكم إدارية واضحة (Dashboard)",
      "قاعدة بيانات سحابية آمنة مع نسخ احتياطي",
      "صلاحيات متعددة للمستخدمين والمديرين",
      "أتمتة التقارير والمتابعة اليومية",
    ],
    timeline: "2 – 6 أسابيع",
    cta: "أبغى أنظم شغلي",
  },
  {
    id: "uiux",
    slug: "ui-ux-design",
    category: "UI/UX والتصميم والهوية",
    projectType: "تصميم",
    problemType: "عندي فكرة تطبيق أو منصة",
    icon: Palette,
    image: "/images/services/service-uiux.webp",
    imageAlt: "تصميم واجهات وتجربة المستخدم ونماذج أولية تفاعلية Figma",
    number: "04",
    title: "التصميم مو زينة للمشروع — هو كيف يفهمه العميل ويستخدمه.",
    summary:
      "أحوّل فكرتك إلى شاشات تفاعلية ونموذج واقعي على Figma تراجعه وتختبره قبل بدء البرمجة.",
    target: "أصحاب الأفكار والمشاريع قبل الاستثمار في مرحلة التطوير.",
    bullets: [
      "تصميم واجهات وتجربة تطبيقات الجوال والويب",
      "مخططات المسارات ونماذج أولية تفاعلية (Prototypes)",
      "نظام تصميم وهوية بصرية رقمية متناسقة",
    ],
    deliverables: [
      "مخططات وهيكلة الشاشات (Wireframes)",
      "واجهات Figma عالية الدقة وكاملة الحالات",
      "نموذج أولي تفاعلي قابل للتجربة (Prototype)",
      "دليل المكونات والألوان والخطوط",
    ],
    timeline: "1 – 3 أسابيع",
    cta: "أبغى أشوف شكل فكرتي",
  },
];

const filterCategories = [
  { id: "all", label: "جميع الخدمات" },
  { id: "websites", label: "مواقع ومنصات" },
  { id: "ecommerce", label: "متاجر إلكترونية" },
  { id: "systems", label: "أنظمة وحلول رقمية" },
  { id: "uiux", label: "UI/UX والتصميم" },
];

const problemScenarios = [
  {
    label: "عندي نشاط أو خدمة، لكن ما عندي موقع احترافي",
    projectType: "موقع",
    problem: "ما عندي موقع أو صفحة واضحة",
  },
  {
    label: "عندي متجر، لكن التصفح أو الشراء يحتاج تحسين",
    projectType: "متجر",
    problem: "متجري يحتاج تحسين",
  },
  {
    label: "أتابع عملي بين واتساب وExcel",
    projectType: "نظام",
    problem: "أتابع الشغل يدويًا بين واتساب وExcel",
  },
  {
    label: "عندي فكرة منصة أو تطبيق ولا أعرف كيف أبدأ",
    projectType: "منصة",
    problem: "عندي فكرة تطبيق أو منصة",
  },
  {
    label: "عندي موقع موجود لكنه يحتاج تطوير",
    projectType: "موقع",
    problem: "عندي موقع أو نظام يحتاج تطوير",
  },
  {
    label: "أحتاج تصميم واضح قبل البرمجة",
    projectType: "تصميم",
    problem: "عندي فكرة تطبيق أو منصة",
  },
];

// Standard easing
const standardEase = [0.4, 0, 0.2, 1];

export function WhatIBuild() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>("websites");
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return services;
    return services.filter((s) => s.id === activeCategory);
  }, [activeCategory]);

  const toggleMobileAccordion = (id: string) => {
    setExpandedMobileId((prev) => (prev === id ? null : id));
  };

  const triggerProblemSelection = (projectType: string, problemText: string) => {
    window.dispatchEvent(
      new CustomEvent("select-problem", {
        detail: { projectType, problem: problemText },
      }),
    );
    const formEl = document.getElementById("contact-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="what-i-build" className="relative overflow-hidden py-16 sm:py-24">
      <Container>
        {/* Section Header */}
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-wider text-accent uppercase">
              الخدمات والحلول
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              حلول عملية مبنية على مشكلتك.
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
              أبني حلولاً رقمية مدروسة تساعدك على تنظيم عملك وعرض خدماتك بوضوح.
            </p>
          </div>
        </Reveal>

        {/* 1) Sticky Filter Tabs / Chips */}
        <div className="sticky top-16 z-30 -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 mt-8 py-3 bg-background/85 backdrop-blur-md border-y border-border/40 transition-colors">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" role="tablist">
            {filterCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (cat.id !== "all") {
                      setExpandedMobileId(cat.id);
                    }
                  }}
                  className={`group relative shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs ring-1 ring-primary/20"
                      : "border border-border/70 bg-card/80 text-muted-foreground hover:border-accent/40 hover:text-foreground hover:bg-card"
                  }`}
                >
                  <span>{cat.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeFilterIndicator"
                      className="size-1.5 rounded-full bg-accent inline-block mr-0.5"
                      transition={{ duration: 0.25, ease: standardEase }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2 & 3) Services Cards — Seamless Floating 3D Objects with Ground Shadows */}
        <div className="mt-8">
          {/* =========================================================
              DESKTOP VIEW (>= 768px): Pristine 2x2 Grid Layout
             ========================================================= */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((svc, idx) => {
                const Icon = svc.icon;
                return (
                  <motion.article
                    key={svc.id}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.25,
                      delay: idx * 0.05,
                      ease: standardEase,
                    }}
                    className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 sm:p-7 transition-all duration-300 hover:border-accent/40 hover:shadow-xl h-full overflow-hidden"
                  >
                    <div>
                      {/* Top Visual Object Stage: Floating 3D Object with Soft Contact Shadow */}
                      <div className="relative w-full h-44 sm:h-52 flex items-center justify-center mb-4 select-none overflow-visible">
                        {/* Soft Ground Contact Shadow */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[72%] h-4 rounded-[100%] bg-black/45 blur-md pointer-events-none transition-all duration-500 group-hover:scale-90 group-hover:opacity-40" />

                        {/* Floating Transparent 3D Device */}
                        <img
                          src={svc.image}
                          alt={svc.imageAlt}
                          loading="lazy"
                          decoding="async"
                          className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.04]"
                        />
                      </div>

                      {/* Category Pill & Number */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <Icon className="size-4 stroke-[1.75]" />
                          </div>
                          <span className="rounded-lg border border-border/70 bg-background/80 px-2.5 py-0.5 text-xs font-medium text-foreground">
                            {svc.category}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-muted-foreground/60" dir="ltr">
                          {svc.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 text-lg sm:text-xl font-bold text-foreground leading-snug">
                        {svc.title}
                      </h3>

                      {/* Summary */}
                      <p className="mt-2.5 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                        {svc.summary}
                      </p>

                      {/* Bullets (3 items) */}
                      <ul className="mt-4 space-y-2 border-t border-border/40 pt-3 text-xs sm:text-sm">
                        {svc.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-foreground/85">
                            <Check className="size-3.5 text-accent shrink-0 stroke-2" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Target Single Line */}
                      <p className="mt-4 text-[11px] sm:text-xs text-muted-foreground">
                        <strong className="text-foreground/80 font-semibold">يناسب:</strong> {svc.target}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => triggerProblemSelection(svc.projectType, svc.problemType)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all duration-150 hover:opacity-90 active:scale-[0.98] cursor-pointer"
                      >
                        {svc.cta}
                        <ArrowLeft className="size-3.5 stroke-2" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedService(svc)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 active:scale-[0.98] cursor-pointer py-1"
                      >
                        تفاصيل الخدمة
                        <ArrowUpRight className="size-3 text-accent stroke-2" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {/* =========================================================
              MOBILE ACCORDION VIEW (< 768px): Compact Collapsible Cards
             ========================================================= */}
          <div className="md:hidden space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((svc, idx) => {
                const Icon = svc.icon;
                const isExpanded = expandedMobileId === svc.id;

                return (
                  <motion.div
                    key={svc.id}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.25,
                      delay: idx * 0.04,
                      ease: standardEase,
                    }}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? "border-accent/50 bg-card shadow-md ring-1 ring-accent/20"
                        : "border-border/70 bg-card/90 hover:border-border"
                    }`}
                  >
                    {/* Collapsed Header / Toggle Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleMobileAccordion(svc.id)}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between p-4 text-right cursor-pointer select-none active:scale-[0.99] transition-transform"
                    >
                      <div className="flex items-start gap-3 min-w-0 pr-1">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isExpanded ? "bg-accent text-white" : "bg-accent/10 text-accent"
                          }`}
                        >
                          <Icon className="size-4.5 stroke-[1.75]" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="rounded-md border border-border/60 bg-background/80 px-2 py-0.5 text-[11px] font-medium text-foreground">
                              {svc.category}
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-muted-foreground/60" dir="ltr">
                              {svc.number}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                            {svc.title}
                          </h3>
                        </div>
                      </div>

                      {/* Animated Chevron 180° rotation */}
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg mr-2 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 bg-accent/15 text-accent" : "text-muted-foreground bg-muted/40"
                        }`}
                      >
                        <ChevronDown className="size-4 stroke-2" />
                      </div>
                    </button>

                    {/* Expandable Body with Floating Object */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="accordion-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.3, ease: standardEase },
                            opacity: { duration: 0.25, ease: standardEase },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-5 pt-1 border-t border-border/40 space-y-4">
                            {/* Floating Object Stage on Expanded Mobile */}
                            <div className="relative w-full h-40 flex items-center justify-center my-2 select-none overflow-visible">
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-3.5 rounded-[100%] bg-black/40 blur-md pointer-events-none" />
                              <img
                                src={svc.image}
                                alt={svc.imageAlt}
                                loading="lazy"
                                decoding="async"
                                className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)]"
                              />
                            </div>

                            {/* Summary */}
                            <p className="text-xs text-foreground/85 leading-relaxed">
                              {svc.summary}
                            </p>

                            {/* Bullets (3 items) */}
                            <ul className="space-y-2 border-t border-border/40 pt-3 text-xs">
                              {svc.bullets.map((b) => (
                                <li key={b} className="flex items-center gap-2 text-foreground/90">
                                  <Check className="size-3.5 text-accent shrink-0 stroke-2" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Target */}
                            <div className="rounded-xl border border-border/50 bg-background/60 p-2.5 text-[11px] text-muted-foreground">
                              <strong className="text-foreground/90 font-semibold">يناسب:</strong> {svc.target}
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="pt-2 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => triggerProblemSelection(svc.projectType, svc.problemType)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 px-3 text-xs font-semibold text-primary-foreground shadow-xs active:scale-[0.98] transition-transform"
                              >
                                {svc.cta}
                                <ArrowLeft className="size-3.5 stroke-2" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedService(svc)}
                                className="inline-flex items-center justify-center gap-1 rounded-xl border border-border/70 bg-card py-2.5 px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-transform"
                              >
                                تفاصيل
                                <ArrowUpRight className="size-3 text-accent stroke-2" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Problem-First Selector Section */}
        <Reveal delay={0.12}>
          <div className="mt-12 rounded-2xl border border-border/70 bg-muted/20 p-6 sm:p-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-0.5 text-xs font-medium text-foreground">
                <HelpCircle className="size-3.5 text-accent stroke-2" /> مسار البداية السريع
              </span>
              <h3 className="mt-3 text-xl sm:text-2xl font-bold text-foreground">
                مو متأكد وش تحتاج؟ ابدأ من مشكلتك.
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                اختر الحالة الأقرب لمشروعك، وسنوجهك مباشرة للحل الأنسب.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {problemScenarios.map((scenario) => (
                <button
                  key={scenario.label}
                  type="button"
                  onClick={() => triggerProblemSelection(scenario.projectType, scenario.problem)}
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-background/80 p-3.5 text-right transition-all duration-150 hover:border-accent/50 hover:bg-card active:scale-[0.98] cursor-pointer"
                >
                  <span className="text-xs sm:text-sm text-foreground group-hover:text-accent transition-colors">
                    {scenario.label}
                  </span>
                  <ArrowLeft className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-accent mr-2 stroke-2" />
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Minimal Service Modal Dialog */}
        <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
          <DialogContent className="max-w-lg bg-card border-border/80 p-6 sm:p-7 max-h-[85vh] overflow-y-auto rounded-2xl">
            {selectedService && (
              <div>
                <DialogHeader className="text-right pb-3 border-b border-border/50">
                  <div className="relative w-full h-36 flex items-center justify-center my-2 select-none">
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[65%] h-3 rounded-[100%] bg-black/40 blur-md pointer-events-none" />
                    <img
                      src={selectedService.image}
                      alt={selectedService.imageAlt}
                      className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-accent">
                      {selectedService.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{selectedService.timeline}</span>
                  </div>
                  <DialogTitle className="mt-2 text-lg sm:text-xl font-bold text-foreground">
                    {selectedService.title}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    {selectedService.summary}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                      <FileCheck className="size-3.5 text-accent stroke-2" /> ما يتم تنفيذه في المشروع:
                    </h4>
                    <ul className="space-y-2">
                      {selectedService.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-foreground/85 bg-muted/30 p-2.5 rounded-xl border border-border/50"
                        >
                          <Check className="size-3.5 text-accent shrink-0 mt-0.5 stroke-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                    <strong className="text-foreground">لمن تناسب:</strong> {selectedService.target}
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const s = selectedService;
                        setSelectedService(null);
                        triggerProblemSelection(s.projectType, s.problemType);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
                    >
                      {selectedService.cta}
                      <ArrowLeft className="size-3.5 stroke-2" />
                    </button>

                    <Link
                      to="/services/$slug"
                      params={{ slug: selectedService.slug }}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors active:scale-[0.98]"
                      onClick={() => setSelectedService(null)}
                    >
                      صفحة الخدمة الكاملة
                      <ArrowUpRight className="size-3 stroke-2" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </section>
  );
}
