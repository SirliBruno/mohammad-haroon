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
    const { listRows, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const db = await getRequestContextClient(context);
    const userId = context.userId || "anonymous";
    await requireAdmin(db, userId);
    return listRows(db, "media", data, [...SEARCH_COLUMNS.media]);
  });

export const createMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => mediaInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const db = await getRequestContextClient(context);
    const userId = context.userId || "anonymous";
    await requireAdmin(db, userId);
    return createRow(db, "media", { ...data, uploaded_by: userId });
  });

export const updateMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: mediaInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const db = await getRequestContextClient(context);
    const userId = context.userId || "anonymous";
    await requireAdmin(db, userId);
    return updateRow(db, "media", data.id, data.patch);
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { getRowById, deleteRow, requireAdmin, getRequestContextClient } = await import(
      "@/features/cms/repository.server"
    );
    const db = await getRequestContextClient(context);
    const userId = context.userId || "anonymous";
    await requireAdmin(db, userId);

    // 1. Fetch to get storage path
    const row = (await getRowById(db, "media", data.id)) as
      | { url: string; storage_path?: string }
      | undefined;
    
    // 2. Delete row
    const result = await deleteRow(db, "media", data.id);
    
    // 3. Delete from storage if possible
    if (row?.storage_path) {
      const { error: rmErr } = await db.storage
        .from("media")
        .remove([row.storage_path]);
      if (rmErr) console.warn("Failed to delete storage object:", rmErr);
    }
    
    return result;
  });
