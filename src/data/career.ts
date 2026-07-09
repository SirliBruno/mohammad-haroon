export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  type: "دوام كامل" | "عمل حر" | "عقد" | "تدريب";
  summary: string;
  highlights: string[];
  stack?: string[];
};

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  location: string;
  detail?: string;
};

export type CertificateItem = {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  href?: string;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type LanguageItem = {
  name: string;
  level: string;
  code?: string;
};

export type AwardItem = {
  title: string;
  issuer: string;
  year: string;
  description?: string;
};

export const experience: ExperienceItem[] = [
  {
    company: "عمل حر",
    role: "مهندس منتجات ومصمم",
    period: "2023 — حتى الآن",
    location: "عن بُعد",
    type: "عمل حر",
    summary:
      "شريك لرواد الأعمال وفرق المنتجات في تصميم وإطلاق منتجات ويب متميزة من البداية حتى النهاية.",
    highlights: [
      "أطلقت أكثر من 12 موقعًا ومتجرًا إلكترونيًا في قطاعات SaaS والتجزئة والضيافة.",
      "بنيت نظام تصميم قابل لإعادة الاستخدام تعتمده 4 فرق عميلة، مما قلّص وقت التسليم إلى النصف.",
      "متوسط 96+ في تقييم Lighthouse عبر المشاريع المُسلَّمة.",
    ],
    stack: ["React", "TypeScript", "Tailwind", "TanStack", "WordPress", "WooCommerce"],
  },
  {
    company: "Northwind",
    role: "قائد فريق هندسة التصميم",
    period: "2022 — 2023",
    location: "عن بُعد",
    type: "عقد",
    summary:
      "قدت إعادة تصميم واجهة التحليلات — من البحث حتى إطلاق الميزات في بيئة الإنتاج.",
    highlights: [
      "قلّصت زمن الوصول إلى أول رؤية من 12 دقيقة إلى أقل من 40 ثانية.",
      "امتلكت توسعة نظام التصميم المستخدم من قِبل 8 مهندسين.",
      "أدرت جلسات أسبوعية مع العملاء للتحقق من كل مسار رئيسي قبل التطوير.",
    ],
    stack: ["React", "TypeScript", "Recharts", "Postgres"],
  },
  {
    company: "Atelier",
    role: "مطوّر واجهات أمامية",
    period: "2021 — 2022",
    location: "عن بُعد",
    type: "دوام كامل",
    summary:
      "أعدت بناء المحرر ومسار النشر لنظام إدارة محتوى بلا رأس (Headless CMS) تستخدمه أكثر من 300 وكالة.",
    highlights: [
      "أطلقت محررًا قائمًا على الكتل مع معاينة حيّة، تبنّاه 92% من الفرق النشطة خلال 60 يومًا.",
      "خفّضت متوسط زمن النشر بنسبة 58%.",
      "أشرفت على مهندسَين مبتدئَين، ووضعت نظام مراجعة الكود للفريق.",
    ],
    stack: ["React", "TipTap", "Node.js", "Postgres"],
  },
  {
    company: "مستقل",
    role: "مطوّر ويب مستقل",
    period: "2019 — 2021",
    location: "الرياض",
    type: "عمل حر",
    summary:
      "طوّرت مواقع ومتاجر إلكترونية للأعمال المحلية أثناء استكمال دراسة تقنية المعلومات.",
    highlights: [
      "سلّمت أكثر من 15 موقعًا بـ WordPress وWooCommerce لعملاء من الشركات الصغيرة والمتوسطة.",
      "نمّيت ممارسة تصميم صغيرة من التواصل البارد إلى شبكة إحالات كاملة.",
    ],
    stack: ["WordPress", "WooCommerce", "PHP", "JavaScript"],
  },
];

export const education: EducationItem[] = [
  {
    school: "جامعة الملك سعود",
    degree: "بكالوريوس تقنية المعلومات",
    period: "2021 — 2025",
    location: "الرياض",
    detail: "تخصص في تفاعل الإنسان مع الحاسب وأنظمة الويب وهندسة البرمجيات.",
  },
  {
    school: "Meta",
    degree: "شهادة مطوّر واجهات أمامية احترافية",
    period: "2023",
    location: "Coursera",
    detail: "React والوصولية والاختبارات وأدوات البناء الحديثة.",
  },
  {
    school: "Google",
    degree: "شهادة تصميم تجربة المستخدم الاحترافية",
    period: "2022",
    location: "Coursera",
    detail: "دورة كاملة في تجربة المستخدم: البحث، النماذج الأولية، والاختبار.",
  },
];

export const certificates: CertificateItem[] = [
  {
    name: "شهادة مطوّر واجهات أمامية احترافية",
    issuer: "Meta",
    year: "2023",
    credentialId: "META-FED-2023",
    href: "https://coursera.org/",
  },
  {
    name: "شهادة تصميم تجربة المستخدم الاحترافية",
    issuer: "Google",
    year: "2022",
    credentialId: "GGL-UX-2022",
    href: "https://coursera.org/",
  },
  {
    name: "React المتقدم",
    issuer: "Frontend Masters",
    year: "2023",
    href: "https://frontendmasters.com/",
  },
  {
    name: "أنظمة التصميم في Figma",
    issuer: "Figma",
    year: "2024",
    href: "https://figma.com/",
  },
  {
    name: "تطوير WooCommerce",
    issuer: "Automattic",
    year: "2022",
    href: "https://woocommerce.com/",
  },
  {
    name: "Cloudflare Workers",
    issuer: "Cloudflare",
    year: "2024",
    href: "https://cloudflare.com/",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "التصميم",
    items: ["تصميم واجهات", "بحث تجربة المستخدم", "أنظمة التصميم", "Figma", "النماذج الأولية", "الحركة"],
  },
  {
    title: "الواجهات الأمامية",
    items: ["React", "TypeScript", "Tailwind CSS", "TanStack Start", "Next.js", "Framer Motion"],
  },
  {
    title: "التجارة الإلكترونية وإدارة المحتوى",
    items: ["WordPress", "WooCommerce", "Shopify", "Sanity", "Stripe", "PayPal"],
  },
  {
    title: "الخلفية والعمليات",
    items: ["Node.js", "PostgreSQL", "Supabase", "Cloudflare Workers", "GitHub Actions", "Vercel"],
  },
];

export const languages: LanguageItem[] = [
  { name: "العربية", level: "اللغة الأم", code: "AR" },
  { name: "الإنجليزية", level: "متقدّم مهني", code: "EN" },
  { name: "الأردية", level: "متقدّم", code: "UR" },
];

export const awards: AwardItem[] = [
  {
    title: "Awwwards — موقع اليوم",
    issuer: "Awwwards",
    year: "2024",
    description: "تكريمًا لإعادة بناء موقع وكالة Meridian.",
  },
  {
    title: "CSS Design Awards — أفضل واجهة مستخدم",
    issuer: "CSSDA",
    year: "2024",
    description: "إعادة تصميم لوحة تحليلات Northwind.",
  },
  {
    title: "قائمة العميد للتميز الأكاديمي",
    issuer: "جامعة الملك سعود",
    year: "2023",
    description: "ضمن أفضل 5% من دفعة التخرج.",
  },
];

export const resumeMeta = {
  href: "/resume.pdf",
  fileName: "Mohammad-Haroon-Resume.pdf",
  updated: "مارس 2026",
};
