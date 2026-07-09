import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      title: "About",
      description: "The story, principles, and background behind Mohammad Haroon.",
      path: "/about",
    }),
  }),
  component: () => <PageHeader eyebrow="About" title="About" description="Coming soon." />,
});
