/**
 * Read-side hooks. Each maps to a `queryOptions` factory from `@/features/cms`
 * so loaders can `ensureQueryData` and components can `useSuspenseQuery`
 * against the same key.
 */
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  projectListOptions,
  projectBySlugOptions,
  serviceListOptions,
  serviceBySlugOptions,
  certificateListOptions,
  experienceListOptions,
  skillListOptions,
  testimonialListOptions,
  blogPostListOptions,
  blogPostBySlugOptions,
  ideaListOptions,
  productListOptions,
  productBySlugOptions,
  mediaListOptions,
} from "@/features/cms";
import type { ListParamsInput } from "@/features/cms/schemas";

type P = Partial<ListParamsInput>;

// Suspense variants — pair with a route loader `ensureQueryData` call.
export const useProjects = (p: P = {}) => useSuspenseQuery(projectListOptions(p));
export const useProject = (slug: string) => useSuspenseQuery(projectBySlugOptions(slug));
export const useServices = (p: P = {}) => useSuspenseQuery(serviceListOptions(p));
export const useService = (slug: string) => useSuspenseQuery(serviceBySlugOptions(slug));
export const useCertificates = (p: P = {}) => useSuspenseQuery(certificateListOptions(p));
export const useExperiences = (p: P = {}) => useSuspenseQuery(experienceListOptions(p));
export const useSkills = (p: P = {}) => useSuspenseQuery(skillListOptions(p));
export const useTestimonials = (p: P = {}) => useSuspenseQuery(testimonialListOptions(p));
export const useBlogPosts = (p: P = {}) => useSuspenseQuery(blogPostListOptions(p));
export const useBlogPost = (slug: string) => useSuspenseQuery(blogPostBySlugOptions(slug));
export const useIdeas = (p: P = {}) => useSuspenseQuery(ideaListOptions(p));
export const useProducts = (p: P = {}) => useSuspenseQuery(productListOptions(p));
export const useProduct = (slug: string) => useSuspenseQuery(productBySlugOptions(slug));
export const useMedia = (p: P = {}) => useSuspenseQuery(mediaListOptions(p));

// Non-suspense variants — for optional/deferred reads (dashboards, filters).
export const useProjectsQuery = (p: P = {}) => useQuery(projectListOptions(p));
export const useServicesQuery = (p: P = {}) => useQuery(serviceListOptions(p));
export const useBlogPostsQuery = (p: P = {}) => useQuery(blogPostListOptions(p));
export const useProductsQuery = (p: P = {}) => useQuery(productListOptions(p));
