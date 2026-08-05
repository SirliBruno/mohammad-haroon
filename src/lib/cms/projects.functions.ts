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
  .validator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import(
      "@/features/cms/repository.server"
    );
    return listRows(getPublicServerClient(), "projects", { ...data, onlyPublished: true }, [
      ...SEARCH_COLUMNS.projects,
    ]);
  });

export const getProjectBySlug = createServerFn({ method: "POST" })
  .validator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient, getRowBySlug } = await import(
      "@/features/cms/repository.server"
    );
    return getRowBySlug(getPublicServerClient(), "projects", data.slug, true);
  });

// ----- Admin mutations -----
export const adminListProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { listRows, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return listRows(db, "projects", data, [...SEARCH_COLUMNS.projects]);
  });

/** Fetch a single project by id with ALL columns (admin edit form). */
export const getAdminProjectById = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { getRowById, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return getRowById(db, "projects", data.id);
  });

export const createProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => projectInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return createRow(db, "projects", data);
  });

export const updateProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: projectInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return updateRow(db, "projects", data.id, data.patch);
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return deleteRow(db, "projects", data.id);
  });
