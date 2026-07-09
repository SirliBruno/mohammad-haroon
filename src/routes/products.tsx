import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: buildMeta({
      title: "المنتجات",
      description: "منتجات صمّمها وأطلقها محمد هارون.",
      path: "/products",
    }),
  }),
  component: () => (
    <PageHeader eyebrow="المنتجات" title="المنتجات" description="قريبًا." />
  ),
});
