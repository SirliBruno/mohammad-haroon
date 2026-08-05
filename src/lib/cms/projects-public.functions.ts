/**
 * Public read-only server functions dedicated to the `projects` table.
 * These support the extra needs of the /work archive (category filter,
 * facet counts) that the generic listRows() helper doesn't cover.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Tables } from "@/integrations/supabase/types";

const listSchema = z.object({
  limit: z.number().int().min(1).max(60).default(12),
  offset: z.number().int().min(0).default(0),
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(),
  featured: z.boolean().optional(),
  orderBy: z.enum(["sort_order", "created_at", "year", "published_at"]).default("sort_order"),
  ascending: z.boolean().default(true),
});

export const listPublicProjects = createServerFn({ method: "POST" })
  .validator((d: unknown) => listSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient } = await import("@/features/cms/repository.server");
    const supabase = getPublicServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("projects").select("*", { count: "exact" }).eq("content_status", "published");
    if (data.category) q = q.eq("category", data.category);
    if (typeof data.featured === "boolean") q = q.eq("featured", data.featured);
    if (data.search) {
      const term = `%${data.search.replace(/[%_]/g, (m) => `\\${m}`)}%`;
      const cols = ["title", "summary", "client", "category"];
      q = q.or(cols.map((c) => `${c}.ilike.${term}`).join(","));
    }
    q = q.order(data.orderBy, { ascending: data.ascending, nullsFirst: false });
    q = q.range(data.offset, data.offset + data.limit - 1);
    const { data: rows, error, count } = await q;
    if (error) {
      console.error("[cms] listPublicProjects failed:", error);
      throw new Error("تعذّر تحميل المشاريع.");
    }
    return {
      rows: (rows ?? []) as Tables<"projects">[],
      count: (count as number | null) ?? 0,
      limit: data.limit,
      offset: data.offset,
    };
  });

export const getPublicProjectBySlug = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ slug: z.string().trim().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient } = await import("@/features/cms/repository.server");
    const supabase = getPublicServerClient();
    const { data: row, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("content_status", "published")
      .maybeSingle();
    if (error) {
      console.error("[cms] getPublicProjectBySlug failed:", error);
      throw new Error("تعذّر تحميل المشروع.");
    }
    return (row ?? null) as Tables<"projects"> | null;
  });

/** Category counts + total for the /work filter bar. */
export const getProjectFacets = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicServerClient } = await import("@/features/cms/repository.server");
  const supabase = getPublicServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("category")
    .eq("content_status", "published");
  if (error) {
    console.error("[cms] getProjectFacets failed:", error);
    throw new Error("تعذّر تحميل التصنيفات.");
  }
  const rows = (data ?? []) as { category: string | null }[];
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const c = r.category ?? "";
    if (!c) continue;
    counts[c] = (counts[c] ?? 0) + 1;
  }
  return { total: rows.length, counts };
});
