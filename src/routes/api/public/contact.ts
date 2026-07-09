import { createFileRoute } from "@tanstack/react-router";
import { inquirySchema } from "@/features/contact/schema";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = inquirySchema.safeParse(body);
          if (!parsed.success) {
            return Response.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
          }
          console.log("[inquiry:public]", parsed.data);
          return Response.json({ ok: true });
        } catch {
          return new Response("Bad Request", { status: 400 });
        }
      },
    },
  },
});
