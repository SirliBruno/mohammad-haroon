/**
 * Site content CRUD — a flexible key/value store for editable site copy
 * (headings, paragraphs, single images, arbitrary snippets) that don't
 * fit the shape of the other CMS collections.
 *
 * Reads are public. Writes are admin-only.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { siteContentInputSchema, idSchema } from "@/features/cms/schemas";

const listInput = z.object({
  group_name: z.string().trim().max(80).optional(),
  search: z.string().trim().max(120).optional(),
});
const keyInput = z.object({ key: z.string().trim().min(1).max(200) });

export const listSiteContent = createServerFn({ method: "POST" })
  .validator((d: unknown) => listInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient } = await import("@/features/cms/repository.server");
    const client = getPublicServerClient();
    let q = client
      .from("site_content")
      .select("*")
      .order("group_name", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("key", { ascending: true });
    if (data.group_name) q = q.eq("group_name", data.group_name);
    if (data.search) {
      const term = `%${data.search}%`;
      q = q.or(
        `key.ilike.${term},label.ilike.${term},value_ar.ilike.${term},value_en.ilike.${term}`,
      );
    }
    const { data: rows, error } = await q;
    if (error) { console.error("[cms] site_content op failed:", error); throw new Error("تعذّر تنفيذ العملية."); }
    return rows ?? [];
  });

export const getSiteContentByKey = createServerFn({ method: "POST" })
  .validator((d: unknown) => keyInput.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient } = await import("@/features/cms/repository.server");
    const client = getPublicServerClient();
    const { data: row, error } = await client
      .from("site_content")
      .select("*")
      .eq("key", data.key)
      .maybeSingle();
    if (error) { console.error("[cms] site_content op failed:", error); throw new Error("تعذّر تنفيذ العملية."); }
    return row;
  });

export const upsertSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => siteContentInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    const { data: row, error } = await db
      .from("site_content")
      .upsert(data, { onConflict: "key" })
      .select("*")
      .single();
    if (error) { console.error("[cms] site_content op failed:", error); throw new Error("تعذّر تنفيذ العملية."); }
    return row;
  });

export const updateSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: siteContentInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    const { data: row, error } = await db
      .from("site_content")
      .update(data.patch)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) { console.error("[cms] site_content op failed:", error); throw new Error("تعذّر تنفيذ العملية."); }
    return row;
  });

export const deleteSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    const { error } = await db
      .from("site_content")
      .delete()
      .eq("id", data.id);
    if (error) { console.error("[cms] site_content op failed:", error); throw new Error("تعذّر تنفيذ العملية."); }
    return { ok: true as const };
  });
