/**
 * TanStack Query bindings for the CMS server functions.
 *
 * Convention:
 *   cmsKeys.<collection>.list(params) / .detail(idOrSlug)
 *
 * Loaders prime the cache with `context.queryClient.ensureQueryData(...)`
 * and components read with `useSuspenseQuery(...)`.
 */
import { queryOptions } from "@tanstack/react-query";
import type { ListParamsInput } from "./schemas";

import { listProjects, getProjectBySlug } from "@/lib/cms/projects.functions";
import { listServices, getServiceBySlug } from "@/lib/cms/services.functions";
import {
  listCertificates,
  listExperiences,
  listSkills,
  listTestimonials,
  listBlogPosts,
  getBlogPostBySlug,
  listIdeas,
  listProducts,
  getProductBySlug,
} from "@/lib/cms/simple.functions";
import { listMedia } from "@/lib/cms/media.functions";

const asData = <T,>(data: T) => ({ data }) as { data: T };

export const cmsKeys = {
  projects: {
    all: ["cms", "projects"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "projects", "list", p] as const,
    detail: (slug: string) => ["cms", "projects", "detail", slug] as const,
  },
  services: {
    all: ["cms", "services"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "services", "list", p] as const,
    detail: (slug: string) => ["cms", "services", "detail", slug] as const,
  },
  certificates: {
    all: ["cms", "certificates"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "certificates", "list", p] as const,
  },
  experiences: {
    all: ["cms", "experiences"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "experiences", "list", p] as const,
  },
  skills: {
    all: ["cms", "skills"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "skills", "list", p] as const,
  },
  testimonials: {
    all: ["cms", "testimonials"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "testimonials", "list", p] as const,
  },
  blogPosts: {
    all: ["cms", "blog_posts"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "blog_posts", "list", p] as const,
    detail: (slug: string) => ["cms", "blog_posts", "detail", slug] as const,
  },
  ideas: {
    all: ["cms", "ideas"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "ideas", "list", p] as const,
  },
  products: {
    all: ["cms", "products"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "products", "list", p] as const,
    detail: (slug: string) => ["cms", "products", "detail", slug] as const,
  },
  media: {
    all: ["cms", "media"] as const,
    list: (p: Partial<ListParamsInput> = {}) => ["cms", "media", "list", p] as const,
  },
} as const;

// ----- queryOptions factories -----
export const projectListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.projects.list(params),
    queryFn: () => listProjects(asData(params)),
  });

export const projectBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: cmsKeys.projects.detail(slug),
    queryFn: () => getProjectBySlug(asData({ slug })),
  });

export const serviceListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.services.list(params),
    queryFn: () => listServices(asData(params)),
  });

export const serviceBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: cmsKeys.services.detail(slug),
    queryFn: () => getServiceBySlug(asData({ slug })),
  });

export const certificateListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.certificates.list(params),
    queryFn: () => listCertificates(asData(params)),
  });

export const experienceListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.experiences.list(params),
    queryFn: () => listExperiences(asData(params)),
  });

export const skillListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.skills.list(params),
    queryFn: () => listSkills(asData(params)),
  });

export const testimonialListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.testimonials.list(params),
    queryFn: () => listTestimonials(asData(params)),
  });

export const blogPostListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.blogPosts.list(params),
    queryFn: () => listBlogPosts(asData(params)),
  });

export const blogPostBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: cmsKeys.blogPosts.detail(slug),
    queryFn: () => getBlogPostBySlug(asData({ slug })),
  });

export const ideaListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.ideas.list(params),
    queryFn: () => listIdeas(asData(params)),
  });

export const productListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.products.list(params),
    queryFn: () => listProducts(asData(params)),
  });

export const productBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: cmsKeys.products.detail(slug),
    queryFn: () => getProductBySlug(asData({ slug })),
  });

export const mediaListOptions = (params: Partial<ListParamsInput> = {}) =>
  queryOptions({
    queryKey: cmsKeys.media.list(params),
    queryFn: () => listMedia(asData(params)),
  });
