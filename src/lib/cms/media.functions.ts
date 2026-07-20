import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { listParamsSchema, idSchema, mediaInputSchema } from "@/features/cms/schemas";
import { SEARCH_COLUMNS } from "./search-columns";

// Media reads are admin-only (asset library). Public rendering uses signed
// URLs stored on the referencing rows (projects.cover_url etc.), not this
// generic list.
export const listMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { listRows, requireAdmin } = await import(
      "@/features/cms/repository.server"
    );
    await requireAdmin(context.supabase, context.userId);
    return listRows(context.supabase, "media", data, [...SEARCH_COLUMNS.media]);
  });

export const createMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => mediaInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "media", { ...data, uploaded_by: context.userId });
  });

export const updateMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: mediaInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "media", data.id, data.patch);
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin, getRowById } = await import(
      "@/features/cms/repository.server"
    );
    await requireAdmin(context.supabase, context.userId);
    // Belt-and-braces storage cleanup: fetch the row's storage_path first,
    // delete the DB row, then best-effort remove the stored object. If the
    // storage delete fails we log and continue — the row is already gone.
    const row = (await getRowById(context.supabase, "media", data.id)) as
      | { storage_path: string | null }
      | null;
    const result = await deleteRow(context.supabase, "media", data.id);
    if (row?.storage_path) {
      const { error: rmErr } = await context.supabase.storage
        .from("media")
        .remove([row.storage_path]);
      if (rmErr) console.warn("[cms] storage cleanup failed for", row.storage_path, rmErr);
    }
    return result;
  });

