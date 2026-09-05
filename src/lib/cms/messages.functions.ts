import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  listParamsSchema,
  idSchema,
  messageSubmitSchema,
  messageUpdateSchema,
} from "@/features/cms/schemas";
import { SEARCH_COLUMNS } from "./search-columns";

/** SHA-256 hash of a string, hex-encoded. Cheap fingerprint for IP throttling. */
async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Best-effort caller IP. Falls back to a static token so a missing header
 *  doesn't accidentally bypass the throttle. */
function callerIp(): string {
  try {
    return (
      getRequestIP({ xForwardedFor: true }) ??
      getRequestHeader("x-forwarded-for") ??
      getRequestHeader("cf-connecting-ip") ??
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

/** Public submit — anon-safe. Rate-limited by IP hash. */
export const submitMessage = createServerFn({ method: "POST" })
  .validator((d: unknown) => messageSubmitSchema.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient, createRow } = await import(
      "@/features/cms/repository.server"
    );

    // Rate-limit: max 3 messages from the same IP in the last 10 minutes.
    // Anon can't SELECT messages (admin-only RLS), so we use the admin client
    // for the count only — the insert stays through the public/anon path so
    // RLS input validation still applies.
    const ipHash = await sha256Hex(callerIp());
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { count } = await supabaseAdmin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", tenMinAgo);
      if ((count ?? 0) >= 3) {
        throw new Error("لقد أرسلت رسائل كثيرة مؤخرًا. حاول بعد قليل.");
      }
    } catch (e) {
      // If the admin client is unavailable, fail open on the throttle rather
      // than blocking legitimate messages — the honey-pot + min-time still apply.
      if (e instanceof Error && e.message.startsWith("لقد أرسلت")) throw e;
      console.warn("[submitMessage] rate-limit check skipped:", e);
    }

    await createRow(getPublicServerClient(), "messages", {
      ...data,
      ip_hash: ipHash,
      status: "new",
    });
    return { ok: true as const };
  });

export const listMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { listRows, requireAdmin, getRequestContextClient, getPublicServerClient } = await import("@/features/cms/repository.server");
    let client;
    try {
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      client = db;
    } catch {
      client = getPublicServerClient();
    }
    try {
      return await listRows(client, "messages", data, [...SEARCH_COLUMNS.messages]);
    } catch (err) {
      console.warn("[listMessages] listRows failed:", err);
      return { rows: [], count: 0, limit: data.limit, offset: data.offset };
    }
  });

export const updateMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => messageUpdateSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    const { id, ...patch } = data;
    return updateRow(db, "messages", id, patch);
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);
    return deleteRow(db, "messages", data.id);
  });

/** Admin — عدد الرسائل الجديدة (لشارة القائمة الجانبية). */
export const countNewMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      const { count, error } = await db
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      if (error) return { count: 0 };
      return { count: count ?? 0 };
    } catch {
      return { count: 0 };
    }
  });
