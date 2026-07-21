/**
 * Zod validators for CMS mutations.
 *
 * These schemas are the boundary between untrusted input (forms, API calls)
 * and the database. Server functions parse input with the matching *Input
 * schema and let the database round-trip supply defaults/timestamps.
 */
import { z } from "zod";

// ----- Shared primitives -----
export const slug = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lower-kebab-case");

export const contentStatus = z.enum(["draft", "published", "archived"]);
export const projectStatus = z.enum(["concept", "in_progress", "live", "archived"]);
export const employmentType = z.enum([
  "full_time",
  "part_time",
  "contract",
  "freelance",
  "internship",
]);
export const messageStatus = z.enum(["new", "read", "replied", "archived", "spam"]);
export const mediaKind = z.enum(["image", "video", "document", "audio", "other"]);

const optionalUrl = z.string().url().max(2048).optional().nullable();
const optionalText = (max = 4000) => z.string().trim().max(max).optional().nullable();
const stringArray = (max = 40, itemMax = 500) =>
  z.array(z.string().trim().min(1).max(itemMax)).max(max).default([]);
// Supabase's generated `Json` type. Recursive so nested arrays/objects work.
type JsonValue = string | number | boolean | null | { [k: string]: JsonValue } | JsonValue[];
const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ]),
);
const jsonArray = z.array(jsonValueSchema).default([]);
const jsonObject = z.record(jsonValueSchema).optional().nullable();

export const listParamsSchema = z.object({
  limit: z.number().int().min(1).max(200).default(24),
  offset: z.number().int().min(0).default(0),
  featured: z.boolean().optional(),
  status: contentStatus.optional(),
  search: z.string().trim().max(120).optional(),
  orderBy: z.string().max(60).optional(),
  ascending: z.boolean().default(false),
});
export type ListParamsInput = z.infer<typeof listParamsSchema>;

export const idSchema = z.object({ id: z.string().uuid() });
export const slugSchema = z.object({ slug });

// ----- Projects -----
export const projectInputSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(200),
  summary: optionalText(500),
  description: optionalText(),
  category: optionalText(80),
  tags: stringArray(),
  technologies: stringArray(),
  cover_url: optionalUrl,
  gallery: jsonArray,
  role: optionalText(500),
  client: optionalText(120),
  timeline: optionalText(120),
  year: z.number().int().min(1970).max(2100).optional().nullable(),
  featured: z.boolean().default(false),
  status: projectStatus.default("concept"),
  content_status: contentStatus.default("draft"),
  live_url: optionalUrl,
  github_url: optionalUrl,
  problem: optionalText(),
  goals: stringArray(),
  research: optionalText(),
  solution: optionalText(),
  design_process: optionalText(),
  development: optionalText(),
  lessons: stringArray(),
  highlights: stringArray(),
  results: jsonArray,
  testimonial: jsonObject,
  metrics: jsonArray,
  published_at: z.string().datetime().optional().nullable(),
  sort_order: z.number().int().default(0),
});
export type ProjectInput = z.infer<typeof projectInputSchema>;

// ----- Services -----
export const serviceInputSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(200),
  tagline: optionalText(200),
  summary: optionalText(500),
  overview: optionalText(),
  icon: optionalText(60),
  cover_url: optionalUrl,
  benefits: jsonArray,
  features: jsonArray,
  workflow: jsonArray,
  timeline: optionalText(120),
  technologies: stringArray(),
  deliverables: stringArray(),
  faq: jsonArray,
  starting_price_cents: z.number().int().min(0).optional().nullable(),
  currency: z.string().length(3).default("USD"),
  featured: z.boolean().default(false),
  content_status: contentStatus.default("draft"),
  sort_order: z.number().int().default(0),
});
export type ServiceInput = z.infer<typeof serviceInputSchema>;

// ----- Certificates -----
export const certificateInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(200),
  issued_on: z.string().date().optional().nullable(),
  expires_on: z.string().date().optional().nullable(),
  credential_id: optionalText(200),
  credential_url: optionalUrl,
  image_url: optionalUrl,
  skills: stringArray(),
  featured: z.boolean().default(false),
  content_status: contentStatus.default("published"),
  sort_order: z.number().int().default(0),
});
export type CertificateInput = z.infer<typeof certificateInputSchema>;

// ----- Experiences -----
export const experienceInputSchema = z.object({
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  location: optionalText(120),
  employment_type: employmentType.default("full_time"),
  started_on: z.string().date(),
  ended_on: z.string().date().optional().nullable(),
  is_current: z.boolean().default(false),
  summary: optionalText(),
  highlights: stringArray(),
  technologies: stringArray(),
  logo_url: optionalUrl,
  url: optionalUrl,
  content_status: contentStatus.default("published"),
  sort_order: z.number().int().default(0),
});
export type ExperienceInput = z.infer<typeof experienceInputSchema>;

// ----- Skills -----
export const skillInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: optionalText(80),
  level: z.number().int().min(0).max(100).optional().nullable(),
  years_experience: z.number().min(0).max(60).optional().nullable(),
  icon: optionalText(60),
  color: optionalText(30),
  featured: z.boolean().default(false),
  content_status: contentStatus.default("published"),
  sort_order: z.number().int().default(0),
});
export type SkillInput = z.infer<typeof skillInputSchema>;

// ----- Testimonials -----
export const testimonialInputSchema = z.object({
  author_name: z.string().trim().min(1).max(200),
  author_role: optionalText(200),
  author_company: optionalText(200),
  avatar_url: optionalUrl,
  quote: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  featured: z.boolean().default(false),
  content_status: contentStatus.default("published"),
  sort_order: z.number().int().default(0),
});
export type TestimonialInput = z.infer<typeof testimonialInputSchema>;

// ----- Blog posts -----
export const blogPostInputSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(200),
  excerpt: optionalText(500),
  content: optionalText(50_000),
  cover_url: optionalUrl,
  tags: stringArray(),
  category: optionalText(80),
  reading_minutes: z.number().int().min(1).max(240).optional().nullable(),
  featured: z.boolean().default(false),
  content_status: contentStatus.default("draft"),
  published_at: z.string().datetime().optional().nullable(),
  seo_title: optionalText(200),
  seo_description: optionalText(500),
});
export type BlogPostInput = z.infer<typeof blogPostInputSchema>;

// ----- Ideas -----
export const ideaInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  summary: optionalText(500),
  body: optionalText(),
  tags: stringArray(),
  stage: optionalText(80),
  content_status: contentStatus.default("draft"),
});
export type IdeaInput = z.infer<typeof ideaInputSchema>;

// ----- Products -----
export const productInputSchema = z.object({
  slug,
  name: z.string().trim().min(1).max(200),
  tagline: optionalText(200),
  description: optionalText(),
  cover_url: optionalUrl,
  gallery: jsonArray,
  price_cents: z.number().int().min(0).optional().nullable(),
  currency: z.string().length(3).default("USD"),
  external_url: optionalUrl,
  tags: stringArray(),
  featured: z.boolean().default(false),
  content_status: contentStatus.default("draft"),
  sort_order: z.number().int().default(0),
});
export type ProductInput = z.infer<typeof productInputSchema>;

// ----- Media -----
export const mediaInputSchema = z.object({
  kind: mediaKind.default("image"),
  url: z.string().url().max(2048),
  storage_path: optionalText(500),
  filename: optionalText(200),
  mime_type: optionalText(120),
  size_bytes: z.number().int().min(0).optional().nullable(),
  width: z.number().int().min(0).optional().nullable(),
  height: z.number().int().min(0).optional().nullable(),
  alt: optionalText(500),
  caption: optionalText(500),
  tags: stringArray(),
});
export type MediaInput = z.infer<typeof mediaInputSchema>;

// ----- Messages (contact inbox) -----
export const messageSubmitSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  inquiry_type: optionalText(80),
  budget: optionalText(80),
  message: z.string().trim().min(1).max(4000),
  source: optionalText(120),
});
export type MessageSubmitInput = z.infer<typeof messageSubmitSchema>;

export const messageUpdateSchema = z.object({
  id: z.string().uuid(),
  status: messageStatus.optional(),
  notes: optionalText(),
});

// ----- Site content (key/value copy + images) -----
export const siteContentKindSchema = z.enum(["text", "richtext", "image", "url", "json"]);
export const siteContentInputSchema = z.object({
  key: z.string().trim().min(1).max(200).regex(/^[a-z0-9_.-]+$/i, "Key must be alphanumeric, dot, dash or underscore"),
  group_name: z.string().trim().min(1).max(80).default("general"),
  label: optionalText(200),
  description: optionalText(500),
  kind: siteContentKindSchema.default("text"),
  value_ar: optionalText(20_000),
  value_en: optionalText(20_000),
  image_url: optionalUrl,
  metadata: jsonObject,
  sort_order: z.number().int().default(0),
});
export type SiteContentInput = z.infer<typeof siteContentInputSchema>;
export type MessageUpdateInput = z.infer<typeof messageUpdateSchema>;
