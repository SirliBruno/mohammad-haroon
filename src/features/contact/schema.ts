import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  type: z.enum(["hire", "freelance", "collab", "other"]),
  budget: z.string().max(80).optional(),
  message: z.string().min(10, "Tell me a bit more").max(4000),
  consent: z.boolean().refine((v) => v, "Consent required"),
});

export type Inquiry = z.infer<typeof inquirySchema>;
