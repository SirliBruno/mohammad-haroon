import { z } from "zod";

export const mediaSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const projectCategories = [
  "مواقع",
  "أنظمة",
  "متاجر",
  "UI/UX",
  "هوية",
  // Legacy backward-compat
  "مواقع إلكترونية",
  "تجارة إلكترونية",
  "تصميم واجهات",
  "تصميم جرافيكي",
  "تسويق",
  "تصوير",
] as const;

export const projectSchema = z.object({
  id: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  shortDescription: z.string().optional(),
  role: z.string(),
  client: z.string().optional(),
  year: z.number(),
  category: z.string().default("مواقع"),
  tags: z.array(z.string()).default([]),
  services: z.array(z.string()).optional(),
  stack: z.array(z.string()).default([]),
  technologies: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  cover: mediaSchema,
  coverImage: z.string().optional(),
  gallery: z.array(mediaSchema).default([]),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  links: z.array(z.object({ label: z.string(), href: z.string().url() })).optional(),
  github: z.string().optional(),
  liveDemo: z.string().optional(),
  liveUrl: z.string().optional(),
  problem: z.string().optional(),
  challenge: z.string().optional(),
  goals: z.array(z.string()).optional(),
  research: z.string().optional(),
  solution: z.string().optional(),
  result: z.string().optional(),
  designProcess: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .optional(),
  development: z.string().optional(),
  lessons: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  spotlight: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
  sectionOrder: z.array(z.string()).optional(),
  testimonial: z
    .object({
      quote: z.string(),
      author: z.string(),
      role: z.string().optional(),
    })
    .optional(),
  featured: z.boolean().default(false),
  status: z.enum(["live", "in-progress", "archived", "concept"]).default("live"),
});

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = z.infer<typeof projectSchema>;
export type Media = z.infer<typeof mediaSchema>;
