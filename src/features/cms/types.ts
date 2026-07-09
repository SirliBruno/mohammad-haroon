/**
 * Central CMS domain types.
 *
 * These are thin aliases over the generated Supabase Database types.
 * Import from here — never from `@/integrations/supabase/types` directly
 * in feature code. That keeps the UI decoupled from Supabase specifics.
 */
import type { Tables, TablesInsert, TablesUpdate, Enums } from "@/integrations/supabase/types";

// Enums
export type ContentStatus = Enums<"content_status">;
export type ProjectStatus = Enums<"project_status">;
export type EmploymentType = Enums<"employment_type">;
export type MessageStatus = Enums<"message_status">;
export type MediaKind = Enums<"media_kind">;
export type AppRole = Enums<"app_role">;

// ----- Row / Insert / Update per collection -----
export type Project = Tables<"projects">;
export type ProjectInsert = TablesInsert<"projects">;
export type ProjectUpdate = TablesUpdate<"projects">;

export type Service = Tables<"services">;
export type ServiceInsert = TablesInsert<"services">;
export type ServiceUpdate = TablesUpdate<"services">;

export type Certificate = Tables<"certificates">;
export type CertificateInsert = TablesInsert<"certificates">;
export type CertificateUpdate = TablesUpdate<"certificates">;

export type Experience = Tables<"experiences">;
export type ExperienceInsert = TablesInsert<"experiences">;
export type ExperienceUpdate = TablesUpdate<"experiences">;

export type Skill = Tables<"skills">;
export type SkillInsert = TablesInsert<"skills">;
export type SkillUpdate = TablesUpdate<"skills">;

export type Testimonial = Tables<"testimonials">;
export type TestimonialInsert = TablesInsert<"testimonials">;
export type TestimonialUpdate = TablesUpdate<"testimonials">;

export type BlogPost = Tables<"blog_posts">;
export type BlogPostInsert = TablesInsert<"blog_posts">;
export type BlogPostUpdate = TablesUpdate<"blog_posts">;

export type Idea = Tables<"ideas">;
export type IdeaInsert = TablesInsert<"ideas">;
export type IdeaUpdate = TablesUpdate<"ideas">;

export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;

export type MediaAsset = Tables<"media">;
export type MediaAssetInsert = TablesInsert<"media">;
export type MediaAssetUpdate = TablesUpdate<"media">;

export type Message = Tables<"messages">;
export type MessageInsert = TablesInsert<"messages">;
export type MessageUpdate = TablesUpdate<"messages">;

// ----- Shared list/query shape -----
export type ListParams = {
  limit?: number;
  offset?: number;
  featured?: boolean;
  status?: ContentStatus;
  search?: string;
  orderBy?: string;
  ascending?: boolean;
};

export type Paginated<T> = {
  rows: T[];
  count: number;
  limit: number;
  offset: number;
};

// Registry of all CMS collections — single source of truth for tooling.
export const CMS_COLLECTIONS = [
  "projects",
  "services",
  "certificates",
  "experiences",
  "skills",
  "testimonials",
  "blog_posts",
  "ideas",
  "products",
  "media",
  "messages",
] as const;

export type CmsCollection = (typeof CMS_COLLECTIONS)[number];
