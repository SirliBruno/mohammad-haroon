import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  type: z.enum(["hire", "freelance", "collab", "other"]),
  budget: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10, "Tell me a bit more").max(4000),
  consent: z.boolean().refine((v) => v, "Consent required"),
  // Honeypot — must be empty. Bots fill hidden fields.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type Inquiry = z.infer<typeof inquirySchema>;

