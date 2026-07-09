import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/uses")({
  head: () => ({
    meta: buildMeta({
      title: "أدواتي",
      description: "الأدوات والبرامج والمعدّات التي أستخدمها في العمل اليومي.",
      path: "/uses",
    }),
  }),
  component: () => (
    <PageHeader eyebrow="بيئة العمل" title="الأدوات" description="قريبًا." />
  ),
});
