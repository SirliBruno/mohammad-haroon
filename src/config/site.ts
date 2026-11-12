export const site = {
  name: "محمد هارون",
  nameEn: "MOHAMMAD HAROON",
  shortName: "محمد هارون",
  role: "مطور ومصمم منتجات رقمية",
  roleEn: "Product Designer & Fullstack Developer",
  tagline: "من فكرة في بالك إلى مشروع تقدر تستخدمه.",
  description:
    "محمد هارون — مطور ومصمم مواقع وأنظمة ومتاجر إلكترونية. أحوّل الأفكار إلى حلول رقمية عملية تبدأ من 499 ريال.",
  url: "https://mohammadharoon.com",
  locale: "ar",
  direction: "rtl" as "ltr" | "rtl",
  email: "hello@mohammadharoon.com",
  whatsapp: "+966500000000", // يتم تحديث الرقم الفعلي هنا
  whatsappDisplay: "+966 50 000 0000",
  location: "متاح للعمل عن بُعد داخل السعودية",
  timezone: "GMT+03:00",
  workingHours: "الأحد–الخميس · 9:00 ص – 6:00 م",
  available: true,
  availabilityLabel: "متاح لمشاريع جديدة",
  startingPrice: "499 ريال",
  linkedin: "https://www.linkedin.com/in/mohammadharoon",
  github: "https://github.com/mohammadharoon",
  twitter: "https://x.com/mohammadharoon",
} as const;

export type Site = typeof site;
