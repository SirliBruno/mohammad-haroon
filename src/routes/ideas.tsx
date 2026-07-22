import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";

export const Route = createFileRoute("/ideas")({
  errorComponent: ({ reset }) => <RouteErrorBoundary reset={reset} eyebrow="المختبر" />,
  notFoundComponent: () => <RouteNotFoundBoundary eyebrow="المختبر" />,
  head: () => ({
    meta: buildMeta({
      title: "مختبر الأفكار",
      description: "مختبر لأفكار مستقبليّة، ونماذج أوّليّة، واستكشافات مفتوحة.",
      path: "/ideas",
    }),
  }),
  component: () => (
    <PageHeader eyebrow="المختبر" title="الأفكار" description="قريبًا." />
  ),
});
