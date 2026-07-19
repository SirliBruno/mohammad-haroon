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
    if (error) throw error;
    return data ?? [];
  },
);

export const adminListHeroProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("hero_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

export const createHeroProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => heroInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: row, error } = await context.supabase
      .from("hero_projects")
      .insert({ ...data, created_by: context.userId })
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const updateHeroProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: heroInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: row, error } = await context.supabase
      .from("hero_projects")
      .update(data.patch)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const deleteHeroProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("hero_projects")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

/** Sign a long-lived URL for a stored object (10 years). */
export const signHeroMediaPath = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ path: z.string().min(1).max(500) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: signed, error } = await context.supabase.storage
      .from("media")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10); // 10 years
    if (error) throw error;
    return { url: signed.signedUrl };
  });
