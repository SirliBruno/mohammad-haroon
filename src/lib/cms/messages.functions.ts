import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  listParamsSchema,
  idSchema,
  messageSubmitSchema,
  messageUpdateSchema,
} from "@/features/cms/schemas";
import { SEARCH_COLUMNS } from "./search-columns";

/** Public submit — anon-safe. RLS enforces the length/email check. */
export const submitMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => messageSubmitSchema.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient, createRow } = await import(
      "@/features/cms/repository.server"
    );
    await createRow(getPublicServerClient(), "messages", { ...data, status: "new" });
    return { ok: true as const };
  });

/** Admin inbox list. */
export const listMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { listRows, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return listRows(context.supabase, "messages", data, [...SEARCH_COLUMNS.messages]);
  });

export const updateMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => messageUpdateSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    const { id, ...patch } = data;
    return updateRow(context.supabase, "messages", id, patch);
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "messages", data.id);
  });
