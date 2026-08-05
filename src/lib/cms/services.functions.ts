import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  listParamsSchema,
  idSchema,
  slugSchema,
  serviceInputSchema,
} from "@/features/cms/schemas";
import { SEARCH_COLUMNS } from "./search-columns";

export const listServices = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import(
      "@/features/cms/repository.server"
    );
    return listRows(
      getPublicServerClient(),
      "services",
      { ...data, onlyPublished: true },
      [...SEARCH_COLUMNS.services],
    );
  });

export const getServiceBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient, getRowBySlug } = await import(
      "@/features/cms/repository.server"
    );
    return getRowBySlug(getPublicServerClient(), "services", data.slug, true);
  });

export const createService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => serviceInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return createRow(db, "services", data);
  });

export const updateService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: serviceInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return updateRow(db, "services", data.id, data.patch);
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return deleteRow(db, "services", data.id);
  });
