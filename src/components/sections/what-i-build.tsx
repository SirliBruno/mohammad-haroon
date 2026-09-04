import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/layout/container";
import { Reveal, SectionReveal } from "@/components/motion/reveal";
import { smoothScrollTo } from "@/components/layout/smooth-scroll";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditableText } from "@/features/live-edit/editable-text";
import { useLiveEdit } from "@/features/live-edit/live-edit-context";

/**
 * Icons8 icon renderer using CSS mask.
 * Renders genuine Icons8 assets (Fluent Systems Regular pack) at 2x resolution
 * with full currentColor inheritance, supporting dark/light mode and hover states seamlessly.
 */
function Icons8Icon({
  id,
  className = "size-5",
  alt = "",
}: {
  id: string;
  className?: string;
  alt?: string;
}) {
  const url = `https://img.icons8.com/?id=${id}&format=png&size=48`;
  return (
    <span
      role="img"
      aria-label={alt}
      className={cn("inline-block shrink-0 bg-current transition-colors", className)}
      style={{
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: "websites" | "stores" | "systems" | "design";
  categoryLabel: string;
  iconId: string;
  description: string;
  example: string;
  badge?: string;
  featured?: boolean;
  ctaText: string;
  projectType: string;
  problemScenario: string;
  deliverables: string[];
  timeline: string;
  idealFor: string;
  detailedBenefit: string;
}

const SERVICES: ServiceItem[] = [
  // Row 1: مواقع ومتاجر
  {
    id: "corporate-websites",
    number: "01",
    title: "مواقع الشركات والمؤسسات",
    category: "websites",
    categoryLabel: "مواقع",
    iconId: "Jole6qi4QB3h", // Icons8: company
    description: "مواقع احترافية تعرّف بشركتك وخدماتك وتبني حضورًا رقميًا قويًا وموثوقًا أمام العملاء.",
    example: "موقع لشركة مقاولات يعرض الخدمات، المشاريع السابقة، نبذة عن الشركة، وطرق التواصل.",
    ctaText: "استكشف الخدمة",
    projectType: "موقع",
    problemScenario: "ما عندي موقع أو صفحة واضحة",
    timeline: "1 – 2 أسبوع",
    idealFor: "الشركات، مكاتب الاستشارات، والأنشطة التجارية والمهنية.",
    detailedBenefit: "أبني لك واجهة تسويقية موثوقة تمنح عملاءك انطباعاً أولياً قوياً وتعرض سابقة أعمالك وفريقك بأسلوب احترافي متجاوب.",
    deliverables: [
      "تصميم واجهة متجاوب وسريع على كل الشاشات",
      "تهيئة متقدمة لمحركات البحث (SEO)",
      "ربط مباشر مع WhatsApp ونماذج المراسلة الفورية",
      "صفحات مفصلة للمشاريع والشهادات والاعتمادات",
      "لوحة تحكم مرنة لتحديث المحتوى والأخبار",
    ],
  },
  {
    id: "ecommerce-stores",
    number: "02",
    title: "المتاجر الإلكترونية",
    category: "stores",
    categoryLabel: "متاجر",
    iconId: "zhda2EVBCvHY", // Icons8: shopping-cart
    description: "متاجر إلكترونية متكاملة مصممة لعرض المنتجات وتحويل الزوار إلى عملاء مشترين.",
    example: "متجر لبيع العطور أو الملابس مع المنتجات، السلة، الدفع الإلكتروني، وإدارة الطلبات.",
    ctaText: "استكشف الخدمة",
    projectType: "متجر",
    problemScenario: "متجري يحتاج تحسين",
    timeline: "2 – 3 أسابيع",
    idealFor: "أصحاب البراندات والمتاجر المستقلة لرفع كفاءة ومبيعات النشاط.",
    detailedBenefit: "متجر مصمم هندسياً لتقليل خطوات الشراء ومضاعفة معدلات التحويل من خلال تجربة تصفح سريعة وخفيفة من الجوال.",
    deliverables: [
      "واجهة متجر جذابة تعكس الهوية البصرية بدقة",
      "صفحات منتجات مفصلة ومهيأة للتحويل والإقناع",
      "سلة شراء مرنة ومسار دفع إلكتروني ميسر",
      "لوحة إدارة المخزون، الطلبات، وكوبونات الخصم",
      "ربط مع شركات الشحن المحلي وبوابات الدفع",
    ],
  },
  {
    id: "salla-stores",
    number: "03",
    title: "تصميم متاجر سلة",
    category: "stores",
    categoryLabel: "متاجر سلة",
    badge: "10+ متاجر منفذة",
    iconId: "sx8jgVIf8D8i", // Icons8: online-store
    description: "تصميم وتطوير واجهات متاجر احترافية على منصة سلة، جاهزة للبيع وتعكس هوية العلامة التجارية.",
    example: "متجر قهوة أو إكسسوارات مصمم بالكامل ليكون جاهزًا لاستقبال العملاء والطلبات.",
    ctaText: "أريد متجر سلة",
    projectType: "متجر",
    problemScenario: "متجري يحتاج تحسين",
    timeline: "3 – 7 أيام",
    idealFor: "رواد الأعمال وأصحاب المتاجر الراغبين في إطلاق متجر فوري على سلة بهوية متميزة.",
    detailedBenefit: "أحوّل متجرك على سلة من مجرد قالب نمطي مكرر إلى متجر فريد يمنح العميل ثقة فورية تزيد من مبيعاتك وتسهل تجربة التصفح.",
    deliverables: [
      "تخصيص كامل لثيم سلة مع بناء أقسام وبانرات احترافية",
      "تنسيق متناسق للألوان والخطوط والأيقونات الخاصة بالهوية",
      "ترتيب الأقسام الرئيسية والمنتجات المميزة وعروض التوفير",
      "ضبط مخصص لشاشات الجوال لتصفح وشراء فائق السرعة",
      "مساعدة في ربط بوابات الدفع والشحن وإعدادات المتجر",
    ],
  },

  // Row 2: أنظمة ولوحات تحكم
  {
    id: "admin-dashboards",
    number: "04",
    title: "الأنظمة الإدارية ولوحات التحكم",
    category: "systems",
    categoryLabel: "أنظمة",
    iconId: "sUJRwjfnGwbJ", // Icons8: dashboard-layout
    description: "أنظمة داخلية تساعد الشركات على إدارة العمليات والموظفين والبيانات من لوحة تحكم واحدة.",
    example: "نظام لإدارة موظفي شركة صغيرة ومتابعة الحضور والبيانات والتقارير.",
    ctaText: "استكشف الخدمة",
    projectType: "نظام",
    problemScenario: "أتابع الشغل يدويًا بين واتساب وExcel",
    timeline: "3 – 6 أسابيع",
    idealFor: "الشركات والأنشطة التي تعاني من فوضى الجداول الورقية وتشتت البيانات في Excel.",
    detailedBenefit: "تجميع عملياتك اليومية في لوحة سحابية آمنة تمنحك رؤية واضحة ومباشرة لأداء العمل وتوفر ساعات العمل اليدوي المهدرة.",
    deliverables: [
      "لوحة تحكم تفاعلية وسريعة تجمع أهم المؤشرات",
      "إدارة شاملة للموظفين والمهام والصلاحيات",
      "قاعدة بيانات سحابية مركزية آمنة مع نسخ احتياطي",
      "تقارير وإحصائيات دورية لأداء العمليات",
      "تصدير البيانات والتقارير بضغطة زر",
    ],
  },
  {
    id: "booking-systems",
    number: "05",
    title: "أنظمة الحجوزات والمواعيد",
    category: "systems",
    categoryLabel: "أنظمة",
    iconId: "vwGXRtPWrZSn", // Icons8: calendar
    description: "أنظمة حجز ذكية تجعل إدارة المواعيد أسهل للعميل وصاحب النشاط دون تداخل.",
    example: "نظام حجز مواعيد لصالون حلاقة أو عيادة مع إدارة المواعيد والعملاء.",
    ctaText: "استكشف الخدمة",
    projectType: "نظام",
    problemScenario: "أتابع الشغل يدويًا بين واتساب وExcel",
    timeline: "2 – 4 أسابيع",
    idealFor: "العيادات، صالونات التجميل، مكاتب الاستشارات، والمرافق الرياضية والخدمية.",
    detailedBenefit: "أتمتة جدولة المواعيد ومنع تضارب الأوقات، مع إرسال تنبيهات وتأكيدات تلقائية عبر WhatsApp أو البريد الإلكتروني.",
    deliverables: [
      "تقويم مواعيد تفاعلي يعرض الأوقات الشاغرة بدقة",
      "واجهة حجز سهلة وفورية للعملاء عبر الجوال",
      "إدارة أوقات العمل وفترات الراحة وجداول الموظفين",
      "تنبيهات تلقائية فورية للمواعيد والتعديلات",
      "إمكانية تفعيل الدفع المسبق أو دفع عربون لتأكيد الحجز",
    ],
  },
  {
    id: "membership-systems",
    number: "06",
    title: "أنظمة العضويات والاشتراكات",
    category: "systems",
    categoryLabel: "أنظمة",
    iconId: "OmlOXb8PLdmy", // Icons8: membership-card
    description: "منصات تعتمد على العضويات والاشتراكات الشهرية أو السنوية مع إدارة المستخدمين والصلاحيات.",
    example: "منصة دورات تدريبية تتيح للمستخدم الاشتراك والوصول إلى المحتوى حسب الباقة.",
    ctaText: "استكشف الخدمة",
    projectType: "منصة",
    problemScenario: "عندي فكرة تطبيق أو منصة",
    timeline: "3 – 5 أسابيع",
    idealFor: "صناع المحتوى، الأكاديميات التدريبية، والمجتمعات والنوادي الرقمية المدفوعة.",
    detailedBenefit: "بناء بنية برمجية متكاملة لتسجيل الأعضاء، تجديد الاشتراكات الدورية، وحماية المحتوى الحصري آلياً.",
    deliverables: [
      "باقات اشتراك متعددة المستويات (شهرية / سنوية)",
      "ربط مع بوابات الدفع للاشتراكات المتكررة والتجديد التلقائي",
      "لوحة حساب شخصية لكل مشترك لإدارة باقته",
      "حماية المحتوى المخصص حسب فئة العضوية",
      "سجل الفواتير والدفعات وإدارة صلاحيات المشتركين",
    ],
  },

  // Row 3: منصات وعملاء
  {
    id: "crm-systems",
    number: "07",
    title: "أنظمة إدارة العملاء والموظفين CRM",
    category: "systems",
    categoryLabel: "أنظمة",
    iconId: "vmcbGnMtRqEX", // Icons8: workflow
    description: "حلول مخصصة لتنظيم العملاء والطلبات والموظفين ومتابعة سير العمل بدقة.",
    example: "نظام CRM لشركة خدمات لتسجيل العملاء ومتابعة طلباتهم ومراحل تنفيذها.",
    ctaText: "استكشف الخدمة",
    projectType: "نظام",
    problemScenario: "أتابع الشغل يدويًا بين واتساب وExcel",
    timeline: "3 – 6 أسابيع",
    idealFor: "الشركات الخدمية، وكالات التسويق، والمكاتب الاستشارية والمهنية.",
    detailedBenefit: "تنظيم مسار تحويل العميل المحتمل إلى عقد منجز، ومتابعة سجل المحادثات والمهام الموزعة على الفريق في شاشة واحدة.",
    deliverables: [
      "سجل مركزي متكامل لبيانات العملاء وتاريخ التعاملات",
      "لوحة كانبان لمتابعة مراحل الطلبات وعمليات البيع",
      "توزيع وتعيين المهام بين الموظفين مع الإشعارات",
      "جدولة مواعيد المتابعة والتذكير التلقائي",
      "تقارير دورية حول إنتاجية الفريق ونسب الإغلاق",
    ],
  },
  {
    id: "service-platforms",
    number: "08",
    title: "المنصات الإلكترونية ومواقع الخدمات",
    category: "websites",
    categoryLabel: "مواقع ومنصات",
    iconId: "8kvDToFaCkmL", // Icons8: layers
    description: "منصات رقمية تربط بين المستخدمين ومقدمي الخدمات أو تعرض خدمات ومنتجات بطريقة منظمة.",
    example: "منصة لعرض خدمات المستقلين ومقدمي الخدمات وتمكين العملاء من استكشافها والتواصل معهم.",
    ctaText: "استكشف الخدمة",
    projectType: "منصة",
    problemScenario: "عندي فكرة تطبيق أو منصة",
    timeline: "4 – 8 أسابيع",
    idealFor: "رواد الأعمال والمشاريع الناشئة الراغبة في بناء منصة وساطة أو Marketplace خدمي.",
    detailedBenefit: "هيكلة منصة متكاملة تسمح بتعدد أطراف الاستخدام (عملاء / مقدمي خدمة / إدارة) مع نظام بحث وتصفية وتقييم دقيق.",
    deliverables: [
      "بوابات مستخدمين مخصصة للعملاء ومقدمي الخدمات",
      "محرك بحث وفلاتر متقدمة للتصنيف والاستكشاف",
      "لوحة تحكم إدارية مركزية للرقابة واعتماد الحسابات",
      "نظام تقييمات ومراجعات لتعزيز الشفافية والموثوقية",
      "بنية سحابية قابلة للتوسع واستيعاب آلاف المستخدمين",
    ],
  },
  {
    id: "landing-pages",
    number: "09",
    title: "صفحات الهبوط Landing Pages",
    category: "websites",
    categoryLabel: "مواقع",
    iconId: "UOXsWpsgfxq5", // Icons8: rocket
    description: "صفحات Landing Page مصممة حول هدف واضح: بيع منتج، الحصول على عملاء، أو إطلاق خدمة.",
    example: "صفحة إطلاق لتطبيق جديد تحتوي على عرض واضح، مزايا المنتج، Social Proof، وCTA قوي.",
    ctaText: "استكشف الخدمة",
    projectType: "موقع",
    problemScenario: "ما عندي موقع أو صفحة واضحة",
    timeline: "3 – 7 أيام",
    idealFor: "الحملات الإعلانية الممولة، إطلاق المنتجات الجديدة، وجمع بيانات العملاء المهتمين (Leads).",
    detailedBenefit: "صفحة سريعة ومركزة ذات رسالة تسويقية واضحة وتصميم بصري مقنع يخاطب حاجة العميل ويدفعه لاتخاذ الإجراء فوراً.",
    deliverables: [
      "تصميم موجه لرفع معدلات التحويل والإقناع",
      "سرعة تحميل فائقة لمنع ارتداد زوار الإعلانات",
      "ربط مباشر مع أدوات التحليل وPixel الإعلانية",
      "صياغة وترتيب العناوين والمزايا بأسلوب بيعي مقنع",
      "تجاوب بصري كامل على كافة أحجام الشاشات",
    ],
  },

  // Row 4: تصميم وحلول مخصصة
  {
    id: "ui-ux-design",
    number: "10",
    title: "تصميم UI/UX",
    category: "design",
    categoryLabel: "تصميم",
    iconId: "yeigAyDNo2GO", // Icons8: design
    description: "تصميم واجهات وتجارب استخدام حديثة قبل بدء البرمجة، مع التركيز على سهولة الاستخدام والوضوح.",
    example: "تصميم واجهة تطبيق توصيل من الفكرة الأولية إلى Prototype قابل للعرض.",
    ctaText: "استكشف الخدمة",
    projectType: "تصميم",
    problemScenario: "عندي فكرة تطبيق أو منصة",
    timeline: "1 – 3 أسابيع",
    idealFor: "أصحاب الأفكار والتطبيقات قبل الاستثمار في مرحلة البرمجة لتفادي تكاليف التعديل.",
    detailedBenefit: "أحوّل فكرتك المجردة إلى شاشات تفاعلية ونموذج واقعي عالي الدقة على Figma يمكنك مراجعته وتجربته قبل كتابة سطر كود واحد.",
    deliverables: [
      "مخططات وهيكلة تجربة الاستخدام (Wireframes)",
      "واجهات Figma عالية الدقة وكاملة الحالات",
      "نموذج أولي تفاعلي قابل للتجربة والنقر (Prototype)",
      "دليل المكونات ونظام التصميم الخاص بالهوية",
      "ملفات مجهزة بدقة لتسليمها للمطورين",
    ],
  },
  {
    id: "modernization",
    number: "11",
    title: "تطوير وتحسين المواقع والأنظمة الحالية",
    category: "websites",
    categoryLabel: "مواقع وأنظمة",
    iconId: "VuNO5eSHIj35", // Icons8: wrench
    description: "لا تحتاج دائمًا إلى بناء مشروع جديد. أستطيع تطوير مشروعك الحالي وتحسين الأداء والتجربة والمظهر.",
    example: "تحسين موقع بطيء، إعادة تصميم واجهته، إصلاح المشاكل، وتحسين تجربة المستخدم.",
    ctaText: "استكشف الخدمة",
    projectType: "موقع",
    problemScenario: "عندي موقع أو نظام يحتاج تطوير",
    timeline: "3 – 10 أيام",
    idealFor: "الأنشطة التي تملك موقعاً أو نظاماً قائماً لكنه يعاني من البطء أو المشاكل التقنية أو المظهر القديم.",
    detailedBenefit: "تحديث شاشات موقعك، رفع سرعة التصفح لـ 90+ على PageSpeed، وإصلاح العيوب البصرية والوظيفية دون الحاجة للبناء من الصفر.",
    deliverables: [
      "فحص شامل للأداء والسرعة ونقاط الضعف التقنية",
      "تحسين سرعة التحميل وضغط الأصول والملفات",
      "تحديث الواجهات القديمة وتطوير مظهرها لتواكب اليوم",
      "إصلاح أخطاء التجاوب على شاشات الهواتف",
      "تحديث وتأمين قواعد البيانات والمكتبات البرمجية",
    ],
  },
  {
    id: "custom-solutions",
    number: "12",
    title: "أنظمة مخصصة حسب فكرة مشروعك",
    category: "systems",
    categoryLabel: "حل مخصص",
    badge: "لديك فكرة مختلفة؟",
    featured: true,
    iconId: "YxCw7An8DYqf", // Icons8: sparkling
    description: "إذا كانت فكرتك لا تنتمي إلى خدمة محددة، يمكن بناء نظام مخصص بالكامل حسب طريقة عمل مشروعك واحتياجاتك.",
    example: "نظام خاص لإدارة طلبات مطعم، مغسلة سيارات، نادي رياضي، شركة خدمات، أو أي فكرة أخرى.",
    ctaText: "احكِ لي عن فكرتك ←",
    projectType: "نظام",
    problemScenario: "عندي فكرة تطبيق أو منصة",
    timeline: "حسب متطلبات فكرتك",
    idealFor: "أصحاب الأفكار المبتكرة والأنشطة ذات المسارات الخاصة التي لا تلائمها القوالب والبرامج الجاهزة.",
    detailedBenefit: "هندسة برمجية متكاملة تبنى خصصياً من الصفر لتطابق طريقة عملك اليومية وتلبي احتياجات فريقك وعملائك بدقة متناهية.",
    deliverables: [
      "جلسة استشارية لتحليل وهندسة متطلبات فكرتك",
      "تصميم واجهات وتجربة استخدام تخدم خصوصية الفكرة",
      "برمجة الواجهات والعمليات الخلفية وقاعدة البيانات بالكامل",
      "ربط وتكامل مع بوابات الدفع، الخرائط، أو خدمات WhatsApp",
      "دعم فني واختبار ما بعد الإطلاق لضمان ثبات النظام",
    ],
  },
];

const FILTER_CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "websites", label: "مواقع" },
  { id: "stores", label: "متاجر" },
  { id: "systems", label: "أنظمة" },
  { id: "design", label: "تصميم" },
] as const;

type FilterId = (typeof FILTER_CATEGORIES)[number]["id"];

export function WhatIBuild() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { isEditMode, openDrawer } = useLiveEdit();

  const filteredServices = useMemo(() => {
    if (activeFilter === "all") return SERVICES;
    return SERVICES.filter((s) => s.category === activeFilter);
  }, [activeFilter]);

  const triggerOrderService = (service: ServiceItem) => {
    setSelectedService(null);
    window.dispatchEvent(
      new CustomEvent("select-problem", {
        detail: {
          projectType: service.projectType,
          problem: service.problemScenario,
        },
      }),
    );
    setTimeout(() => {
      smoothScrollTo("#contact-form");
    }, 100);
  };

  const scrollToContact = () => {
    smoothScrollTo("#contact-form");
  };

  return (
    <SectionReveal id="what-i-build" className="relative overflow-hidden py-16 sm:py-24 border-t border-border/60">
      {/* Subtle Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/4 -z-10 size-[500px] rounded-full bg-accent/5 blur-3xl"
      />

      <Container>
        {/* 1. Header */}
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles className="size-3.5" />
              <EditableText contentKey="home.services.badge" defaultText="خدماتي" />
            </span>
            <EditableText
              as="h2"
              contentKey="home.services.title"
              defaultText="أحوّل أفكارك إلى منتجات رقمية حقيقية"
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-display"
            />
            <EditableText
              as="p"
              contentKey="home.services.subtitle"
              multiline
              defaultText="من المواقع والمتاجر إلى الأنظمة والمنصات المخصصة — أصمم وأطور حلولًا رقمية تناسب احتياج مشروعك وتُبنى لتكون قابلة للاستخدام والتوسع."
              className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-sans"
            />
          </div>
        </Reveal>

        {/* 2. Filter Bar */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" role="tablist" aria-label="تصفية الخدمات">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(cat.id)}
                className={`relative shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "border border-border/70 bg-card/80 text-muted-foreground hover:border-accent/40 hover:text-foreground hover:bg-card"
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeServiceFilter"
                    className="size-1.5 rounded-full bg-accent inline-block mr-0.5"
                    transition={{ duration: 0.22 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Services 12-Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((svc, idx) => {
              const isFeatured = svc.featured;

              return (
                <motion.article
                  key={svc.id}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className={`group relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isFeatured
                      ? "border-2 border-accent/60 bg-gradient-to-br from-accent/[0.07] via-card to-card shadow-lg shadow-accent/5 hover:border-accent"
                      : "border border-border/70 bg-card/90 hover:border-accent/50 dark:bg-card/70"
                  }`}
                >
                  <div>
                    {/* Top Row: Number, Icon, and Optional Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-10 items-center justify-center rounded-xl transition-colors duration-300 ${
                            isFeatured
                              ? "bg-accent text-accent-foreground shadow-sm"
                              : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
                          }`}
                        >
                          <Icons8Icon id={svc.iconId} className="size-5" alt={svc.title} />
                        </div>
                        <span className="font-mono text-xs font-bold text-accent tracking-wider" dir="ltr">
                          {svc.number}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawer("service", svc.id, svc);
                            }}
                            className="inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/40 text-accent px-2 py-0.5 text-[11px] font-bold hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer shadow-xs"
                            title="تعديل تفاصيل هذه الخدمة"
                          >
                            <Pencil className="size-3" />
                            <span>تعديل</span>
                          </button>
                        )}
                        {svc.badge && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                            {svc.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-5 text-lg sm:text-xl font-bold text-foreground leading-snug font-sans group-hover:text-accent transition-colors">
                      <EditableText
                        contentKey={`service.${svc.id}.title`}
                        defaultText={svc.title}
                        groupName="services"
                      />
                    </h3>

                    {/* Short Description */}
                    <p className="mt-2.5 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                      <EditableText
                        contentKey={`service.${svc.id}.description`}
                        defaultText={svc.description}
                        multiline
                        groupName="services"
                      />
                    </p>

                    {/* Example Box */}
                    <div className="mt-4 rounded-xl border border-border/50 bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                      <span className="font-bold text-foreground inline-block ml-1">مثال:</span>
                      <EditableText
                        contentKey={`service.${svc.id}.example`}
                        defaultText={svc.example}
                        multiline
                        groupName="services"
                      />
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedService(svc)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent transition-colors hover:underline cursor-pointer"
                    >
                      <span>تفاصيل الخدمة</span>
                      <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerOrderService(svc)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        isFeatured
                          ? "bg-accent text-accent-foreground hover:opacity-90 shadow-sm"
                          : "border border-border/80 bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent"
                      }`}
                    >
                      <span>{isFeatured ? "احكِ لي عن فكرتك →" : "أريد هذا النوع"}</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 4. Bottom CTA Section */}
        <Reveal delay={0.1}>
          <div className="mt-14 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-accent/5 p-8 sm:p-12 text-center shadow-lg">
            <div className="mx-auto max-w-2xl">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent mb-4">
                <HelpCircle className="size-6 stroke-[1.8]" />
              </span>
              <EditableText
                as="h3"
                contentKey="home.services.custom_cta_title"
                defaultText="ما لقيت الخدمة اللي تبحث عنها؟"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display"
              />
              <EditableText
                as="p"
                contentKey="home.services.custom_cta_desc"
                multiline
                defaultText="إذا كانت فكرتك مختلفة أو لم تجدها ضمن القائمة، اشرحها لي وسأساعدك في تحليلها وتحويلها إلى حل رقمي مناسب لطريقة عملك."
                className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground font-sans"
              />

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 cursor-pointer"
                >
                  <span>ابدأ مشروعك</span>
                  <ArrowLeft className="size-4" />
                </button>

                <a
                  href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("السلام عليكم محمد، عندي فكرة مشروع وأود استشارتك فيها.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <MessageCircle className="size-4 text-accent" />
                  <span>تواصل معي عبر WhatsApp</span>
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* 5. Service Detail Modal */}
      {selectedService && (
        <Dialog open={Boolean(selectedService)} onOpenChange={(open) => !open && setSelectedService(null)}>
          <DialogContent className="max-w-2xl sm:rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                  {selectedService.categoryLabel}
                </span>
                <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                  #{selectedService.number}
                </span>
                {selectedService.badge && (
                  <span className="rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                    {selectedService.badge}
                  </span>
                )}
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold font-display text-foreground">
                {selectedService.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-foreground/80 mt-1 leading-relaxed">
                {selectedService.detailedBenefit}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Deliverables Checklist */}
              <div>
                <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-3">
                  ماذا تستلم في هذا المشروع؟
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.deliverables.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-muted/40 p-3 text-xs leading-relaxed text-foreground/90">
                      <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-background p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
                    <Target className="size-3.5 text-accent" />
                    <span>الأنسب لمين؟</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedService.idealFor}
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-background p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
                    <Clock className="size-3.5 text-accent" />
                    <span>المدة المتوقعة:</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedService.timeline}
                  </p>
                </div>
              </div>

              {/* Real World Example Box */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-xs leading-relaxed">
                <span className="font-bold text-accent block mb-1">💡 مثال واقعي:</span>
                <span className="text-foreground/85">{selectedService.example}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-end gap-3">
                <a
                  href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`السلام عليكم محمد، أود الاستفسار عن خدمة: ${selectedService.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  <MessageCircle className="size-3.5 text-accent" />
                  <span>محادثة واتساب</span>
                </a>

                <button
                  type="button"
                  onClick={() => triggerOrderService(selectedService)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span>طلب هذه الخدمة الآن</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </SectionReveal>
  );
}

