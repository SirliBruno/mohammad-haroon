import { z } from "zod";

export const socialSchema = z.object({
  label: z.string(),
  handle: z.string(),
  href: z.string().url(),
});

export const profileSchema = z.object({
  name: z.string(),
  role: z.string(),
  tagline: z.string(),
  bio: z.string(),
  location: z.string(),
  avatarUrl: z.string().optional(),
  available: z.boolean(),
  socials: z.array(socialSchema),
});

export type Social = z.infer<typeof socialSchema>;
export type Profile = z.infer<typeof profileSchema>;
