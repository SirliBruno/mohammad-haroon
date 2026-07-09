/**
 * CRUD server functions for the "simple" collections — the ones that don't
 * need custom read shapes or per-collection business logic beyond
 * list / get-by-id / create / update / delete:
 *
 *   certificates, experiences, skills, testimonials, ideas, products, blog_posts
 *
 * Blog posts also get a `getBlogPostBySlug` for the public reader.
 * Media lives in `./media.functions.ts` (owner tracking).
 * Messages live in `./messages.functions.ts` (inbox + public submit).
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  listParamsSchema,
  idSchema,
  slugSchema,
  certificateInputSchema,
  experienceInputSchema,
  skillInputSchema,
  testimonialInputSchema,
  blogPostInputSchema,
  ideaInputSchema,
  productInputSchema,
} from "@/features/cms/schemas";
import { SEARCH_COLUMNS } from "./search-columns";

// ---------- Certificates ----------
export const listCertificates = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import("@/features/cms/repository.server");
    return listRows(getPublicServerClient(), "certificates", { ...data, onlyPublished: true }, [
      ...SEARCH_COLUMNS.certificates,
    ]);
  });

export const createCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => certificateInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "certificates", data);
  });

export const updateCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: certificateInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "certificates", data.id, data.patch);
  });

export const deleteCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "certificates", data.id);
  });

// ---------- Experiences ----------
export const listExperiences = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import("@/features/cms/repository.server");
    return listRows(
      getPublicServerClient(),
      "experiences",
      { ...data, onlyPublished: true, orderBy: data.orderBy ?? "started_on" },
      [...SEARCH_COLUMNS.experiences],
    );
  });

export const createExperience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => experienceInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "experiences", data);
  });

export const updateExperience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: experienceInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "experiences", data.id, data.patch);
  });

export const deleteExperience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "experiences", data.id);
  });

// ---------- Skills ----------
export const listSkills = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import("@/features/cms/repository.server");
    return listRows(
      getPublicServerClient(),
      "skills",
      { ...data, onlyPublished: true, orderBy: data.orderBy ?? "sort_order", ascending: true },
      [...SEARCH_COLUMNS.skills],
    );
  });

export const createSkill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => skillInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "skills", data);
  });

export const updateSkill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: skillInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "skills", data.id, data.patch);
  });

export const deleteSkill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "skills", data.id);
  });

// ---------- Testimonials ----------
export const listTestimonials = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import("@/features/cms/repository.server");
    return listRows(getPublicServerClient(), "testimonials", { ...data, onlyPublished: true }, [
      ...SEARCH_COLUMNS.testimonials,
    ]);
  });

export const createTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => testimonialInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "testimonials", data);
  });

export const updateTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: testimonialInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "testimonials", data.id, data.patch);
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "testimonials", data.id);
  });

// ---------- Blog posts ----------
export const listBlogPosts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import("@/features/cms/repository.server");
    return listRows(
      getPublicServerClient(),
      "blog_posts",
      { ...data, onlyPublished: true, orderBy: data.orderBy ?? "published_at" },
      [...SEARCH_COLUMNS.blog_posts],
    );
  });

export const getBlogPostBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient, getRowBySlug } = await import(
      "@/features/cms/repository.server"
    );
    return getRowBySlug(getPublicServerClient(), "blog_posts", data.slug, true);
  });

export const createBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => blogPostInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "blog_posts", { ...data, author_id: context.userId });
  });

export const updateBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: blogPostInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "blog_posts", data.id, data.patch);
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "blog_posts", data.id);
  });

// ---------- Ideas ----------
export const listIdeas = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import("@/features/cms/repository.server");
    return listRows(getPublicServerClient(), "ideas", { ...data, onlyPublished: true }, [
      ...SEARCH_COLUMNS.ideas,
    ]);
  });

export const createIdea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ideaInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "ideas", data);
  });

export const updateIdea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: ideaInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "ideas", data.id, data.patch);
  });

export const deleteIdea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "ideas", data.id);
  });

// ---------- Products ----------
export const listProducts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listParamsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getPublicServerClient, listRows } = await import("@/features/cms/repository.server");
    return listRows(getPublicServerClient(), "products", { ...data, onlyPublished: true }, [
      ...SEARCH_COLUMNS.products,
    ]);
  });

export const getProductBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const { getPublicServerClient, getRowBySlug } = await import(
      "@/features/cms/repository.server"
    );
    return getRowBySlug(getPublicServerClient(), "products", data.slug, true);
  });

export const createProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { createRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return createRow(context.supabase, "products", data);
  });

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), patch: productInputSchema.partial() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { updateRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return updateRow(context.supabase, "products", data.id, data.patch);
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { deleteRow, requireAdmin } = await import("@/features/cms/repository.server");
    await requireAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, "products", data.id);
  });
