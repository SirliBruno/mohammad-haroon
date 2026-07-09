export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  type: "Full-time" | "Freelance" | "Contract" | "Internship";
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
    company: "Freelance",
    role: "Product Engineer & Designer",
    period: "2023 — Present",
    location: "Remote",
    type: "Freelance",
    summary:
      "Partnering with founders and product teams to design and ship premium web products end-to-end.",
    highlights: [
      "Shipped 12+ production websites and e-commerce stores across SaaS, retail and hospitality.",
      "Built reusable design system used by 4 client teams, cutting hand-off time in half.",
      "Averaged 96+ Lighthouse scores across delivered projects.",
    ],
    stack: ["React", "TypeScript", "Tailwind", "TanStack", "WordPress", "WooCommerce"],
  },
  {
    company: "Northwind",
    role: "Lead Design Engineer",
    period: "2022 — 2023",
    location: "Remote",
    type: "Contract",
    summary:
      "Led the redesign of the analytics surface — from research to shipped feature flags in production.",
    highlights: [
      "Cut time-to-first-insight from 12 minutes to under 40 seconds.",
      "Owned the design system extension used by 8 engineers.",
      "Ran weekly customer sessions to validate every major flow before build.",
    ],
    stack: ["React", "TypeScript", "Recharts", "Postgres"],
  },
  {
    company: "Atelier",
    role: "Frontend Developer",
    period: "2021 — 2022",
    location: "Remote",
    type: "Full-time",
    summary:
      "Rebuilt the editor and publishing flow for a boutique headless CMS used by 300+ agencies.",
    highlights: [
      "Shipped block-based editor with live preview, adopted by 92% of active teams within 60 days.",
      "Reduced average publish time by 58%.",
      "Mentored 2 junior engineers and set up the team's code review rituals.",
    ],
    stack: ["React", "TipTap", "Node.js", "Postgres"],
  },
  {
    company: "Independent",
    role: "Freelance Web Developer",
    period: "2019 — 2021",
    location: "Karachi, PK",
    type: "Freelance",
    summary:
      "Built websites and stores for local businesses while completing my IT degree.",
    highlights: [
      "Delivered 15+ WordPress and WooCommerce sites for SMB clients.",
      "Grew a small design practice from cold outreach to full referral pipeline.",
    ],
    stack: ["WordPress", "WooCommerce", "PHP", "JavaScript"],
  },
];

export const education: EducationItem[] = [
  {
    school: "University of Karachi",
    degree: "B.S. Information Technology",
    period: "2021 — 2025",
    location: "Karachi, PK",
    detail: "Focus on human-computer interaction, web systems and software design.",
  },
  {
    school: "Meta",
    degree: "Front-End Developer Professional Certificate",
    period: "2023",
    location: "Coursera",
    detail: "React, accessibility, testing and modern build tooling.",
  },
  {
    school: "Google",
    degree: "UX Design Professional Certificate",
    period: "2022",
    location: "Coursera",
    detail: "End-to-end UX process: research, wireframing, prototyping, usability testing.",
  },
];

export const certificates: CertificateItem[] = [
  {
    name: "Front-End Developer Professional Certificate",
    issuer: "Meta",
    year: "2023",
    credentialId: "META-FED-2023",
    href: "https://coursera.org/",
  },
  {
    name: "UX Design Professional Certificate",
    issuer: "Google",
    year: "2022",
    credentialId: "GGL-UX-2022",
    href: "https://coursera.org/",
  },
  {
    name: "Advanced React",
    issuer: "Frontend Masters",
    year: "2023",
    href: "https://frontendmasters.com/",
  },
  {
    name: "Design Systems for Figma",
    issuer: "Figma",
    year: "2024",
    href: "https://figma.com/",
  },
  {
    name: "WooCommerce Development",
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
    title: "Design",
    items: ["UI Design", "UX Research", "Design Systems", "Figma", "Prototyping", "Motion"],
  },
  {
    title: "Frontend",
    items: ["React", "TypeScript", "Tailwind CSS", "TanStack Start", "Next.js", "Framer Motion"],
  },
  {
    title: "Commerce & CMS",
    items: ["WordPress", "WooCommerce", "Shopify", "Sanity", "Stripe", "PayPal"],
  },
  {
    title: "Backend & Ops",
    items: ["Node.js", "PostgreSQL", "Cloudflare Workers", "GitHub Actions", "Vercel"],
  },
];

export const languages: LanguageItem[] = [
  { name: "English", level: "Professional", code: "EN" },
  { name: "Urdu", level: "Native", code: "UR" },
  { name: "Arabic", level: "Basic", code: "AR" },
];

export const awards: AwardItem[] = [
  {
    title: "Awwwards — Site of the Day",
    issuer: "Awwwards",
    year: "2024",
    description: "Recognized for the Meridian agency site rebuild.",
  },
  {
    title: "CSS Design Awards — Best UI",
    issuer: "CSSDA",
    year: "2024",
    description: "Northwind analytics dashboard redesign.",
  },
  {
    title: "Dean's Merit List",
    issuer: "University of Karachi",
    year: "2023",
    description: "Top 5% of the graduating class.",
  },
];

export const resumeMeta = {
  href: "/resume.pdf",
  fileName: "Mohammad-Haroon-Resume.pdf",
  updated: "March 2026",
};
