import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  listParamsSchema,
  idSchema,
  slugSchema,
  projectInputSchema,
} from "@/features/cms/schemas";
import { z } from "zod";
import { SEARCH_COLUMNS } from "./search-columns";

export const listProjects = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import(
      "@/features/cms/repository.server"
    );
    return listRows(getPublicServerClient(), "projects", { ...data, onlyPublished: true }, [
      ...SEARCH_COLUMNS.projects,
    ]);
  });

export const getProjectBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient, getRowBySlug } = await import(
      "@/features/cms/repository.server"
    );
    return getRowBySlug(getPublicServerClient(), "projects", data.slug, true);
  });

// ----- Admin mutations -----
export const adminListProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { listRows, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return listRows(context.supabase, "projects", data, [...SEARCH_COLUMNS.projects]);
  });

export const createProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => projectInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "projects", data);
  });

export const updateProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: projectInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "projects", data.id, data.patch);
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "projects", data.id);
  });
