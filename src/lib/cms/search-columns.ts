/**
 * Free-text search columns per collection. Client-safe (plain data).
 * Consumed by the CMS server functions via imports so the RPC splitter
 * doesn't complain about sibling references in handler bodies.
 */
export const SEARCH_COLUMNS = {
  projects: ["title", "summary", "category"],
  services: ["title", "tagline", "summary"],
  certificates: ["title", "issuer"],
  experiences: ["company", "role", "summary"],
  skills: ["name", "category"],
  testimonials: ["author_name", "author_company", "quote"],
  blog_posts: ["title", "excerpt", "category"],
  ideas: ["title", "summary"],
  products: ["name", "tagline", "description"],
  media: ["filename", "alt", "caption"],
  messages: ["name", "email", "message"],
  site_content: ["key", "group_name", "label", "value_ar", "value_en"],
} as const;
