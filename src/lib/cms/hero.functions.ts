import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getOptimizedImageUrl } from "@/lib/optimized-images";

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
    const { getPublicServerClient } = await import("@/features/cms/repository.server");
    const client = getPublicServerClient();
    const { data, error } = await client
      .from("hero_projects")
      .select("id, title, host, category, year, status, accent, cover_url, mobile_url, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throwSafe("listPublic", "hero_projects", error);
    return (data ?? []).map((item) => ({
      ...item,
      cover_url: getOptimizedImageUrl(item.cover_url),
      mobile_url: getOptimizedImageUrl(item.mobile_url),
    }));
  },
);

export const adminListHeroProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin, getRequestContextClient, getPublicServerClient } = await import("@/features/cms/repository.server");
    let client;
    try {
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      client = db;
    } catch (e) {
      console.warn("[adminListHeroProjects] Authenticated read failed, falling back to public client:", e);
      client = getPublicServerClient();
    }
    const { data, error } = await client
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
  .validator((d: unknown) => heroInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    const { data: row, error } = await db
      .from("hero_projects")
      .insert({ ...data, created_by: userId })
      .select()
      .single();
    if (error) throwSafe("create", "hero_projects", error);
    return row;
  });

export const updateHeroProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: heroInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    const { data: row, error } = await db
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
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    const { error } = await db
      .from("hero_projects")
      .delete()
      .eq("id", data.id);
    if (error) throwSafe("delete", "hero_projects", error);
    return { ok: true };
  });

const ALLOWED_PREFIXES = [
  "hero/",
  "projects/",
  "uploads/",
  "media/",
  "library/",
  "client-works/",
  "content/",
  "gallery/",
  "services/",
  "blog/",
  "certificates/",
  "experiences/",
  "products/",
  "testimonials/",
  "avatars/",
] as const;
const safeMediaPath = z
  .string()
  .min(1)
  .max(500)
  .refine((p) => !p.startsWith("/") && !p.includes("..") && !p.includes("\\") && !p.includes("://"), {
    message: "Invalid path",
  })
  .refine(
    (p) =>
      ALLOWED_PREFIXES.some((prefix) => p.startsWith(prefix)) ||
      /^[a-zA-Z0-9_\-\/.]+$/.test(p),
    {
      message: "Path must be under an allowed prefix",
    }
  );

export const signHeroMediaPath = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ path: safeMediaPath }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);

    let signedUrl: string | undefined;

    // 1. Attempt signing with supabaseAdmin (service role bypasses RLS)
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: adminSigned, error: adminErr } = await supabaseAdmin.storage
        .from("media")
        .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10);
      if (!adminErr && adminSigned?.signedUrl) {
        signedUrl = adminSigned.signedUrl;
      }
    } catch {
      // ignore admin client load error and fallback to db client
    }

    // 2. Fallback to request db client
    if (!signedUrl) {
      const { data: signed, error } = await db.storage
        .from("media")
        .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10);
      if (!error && signed?.signedUrl) {
        signedUrl = signed.signedUrl;
      } else {
        // Fallback to public URL if media bucket has public read policy
        const { data: pub } = db.storage.from("media").getPublicUrl(data.path);
        if (pub?.publicUrl) {
          signedUrl = pub.publicUrl;
        } else if (error) {
          console.error("[signHeroMediaPath] storage signing failed:", error);
          throw new Error(`تعذر توقيع رابط الصورة من وحدة التخزين: ${error.message || "الملف غير موجود"}`);
        }
      }
    }

    if (!signedUrl) {
      throw new Error("تعذّر إنشاء رابط الصورة. يرجى المحاولة مرة أخرى.");
    }

    return { url: signedUrl };
  });
