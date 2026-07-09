import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/writing/")({
  head: () => ({
    meta: buildMeta({
      title: "Writing",
      description: "Essays and notes on product, design, and engineering craft.",
      path: "/writing",
    }),
  }),
  component: () => <PageHeader eyebrow="Writing" title="Writing" description="Coming soon." />,
});
