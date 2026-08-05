import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const listSchema = z.object({
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
  table: z.string().optional(),
});

export type AuditJson =
  | string
  | number
  | boolean
  | null
  | AuditJson[]
  | { [key: string]: AuditJson };

export type AuditLogRow = {
  id: string;
  table_name: string;
  row_id: string | null;
  action: "INSERT" | "UPDATE" | "DELETE";
  actor_id: string | null;
  diff: AuditJson | null;
  created_at: string;
};

export const adminListAuditLog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => listSchema.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const { db, userId } = await getRequestContextClient(context);
    await requireAdmin(db, userId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = db
      .from("audit_log")
      .select("id, table_name, row_id, action, actor_id, diff, created_at", { count: "exact" });

    if (data.table) q = q.eq("table_name", data.table);
    q = q.order("created_at", { ascending: false });
    q = q.range(data.offset, data.offset + data.limit - 1);

    const { data: rows, error, count } = await q;
    if (error) throw new Error("تعذّر تحميل سجل التدقيق.");
    return {
      rows: (rows ?? []) as AuditLogRow[],
      count: (count as number | null) ?? 0,
      limit: data.limit,
      offset: data.offset,
    };
  });
