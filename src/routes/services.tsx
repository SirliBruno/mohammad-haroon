import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: buildMeta({
      title: "Services",
      description: "Freelance engagement models — project work, retainers, and advisory.",
      path: "/services",
    }),
  }),
  component: () => <PageHeader eyebrow="Services" title="Ways to work together" description="Coming soon." />,
});
