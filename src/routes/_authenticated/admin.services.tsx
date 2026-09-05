import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import { adminListServices } from "@/lib/cms/admin-list.functions";
import { createService, updateService, deleteService } from "@/lib/cms/services.functions";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: Page,
  head: () => ({ meta: [{ title: "إدارة الخدمات" }] }),
});

const STATUS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const FIELDS: FieldDef[] = [
  { name: "title", label: "اسم الخدمة", type: "text", required: true },
  { name: "slug", label: "المعرّف (slug)", type: "text", required: true, dir: "ltr", help: "أحرف إنجليزية صغيرة وشرطات فقط بدون مسافات (مثال: web-development)" },
  { name: "tagline", label: "الشعار المختصر", type: "text", colSpan: 2 },
  { name: "icon", label: "الأيقونة", type: "text", help: "اسم أيقونة اختياري" },
  { name: "timeline", label: "المدة الزمنية", type: "text", help: "مثال: 2-4 أسابيع" },
  { name: "cover_url", label: "صورة الغلاف", type: "image", folder: "services", colSpan: 2 },
  { name: "summary", label: "ملخص", type: "textarea", colSpan: 2 },
  { name: "overview", label: "نظرة عامة", type: "richtext", colSpan: 2, rows: 8 },
  { name: "technologies", label: "التقنيات", type: "tags", colSpan: 2 },
  { name: "deliverables", label: "المخرجات", type: "tags", colSpan: 2 },
  { name: "starting_price_cents", label: "السعر يبدأ من (ريال)", type: "number", min: 0, help: "مثال: 300 أو 500 ريال" },
  { name: "currency", label: "العملة", type: "text", dir: "ltr", placeholder: "SAR" },
  { name: "benefits", label: "المزايا (JSON)", type: "json", colSpan: 2, help: '["فائدة 1","فائدة 2"] أو [{"title":"...","description":"..."}]' },
  { name: "features", label: "الميزات (JSON)", type: "json", colSpan: 2 },
  { name: "workflow", label: "خطوات العمل (JSON)", type: "json", colSpan: 2, help: '[{"step":"البحث","description":"..."}]' },
  { name: "faq", label: "الأسئلة الشائعة (JSON)", type: "json", colSpan: 2, help: '[{"question":"...","answer":"..."}]' },
  { name: "featured", label: "مميّز", type: "boolean" },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "sort_order", label: "الترتيب", type: "number" },
  { name: "showcase_phone_image", label: "صورة الهاتف (Showcase)", type: "image", folder: "services", colSpan: 2, help: "لقطة شاشة تظهر داخل الأيفون في بطاقة الخدمة" },
  { name: "showcase_logo_image", label: "شعار التقنية (Showcase)", type: "image", folder: "services", help: "اختياري — بديل عن النص" },
  { name: "showcase_logo_label", label: "اسم التقنية", type: "text", help: "مثال: React، WordPress، Figma", dir: "ltr" },
  { name: "featured_project_slugs", label: "معرّفات المشاريع المميزة", type: "tags", colSpan: 2, help: "حتى 3 معرّفات (slug) — تظهر في أسفل البطاقة" },
];

function Page() {
  return (
    <AdminShell title="الخدمات" description="صفحات الخدمات: العرض والتفاصيل.">
      <AdminCrud
        entityName="خدمة"
        entityNamePlural="خدمات"
        fields={FIELDS}
        emptyValues={{ title: "", slug: "", currency: "SAR", featured: false, content_status: "published", technologies: [], deliverables: [], benefits: [], features: [], workflow: [], faq: [], sort_order: 0, featured_project_slugs: [] }}
        listFn={adminListServices}
        createFn={createService}
        updateFn={updateService}
        deleteFn={deleteService}
        columns={[
          {
            header: "الخدمة",
            render: (r: any) => (
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground" dir="ltr">/{r.slug}</div>
              </div>
            ),
          },
          {
            header: "المدة",
            render: (r: any) => <span className="text-xs text-muted-foreground">{r.timeline ?? "—"}</span>,
          },
          {
            header: "يبدأ من",
            render: (r: any) => (
              <span className="text-xs font-semibold tabular-nums">
                {r.starting_price_cents ? `${r.starting_price_cents} ${r.currency || "SAR"}` : "—"}
              </span>
            ),
          },
          {
            header: "الحالة",
            render: (r: any) => (
              <div className="flex flex-col gap-1 text-[11px]">
                <span
                  className={
                    r.content_status === "published"
                      ? "inline-flex w-fit rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300"
                      : r.content_status === "draft"
                        ? "inline-flex w-fit rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300"
                        : "inline-flex w-fit rounded-full bg-neutral-500/10 px-2 py-0.5 text-muted-foreground"
                  }
                >
                  {r.content_status === "published" ? "منشور" : r.content_status === "draft" ? "مسودة" : "مؤرشف"}
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
            render: (r: any) => <span className="text-xs tabular-nums text-muted-foreground">{r.sort_order ?? 0}</span>,
          },
        ]}
      />
    </AdminShell>
  );
}
