import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: buildMeta({
      title: "Products",
      description: "Products built and shipped by Mohammad Haroon.",
      path: "/products",
    }),
  }),
  component: () => <PageHeader eyebrow="Products" title="Products" description="Coming soon." />,
});
