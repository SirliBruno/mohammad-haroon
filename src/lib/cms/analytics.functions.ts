import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const paramsSchema = z
  .object({
    days: z.number().int().min(1).max(365).default(30),
  })
  .default({ days: 30 });

export type FunnelSummary = {
  range: { from: string; to: string; days: number };
  totals: Record<string, number>;
  uniqueSessions: Record<string, number>;
  conversions: {
    homeToWork: number;
    workToProject: number;
    projectToContact: number;
    contactToSubmit: number;
    overall: number;
  };
  daily: Array<{ date: string; views: number; contacts: number; submits: number }>;
  topPaths: Array<{ path: string; views: number }>;
};

export const getFunnelSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => paramsSchema.parse(d ?? { days: 30 }))
  .handler(async ({ data, context }): Promise<FunnelSummary> => {
    const { requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
    const db = await getRequestContextClient(context);
    const userId = context.userId || "anonymous";
    await requireAdmin(db, userId);

    const days = data.days;
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

    const { data: rows, error } = await db
      .from("analytics_events")
      .select("event, path, session_id, created_at")
      .gte("created_at", from.toISOString())
      .order("created_at", { ascending: true })
      .limit(50000);

    if (error) throw new Error(error.message);
    const events = rows ?? [];

    const totals: Record<string, number> = {};
    const sessionsByEvent: Record<string, Set<string>> = {};
    const pathCounts = new Map<string, number>();
    const dayMap = new Map<string, { views: number; contacts: number; submits: number }>();

    for (const r of events) {
      const ev = r.event as string;
      totals[ev] = (totals[ev] ?? 0) + 1;
      const sid = (r.session_id as string) || "anon";
      (sessionsByEvent[ev] ??= new Set()).add(sid);

      if (ev === "page_view" && r.path) {
        const p = r.path as string;
        pathCounts.set(p, (pathCounts.get(p) ?? 0) + 1);
      }
      const day = String(r.created_at).slice(0, 10);
      const bucket = dayMap.get(day) ?? { views: 0, contacts: 0, submits: 0 };
      if (ev === "page_view") bucket.views += 1;
      if (ev === "contact_view") bucket.contacts += 1;
      if (ev === "contact_submit") bucket.submits += 1;
      dayMap.set(day, bucket);
    }

    const uniqueSessions: Record<string, number> = {};
    for (const [k, s] of Object.entries(sessionsByEvent)) uniqueSessions[k] = s.size;

    const u = (k: string) => uniqueSessions[k] ?? 0;
    const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);

    const conversions = {
      homeToWork: pct(u("work_view"), u("home_view")),
      workToProject: pct(u("project_view"), u("work_view")),
      projectToContact: pct(u("contact_view"), u("project_view")),
      contactToSubmit: pct(u("contact_submit"), u("contact_view")),
      overall: pct(u("contact_submit"), u("home_view")),
    };

    const daily = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v }));

    const topPaths = Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));

    return {
      range: { from: from.toISOString(), to: to.toISOString(), days },
      totals,
      uniqueSessions,
      conversions,
      daily,
      topPaths,
    };
  });
