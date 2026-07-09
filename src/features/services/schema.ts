import { z } from "zod";

export const serviceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  icon: z.string().optional(),
  overview: z.string().optional(),
  benefits: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  workflow: z
    .array(z.object({ step: z.string(), title: z.string(), description: z.string() }))
    .default([]),
  timeline: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  engagement: z.enum(["project", "retainer", "advisory"]).optional(),
  startingAt: z.string().optional(),
});

export type Service = z.infer<typeof serviceSchema>;
