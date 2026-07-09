import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: buildMeta({
      title: "مختبر الأفكار",
      description: "مختبر للأفكار المستقبلية والنماذج الأولية والاستكشافات.",
      path: "/ideas",
    }),
  }),
  component: () => (
    <PageHeader eyebrow="المختبر" title="الأفكار" description="قريبًا." />
  ),
});
