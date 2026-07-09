import { z } from "zod";
import { mediaSchema } from "../projects/schema";

export const productSchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  status: z.enum(["live", "beta", "soon"]),
  url: z.string().url().optional(),
  cover: mediaSchema.optional(),
});

export type Product = z.infer<typeof productSchema>;
