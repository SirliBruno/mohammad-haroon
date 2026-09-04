import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const projectRequestSchema = z.object({
  name: z.string().trim().max(200).optional(),
  phone: z.string().trim().min(1, "رقم التواصل مطلوب").max(30),
  projectType: z.string().trim().max(80),
  currentProblem: z.string().trim().max(200),
  needs: z.array(z.string().trim().max(80)).max(10),
  idea: z.string().trim().min(1).max(2000),
  budget: z.string().trim().max(80),
});

/**
 * Project request form entry point. Persists the request into the CMS
 * `messages` collection so the admin inbox picks it up — alongside the
 * WhatsApp message that is opened on the client side.
 *
 * Uses the public (anon-safe) Supabase client; no auth required.
 */
export const submitProjectRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => projectRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { getPublicServerClient, createRow } = await import(
      "@/features/cms/repository.server"
    );

    const needsString = data.needs.length > 0 ? data.needs.join("، ") : "غير محدد";
    const fullMessage = `نوع المشروع: ${data.projectType}
التحدي: ${data.currentProblem}
الاحتياج: ${needsString}
فكرة المشروع: ${data.idea}
الميزانية: ${data.budget}
رقم التواصل: ${data.phone}`;

    await createRow(getPublicServerClient(), "messages", {
      name: data.name?.trim() || "غير محدد",
      email: `wa:${data.phone.replace(/[^0-9+]/g, "")}@whatsapp`,
      inquiry_type: data.projectType,
      budget: data.budget,
      message: fullMessage,
      source: "project-request-form",
      status: "new",
    });

    return { ok: true as const };
  });
