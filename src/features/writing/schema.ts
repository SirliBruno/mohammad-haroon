import { z } from "zod";
import { mediaSchema } from "../projects/schema";

export const articleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  cover: mediaSchema.optional(),
  readingTime: z.number().default(3),
  body: z.string().default(""),
});

export type Article = z.infer<typeof articleSchema>;
