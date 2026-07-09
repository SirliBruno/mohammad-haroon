import { seoDefaults } from "@/config/seo";
import { site } from "@/config/site";

export type MetaInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
};

export function buildMeta(input: MetaInput = {}) {
  const title = seoDefaults.titleTemplate(input.title);
  const description = input.description ?? seoDefaults.description;
  const url = input.path ? `${site.url}${input.path}` : site.url;
  const type = input.type ?? seoDefaults.ogType;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "author", content: site.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { name: "twitter:card", content: seoDefaults.twitterCard },
    { name: "twitter:site", content: seoDefaults.twitterSite },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (input.image) {
    meta.push({ property: "og:image", content: input.image });
    meta.push({ name: "twitter:image", content: input.image });
  }
  if (input.noindex) {
    meta.push({ name: "robots", content: "noindex" });
  }
  return meta;
}
