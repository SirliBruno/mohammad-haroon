export const site = {
  name: "محمد هارون",
  shortName: "هارون",
  role: "مهندس منتجات رقمية ومصمم واجهات",
  tagline: "نصمّم ونطوّر منتجات رقمية بذوق رفيع وحرفية عالية.",
  description:
    "أعمال وكتابات وأفكار محمد هارون — مهندس منتجات ومصمم يبني تجارب رقمية متميزة للشركات والعلامات التجارية.",
  url: "https://mohammadharoon.com",
  locale: "ar",
  direction: "rtl" as "ltr" | "rtl",
  email: "hello@mohammadharoon.com",
  whatsapp: "+966500000000",
  whatsappDisplay: "+966 50 000 0000",
  location: "الرياض · عن بُعد",
  timezone: "GMT+03:00",
  workingHours: "الأحد–الخميس · 9:00 ص – 6:00 م",
  available: true,
  availabilityLabel: "متاح لاستقبال المشاريع",
} as const;

export type Site = typeof site;
