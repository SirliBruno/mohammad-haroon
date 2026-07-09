import { z } from "zod";

export const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string().optional(),
  avatar: z.string().optional(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
