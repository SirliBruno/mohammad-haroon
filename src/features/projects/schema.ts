import { z } from "zod";

export const mediaSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  role: z.string(),
  client: z.string().optional(),
  year: z.number(),
  tags: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  cover: mediaSchema,
  gallery: z.array(mediaSchema).default([]),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  links: z.array(z.object({ label: z.string(), href: z.string().url() })).optional(),
  featured: z.boolean().default(false),
  status: z.enum(["live", "archived", "concept"]).default("live"),
});

export type Project = z.infer<typeof projectSchema>;
export type Media = z.infer<typeof mediaSchema>;
