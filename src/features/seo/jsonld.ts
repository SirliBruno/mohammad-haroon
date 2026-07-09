import { site } from "@/config/site";
import { socials } from "@/config/socials";

export const personJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
});
