import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef, type ListColumn } from "@/components/admin/admin-crud";
import {
  adminListHeroProjects,
  createHeroProject,
  updateHeroProject,
  deleteHeroProject,
} from "@/lib/cms/hero.functions";

export const Route = createFileRoute("/_authenticated/admin/hero")({
  component: AdminHeroPage,
  head: () => ({ meta: [{ title: "إدارة مشاريع الهيرو" }] }),
});

type Row = {
  id: string;
  title: string;
  host: string | null;
  category: string | null;
  year: number | null;
  status: "مباشر" | "قيد التطوير";
  accent: "emerald" | "amber" | "sky" | "violet";
  cover_url: string | null;
  mobile_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const fields: FieldDef[] = [
  { name: "title", label: "العنوان", type: "text", required: true },
  { name: "host", label: "النطاق (host)", type: "text", dir: "ltr" },
  { name: "category", label: "التصنيف", type: "text" },
  { name: "year", label: "السنة", type: "number", min: 1970, max: 2100 },
  {
    name: "status",
    label: "الحالة",
    type: "select",
    options: [
      { value: "مباشر", label: "مباشر" },
      { value: "قيد التطوير", label: "قيد التطوير" },
    ],
  },
  {
    name: "accent",
    label: "لون التمييز",
    type: "select",
    options: [
      { value: "emerald", label: "أخضر" },
      { value: "amber", label: "كهرماني" },
      { value: "sky", label: "سماوي" },
      { value: "violet", label: "بنفسجي" },
    ],
  },
  { name: "sort_order", label: "ترتيب الظهور", type: "number" },
  { name: "is_active", label: "ظاهر في الهيرو", type: "boolean" },
  {
    name: "cover_url",
    label: "صورة المتصفح (Desktop)",
    type: "image",
    folder: "hero",
    colSpan: 2,
    help: "المقاس المثالي 1600×1000 (نسبة 16:10).",
  },
  {
    name: "mobile_url",
    label: "صورة الجوال (S25 Ultra)",
    type: "image",
    folder: "hero",
    colSpan: 2,
    help: "المقاس المثالي 1170×2532 (نسبة 9:19.5).",
  },
];

const emptyValues: Record<string, unknown> = {
  title: "",
  host: "",
  category: "",
  year: new Date().getFullYear(),
  status: "مباشر",
  accent: "emerald",
  cover_url: "",
  mobile_url: "",
  is_active: true,
  sort_order: 0,
};

const columns: ListColumn<Row>[] = [
  {
    header: "الغلاف",
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
        {r.host && (
          <div className="text-[11px] text-neutral-500 truncate" dir="ltr">
            {r.host}
          </div>
        )}
      </div>
    ),
  },
  {
    header: "التصنيف",
    render: (r) => (
      <span className="text-xs text-neutral-600 dark:text-neutral-400">
        {r.category ?? "—"} · {r.year ?? "—"}
      </span>
    ),
  },
  {
    header: "الحالة",
    className: "w-28",
    render: (r) => (
      <div className="flex flex-col gap-1 text-[11px]">
        <span
          className={
            r.status === "مباشر"
              ? "inline-flex w-fit rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300"
              : "inline-flex w-fit rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300"
          }
        >
          {r.status}
        </span>
        {!r.is_active && (
          <span className="inline-flex w-fit rounded-full bg-neutral-500/10 px-2 py-0.5 text-neutral-600 dark:text-neutral-400">
            مخفي
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

function AdminHeroPage() {
  return (
    <AdminShell
      title="إدارة مشاريع الهيرو"
      description="الصور والعناوين هنا تظهر تلقائيًا داخل نوافذ الهيرو في الصفحة الرئيسية."
    >
      <AdminCrud<Row>
        entityName="مشروع هيرو"
        entityNamePlural="مشاريع هيرو"
        fields={fields}
        columns={columns}
        emptyValues={emptyValues}
        listFn={adminListHeroProjects as never}
        createFn={createHeroProject as never}
        updateFn={updateHeroProject as never}
        deleteFn={deleteHeroProject as never}
        fromForm={(form) => ({
          title: String(form.title ?? "").trim(),
          host: (form.host as string) || null,
          category: (form.category as string) || null,
          year: (form.year as number | null) ?? null,
          status: form.status,
          accent: form.accent,
          cover_url: (form.cover_url as string) || null,
          mobile_url: (form.mobile_url as string) || null,
          is_active: Boolean(form.is_active),
          sort_order: Number(form.sort_order ?? 0),
        })}
      />
    </AdminShell>
  );
}
