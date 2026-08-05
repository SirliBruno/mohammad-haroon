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

function getEnvVar(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key]) return process.env[key];
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];
  }
  try {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      const metaEnv = import.meta.env as Record<string, string | undefined>;
      if (metaEnv[key]) return metaEnv[key];
      if (metaEnv[`VITE_${key}`]) return metaEnv[`VITE_${key}`];
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

/**
 * Publishable-key Supabase client for public read-only Data API calls
 * from server functions. RLS applies as the anon role.
 */
export function getPublicServerClient(): Db {
  if (_publicClient) return _publicClient;
  const url = getEnvVar("SUPABASE_URL");
  const key = getEnvVar("SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY. Enable Lovable Cloud.",
    );
  }
  _publicClient = createClient<Database>(url, key, {
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
          global: { headers: { Authorization: `Bearer ${token}` } },
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

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(`Role check failed: ${error.message}`);
  if (!data) throw new Error("Forbidden: admin role required");
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
  // Postgres SQLSTATE codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
  if (code === "23505") return new Error("القيمة موجودة مسبقًا (تعارض في المعرّف).");
  if (code === "23502") return new Error("حقل مطلوب مفقود.");
  if (code === "23503") return new Error("مرجع غير صالح.");
  if (code === "23514") return new Error("قيمة غير مقبولة.");
  if (code === "42501" || code === "PGRST301") return new Error("لا تملك صلاحية تنفيذ هذه العملية.");
  return new Error("تعذّر تنفيذ العملية. حاول مرة أخرى.");
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

  // Filter chain is column-name-generic; the strictly-typed builder can't
  // model that with an unknown `T`. Cast to a loose builder here and
  // re-narrow the returned rows on the way out.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from(table) as any)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from(table) as any)
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw mapDbError("update", table, error);
  return data as Database["public"]["Tables"][T]["Row"];
}

export async function deleteRow<T extends TableName>(supabase: Db, table: T, id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from(table) as any).delete().eq("id", id);
  if (error) throw mapDbError("delete", table, error);
  return { id, deleted: true as const };
}
