import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";

export const Route = createFileRoute("/products")({
  errorComponent: ({ reset }) => <RouteErrorBoundary reset={reset} eyebrow="المنتجات" />,
  notFoundComponent: () => <RouteNotFoundBoundary eyebrow="المنتجات" />,
  head: () => ({
    meta: buildMeta({
      title: "المنتجات",
      description: "منتجات أطلقها محمد هارون بتصميم وتنفيذ خاصّ.",
      path: "/products",
    }),
  }),
  component: () => (
    <PageHeader eyebrow="المنتجات" title="المنتجات" description="قريبًا." />
  ),
});
