import { z } from "zod";

export const serviceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  deliverables: z.array(z.string()).default([]),
  engagement: z.enum(["project", "retainer", "advisory"]),
  startingAt: z.string().optional(),
});

export type Service = z.infer<typeof serviceSchema>;
