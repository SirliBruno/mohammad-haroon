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

/**
 * Publishable-key Supabase client for public read-only Data API calls
 * from server functions. RLS applies as the anon role.
 */
export function getPublicServerClient(): Db {
  if (_publicClient) return _publicClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
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
 * Assert the currently-authenticated user has the `admin` role.
 * Throws a 403-style error otherwise. Uses the request-scoped client so RLS
 * enforces "read own row" on `user_roles`.
 */
export async function requireAdmin(supabase: Db, userId: string): Promise<void> {
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
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(`[${table}] list failed: ${error.message}`);

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
  if (error) throw new Error(`[${table}] get failed: ${error.message}`);
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
  if (error) throw new Error(`[${table}] get by slug failed: ${error.message}`);
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
  if (error) throw new Error(`[${table}] create failed: ${error.message}`);
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
  if (error) throw new Error(`[${table}] update failed: ${error.message}`);
  return data as Database["public"]["Tables"][T]["Row"];
}

export async function deleteRow<T extends TableName>(supabase: Db, table: T, id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from(table) as any).delete().eq("id", id);
  if (error) throw new Error(`[${table}] delete failed: ${error.message}`);
  return { id, deleted: true as const };
}
