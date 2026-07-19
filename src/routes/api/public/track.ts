import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "home_view",
  "work_view",
  "project_view",
  "services_view",
  "service_view",
  "contact_view",
  "contact_start",
  "contact_submit",
  "cta_click",
]);

// Best-effort per-IP burst limit (resets on cold start)
const buckets = new Map<string, { count: number; reset: number }>();
const LIMIT = 120;
const WINDOW_MS = 60_000;

function allow(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (b.count >= LIMIT) return false;
  b.count += 1;
  return true;
}

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const ip =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown";
          if (!allow(ip)) return new Response("rate", { status: 429 });

          const body = await request.json().catch(() => null);
          if (!body || typeof body !== "object") {
            return new Response("bad", { status: 400 });
          }
          const event = String((body as { event?: unknown }).event ?? "");
          if (!ALLOWED_EVENTS.has(event)) {
            return new Response("event", { status: 400 });
          }

          const path =
            typeof (body as { path?: unknown }).path === "string"
              ? String((body as { path: string }).path).slice(0, 300)
              : null;
          const sessionId =
            typeof (body as { sessionId?: unknown }).sessionId === "string"
              ? String((body as { sessionId: string }).sessionId).slice(0, 64)
              : null;
          const referrer =
            typeof (body as { referrer?: unknown }).referrer === "string"
              ? String((body as { referrer: string }).referrer).slice(0, 500)
              : null;
          const metadata =
            (body as { metadata?: unknown }).metadata &&
            typeof (body as { metadata: unknown }).metadata === "object"
              ? ((body as { metadata: Record<string, unknown> }).metadata)
              : {};

          const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null;
          const salt = process.env.SUPABASE_SERVICE_ROLE_KEY || "salt";
          const ipHash = createHash("sha256").update(`${ip}:${salt}`).digest("hex").slice(0, 32);

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("analytics_events").insert({
            event,
            path,
            session_id: sessionId,
            referrer,
            metadata,
            ip_hash: ipHash,
            user_agent: userAgent,
          });

          return new Response("ok");
        } catch {
          return new Response("err", { status: 500 });
        }
      },
    },
  },
});
