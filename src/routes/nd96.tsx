import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { Saudi96LandingPage } from "./saudi96";

export const Route = createFileRoute("/nd96")({
  head: () => ({
    meta: buildMeta({
      title: "عرض اليوم الوطني السعودي 96 | موقعك التعريفي بـ 296 ريال فقط",
      description:
        "عرض استثنائي بمناسبة اليوم الوطني السعودي 96: موقعك التعريفي شغال خلال 48 ساعة فقط بـ 296 ريال بدلاً من 650 ريال.",
      path: "/nd96",
    }),
  }),
  component: Saudi96LandingPage,
});
