# CMS Layer

Scalable CRUD architecture over Lovable Cloud (Postgres + RLS) for 11 content
collections. Business logic lives in server functions; the UI only sees typed
DTOs and query hooks.

```
Browser (UI)
  └── @/features/cms  ← queryOptions + types + zod schemas
        └── @/lib/cms/*.functions.ts  ← createServerFn (RPC boundary)
              └── @/features/cms/repository.server.ts  ← Supabase data access
                    └── Postgres (RLS enforced)
```

## Collections

| Collection    | Slug          | Public read | Admin write |
| ------------- | ------------- | ----------- | ----------- |
| Projects      | `projects`    | published   | ✓           |
| Services      | `services`    | published   | ✓           |
| Certificates  | `certificates`| published   | ✓           |
| Experiences   | `experiences` | published   | ✓           |
| Skills        | `skills`      | published   | ✓           |
| Testimonials  | `testimonials`| published   | ✓           |
| Blog posts    | `blog_posts`  | published   | ✓           |
| Ideas         | `ideas`       | published   | ✓           |
| Products      | `products`    | published   | ✓           |
| Media         | `media`       | all         | ✓           |
| Messages      | `messages`    | admin only  | inbox only  |

Every content table has a `content_status` (`draft` / `published` / `archived`)
and shared timestamps (`created_at`, `updated_at`) maintained by triggers.

## Security model

- `public.user_roles` + `app_role` enum (`admin`, `editor`, `user`).
- Public reads: anon role, only rows where `content_status = 'published'`.
- Admin writes: authenticated + inline `EXISTS` check against `user_roles`.
- `messages` accepts anon inserts (contact form) with an email/length check
  in the RLS policy itself.

To grant yourself admin access after signing in, run once from the SQL editor:

```sql
insert into public.user_roles (user_id, role)
values ('<your auth user id>', 'admin')
on conflict do nothing;
```

## Using it from a route

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectListOptions } from "@/features/cms";

export const Route = createFileRoute("/work")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(projectListOptions({ featured: true })),
  component: WorkPage,
});

function WorkPage() {
  const { data } = useSuspenseQuery(projectListOptions({ featured: true }));
  return <ProjectGrid projects={data.rows} />;
}
```

## Mutations

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createProject } from "@/lib/cms/projects.functions";
import { cmsKeys } from "@/features/cms";

const create = useServerFn(createProject);
const qc = useQueryClient();
const mutation = useMutation({
  mutationFn: create,
  onSuccess: () => qc.invalidateQueries({ queryKey: cmsKeys.projects.all }),
});
```

## Extending

1. Add / alter columns in a migration.
2. Regenerate types are automatic — new fields appear in `Tables<"...">`.
3. Add fields to the matching zod schema in `schemas.ts`.
4. That's it — the generic repository handles the rest.
