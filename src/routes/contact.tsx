import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: buildMeta({
      title: "Contact",
      description: "Get in touch about hiring, freelance projects, or collaborations.",
      path: "/contact",
    }),
  }),
  component: () => (
    <PageHeader
      eyebrow="Contact"
      title="Let's talk"
      description="Coming soon."
    />
  ),
});
