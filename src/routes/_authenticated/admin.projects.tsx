import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef, type ListColumn } from "@/components/admin/admin-crud";
import {
  adminListProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/cms/projects.functions";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: AdminProjectsPage,
  head: () => ({ meta: [{ title: "إدارة المشاريع" }] }),
});

type Row = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  year: number | null;
  content_status: "draft" | "published" | "archived";
  status: "concept" | "in_progress" | "live" | "archived";
  featured: boolean;
  sort_order: number;
  cover_url: string | null;
  live_url: string | null;
  github_url: string | null;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fields: FieldDef[] = [
  // ——— أساسيات ———
  { name: "title", label: "العنوان", type: "text", required: true },
  {
    name: "slug",
    label: "المعرّف (slug)",
    type: "text",
    dir: "ltr",
    help: "يُشتق تلقائيًا من العنوان إذا تُرك فارغًا.",
  },
  { name: "category", label: "التصنيف", type: "text" },
  { name: "year", label: "السنة", type: "number", min: 1970, max: 2100 },
  {
    name: "status",
    label: "حالة المشروع",
    type: "select",
    options: [
      { value: "live", label: "مباشر" },
      { value: "in_progress", label: "قيد التنفيذ" },
      { value: "concept", label: "تصوّر" },
      { value: "archived", label: "مؤرشف" },
    ],
  },
  {
    name: "content_status",
    label: "حالة النشر",
    type: "select",
    options: [
      { value: "published", label: "منشور" },
      { value: "draft", label: "مسودة" },
      { value: "archived", label: "مؤرشف" },
    ],
  },
  { name: "sort_order", label: "ترتيب الظهور", type: "number" },
  { name: "featured", label: "عرض ضمن المميّزة", type: "boolean" },

  // ——— معلومات موجزة ———
  { name: "summary", label: "الملخّص", type: "textarea", colSpan: 2, rows: 3 },
  { name: "role", label: "دوري في المشروع", type: "text" },
  { name: "client", label: "العميل", type: "text" },
  { name: "timeline", label: "المدة الزمنية", type: "text" },
  { name: "live_url", label: "الرابط المباشر", type: "url", dir: "ltr" },
  { name: "github_url", label: "رابط GitHub", type: "url", dir: "ltr" },
  {
    name: "cover_url",
    label: "صورة الغلاف",
    type: "image",
    folder: "projects",
    colSpan: 2,
    help: "المقاس المثالي 1600×1000 (نسبة 16:10).",
  },
  {
    name: "tags",
    label: "الوسوم",
    type: "tags",
    colSpan: 2,
    help: "اضغط Enter لإضافة وسم.",
  },
  {
    name: "technologies",
    label: "التقنيات المستخدمة",
    type: "tags",
    colSpan: 2,
    help: "مثال: React, TypeScript, Tailwind.",
  },

  // ——— أقسام تفاصيل المشروع (اختياري) ———
  {
    name: "description",
    label: "نظرة عامة موسّعة",
    type: "textarea",
    colSpan: 2,
    rows: 5,
    help: "وصف تفصيلي يظهر في صفحة تفاصيل المشروع.",
  },
  {
    name: "problem",
    label: "المشكلة",
    type: "textarea",
    colSpan: 2,
    rows: 4,
    help: "ما التحدي الذي كان يواجه العميل؟",
  },
  {
    name: "goals",
    label: "الأهداف",
    type: "tags",
    colSpan: 2,
    help: "أضف هدفًا في كل سطر (Enter للفصل).",
  },
  {
    name: "research",
    label: "البحث والاكتشاف",
    type: "textarea",
    colSpan: 2,
    rows: 4,
  },
  {
    name: "solution",
    label: "الحل",
    type: "textarea",
    colSpan: 2,
    rows: 4,
  },
  {
    name: "design_process",
    label: "مسار التصميم",
    type: "textarea",
    colSpan: 2,
    rows: 4,
    help: "يمكن كتابته كنص عادي أو JSON لمصفوفة {title, description}.",
  },
  {
    name: "development",
    label: "التطوير والتنفيذ",
    type: "textarea",
    colSpan: 2,
    rows: 4,
  },
  {
    name: "lessons",
    label: "الدروس المستفادة",
    type: "tags",
    colSpan: 2,
  },

  // ——— بيانات مهيكلة ———
  {
    name: "metrics",
    label: "المؤشرات (Metrics)",
    type: "structured",
    colSpan: 2,
    addLabel: "+ إضافة مؤشر",
    schema: [
      { name: "label", label: "التسمية", placeholder: "مثال: زمن أول رؤية" },
      { name: "value", label: "القيمة", placeholder: "مثال: -93%" },
    ],
  },
  {
    name: "results",
    label: "النتائج",
    type: "structured",
    colSpan: 2,
    addLabel: "+ إضافة نتيجة",
    schema: [
      { name: "label", label: "التسمية", placeholder: "مثال: NPS" },
      { name: "value", label: "القيمة", placeholder: "مثال: 72" },
    ],
  },
  {
    name: "gallery",
    label: "معرض الصور",
    type: "gallery",
    folder: "projects/gallery",
    colSpan: 2,
    help: "ارفع صورًا متعددة، وأضف نصًا بديلًا لكل صورة.",
  },
  {
    name: "testimonial",
    label: "شهادة العميل",
    type: "object",
    colSpan: 2,
    schema: [
      { name: "quote", label: "الاقتباس", type: "textarea", placeholder: "نص الشهادة…" },
      { name: "author", label: "الاسم", placeholder: "اسم العميل" },
      { name: "role", label: "المسمى", placeholder: "الرئيس التنفيذي، شركة …" },
    ],
  },
];

const emptyValues: Record<string, unknown> = {
  slug: "",
  title: "",
  summary: "",
  category: "",
  year: new Date().getFullYear(),
  status: "live",
  content_status: "published",
  featured: false,
  sort_order: 0,
  cover_url: "",
  live_url: "",
  github_url: "",
  role: "",
  client: "",
  timeline: "",
  tags: [],
  technologies: [],
  description: "",
  problem: "",
  goals: [],
  research: "",
  solution: "",
  design_process: "",
  development: "",
  lessons: [],
  metrics: [],
  results: [],
  gallery: [],
  testimonial: null,
};

const columns: ListColumn<Row>[] = [
  {
    header: "الصورة",
    className: "w-24",
    render: (r) =>
      r.cover_url ? (
        <img
          src={r.cover_url}
          alt=""
          className="h-12 w-20 rounded border border-neutral-200 object-cover dark:border-neutral-800"
        />
      ) : (
        <div className="h-12 w-20 rounded border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800" />
      ),
  },
  {
    header: "العنوان",
    render: (r) => (
      <div className="min-w-0">
        <div className="font-medium truncate">{r.title}</div>
        <div className="text-[11px] text-neutral-500 truncate" dir="ltr">
          /{r.slug}
        </div>
      </div>
    ),
  },
  {
    header: "التصنيف",
    render: (r) => (
      <span className="text-xs text-neutral-600 dark:text-neutral-400">
        {r.category ?? "—"}
      </span>
    ),
  },
  {
    header: "السنة",
    className: "w-16",
    render: (r) => (
      <span className="text-xs text-neutral-600 dark:text-neutral-400">
        {r.year ?? "—"}
      </span>
    ),
  },
  {
    header: "الحالة",
    className: "w-32",
    render: (r) => (
      <div className="flex flex-col gap-1 text-[11px]">
        <span
          className={
            r.content_status === "published"
              ? "inline-flex w-fit rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300"
              : r.content_status === "draft"
                ? "inline-flex w-fit rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300"
                : "inline-flex w-fit rounded-full bg-neutral-500/10 px-2 py-0.5 text-neutral-600 dark:text-neutral-400"
          }
        >
          {r.content_status === "published"
            ? "منشور"
            : r.content_status === "draft"
              ? "مسودة"
              : "مؤرشف"}
        </span>
        {r.featured && (
          <span className="inline-flex w-fit rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300">
            مميّز
          </span>
        )}
      </div>
    ),
  },
  {
    header: "ترتيب",
    className: "w-14",
    render: (r) => (
      <span className="text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
        {r.sort_order}
      </span>
    ),
  },
];

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : [];

const asJsonOrNull = (v: unknown, fallback: unknown = null): unknown => {
  if (v === undefined || v === null) return fallback;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return fallback;
    try {
      return JSON.parse(s);
    } catch {
      throw new Error("تنسيق JSON غير صالح — تأكد من صحة الأقواس وعلامات الاقتباس.");
    }
  }
  return v ?? fallback;
};

function AdminProjectsPage() {
  return (
    <AdminShell
      title="إدارة المشاريع"
      description="أضف وعدّل واحذف مشاريعك، وتحكّم بترتيب ظهورها في صفحة الأعمال."
    >
      <AdminCrud<Row>
        entityName="مشروع"
        entityNamePlural="مشاريع"
        fields={fields}
        columns={columns}
        emptyValues={emptyValues}
        listFn={adminListProjects as never}
        createFn={createProject as never}
        updateFn={updateProject as never}
        deleteFn={deleteProject as never}
        fromForm={(form) => {
          const title = String(form.title ?? "").trim();
          const slug = String(form.slug ?? "").trim() || slugify(title);
          return {
            slug,
            title,
            summary: (form.summary as string) || null,
            description: (form.description as string) || null,
            category: (form.category as string) || null,
            year: (form.year as number | null) ?? null,
            status: form.status,
            content_status: form.content_status,
            featured: Boolean(form.featured),
            sort_order: Number(form.sort_order ?? 0),
            cover_url: (form.cover_url as string) || null,
            live_url: (form.live_url as string) || null,
            github_url: (form.github_url as string) || null,
            role: (form.role as string) || null,
            client: (form.client as string) || null,
            timeline: (form.timeline as string) || null,
            tags: asStringArray(form.tags),
            technologies: asStringArray(form.technologies),
            problem: (form.problem as string) || null,
            goals: asStringArray(form.goals),
            research: (form.research as string) || null,
            solution: (form.solution as string) || null,
            design_process: (form.design_process as string) || null,
            development: (form.development as string) || null,
            lessons: asStringArray(form.lessons),
            metrics: Array.isArray(form.metrics) ? (form.metrics as unknown[]) : [],
            results: Array.isArray(form.results) ? (form.results as unknown[]) : [],
            gallery: Array.isArray(form.gallery) ? (form.gallery as unknown[]) : [],
            testimonial:
              form.testimonial && typeof form.testimonial === "object" && !Array.isArray(form.testimonial)
                ? (form.testimonial as Record<string, unknown>)
                : null,
          };
        }}
      />
    </AdminShell>
  );
}
      />
    </AdminShell>
  );
}
