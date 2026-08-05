/**
 * Admin-scoped list functions — return ALL rows (drafts included) using
 * the request-scoped authenticated Supabase client. Complements the
 * public list functions in `simple.functions.ts` / `projects.functions.ts`
 * which filter to `content_status = 'published'`.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { listParamsSchema } from "@/features/cms/schemas";
import { SEARCH_COLUMNS } from "./search-columns";

function make(table: keyof typeof SEARCH_COLUMNS, defaultOrder?: string, ascending = false) {
  return createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((d: unknown) => listParamsSchema.parse(d ?? {}))
    .handler(async ({ data, context }) => {
      const { listRows, requireAdmin, getRequestContextClient } = await import("@/features/cms/repository.server");
      
      const { db, userId } = await getRequestContextClient(context);
      await requireAdmin(db, userId);
      return listRows(
        db,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table as any,
        { ...data, orderBy: data.orderBy ?? defaultOrder, ascending: data.ascending ?? ascending },
        [...SEARCH_COLUMNS[table]],
      );
    });
}

export const adminListCertificates = make("certificates", "sort_order", true);
export const adminListExperiences = make("experiences", "started_on", false);
export const adminListSkills = make("skills", "sort_order", true);
export const adminListTestimonials = make("testimonials", "sort_order", true);
export const adminListBlogPosts = make("blog_posts", "created_at", false);
export const adminListIdeas = make("ideas", "created_at", false);
export const adminListProducts = make("products", "sort_order", true);
export const adminListServices = make("services", "sort_order", true);
export const adminListMedia = make("media", "created_at", false);
