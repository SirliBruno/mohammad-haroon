import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: buildMeta({
      title: "Ideas",
      description: "A lab of future ideas, prototypes, and explorations.",
      path: "/ideas",
    }),
  }),
  component: () => <PageHeader eyebrow="Lab" title="Ideas" description="Coming soon." />,
});
