export const site = {
  name: "Mohammad Haroon",
  shortName: "Haroon",
  role: "Product Engineer & Designer",
  tagline: "Building considered software, with taste.",
  description:
    "The work, writing, and ideas of Mohammad Haroon — a product engineer and designer crafting premium digital products.",
  url: "https://mohammadharoon.com",
  locale: "en",
  direction: "ltr" as "ltr" | "rtl",
  email: "hello@mohammadharoon.com",
  whatsapp: "+10000000000",
  whatsappDisplay: "+1 (000) 000-0000",
  location: "Remote",
  timezone: "UTC+05:00",
  workingHours: "Mon–Fri · 9:00–18:00",
  available: true,
  availabilityLabel: "Open to opportunities",
} as const;

export type Site = typeof site;
