/**
 * CMS hooks barrel.
 *
 * Two layers:
 *   - Query hooks: thin wrappers over the `queryOptions` factories in
 *     `@/features/cms` so components read via `useSuspenseQuery` / `useQuery`.
 *   - Mutation hooks: bind server functions to react-query with the correct
 *     cache invalidation for their collection.
 *
 * UI code should import from `@/hooks/cms` — never from `@/lib/cms/*` directly.
 */
export * from "./use-cms-queries";
export * from "./use-cms-mutations";
export * from "./use-media-upload";
