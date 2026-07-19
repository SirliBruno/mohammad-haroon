import { createFileRoute } from "@tanstack/react-router";
import { inquirySchema } from "@/features/contact/schema";

// In-memory rate limit — best-effort, resets on cold start
const buckets = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function rateLimit(ip: string): boolean {
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

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const ip =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown";
          if (!rateLimit(ip)) {
            return Response.json(
              { ok: false, error: "تم تجاوز الحد المسموح. حاول لاحقًا." },
              { status: 429 },
            );
          }
          const body = await request.json();
          const parsed = inquirySchema.safeParse(body);
          if (!parsed.success) {
            return Response.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
          }
          // Honeypot: silently accept but do nothing
          if (parsed.data.company && parsed.data.company.length > 0) {
            return Response.json({ ok: true });
          }
          console.log("[inquiry:public]", { ...parsed.data, ip });
          return Response.json({ ok: true });
        } catch {
          return new Response("Bad Request", { status: 400 });
        }
      },
    },
  },
});
