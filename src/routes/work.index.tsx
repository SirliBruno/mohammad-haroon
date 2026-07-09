import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: buildMeta({
      title: "Work",
      description: "Selected projects and case studies by Mohammad Haroon.",
      path: "/work",
    }),
  }),
  component: () => <PageHeader eyebrow="Work" title="Selected work" description="Coming soon." />,
});
