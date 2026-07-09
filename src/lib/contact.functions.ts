import { createServerFn } from "@tanstack/react-start";
import { inquirySchema, type Inquiry } from "@/features/contact/schema";

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): Inquiry => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    // Foundation-only: log server-side. Wire to email / DB in a later phase.
    console.log("[inquiry]", { ...data, receivedAt: new Date().toISOString() });
    return { ok: true as const };
  });
