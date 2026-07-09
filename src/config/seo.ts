import { site } from "./site";

export const seoDefaults = {
  titleTemplate: (t?: string) => (t ? `${t} — ${site.name}` : `${site.name} — ${site.role}`),
  description: site.description,
  ogType: "website" as const,
  twitterCard: "summary_large_image" as const,
  twitterSite: "@mharoon",
};
