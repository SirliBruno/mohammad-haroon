/**
 * Maps Supabase rows for `experiences`, `certificates`, and `skills` to
 * the UI shapes used by `/career`. Presentation code stays agnostic of DB
 * column casing and enums.
 */
import type { Database } from "@/integrations/supabase/types";
import type {
  ExperienceItem,
  CertificateItem,
  SkillGroup,
} from "@/data/career";

type ExpRow = Database["public"]["Tables"]["experiences"]["Row"];
type CertRow = Database["public"]["Tables"]["certificates"]["Row"];
type SkillRow = Database["public"]["Tables"]["skills"]["Row"];

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const EMPLOYMENT_LABEL: Record<string, ExperienceItem["type"]> = {
  full_time: "دوام كامل",
  part_time: "دوام كامل",
  contract: "عقد",
  freelance: "عمل حر",
  internship: "تدريب",
};

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (typeof x === "string") return x;
      if (x && typeof x === "object") {
        const o = x as Record<string, unknown>;
        return (o.text as string) ?? (o.title as string) ?? (o.name as string) ?? "";
      }
      return "";
    })
    .filter(Boolean);
}

export function dbRowToExperience(row: ExpRow): ExperienceItem {
  const start = formatMonthYear(row.started_on);
  const end = row.is_current
    ? "حتى الآن"
    : formatMonthYear(row.ended_on) || "";
  const period = [start, end].filter(Boolean).join(" — ");
  return {
    company: row.company,
    role: row.role,
    period: period || "",
    location: row.location ?? "",
    type: EMPLOYMENT_LABEL[row.employment_type as string] ?? "دوام كامل",
    summary: row.summary ?? "",
    highlights: asStringArray(row.highlights),
    stack: asStringArray(row.technologies),
  };
}

export function dbRowToCertificate(row: CertRow): CertificateItem {
  const year = row.issued_on
    ? String(new Date(row.issued_on).getFullYear())
    : "";
  return {
    name: row.title,
    issuer: row.issuer,
    year,
    credentialId: row.credential_id ?? undefined,
    href: row.credential_url ?? undefined,
  };
}

export function dbRowsToSkillGroups(rows: SkillRow[]): SkillGroup[] {
  const map = new Map<string, string[]>();
  for (const s of rows) {
    const key = s.category?.trim() || "عام";
    const arr = map.get(key) ?? [];
    arr.push(s.name);
    map.set(key, arr);
  }
  return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
}
