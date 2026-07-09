import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { site } from "@/config/site";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { articles } from "@/data/writing";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const base = site.url.replace(/\/$/, "");

        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/work", changefreq: "weekly", priority: "0.9" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/career", changefreq: "monthly", priority: "0.7" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/products", changefreq: "monthly", priority: "0.6" },
          { path: "/ideas", changefreq: "monthly", priority: "0.5" },
          { path: "/uses", changefreq: "monthly", priority: "0.5" },
        ];

        const dynamicEntries: SitemapEntry[] = [
          ...projects.map((p) => ({ path: `/work/${p.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
          ...services.map((s) => ({ path: `/services/${s.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
          ...articles.map((w) => ({ path: `/blog/${w.slug}`, changefreq: "monthly" as const, priority: "0.6" })),
        ];

        const urls = [...staticEntries, ...dynamicEntries].map((e) =>
          [
            `  <url>`,
            `    <loc>${base}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
