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
    try {
      const res = await listRows(getPublicServerClient(), "projects", { ...data, onlyPublished: true }, [
        ...SEARCH_COLUMNS.projects,
      ]);
      if (res.rows.length === 0 && !data.search) {
        const { staticProjectsAsRows } = await import("./static-defaults");
        return {
          rows: staticProjectsAsRows,
          count: staticProjectsAsRows.length,
          limit: data.limit,
          offset: data.offset,
        };
      }
      return res;
    } catch (err) {
      console.warn("[listProjects] listRows failed, falling back to static defaults:", err);
      const { staticProjectsAsRows } = await import("./static-defaults");
      return {
        rows: staticProjectsAsRows,
        count: staticProjectsAsRows.length,
        limit: data.limit,
        offset: data.offset,
      };
    }
  });

export const getProjectBySlug = createServerFn({ method: "POST" })
  .validator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient, getRowBySlug } = await import(
      "@/features/cms/repository.server"
    );
    try {
      const row = await getRowBySlug(getPublicServerClient(), "projects", data.slug, true);
      if (row) return row;
    } catch (err) {
      console.warn("[getProjectBySlug] getRowBySlug failed, falling back to static:", err);
    }
    const { staticProjectsAsRows } = await import("./static-defaults");
    return staticProjectsAsRows.find((p) => p.slug === data.slug) ?? null;
  });

// ----- Admin mutations -----
export const adminListProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { listRows, requireAdmin, getRequestContextClient, getPublicServerClient } = await import("@/features/cms/repository.server");
    let client;
    try {
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      client = db;
    } catch (e) {
      console.warn("[adminListProjects] Authenticated read failed, falling back to public client:", e);
      client = getPublicServerClient();
    }
    try {
      const res = await listRows(client, "projects", data, [...SEARCH_COLUMNS.projects]);
      if (res.rows.length === 0 && !data.search) {
        const { staticProjectsAsRows } = await import("./static-defaults");
        return {
          rows: staticProjectsAsRows,
          count: staticProjectsAsRows.length,
          limit: data.limit,
          offset: data.offset,
        };
      }
      return res;
    } catch (err) {
      console.warn("[adminListProjects] listRows failed, falling back to static defaults:", err);
      const { staticProjectsAsRows } = await import("./static-defaults");
      return {
        rows: staticProjectsAsRows,
        count: staticProjectsAsRows.length,
        limit: data.limit,
        offset: data.offset,
      };
    }
  });

/** Fetch a single project by id with ALL columns (admin edit form). */
export const getAdminProjectById = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { getRowById, requireAdmin, getRequestContextClient, getPublicServerClient } = await import("@/features/cms/repository.server");
    let client;
    try {
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      client = db;
    } catch {
      client = getPublicServerClient();
    }
    try {
      const row = await getRowById(client, "projects", data.id);
      if (row) return row;
    } catch (err) {
      console.warn("[getAdminProjectById] getRowById failed, falling back to static:", err);
    }
    const { staticProjectsAsRows } = await import("./static-defaults");
    return staticProjectsAsRows.find((p) => p.id === data.id) ?? null;
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
