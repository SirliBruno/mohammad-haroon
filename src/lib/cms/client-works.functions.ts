import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { clientEntities as staticClientEntities, type ClientEntity, type DeliverableFolder } from "@/data/client-works";

const deliverableFolderSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  category: z.string().trim().default("هوية"),
  summary: z.string().trim().default(""),
  cover: z.string().trim().default(""),
  images: z.array(
    z.object({
      src: z.string().trim().min(1),
      alt: z.string().trim().default(""),
    }),
  ).default([]),
  projectSlug: z.string().trim().optional(),
});

const clientEntitySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  tagline: z.string().trim().default(""),
  description: z.string().trim().default(""),
  category: z.enum(["هوية", "متاجر", "مواقع", "أنظمة", "مطبوعات", "تسويق"]).default("هوية"),
  categoryLabel: z.string().trim().default("هوية وشعارات"),
  year: z.number().int().default(new Date().getFullYear()),
  featured: z.boolean().default(false),
  services: z.array(z.string()).default([]),
  mainSlug: z.string().trim().default(""),
  totalFiles: z.number().int().optional(),
  folders: z.array(deliverableFolderSchema).default([]),
});

/**
 * Public function to list client works, merging database overrides with static defaults.
 */
export const listClientWorksPublic = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClientEntity[]> => {
    try {
      const { getPublicServerClient } = await import("@/features/cms/repository.server");
      const client = getPublicServerClient();

      const { data, error } = await client
        .from("site_content")
        .select("key, metadata")
        .eq("group_name", "client_works");

      if (error || !data || data.length === 0) {
        return staticClientEntities;
      }

      // Map db overrides by entity id
      const dbEntitiesMap = new Map<string, ClientEntity>();
      for (const row of data) {
        try {
          const meta = row.metadata as { entity?: ClientEntity };
          if (meta?.entity && meta.entity.id) {
            dbEntitiesMap.set(meta.entity.id, meta.entity);
          }
        } catch {}
      }

      // Merge: override existing, preserve order, append new custom ones
      const merged: ClientEntity[] = staticClientEntities.map((staticEntity) => {
        if (dbEntitiesMap.has(staticEntity.id)) {
          const overridden = dbEntitiesMap.get(staticEntity.id)!;
          dbEntitiesMap.delete(staticEntity.id);
          return overridden;
        }
        return staticEntity;
      });

      // Any remaining are newly created custom entities
      for (const customEntity of dbEntitiesMap.values()) {
        merged.push(customEntity);
      }

      return merged;
    } catch (e) {
      console.warn("[listClientWorksPublic] Failed to read from db, using static defaults:", e);
      return staticClientEntities;
    }
  },
);

/**
 * Admin function to fetch all client works with status information.
 */
export const adminListClientWorks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin, getRequestContextClient, getPublicServerClient } = await import(
      "@/features/cms/repository.server"
    );

    let client;
    try {
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      client = db;
    } catch {
      client = getPublicServerClient();
    }

    const { data } = await client
      .from("site_content")
      .select("key, metadata, updated_at")
      .eq("group_name", "client_works");

    const dbEntitiesMap = new Map<string, { entity: ClientEntity; updatedAt: string }>();
    if (data) {
      for (const row of data) {
        try {
          const meta = row.metadata as { entity?: ClientEntity };
          if (meta?.entity?.id) {
            dbEntitiesMap.set(meta.entity.id, {
              entity: meta.entity,
              updatedAt: row.updated_at,
            });
          }
        } catch {}
      }
    }

    const result = staticClientEntities.map((staticEntity) => {
      const isCustomized = dbEntitiesMap.has(staticEntity.id);
      const active = isCustomized ? dbEntitiesMap.get(staticEntity.id)!.entity : staticEntity;
      if (isCustomized) dbEntitiesMap.delete(staticEntity.id);
      return {
        ...active,
        isCustomized,
        isDefault: true,
      };
    });

    for (const [_, item] of dbEntitiesMap) {
      result.push({
        ...item.entity,
        isCustomized: true,
        isDefault: false,
      });
    }

    return result;
  });

/**
 * Admin function to save/update a client entity, including all its deliverable folders and images.
 */
export const adminSaveClientWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { entity: unknown }) => ({
    entity: clientEntitySchema.parse(d.entity),
  }))
  .handler(async ({ data: { entity }, context }) => {
    const { requireAdmin, getRequestContextClient, getPublicServerClient } = await import(
      "@/features/cms/repository.server"
    );

    let client;
    try {
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      client = db;
    } catch {
      client = getPublicServerClient();
    }

    // Auto-calculate total files across all folders
    const totalFiles = entity.folders.reduce((acc, f) => acc + (f.images?.length || 0), 0);
    const sanitizedEntity: ClientEntity = {
      ...entity,
      totalFiles,
      mainSlug: entity.mainSlug || entity.id,
    };

    const key = `client_work.${entity.id}`;
    const payload = {
      key,
      group_name: "client_works",
      kind: "json",
      label: entity.name,
      value_ar: entity.name,
      metadata: { entity: sanitizedEntity },
      updated_at: new Date().toISOString(),
    };

    const { data: saved, error } = await client
      .from("site_content")
      .upsert(payload, { onConflict: "key" })
      .select()
      .single();

    if (error) {
      console.error("[adminSaveClientWork] Upsert failed:", error);
      throw new Error(`فشل حفظ مجلدات وملفات العمل: ${error.message}`);
    }

    return { success: true, entity: sanitizedEntity };
  });

/**
 * Admin function to delete/reset a client work.
 */
export const adminDeleteClientWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data: { id }, context }) => {
    const { requireAdmin, getRequestContextClient, getPublicServerClient } = await import(
      "@/features/cms/repository.server"
    );

    let client;
    try {
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      client = db;
    } catch {
      client = getPublicServerClient();
    }

    const key = `client_work.${id}`;
    const { error } = await client.from("site_content").delete().eq("key", key);

    if (error) {
      throw new Error(`فشل حذف المجلدات: ${error.message}`);
    }

    return { success: true, id };
  });
