import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { listParamsSchema, idSchema, mediaInputSchema } from "@/features/cms/schemas";
import { SEARCH_COLUMNS } from "./search-columns";

// Media is public-read (assets rendered on the site) but admin-write.
export const listMedia = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import(
      "@/features/cms/repository.server"
    );
    return listRows(getPublicServerClient(), "media", data, [...SEARCH_COLUMNS.media]);
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
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "media", data.id);
  });
