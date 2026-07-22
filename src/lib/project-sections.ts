/**
 * Section keys for the project detail page.
 * Order in this array = default rendering order when a project has no
 * custom `section_order` saved.
 */
export const PROJECT_SECTION_KEYS = [
  "spotlight",
  "problem",
  "goals",
  "research",
  "solution",
  "designProcess",
  "development",
  "stack",
  "gallery",
  "metrics",
  "highlights",
  "lessons",
  "testimonial",
] as const;

export type ProjectSectionKey = (typeof PROJECT_SECTION_KEYS)[number];

export const PROJECT_SECTION_LABELS: Record<ProjectSectionKey, string> = {
  spotlight: "قسم مميّز (Spotlight)",
  problem: "المشكلة",
  goals: "الأهداف",
  research: "البحث",
  solution: "الحل",
  designProcess: "عملية التصميم",
  development: "التطوير",
  stack: "التقنيات",
  gallery: "المعرض",
  metrics: "النتائج / المؤشرات",
  highlights: "أبرز المميزات",
  lessons: "الدروس المستفادة",
  testimonial: "رأي العميل",
};

export const PROJECT_SECTION_OPTIONS = PROJECT_SECTION_KEYS.map((value) => ({
  value,
  label: PROJECT_SECTION_LABELS[value],
}));

/** Normalize stored order: keep valid keys in order, append missing defaults. */
export function normalizeSectionOrder(input: unknown): ProjectSectionKey[] {
  const known = new Set<string>(PROJECT_SECTION_KEYS);
  const arr = Array.isArray(input) ? input.filter((v): v is string => typeof v === "string") : [];
  const seen = new Set<string>();
  const out: ProjectSectionKey[] = [];
  for (const k of arr) {
    if (known.has(k) && !seen.has(k)) {
      seen.add(k);
      out.push(k as ProjectSectionKey);
    }
  }
  for (const k of PROJECT_SECTION_KEYS) {
    if (!seen.has(k)) out.push(k);
  }
  return out;
}
