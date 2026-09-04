import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const batchItemSchema = z.object({
  key: z.string().trim().min(1).max(200),
  value_ar: z.string().optional().nullable(),
  value_en: z.string().optional().nullable(),
  group_name: z.string().trim().min(1).max(80).default("home"),
  kind: z.enum(["text", "richtext", "image", "url", "json"]).default("text"),
  metadata: z.record(z.any()).optional().nullable(),
});

const batchSaveSchema = z.object({
  items: z.array(batchItemSchema).min(1).max(100),
});

/**
 * Batch save site content updates from On-Page Live Edit Mode.
 * Ensures caller is an authorized admin before committing changes.
 */
export const batchSaveSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => batchSaveSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import(
      "@/features/cms/repository.server"
    );
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);

    const rowsToUpsert = data.items.map((item) => ({
      key: item.key,
      value_ar: item.value_ar ?? "",
      value_en: item.value_en ?? null,
      group_name: item.group_name,
      kind: item.kind,
      metadata: item.metadata ?? {},
      updated_at: new Date().toISOString(),
    }));

    const { data: rows, error } = await db
      .from("site_content")
      .upsert(rowsToUpsert, { onConflict: "key" })
      .select("id, key, value_ar, group_name");

    if (error) {
      console.error("[live-edit] Batch upsert failed:", error);
      throw new Error(`فشل حفظ التعديلات: ${error.message}`);
    }

    return { ok: true as const, count: rows?.length ?? 0 };
  });

/**
 * Server check to verify if the currently authenticated user has the admin role.
 */
export const checkIsAdminServer = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const { requireAdmin, getRequestContextClient } = await import(
        "@/features/cms/repository.server"
      );
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      return { isAdmin: true as const, userId };
    } catch {
      return { isAdmin: false as const };
    }
  });
