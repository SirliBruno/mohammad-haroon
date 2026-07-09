import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/work/$slug")({
  head: ({ params }) => ({
    meta: buildMeta({
      title: params.slug,
      description: `Case study: ${params.slug}.`,
      path: `/work/${params.slug}`,
      type: "article",
    }),
  }),
  component: CaseStudy,
});

function CaseStudy() {
  const { slug } = Route.useParams();
  return <PageHeader eyebrow="Case study" title={slug} description="Coming soon." />;
}
