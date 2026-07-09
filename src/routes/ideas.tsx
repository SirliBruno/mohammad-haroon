import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: buildMeta({
      title: "مختبر الأفكار",
      description: "مختبر لأفكار مستقبليّة، ونماذج أوّليّة، واستكشافات مفتوحة.",
      path: "/ideas",
    }),
  }),
  component: () => (
    <PageHeader eyebrow="المختبر" title="الأفكار" description="قريبًا." />
  ),
});
