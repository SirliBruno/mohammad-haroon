import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/writing/$slug")({
  head: ({ params }) => ({
    meta: buildMeta({
      title: params.slug,
      description: `Article: ${params.slug}.`,
      path: `/writing/${params.slug}`,
      type: "article",
    }),
  }),
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  return <PageHeader eyebrow="Article" title={slug} description="Coming soon." />;
}
