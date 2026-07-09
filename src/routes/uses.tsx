import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/uses")({
  head: () => ({
    meta: buildMeta({
      title: "Uses",
      description: "Tools, stack, and gear used by Mohammad Haroon.",
      path: "/uses",
    }),
  }),
  component: () => <PageHeader eyebrow="Setup" title="Uses" description="Coming soon." />,
});
