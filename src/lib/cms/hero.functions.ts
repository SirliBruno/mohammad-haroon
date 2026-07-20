import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const heroInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  host: z.string().trim().max(200).optional().nullable(),
  category: z.string().trim().max(80).optional().nullable(),
  year: z.number().int().min(1970).max(2100).optional().nullable(),
  status: z.enum(["مباشر", "قيد التطوير"]).default("مباشر"),
  accent: z.enum(["emerald", "amber", "sky", "violet"]).default("emerald"),
  cover_url: z.string().url().max(2048).optional().nullable(),
  mobile_url: z.string().url().max(2048).optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

/**
 * Local error mapper — mirrors `mapDbError` from repository.server but stays
 * usable inside this .functions.ts file without importing the server-only
 * module at module scope.
 */
function throwSafe(op: string, table: string, error: { message?: string; code?: string }): never {
  console.error(`[cms] ${op} ${table} failed:`, error);
  const code = error?.code ?? "";
  if (code === "23505") throw new Error("القيمة موجودة مسبقًا (تعارض في المعرّف).");
  if (code === "23502") throw new Error("حقل مطلوب مفقود.");
  if (code === "23503") throw new Error("مرجع غير صالح.");
  if (code === "23514") throw new Error("قيمة غير مقبولة.");
  if (code === "42501" || code === "PGRST301")
    throw new Error("لا تملك صلاحية تنفيذ هذه العملية.");
  throw new Error("تعذّر تنفيذ العملية. حاول مرة أخرى.");
}

export const listHeroProjectsPublic = createServerFn({ method: "GET" }).handler(
  async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const url = process.env.SUPABASE_URL!;
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data, error } = await client
      .from("hero_projects")
      .select("id, title, host, category, year, status, accent, cover_url, mobile_url, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throwSafe("listPublic", "hero_projects", error);
    return data ?? [];
  },
);

export const adminListHeroProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("hero_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throwSafe("adminList", "hero_projects", error);
    return data ?? [];
  });

export const createHeroProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => heroInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("hero_projects")
      .insert({ ...data, created_by: context.userId })
      .select()
      .single();
    if (error) throwSafe("create", "hero_projects", error);
    return row;
  });

export const updateHeroProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: heroInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("hero_projects")
      .update(data.patch)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throwSafe("update", "hero_projects", error);
    return row;
  });

export const deleteHeroProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("hero_projects")
      .delete()
      .eq("id", data.id);
    if (error) throwSafe("delete", "hero_projects", error);
    return { ok: true };
  });

/**
 * Path validator: restrict signed URL creation to safe object paths inside
 * the `media` bucket. Prevents an admin token from signing arbitrary paths
 * (which could expose the full bucket via URL enumeration).
 *
 * Allowed shapes:
 *   hero/<file>            legacy flat layout
 *   hero/<uuid>/<file>     per-project media
 *   projects/<uuid>/<file> project gallery
 *   uploads/<file>         generic admin uploads
 *   library/<uuid>.<ext>   media library uploads
 *   media/<file>           misc media
 * Rejected: leading `/`, `..`, `\`, absolute URLs, empty segments.
 */
const ALLOWED_PREFIXES = [
  "hero/",
  "projects/",
  "uploads/",
  "media/",
  "library/",
] as const;
const safeMediaPath = z
  .string()
  .min(1)
  .max(500)
  .refine((p) => !p.startsWith("/") && !p.includes("..") && !p.includes("\\") && !p.includes("://"), {
    message: "Invalid path",
  })
  .refine((p) => ALLOWED_PREFIXES.some((prefix) => p.startsWith(prefix)), {
    message: "Path must be under an allowed prefix",
  });

/** Sign a long-lived URL for a stored object (10 years). Admin only. */
export const signHeroMediaPath = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ path: safeMediaPath }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    const { data: signed, error } = await context.supabase.storage
      .from("media")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10); // 10 years
    if (error) throwSafe("sign", "storage.media", error);
    return { url: signed.signedUrl };
  });

