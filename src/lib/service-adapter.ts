/**
 * Maps a Supabase `services` row to the UI `Service` shape used by
 * `/services` and `/services/$slug`. Keeps the presentation code agnostic
 * of database column casing and JSON structure.
 */
import type { Service } from "@/features/services/schema";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["services"]["Row"];

type WorkflowStep = { step: string; title: string; description: string };
type FaqEntry = { q: string; a: string };

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (typeof x === "string") return x;
      if (x && typeof x === "object") {
        const obj = x as Record<string, unknown>;
        return (
          (obj.title as string) ??
          (obj.name as string) ??
          (obj.label as string) ??
          (obj.text as string) ??
          ""
        );
      }
      return "";
    })
    .filter(Boolean);
}

function asWorkflow(v: unknown): WorkflowStep[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x, i) => {
      if (!x || typeof x !== "object") return null;
      const obj = x as Record<string, unknown>;
      const step =
        (obj.step as string) ??
        (obj.number as string) ??
        String(i + 1).padStart(2, "0");
      const title = (obj.title as string) ?? (obj.name as string) ?? "";
      const description =
        (obj.description as string) ??
        (obj.body as string) ??
        (obj.summary as string) ??
        "";
      if (!title && !description) return null;
      return { step, title: title || step, description };
    })
    .filter(Boolean) as WorkflowStep[];
}

function asFaq(v: unknown): FaqEntry[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!x || typeof x !== "object") return null;
      const obj = x as Record<string, unknown>;
      const q = (obj.q as string) ?? (obj.question as string) ?? "";
      const a = (obj.a as string) ?? (obj.answer as string) ?? "";
      if (!q || !a) return null;
      return { q, a };
    })
    .filter(Boolean) as FaqEntry[];
}

export function dbRowToService(
  row: Row,
  projectLookup: Record<string, { title: string; cover?: string }> = {},
): Service {
  const rawSlugs = Array.isArray(
    (row as unknown as Record<string, unknown>).featured_project_slugs,
  )
    ? ((row as unknown as Record<string, unknown>).featured_project_slugs as string[])
    : [];
  const featuredProjects = rawSlugs
    .filter((s): s is string => typeof s === "string" && s.length > 0)
    .slice(0, 3)
    .map((slug) => {
      const found = projectLookup[slug];
      return { slug, title: found?.title ?? slug, cover: found?.cover };
    });

  const phoneImage =
    (row as unknown as Record<string, unknown>).showcase_phone_image as string | null | undefined;
  const logoImage =
    (row as unknown as Record<string, unknown>).showcase_logo_image as string | null | undefined;
  const logoLabel =
    (row as unknown as Record<string, unknown>).showcase_logo_label as string | null | undefined;

  const hasShowcase =
    !!phoneImage || !!logoImage || !!logoLabel || featuredProjects.length > 0;

  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? row.tagline ?? "",
    icon: row.icon ?? undefined,
    overview: row.overview ?? undefined,
    benefits: asStringArray(row.benefits),
    features: asStringArray(row.features),
    workflow: asWorkflow(row.workflow),
    timeline: row.timeline ?? undefined,
    technologies: Array.isArray(row.technologies) ? (row.technologies as string[]) : [],
    deliverables: Array.isArray(row.deliverables) ? (row.deliverables as string[]) : [],
    faq: asFaq(row.faq),
    showcase: hasShowcase
      ? {
          phoneImage: phoneImage ?? undefined,
          logoImage: logoImage ?? undefined,
          logoLabel: logoLabel ?? undefined,
          featuredProjects,
        }
      : undefined,
  };
}
