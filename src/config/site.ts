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
  location: "Remote",
  available: true,
} as const;

export type Site = typeof site;
