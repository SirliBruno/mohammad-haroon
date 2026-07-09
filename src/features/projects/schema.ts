import { z } from "zod";

export const mediaSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const projectCategories = [
  "Websites",
  "E-commerce",
  "UI Design",
  "Graphic Design",
  "Marketing",
  "Photography",
] as const;

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  role: z.string(),
  client: z.string().optional(),
  year: z.number(),
  category: z.enum(projectCategories).default("Websites"),
  tags: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  cover: mediaSchema,
  gallery: z.array(mediaSchema).default([]),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  links: z.array(z.object({ label: z.string(), href: z.string().url() })).optional(),
  featured: z.boolean().default(false),
  status: z.enum(["live", "in-progress", "archived", "concept"]).default("live"),
});

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = z.infer<typeof projectSchema>;
export type Media = z.infer<typeof mediaSchema>;
