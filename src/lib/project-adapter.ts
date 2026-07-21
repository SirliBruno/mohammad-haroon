/**
 * Adapter: DB `projects` row → the file-schema `Project` shape used by
 * the public UI (`work.index`, `work.$slug`, related/next cards, etc.).
 *
 * Keeps all the presentation components untouched while switching the
 * data source from `src/data/projects.ts` to the CMS.
 */
import type { Tables } from "@/integrations/supabase/types";
import { projectCategories, type Project, type ProjectCategory } from "@/features/projects/schema";

type Row = Tables<"projects">;

function mapCategory(value: string | null | undefined): ProjectCategory {
  const list = projectCategories as readonly string[];
  if (value && list.includes(value)) return value as ProjectCategory;
  return projectCategories[0];
}

function mapStatus(value: string | null | undefined): Project["status"] {
  switch (value) {
    case "in_progress":
      return "in-progress";
    case "live":
    case "archived":
    case "concept":
      return value;
    default:
      return "live";
  }
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}
function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length ? v : undefined;
}

function mapGallery(v: unknown): Project["gallery"] {
  if (!Array.isArray(v)) return [];
  return v
    .map((it) => {
      const r = asRecord(it);
      if (!r) return null;
      const src = str(r.src) ?? str(r.url);
      if (!src) return null;
      return {
        src,
        alt: str(r.alt) ?? "",
        width: typeof r.width === "number" ? r.width : undefined,
        height: typeof r.height === "number" ? r.height : undefined,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
}

function mapMetrics(v: unknown): { label: string; value: string }[] | undefined {
  if (!Array.isArray(v) || v.length === 0) return undefined;
  const out = v
    .map((it) => {
      const r = asRecord(it);
      if (!r) return null;
      const label = str(r.label);
      const value = str(r.value) ?? (typeof r.value === "number" ? String(r.value) : undefined);
      if (!label || !value) return null;
      return { label, value };
    })
    .filter((x): x is { label: string; value: string } => Boolean(x));
  return out.length ? out : undefined;
}

function mapTestimonial(v: unknown): Project["testimonial"] {
  const r = asRecord(v);
  if (!r) return undefined;
  const quote = str(r.quote);
  const author = str(r.author);
  if (!quote || !author) return undefined;
  return { quote, author, role: str(r.role) };
}

function mapDesignProcess(v: string | null): Project["designProcess"] {
  if (!v) return undefined;
  const trimmed = v.trim();
  if (!trimmed.startsWith("[")) return undefined;
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return undefined;
    const out = parsed
      .map((it) => {
        const r = asRecord(it);
        if (!r) return null;
        const title = str(r.title);
        const description = str(r.description);
        if (!title || !description) return null;
        return { title, description };
      })
      .filter((x): x is { title: string; description: string } => Boolean(x));
    return out.length ? out : undefined;
  } catch {
    return undefined;
  }
}

/** Map a `projects` DB row into the public `Project` shape. */
export function toProject(row: Row): Project {
  const metrics = mapMetrics(row.metrics) ?? mapMetrics(row.results);
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    description: row.description ?? row.summary ?? "",
    role: row.role ?? "",
    client: row.client ?? undefined,
    year: row.year ?? new Date().getFullYear(),
    category: mapCategory(row.category),
    tags: row.tags ?? [],
    stack: row.technologies ?? [],
    tools: undefined,
    timeline: row.timeline ?? undefined,
    cover: { src: row.cover_url ?? "", alt: row.title },
    gallery: mapGallery(row.gallery),
    metrics,
    github: row.github_url ?? undefined,
    liveDemo: row.live_url ?? undefined,
    problem: row.problem ?? undefined,
    goals: row.goals && row.goals.length ? row.goals : undefined,
    research: row.research ?? undefined,
    solution: row.solution ?? undefined,
    designProcess: mapDesignProcess(row.design_process),
    development: row.development ?? undefined,
    lessons: row.lessons && row.lessons.length ? row.lessons : undefined,
    highlights: row.highlights && row.highlights.length ? row.highlights : undefined,
    sectionOrder: Array.isArray(row.section_order) && row.section_order.length ? row.section_order : undefined,
    testimonial: mapTestimonial(row.testimonial),
    featured: Boolean(row.featured),
    status: mapStatus(row.status),
  };
}
