import { createServerFn } from "@tanstack/react-start";
import { inquirySchema, type Inquiry } from "@/features/contact/schema";

/**
 * Contact form entry point. Persists the inquiry into the CMS `messages`
 * collection via the shared repository so the admin inbox picks it up.
 */
export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): Inquiry => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { getPublicServerClient, createRow } = await import(
      "@/features/cms/repository.server"
    );
    await createRow(getPublicServerClient(), "messages", {
      name: data.name,
      email: data.email,
      inquiry_type: data.type,
      budget: data.budget || null,
      message: data.message,
      source: "contact-form",
      status: "new",
    });
    return { ok: true as const };
  });
