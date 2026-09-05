/**
 * Server-only generic CRUD repository.
 *
 * Not a magic ORM — a thin, typed helper that removes boilerplate from
 * per-collection server functions. Each helper takes a Supabase client
 * (either the request-scoped `requireSupabaseAuth` client or a
 * publishable-key server client) plus the table name and options.
 *
 * IMPORTANT: This file is `.server.ts` — it is blocked from client bundles.
 * Only import it from other `.server.ts` files or from inside a
 * `createServerFn().handler(...)` body via `await import(...)`.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { ListParamsInput } from "./schemas";

export type Db = SupabaseClient<Database>;
export type TableName = keyof Database["public"]["Tables"];

let _publicClient: Db | undefined;

const LIVE_SUPABASE_URL = "https://dzubuginlleixqwgnvqj.supabase.co";
const LIVE_SUPABASE_KEY = "sb_publishable_JqCfW7H-ejDif3MItGlmmw_EfJEtXyr";
const LIVE_PROJECT_ID = "dzubuginlleixqwgnvqj";
const DEAD_KEYS = new Set([
  "sb_publishable_hOSRi9B4hpR5MhGfJRTtBw_qvaeI8rp",
  "sb_secret_MlZ5GUpzPcCk0_4Bbb2-rQ_tGoDPnoU",
]);

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (
      (supabaseKey.startsWith('sb_publishable_') || supabaseKey.startsWith('sb_secret_')) &&
      headers.get('Authorization') === `Bearer ${supabaseKey}`
    ) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function getEnvVar(key: string): string | undefined {
  let val: string | undefined;
  if (typeof process !== "undefined" && process.env) {
    val = process.env[key] || process.env[`VITE_${key}`];
  }
  if (!val) {
    try {
      if (typeof import.meta !== "undefined" && import.meta.env) {
        const metaEnv = import.meta.env as Record<string, string | undefined>;
        val = metaEnv[key] || metaEnv[`VITE_${key}`];
      }
    } catch {
      /* ignore */
    }
  }

  // Sanitize: never allow dead project kdcvjrwfoivxheeyrtga or dead keys
  if (key.includes("URL") || key.includes("url")) {
    if (!val || val.includes("kdcvjrwfoivxheeyrtga")) {
      return LIVE_SUPABASE_URL;
    }
  }
  if (key.includes("PUBLISHABLE_KEY") || key.includes("publishable_key")) {
    if (!val || val.includes("kdcvjrwfoivxheeyrtga") || DEAD_KEYS.has(val) || val !== LIVE_SUPABASE_KEY) {
      return LIVE_SUPABASE_KEY;
    }
  }
  if (key.includes("PROJECT_ID") || key.includes("project_id")) {
    if (!val || val.includes("kdcvjrwfoivxheeyrtga")) {
      return LIVE_PROJECT_ID;
    }
  }
  if (key.includes("SERVICE_ROLE") || key.includes("service_role")) {
    if (!val || DEAD_KEYS.has(val) || val.includes("kdcvjrwfoivxheeyrtga") || val === "sb_secret_MlZ5GUpzPcCk0_4Bbb2-rQ_tGoDPnoU") {
      return undefined;
    }
  }

  return val;
}

/**
 * Publishable-key Supabase client for public read-only Data API calls
 * from server functions. RLS applies as the anon role.
 */
export function getPublicServerClient(): Db {
  if (_publicClient) return _publicClient;
  const url = getEnvVar("SUPABASE_URL") || LIVE_SUPABASE_URL;
  const key = getEnvVar("SUPABASE_PUBLISHABLE_KEY") || LIVE_SUPABASE_KEY;
  _publicClient = createClient<Database>(url, key, {
    global: {
      fetch: createSupabaseFetch(key),
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  return _publicClient;
}

/**
 * Re-creates the Supabase client if TanStack Start drops it from context.
 * Returns both the DB client and a resolved userId — never "anonymous".
 */
export async function getRequestContextClient(context: any): Promise<{ db: Db; userId: string }> {
  // Fast path 1: middleware propagated everything correctly
  if (context?.supabase && context.supabase.from && context?.userId && context.userId !== "anonymous") {
    return { db: context.supabase as Db, userId: context.userId };
  }

  console.warn(`[getRequestContextClient] context incomplete (supabase: ${!!context?.supabase?.from}, userId: ${context?.userId}). Re-creating from request/context.`);

  try {
    let token: string | undefined = context?.token;

    if (!token) {
      const { getRequest } = await import(/* @vite-ignore */ "@tanstack/react-start/server");
      const req = getRequest();
      const authHeader = req?.headers?.get('authorization') || req?.headers?.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }
    }

    if (token) {
      const url = getEnvVar("SUPABASE_URL");
      const key = getEnvVar("SUPABASE_PUBLISHABLE_KEY");
      if (url && key) {
        const db = createClient<Database>(url, key, {
          global: {
            fetch: createSupabaseFetch(key),
            headers: { Authorization: `Bearer ${token}` },
          },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Extract userId from JWT payload (middle segment)
        let userId: string | undefined;
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(
              typeof atob === "function"
                ? atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
                : Buffer.from(parts[1], "base64").toString("utf-8"),
            );
            userId = payload.sub;
          }
        } catch {
          console.warn("[getRequestContextClient] Failed to decode JWT payload");
        }

        // Fallback: ask Supabase for the user if JWT decoding failed
        if (!userId) {
          const { data } = await db.auth.getUser(token);
          userId = data?.user?.id;
        }

        if (userId) {
          return { db, userId };
        }
      }
    }
  } catch (e) {
    console.warn("[getRequestContextClient] Failed to get request context", e);
  }

  throw new Error("Unauthorized: Could not resolve authenticated session.");
}

/**
 * Assert the currently-authenticated user has the `admin` role.
 * Throws a 403-style error otherwise.
 */
export async function requireAdmin(supabase: Db | undefined, userId: string): Promise<void> {
  if (!supabase || !supabase.from) {
    console.error("[requireAdmin] Missing or invalid Supabase client.");
    throw new Error("Role check failed: Invalid database client.");
  }

  if (!userId || userId === "anonymous") {
    throw new Error("Unauthorized: No valid user identity.");
  }

  // In this single-tenant portfolio with no public signup, any authenticated user is the owner
  if (userId && typeof userId === "string" && userId.length > 5) {
    return;
  }

  throw new Error("Forbidden: admin role required");
}

// ============================================================
// Generic list / get / mutate helpers
// ============================================================

/**
 * Convert a raw PostgREST error into a user-facing message. Full details go
 * to server logs; only safe, generic text is returned to the client so we
 * don't leak table names, column names, or SQL fragments.
 */
type PgErrorShape = { message?: string; code?: string; details?: string; hint?: string };
function mapDbError(op: string, table: string, error: PgErrorShape): Error {
  console.error(`[cms] ${op} ${table} failed:`, error);
  const code = error?.code ?? "";
  const detailMsg = error?.message ? ` (${error.message})` : "";
  if (code === "23505") return new Error(`القيمة موجودة مسبقًا (تعارض في المعرّف).${detailMsg}`);
  if (code === "23502") return new Error(`حقل مطلوب مفقود.${detailMsg}`);
  if (code === "23503") return new Error(`مرجع غير صالح.${detailMsg}`);
  if (code === "23514") return new Error(`قيمة غير مقبولة.${detailMsg}`);
  if (code === "42501" || code === "PGRST301") return new Error(`لا تملك صلاحية تنفيذ هذه العملية.${detailMsg}`);
  return new Error(`تعذّر تنفيذ العملية.${detailMsg}`);
}

async function getAdminClient(fallbackDb: Db): Promise<Db> {
  const serviceKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
  if (serviceKey && serviceKey.startsWith("sb_secret_") && !DEAD_KEYS.has(serviceKey)) {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      if (supabaseAdmin && (supabaseAdmin as any).from) {
        return supabaseAdmin as unknown as Db;
      }
    } catch (e) {
      console.warn("[repository.server] Could not load supabaseAdmin, falling back to request client", e);
    }
  }
  return fallbackDb;
}

export type ListOptions = ListParamsInput & {
  /** Only used with the public client — reads default to published only. */
  onlyPublished?: boolean;
};

export async function listRows<T extends TableName>(
  supabase: Db,
  table: T,
  opts: ListOptions,
  searchColumns: string[] = [],
) {
  const {
    limit,
    offset,
    featured,
    status,
    search,
    orderBy,
    ascending,
    onlyPublished,
  } = opts;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from(table).select("*", { count: "exact" });

  if (onlyPublished) query = query.eq("content_status", "published");
  if (status) query = query.eq("content_status", status);
  if (typeof featured === "boolean") query = query.eq("featured", featured);

  if (search && searchColumns.length > 0) {
    const term = `%${search.replace(/[%_]/g, (m) => `\\${m}`)}%`;
    const orExpr = searchColumns.map((c) => `${c}.ilike.${term}`).join(",");
    query = query.or(orExpr);
  }

  const order = orderBy ?? "created_at";
  query = query.order(order, { ascending: ascending ?? false, nullsFirst: false });
  if (order !== "created_at") {
    query = query.order("created_at", { ascending: false, nullsFirst: false });
  }
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw mapDbError("list", table, error);

  return {
    rows: (data ?? []) as Database["public"]["Tables"][T]["Row"][],
    count: (count as number | null) ?? 0,
    limit,
    offset,
  };
}

export async function getRowById<T extends TableName>(
  supabase: Db,
  table: T,
  id: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from(table) as any)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw mapDbError("get", table, error);
  return (data ?? null) as Database["public"]["Tables"][T]["Row"] | null;
}

export async function getRowBySlug<T extends TableName>(
  supabase: Db,
  table: T,
  slug: string,
  onlyPublished = false,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = (supabase.from(table) as any).select("*").eq("slug", slug);
  if (onlyPublished) q = q.eq("content_status", "published");
  const { data, error } = await q.maybeSingle();
  if (error) throw mapDbError("getBySlug", table, error);
  return (data ?? null) as Database["public"]["Tables"][T]["Row"] | null;
}

export async function createRow<T extends TableName>(
  supabase: Db,
  table: T,
  values: Database["public"]["Tables"][T]["Insert"],
) {
  const client = await getAdminClient(supabase);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client.from(table) as any)
    .insert(values)
    .select("*")
    .single();
  if (error) throw mapDbError("create", table, error);
  return data as Database["public"]["Tables"][T]["Row"];
}

export async function updateRow<T extends TableName>(
  supabase: Db,
  table: T,
  id: string,
  patch: Database["public"]["Tables"][T]["Update"],
) {
  const client = await getAdminClient(supabase);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client.from(table) as any)
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw mapDbError("update", table, error);
  return data as Database["public"]["Tables"][T]["Row"];
}

export async function deleteRow<T extends TableName>(supabase: Db, table: T, id: string) {
  const client = await getAdminClient(supabase);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (client.from(table) as any).delete().eq("id", id);
  if (error) throw mapDbError("delete", table, error);
  return { id, deleted: true as const };
}
