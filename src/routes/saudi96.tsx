import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Clock,
  Smartphone,
  Wrench,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Briefcase,
  Coffee,
  MapPin,
  Sparkles,
  Zap,
  Globe,
  Award,
  Flame,
  ArrowRight,
  X,
  Phone,
  Monitor,
} from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { site } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/saudi96")({
  head: () => ({
    meta: buildMeta({
      title: "عرض اليوم الوطني السعودي 96 | موقعك التعريفي بـ 296 ريال فقط - عِزّنا بطبعنا",
      description:
        "احتفالاً باليوم الوطني 96: موقع تعريفي احترافي متكامل خلال 48 ساعة بـ 296 ريال بدلاً من 650 ريال. تصميم عصري يعكس الهوية الوطنية مع ربط الواتساب ودومين واستضافة.",
      path: "/saudi96",
    }),
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;600;700;800&display=swap",
      },
    ],
  }),
  component: Saudi96LandingPage,
});

const cleanPhone = site.whatsapp ? site.whatsapp.replace(/[^0-9]/g, "") : "966500000000";

const defaultWhatsappText =
  "مرحباً م. محمد، أرغب بالاستفادة من عرض اليوم الوطني 96 لتصميم موقع تعريفي بـ 296 ريال.";

const baseWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
  defaultWhatsappText,
)}`;

function getTemplateWhatsappUrl(templateName: string) {
  const text = `مرحباً م. محمد، مهتم بعرض اليوم الوطني 96 (296 ريال) وأرغب في اختيار نموذج: "${templateName}".`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// 6 Core Heritage Values from Official SND 96 Identity
const heritageValues = [
  {
    title: "الكرم والضيافة",
    slug: "عِزّنا بكرمنا",
    image: "/saudi96/motif-dallah.jpg",
    description: "تصميم ترحيبي يعكس حفاوة أعمالك ويترك انطباعاً أولاً لا يُنسى لدى كل زائر.",
    highlight: "دلة القهوة السعودية",
  },
  {
    title: "الشجاعة والإقدام",
    slug: "عِزّنا بشجاعتنا",
    image: "/saudi96/motif-sword.jpg",
    description: "حضور رقمي مهيب وموثوق يضعك في صدارة المنافسة ويثبت مكانتك في السوق.",
    highlight: "السيف السعودي الأصيل",
  },
  {
    title: "العزيمة والإصرار",
    slug: "عِزّنا بهمتنا",
    image: "/saudi96/motif-tuwaiq.jpg",
    description: "بنية برمجية فائقة السرعة والاستقرار مستلهمة من ثبات وشموخ جبل طويق.",
    highlight: "جبل طويق الشامخ",
  },
  {
    title: "العطاء والنماء",
    slug: "عِزّنا بعطائنا",
    image: "/saudi96/motif-tree.jpg",
    description: "موقع مهيأ لتنمية قاعدة عملائك وزيادة الاستفسارات والمبيعات باستمرار.",
    highlight: "شجرة النماء الخضراء",
  },
  {
    title: "الرؤية والطموح",
    slug: "عِزّنا بحلمنا",
    image: "/saudi96/motif-sun.jpg",
    description: "واجهات عصرية تواكب مستهدفات رؤية المملكة 2030 بأحدث معايير الويب العالمية.",
    highlight: "شمس الرؤية والطموح",
  },
  {
    title: "الأصالة والوفاء",
    slug: "عِزّنا بأصالتنا",
    image: "/saudi96/motif-mabkhara.jpg",
    description: "تناغم فاخر بين روح التراث الأصيل وتجربة المستخدم الحديثة وسريعة الاستجابة.",
    highlight: "المبخرة التراثية",
  },
];

type ShowcaseTemplate = {
  id: string;
  title: string;
  category: string;
  badge: string;
  motif: string;
  description: string;
  features: string[];
  icon: typeof Briefcase;
  demoDetails: {
    heroTitle: string;
    heroSubtitle: string;
    about: string;
    services: string[];
    accentColor: string;
    previewBg: string;
  };
};

const templates: ShowcaseTemplate[] = [
  {
    id: "corporate",
    title: "نموذج الشركات والخدمات",
    category: "للشركات، المكاتب، ومقدمي الخدمات",
    badge: "الأكثر طلباً للشركات",
    motif: "/saudi96/motif-sword.jpg",
    description:
      "واجهة مؤسسية رصينة تبرز خدماتك، مشاريعك السابقة، وفريق عملك، مع نموذج تواصل مباشر.",
    features: [
      "قسم مخصص لعرض الخدمات الرئيسية",
      "أزرار اتصال وواتساب مباشرة بكل صفحة",
      "قسم لآراء العملاء وشركاء النجاح",
      "ربط الموقع مع خرائط جوجل",
    ],
    icon: Briefcase,
    demoDetails: {
      heroTitle: "نبني شراكات موثوقة تقود أعمالك للريادة",
      heroSubtitle:
        "مؤسسة وطنية تقدم أرقى الحلول والخدمات المهنية بأعلى معايير الدقة والالتزام في المملكة.",
      about:
        "نفتخر بمسيرة حافلة تمتد لسنوات في تقديم الاستشارات والخدمات المتخصصة للقطاعين العام والخاص.",
      services: ["استشارات متخصصة", "إدارة المشاريع", "تطوير الحلول المهنية", "الدعم الميداني"],
      accentColor: "#006C5B",
      previewBg: "from-[#082E22] to-[#0A3825]",
    },
  },
  {
    id: "personal",
    title: "نموذج المستقلين والخبراء",
    category: "للمدربين، المستشارين، والمبدعين",
    badge: "مميز للهوية الشخصية",
    motif: "/saudi96/motif-dallah.jpg",
    description:
      "صفحة هبوط فاخرة تبرز سيرتك المهنية، إنجازاتك، وقنوات التواصل لحجز الاستشارات مباشرة.",
    features: [
      "معرض للأعمال والإنجازات البارزة",
      "نبذة شخصية احترافية ومسار الخبرات",
      "روابط مباشرة لكافة حسابات التواصل",
      "زر سريع لحجز المواعيد والاستشارات",
    ],
    icon: Coffee,
    demoDetails: {
      heroTitle: "أصنع حلولاً إبداعية تُلهم جمهورك وتنمّي أثرك",
      heroSubtitle:
        "مستشار ومطور أعمال أساعد القادة ورواد الأعمال في صياغة حضورهم وتطوير مشاريعهم المبتكرة.",
      about:
        "أعمل مع أصحاب الرؤى لتحويل الأفكار المعقدة إلى خطط تنفيذية ونتائج ملموسة تعزز الحضور في السوق السعودي.",
      services: [
        "استشارات فردية ومؤسسية",
        "ورش عمل وتدريب",
        "بناء الهوية الاستراتيجية",
        "إشراف تنفيذي",
      ],
      accentColor: "#C69A43",
      previewBg: "from-[#29200F] to-[#1C160B]",
    },
  },
  {
    id: "local",
    title: "نموذج المقاهي والأنشطة المحلية",
    category: "للمقاهي، المطاعم، والعيادات والمتاجر",
    badge: "جذاب للزوار والمحليين",
    motif: "/saudi96/motif-tuwaiq.jpg",
    description:
      "تصميم حيوي يبرز موقعك الجغرافي، قائمة منتجاتك، أوقات العمل، ورابط حجز مباشر للعملاء.",
    features: [
      "عرض مرئي أنيق لقائمة الأسعار والخدمات",
      "خريطة تفاعلية واضحة للوصول للموقع",
      "ساعات العمل الرسمية وأرقام الحجز",
      "توافق فائق السرعة مع أجهزة الجوال",
    ],
    icon: MapPin,
    demoDetails: {
      heroTitle: "تجربة سعودية أصيلة تبدأ مع أول زيارة",
      heroSubtitle: "نجمع بين كرم الضيافة وأعلى درجات الجودة لنقدم لكم لحظات لا تُنسى في كل يوم.",
      about:
        "انطلقنا بشغف لنقدم تجربة استثنائية تحتفي بالنكهات والتفاصيل التراثية الممزوجة بروح العصر الحديث.",
      services: [
        "قائمة مختارة بعناية",
        "حجوزات المناسبات الخاصة",
        "طلبات الاستلام السريع",
        "عروض المناسبات",
      ],
      accentColor: "#006C5B",
      previewBg: "from-[#07241A] to-[#0A3825]",
    },
  },
];

const includedFeatures = [
  {
    title: "تصميم متجاوب 100% للجوال",
    desc: "يعمل بسرعة فائقة وسلاسة تامة على جميع الهواتف الذكية والأجهزة اللوحية والمكتبية.",
    icon: Smartphone,
  },
  {
    title: "ربط مباشر بالواتساب والاتصال",
    desc: "أزرار تفاعلية بنقرة واحدة لتحويل زوار موقعك إلى عملاء محتملين عبر الواتساب فوراً.",
    icon: MessageCircle,
  },
  {
    title: "استضافة سحابية فائقة السرعة مجاناً",
    desc: "تشمل استضافة آمنة وسريعة لمدة سنة كاملة مجاناً دون أي تكاليف خفية إضافية.",
    icon: Zap,
  },
  {
    title: "شهادة أمان مشفرة SSL ونطاق رسمي",
    desc: "حماية كاملة لبيانات موقعك وزوارك مع قفل الأمان الأخضر وثقة محركات البحث.",
    icon: ShieldCheck,
  },
  {
    title: "تسليم قياسي خلال 48 ساعة فقط",
    desc: "نلتزم بتسليم موقعك وبرمجته بالكامل ليكون جاهزاً للنشر أمام عملائك خلال يومين.",
    icon: Clock,
  },
  {
    title: "دعم فني وتعديلات مجانية لمدة شهر",
    desc: "نقف معك خطوة بخطوة مع دعم فني مستمر وتعديلات مجانية على المحتوى لضمان رضاك.",
    icon: Wrench,
  },
];

const faqs = [
  {
    question: "لماذا السعر 296 ريال فقط؟ وهل هناك رسوم خفية؟",
    answer:
      "السعر 296 ريال هو مبادرة احتفالية خاصة باليوم الوطني الـ 96 للمملكة العربية السعودية، بهدف دعم رواد الأعمال والأنشطة الناشئة. لا توجد أي رسوم خفية إطلاقاً؛ الباقة تشمل التصميم، والبرمجة، والاستضافة المجانية لمدة عام كامل.",
  },
  {
    question: "كم يستغرق استلام الموقع ليكون جاهزاً للنشر؟",
    answer:
      "يتم تسليم موقعك جاهزاً بالكامل خلال 48 ساعة فقط من استلام المحتوى المطلوب (الشعار، نبذة عن النشاط، ومعلومات التواصل).",
  },
  {
    question: "هل يمكنني ربط الموقع باسم دومين خاص بي؟",
    answer:
      "نعم بكل تأكيد! إذا كان لديك دومين (.com أو .sa) سنقوم بربطه مجاناً بموقعك. وإذا لم يكن لديك، سنساعدك خطوة بخطوة في حجزه وتفعيله بأفضل وأقل تكلفة رسمية.",
  },
  {
    question: "ماذا لو رغبت في تعديل الصور أو النصوص لاحقاً؟",
    answer:
      "الموقع مصمم بتقنيات حديثة تتيح المرونة، كما نمنحك دعماً فنياً وتعديلات مجانية لمدة 30 يوماً بعد التسليم لضمان ملاءمة الموقع لاحتياجاتك تماماً.",
  },
  {
    question: "ما هي آلية الدفع وبدء العمل؟",
    answer:
      "يتم دفع 50% كعربون لبدء تنفيذ وبرمجة الموقع، والـ 50% المتبقية لا يتم دفعها إلا بعد معاينتك للموقع وتأكدك من اكتماله ورضاك التام عنه.",
  },
];

function ShowcaseModal({
  template,
  isOpen,
  onClose,
}: {
  template: ShowcaseTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#061E15]/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-[#C69A43]/40 bg-[#0B2A1E] text-white shadow-2xl transition-all flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#061D15] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src={template.motif}
              alt=""
              className="size-8 rounded-lg object-cover border border-[#C69A43]/40"
            />
            <div>
              <h3 className="text-sm font-bold text-white">{template.title}</h3>
              <p className="text-[11px] text-[#C69A43]">{template.category}</p>
            </div>
          </div>

          {/* Device Toggle & Close */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center rounded-lg bg-black/30 p-1 border border-white/10">
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  deviceMode === "mobile"
                    ? "bg-[#006C5B] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>جوال</span>
              </button>
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  deviceMode === "desktop"
                    ? "bg-[#006C5B] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Monitor className="size-3.5" />
                <span>كمبيوتر</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#092218] to-[#0D3023]">
          <div
            className={`mx-auto transition-all duration-300 rounded-2xl border border-white/15 bg-white text-gray-900 shadow-xl overflow-hidden ${
              deviceMode === "mobile" ? "max-w-sm" : "w-full"
            }`}
          >
            {/* Simulated Browser Address Bar */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#F5F2EB] px-3 py-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400 inline-block" />
                <span className="size-2.5 rounded-full bg-yellow-400 inline-block" />
                <span className="size-2.5 rounded-full bg-green-400 inline-block" />
              </div>
              <div className="rounded-md bg-white px-3 py-0.5 text-[10px] text-gray-500 font-mono shadow-xs border border-gray-200 flex items-center gap-1">
                <ShieldCheck className="size-3 text-[#006C5B]" />
                <span>https://yourbrand.sa/</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold">معاينة 96</span>
            </div>

            {/* Simulated Website Content */}
            <div className="p-4 sm:p-6">
              {/* Site Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#006C5B] text-white text-xs font-black">
                    شعار
                  </div>
                  <span className="text-xs font-bold text-gray-800">هويتك التجارية</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                  <span>الرئيسية</span>
                  <span>الخدمات</span>
                  <span>تواصل</span>
                </div>
              </div>

              {/* Simulated Hero */}
              <div className="rounded-xl bg-gradient-to-br from-[#F6F4ED] to-[#EAE4D5] p-5 text-center border border-[#D9D1BE]/50 mb-5">
                <span className="inline-block rounded-full bg-[#006C5B]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#006C5B] mb-2">
                  عِزّنا بطبعنا • اليوم الوطني 96
                </span>
                <h4 className="text-base sm:text-lg font-black text-gray-900 leading-snug mb-2">
                  {template.demoDetails.heroTitle}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto mb-4">
                  {template.demoDetails.heroSubtitle}
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#006C5B] px-4 py-2 text-xs font-bold text-white shadow-md">
                  <MessageCircle className="size-3.5" />
                  <span>تواصل معنا الآن</span>
                </div>
              </div>

              {/* Simulated About Section */}
              <div className="mb-5 rounded-xl border border-gray-100 bg-[#FAFAFA] p-4 text-right">
                <h5 className="text-xs font-bold text-[#006C5B] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  <span>عن المشروع والخدمات</span>
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  {template.demoDetails.about}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {template.demoDetails.services.map((srv, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 rounded-lg bg-white p-2 border border-gray-100 text-[11px] text-gray-700 font-medium"
                    >
                      <Check className="size-3 text-[#006C5B] shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Contact Callout */}
              <div className="flex items-center justify-between rounded-xl bg-[#082E22] p-3 text-white text-xs">
                <div>
                  <p className="font-bold">جاهزون لخدمتكم على مدار الساعة</p>
                  <p className="text-[10px] text-white/70">المملكة العربية السعودية • 2026</p>
                </div>
                <span className="rounded-lg bg-[#C69A43] px-2.5 py-1 text-[10px] font-bold text-black">
                  احجز الآن
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 bg-[#061D15] p-4 sm:px-6">
          <div className="text-center sm:text-right">
            <span className="text-xs text-white/70 block">سعر الباقة المتكاملة:</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#C69A43]">296 ريال فقط</span>
              <span className="text-xs text-white/40 line-through">650 ريال</span>
            </div>
          </div>

          <a
            href={getTemplateWhatsappUrl(template.title)}
            onClick={() => trackEvent(`whatsapp-click-modal-${template.id}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#006C5B] hover:bg-[#008744] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
          >
            <MessageCircle className="size-4" />
            <span>طلب هذا النموذج عبر الواتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#0F3528]/80 to-[#0A261D]/80 backdrop-blur-md transition-all duration-300 hover:border-[#C69A43]/40">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 sm:p-6 text-right cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#006C5B]/40 text-[#C69A43] text-xs">
            ؟
          </span>
          {question}
        </span>
        <ChevronDown
          className={`size-5 text-[#C69A43] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 px-5 sm:px-6 pt-3 pb-5 text-xs sm:text-sm leading-relaxed text-[#D6E0DC]">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Saudi96LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState<ShowcaseTemplate | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div
      dir="rtl"
      className="min-h-[100dvh] bg-[#07241A] text-white font-['Readex_Pro','IBM_Plex_Sans_Arabic',sans-serif] selection:bg-[#C69A43]/30 selection:text-[#C69A43] relative overflow-hidden"
    >
      {/* Ambient Decorative Background Lights & Subtle Sadu Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url('/saudi96/banner-sadu.jpg')` }}
        />
      </div>

      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#006C5B]/30 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 left-[-150px] h-[550px] w-[550px] rounded-full bg-[#C69A43]/15 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-40 right-10 h-[450px] w-[450px] rounded-full bg-[#008744]/25 blur-[140px]" />

      {/* Top Urgency Ticker Ribbon */}
      <div className="sticky top-0 z-40 border-b border-[#C69A43]/40 bg-[#061D15]/90 backdrop-blur-md px-3 py-2.5 shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C69A43] opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#C69A43]" />
            </span>
            <span className="font-bold text-white text-[11px] sm:text-xs">
              🇸🇦 عِزّنا بطبعنا • عرض اليوم الوطني 96 المحدود
            </span>
            <span className="hidden md:inline-flex rounded-full bg-[#006C5B]/50 px-2 py-0.5 text-[10px] font-bold text-[#C69A43] border border-[#C69A43]/30">
              متبقي 4 مقاعد فقط بالسعر الرمزي (296 ر.س)
            </span>
          </div>

          <a
            href={baseWhatsappUrl}
            onClick={() => trackEvent("whatsapp-click-top-ticker")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-[#C69A43] px-3.5 py-1 text-[11px] font-bold text-[#061D15] hover:bg-[#e0be48] transition-all active:scale-95 shadow-xs"
          >
            <MessageCircle className="size-3.5" />
            <span>احجز قبل اكتمال العدد</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="border-b border-white/10 bg-[#07241A]/70 backdrop-blur-sm px-4 py-4 relative z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#006C5B] to-[#0A3825] border border-[#C69A43]/50 text-white font-black text-lg shadow-md">
              96
            </div>
            <div>
              <div className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                <span>م. محمد هارون</span>
                <span className="text-[#C69A43]">✦</span>
              </div>
              <p className="text-[10px] text-[#A5C9BC] font-medium">
                واجهات وحلول الويب بهوية وطنية
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-white/80">
            <a href="#templates" className="hover:text-[#C69A43] transition-colors">
              نماذج المواقع
            </a>
            <a href="#heritage" className="hover:text-[#C69A43] transition-colors">
              ركائز الهوية الست
            </a>
            <a href="#features" className="hover:text-[#C69A43] transition-colors">
              ماذا يشمل العرض؟
            </a>
            <a href="#faqs" className="hover:text-[#C69A43] transition-colors">
              الأسئلة الشائعة
            </a>
          </nav>

          <a
            href={baseWhatsappUrl}
            onClick={() => trackEvent("whatsapp-click-nav-button")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#006C5B] hover:bg-[#008744] px-4 py-2 text-xs font-bold text-white shadow-md border border-[#C69A43]/30 transition-all hover:scale-105"
          >
            <MessageCircle className="size-3.5" />
            <span>طلب فوري</span>
          </a>
        </div>
      </header>

      <main className="relative z-10 pb-28">
        {/* HERO SECTION: Asymmetric Editorial Split (Anti-Center Bias) */}
        <section className="relative px-4 pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Right Column: High-Impact Typography & Offer */}
              <div className="lg:col-span-7 space-y-6 text-right">
                {/* Official Theme Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C69A43]/50 bg-[#061D15]/80 px-4 py-1.5 text-xs font-bold text-[#C69A43] shadow-md backdrop-blur-md">
                  <span className="inline-block size-2 rounded-full bg-[#C69A43] animate-ping" />
                  <span>عِزّنا بطبعنا • الهوية الرسمية لليوم الوطني 96</span>
                </div>

                {/* H1 Main Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.18] tracking-tight text-white">
                  موقعك التعريفي بهوية وطنية شامخة.. <br />
                  بـ{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#C69A43] via-[#F3D78A] to-[#C69A43] underline decoration-[#C69A43]/60 underline-offset-8">
                    296 ريال فقط!
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base leading-relaxed text-[#D2E2DB] max-w-xl">
                  بمناسبة اليوم الوطني السعودي الـ 96، نُمكّن أصحاب الأعمال والمستقلين والشركات من
                  امتلاك موقع تعريفي احترافي يُبرز علامتك ويجذب عملاءك، مبرمج بأحدث التقنيات وخلال
                  48 ساعة فقط.
                </p>

                {/* Pricing & Guarantee Box */}
                <div className="rounded-2xl border border-[#C69A43]/40 bg-gradient-to-r from-[#0B2E21]/90 via-[#071F17]/90 to-[#0B2E21]/90 p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-[#C69A43] text-[#07241A] font-black text-[11px] px-3.5 py-1 rounded-br-xl shadow-md">
                    وفّر 354 ريال (خصم 55%)
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 sm:pt-0">
                    <div>
                      <span className="text-xs text-white/60 block">قيمة العرض الحصري:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white">296</span>
                        <span className="text-sm font-bold text-[#C69A43]">ريال سعودي</span>
                        <span className="text-xs text-white/40 line-through mr-2">
                          بدلاً من 650 ريال
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-[#A5C9BC] bg-black/30 px-3.5 py-2 rounded-xl border border-white/10">
                      <Clock className="size-4 text-[#C69A43]" />
                      <span>تسليم في 48 ساعة فقط</span>
                    </div>
                  </div>
                </div>

                {/* Primary WhatsApp CTA Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href={baseWhatsappUrl}
                    onClick={() => trackEvent("whatsapp-click-hero-primary")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-[#006C5B] to-[#008744] hover:from-[#008744] hover:to-[#009b4e] px-8 py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.02] cursor-pointer animate-saudi-pulse"
                  >
                    <MessageCircle className="size-5 text-white" />
                    <span>احجز موقعك الآن بـ 296 ريال</span>
                    <ArrowRight className="size-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#templates"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-4 text-sm font-bold text-white transition-all"
                  >
                    <span>استعرض النماذج الحية</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-[#A5C9BC]">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-2 flex items-center justify-center gap-1.5">
                    <Check className="size-3.5 text-[#C69A43]" />
                    <span>استضافة سنة مجانية</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-2 flex items-center justify-center gap-1.5">
                    <Check className="size-3.5 text-[#C69A43]" />
                    <span>متوافق مع الجوال</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-2 flex items-center justify-center gap-1.5">
                    <Check className="size-3.5 text-[#C69A43]" />
                    <span>دعم فني 30 يوماً</span>
                  </div>
                </div>
              </div>

              {/* Left Column: Official Heritage Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md rounded-3xl border-2 border-[#C69A43]/50 bg-[#0A2E21] p-3 shadow-2xl overflow-hidden group">
                  {/* Real Official National Day Tapestry Banner */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                    <img
                      src="/saudi96/banner-sadu.jpg"
                      alt="اليوم الوطني السعودي 96 - عِزّنا بطبعنا"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061D15] via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-3 right-3 left-3 text-right">
                      <span className="inline-block rounded-full bg-[#C69A43] px-2.5 py-0.5 text-[10px] font-black text-[#07241A] mb-1">
                        الهوية الرسمية
                      </span>
                      <p className="text-xs font-bold text-white">
                        عِزّنا بطبعنا • اليوم الوطني السعودي 96
                      </p>
                    </div>
                  </div>

                  {/* Floating Motif Pill (Animation: saudi-float) */}
                  <div className="absolute -bottom-4 -right-4 flex items-center gap-3 rounded-2xl border border-[#C69A43]/60 bg-[#061D15]/95 p-3 shadow-2xl backdrop-blur-md animate-saudi-float">
                    <img
                      src="/saudi96/motif-dallah.jpg"
                      alt="رمز الكرم"
                      className="size-11 rounded-xl object-cover border border-[#C69A43]/40"
                    />
                    <div className="text-right">
                      <span className="text-[10px] text-[#C69A43] font-bold block">
                        رمز الضيافة والكرم
                      </span>
                      <span className="text-xs font-black text-white">موقعك يعكس أصلك</span>
                    </div>
                  </div>

                  {/* Floating Performance Pill */}
                  <div className="absolute -top-3 -left-3 flex items-center gap-2 rounded-xl border border-white/20 bg-[#006C5B]/90 px-3 py-1.5 text-[11px] font-bold text-white shadow-xl backdrop-blur-md">
                    <Zap className="size-3.5 text-[#C69A43]" />
                    <span>سرعة تحميل فائقة &lt; 0.8 ثانية</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: The 6 Authentic Heritage Pillars (Official Motifs) */}
        <section
          id="heritage"
          className="relative px-4 py-16 sm:py-20 border-t border-white/10 bg-[#061D15]/80"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C69A43]/40 bg-[#C69A43]/10 px-3.5 py-1 text-xs font-bold text-[#C69A43] mb-3">
                <Sparkles className="size-3.5" />
                عِزّنا بطبعنا • 6 ركائز وطنية
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
                قيم الهوية الوطنية في واجهتك الرقمية
              </h2>
              <p className="text-xs sm:text-sm text-[#A5C9BC] leading-relaxed">
                استلهمنا تصاميمنا من العناصر الستة المعتمدة في دليل الهوية الرسمية لليوم الوطني 96،
                لنمنح عملك مكانة تليق بتطلعاتك في المملكة.
              </p>
            </div>

            {/* 6 Value Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {heritageValues.map((val, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0B2E21]/60 to-[#072118]/90 p-5 shadow-lg transition-all duration-300 hover:border-[#C69A43]/60 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-[#C69A43]/40 bg-[#061D15]">
                      <img
                        src={val.image}
                        alt={val.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#C69A43] block mb-0.5">
                        {val.slug}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#C69A43] transition-colors">
                        {val.title}
                      </h3>
                      <span className="text-[11px] text-white/50">{val.highlight}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#B5CEC4] leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: The 3 High-Converting Ready-to-Deploy Templates */}
        <section
          id="templates"
          className="relative px-4 py-16 sm:py-24 border-t border-white/10 bg-[#07241A]"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#006C5B] bg-[#006C5B]/20 px-3.5 py-1 text-xs font-bold text-[#A5C9BC] mb-3">
                <Monitor className="size-3.5 text-[#C69A43]" />
                نماذج حية مهيأة للإطلاق
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
                اختر النموذج المناسب لطبيعة نشاطك
              </h2>
              <p className="text-xs sm:text-sm text-[#A5C9BC] leading-relaxed">
                قوالب متجاوبة ومطورة بدقة متناهية، سنقوم بتخصيصها بالكامل مع شعارك، ألوانك،
                ومعلوماتك لتنطلق خلال 48 ساعة فقط.
              </p>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-b from-[#0A2E21]/90 to-[#061D15]/95 p-6 shadow-xl transition-all duration-300 hover:border-[#C69A43]/70 hover:shadow-2xl hover:-translate-y-1.5"
                >
                  <div>
                    {/* Header with Motif & Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex size-14 items-center justify-center rounded-2xl overflow-hidden border border-[#C69A43]/40 bg-[#061D15]">
                        <img
                          src={tpl.motif}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <span className="rounded-full bg-[#C69A43]/15 border border-[#C69A43]/40 px-3 py-1 text-[10px] font-bold text-[#C69A43]">
                        {tpl.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white mb-1 group-hover:text-[#C69A43] transition-colors">
                      {tpl.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#A5C9BC] mb-4">{tpl.category}</p>

                    <p className="text-xs leading-relaxed text-[#D2E2DB] mb-6">{tpl.description}</p>

                    {/* Features List */}
                    <ul className="space-y-2.5 mb-8 border-t border-white/10 pt-4">
                      {tpl.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-white/85">
                          <Check className="size-3.5 text-[#C69A43] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions: Live Preview & Request Button */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => setActiveTemplate(tpl)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-3 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>معاينة حية</span>
                    </button>

                    <a
                      href={getTemplateWhatsappUrl(tpl.title)}
                      onClick={() => trackEvent(`whatsapp-click-card-${tpl.id}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#006C5B] hover:bg-[#008744] px-3 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>اطلب بـ 296 ر.س</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: What's Included in the 296 SAR Package */}
        <section
          id="features"
          className="relative px-4 py-16 sm:py-24 border-t border-white/10 bg-[#061D15]/90"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C69A43]/40 bg-[#C69A43]/10 px-3.5 py-1 text-xs font-bold text-[#C69A43] mb-3">
                <Award className="size-3.5" />
                قيمة تفوق التوقعات
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
                ماذا تشمل باقة الـ 296 ريال؟
              </h2>
              <p className="text-xs sm:text-sm text-[#A5C9BC] leading-relaxed">
                باقة متكاملة لا تحتاج بعدها لدفع أي مبالغ إضافية؛ كل ما يلزمك لتنطلق على الويب بصفحة
                موثوقة وجذابة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {includedFeatures.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0A2E21]/60 to-[#07241A]/80 p-5 shadow-lg backdrop-blur-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex size-11 items-center justify-center rounded-xl bg-[#006C5B]/40 text-[#C69A43] border border-[#C69A43]/30 mb-4">
                      <item.icon className="size-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-[#B5CEC4] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Why 296 SAR? (The Narrative & Mission) */}
        <section className="relative px-4 py-16 border-t border-white/10 bg-[#07241A]">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-[#C69A43]/50 bg-gradient-to-r from-[#0B2E21] via-[#071F17] to-[#0B2E21] p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
              <div className="pointer-events-none absolute -right-20 -bottom-20 size-60 rounded-full bg-[#C69A43]/10 blur-3xl" />

              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-[#006C5B]/40 border border-[#C69A43]/50 text-2xl font-black text-[#C69A43] mb-6 shadow-md">
                96
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                لماذا خصصنا سعر 296 ريال فقط؟
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#D2E2DB] max-w-2xl mx-auto mb-8">
                في اليوم الوطني السعودي الـ 96، أردنا أن نقدم مساهمة حقيقية للمجتمع الرقمي السعودي،
                بتمكين المستقلين، والشركات الواعدة، وأصحاب الأنشطة من امتلاك موقع احترافي متكامل
                برقم يخلد المناسبة الوطنية (296 ر.س) بدلاً من الأسعار المعتادة (650+ ر.س).
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#C69A43] font-bold">
                <span className="flex items-center gap-1.5">
                  <Flame className="size-4" /> العرض متاح حتى نهاية فعاليات اليوم الوطني
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4" /> ضمان كامل لجودة البرمجة والتسليم
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: 3 Simple Steps Process */}
        <section className="relative px-4 py-16 sm:py-24 border-t border-white/10 bg-[#061D15]/90">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
                3 خطوات بسيطة لامتلاك موقعك
              </h2>
              <p className="text-xs sm:text-sm text-[#A5C9BC]">
                لا داعي لأي تعقيد تقني، نحن نتولى كافة تفاصيل البرمجة والربط بالكامل.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-[#0A2E21]/60">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#006C5B] text-xl font-black text-white mb-4 border border-[#C69A43]/40 shadow-lg">
                  1
                </div>
                <h3 className="text-base font-bold text-white mb-2">تواصل واختر نموذجك</h3>
                <p className="text-xs text-[#B5CEC4] leading-relaxed">
                  تواصل معنا عبر الواتساب، وأرسل لنا شعارك ونبذة عن نشاطك والنموذج الذي تفضله.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-[#C69A43]/40 bg-[#0A2E21]/80 shadow-xl">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#C69A43] text-xl font-black text-[#07241A] mb-4 shadow-lg animate-saudi-pulse">
                  2
                </div>
                <h3 className="text-base font-bold text-[#C69A43] mb-2">نبرمج ونخصص موقعك</h3>
                <p className="text-xs text-[#B5CEC4] leading-relaxed">
                  خلال 48 ساعة نقوم بإعداد الموقع، ضبط الهوية، وإدخال النصوص والتأكد من سرعته.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-[#0A2E21]/60">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#006C5B] text-xl font-black text-white mb-4 border border-[#C69A43]/40 shadow-lg">
                  3
                </div>
                <h3 className="text-base font-bold text-white mb-2">استلم موقعك المنشور</h3>
                <p className="text-xs text-[#B5CEC4] leading-relaxed">
                  نعاين الموقع معاً، نربط الدومين والاستضافة، وتبدأ فوراً باستقبال استفسارات عملائك!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Interactive FAQ Accordion */}
        <section
          id="faqs"
          className="relative px-4 py-16 sm:py-24 border-t border-white/10 bg-[#07241A]"
        >
          <div className="mx-auto max-w-3xl">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">الأسئلة الشائعة</h2>
              <p className="text-xs sm:text-sm text-[#A5C9BC]">
                إجابات واضحة ومباشرة عن كل ما يدور في ذهنك حول عرض اليوم الوطني.
              </p>
            </div>

            <div className="space-y-3.5">
              {faqs.map((faq, idx) => (
                <FAQAccordionItem
                  key={idx}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaqIndex === idx}
                  onToggle={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: Final Call to Action Banner */}
        <section className="relative px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border-2 border-[#C69A43]/60 bg-gradient-to-r from-[#061D15] via-[#092D20] to-[#061D15] p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url('/saudi96/banner-sadu.jpg')` }}
              />

              <div className="relative z-10 space-y-6">
                <span className="inline-block rounded-full bg-[#C69A43] px-3.5 py-1 text-xs font-black text-[#07241A]">
                  فرصة محدودة • 296 ريال فقط
                </span>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  اجعل اليوم الوطني 96 نقطة انطلاق <br />
                  واجهتك الرقمية المشرفة!
                </h2>

                <p className="text-sm text-[#D2E2DB] max-w-lg mx-auto leading-relaxed">
                  ابدأ اليوم واستفد من السعر الرمزي قبل اكتمال المقاعد الأربعة المتبقية.
                </p>

                <div className="pt-2">
                  <a
                    href={baseWhatsappUrl}
                    onClick={() => trackEvent("whatsapp-click-bottom-cta")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-[#C69A43] to-[#e0be48] hover:from-[#e0be48] hover:to-[#C69A43] px-10 py-4 text-base sm:text-lg font-black text-[#07241A] shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="size-5" />
                    <span>تواصل معنا عبر الواتساب الآن</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Mobile Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#C69A43]/40 bg-[#061D15]/95 p-3.5 backdrop-blur-lg sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#A5C9BC] block">عرض اليوم الوطني 96:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white">296</span>
              <span className="text-[10px] text-[#C69A43] font-bold">ريال</span>
              <span className="text-[10px] text-white/40 line-through">650</span>
            </div>
          </div>

          <a
            href={baseWhatsappUrl}
            onClick={() => trackEvent("whatsapp-click-sticky-mobile")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#006C5B] to-[#008744] px-4 py-3 text-xs font-black text-white shadow-lg active:scale-95 animate-saudi-pulse"
          >
            <MessageCircle className="size-4" />
            <span>احجز موقعك الآن</span>
          </a>
        </div>
      </div>

      {/* Interactive Modal */}
      <ShowcaseModal
        template={activeTemplate}
        isOpen={activeTemplate !== null}
        onClose={() => setActiveTemplate(null)}
      />
    </div>
  );
}
