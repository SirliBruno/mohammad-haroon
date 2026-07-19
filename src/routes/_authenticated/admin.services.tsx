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
  { name: "slug", label: "المعرّف (slug)", type: "text", required: true, dir: "ltr" },
  { name: "tagline", label: "الشعار المختصر", type: "text", colSpan: 2 },
  { name: "icon", label: "الأيقونة", type: "text", help: "اسم أيقونة اختياري" },
  { name: "timeline", label: "المدة الزمنية", type: "text", help: "مثال: 2-4 أسابيع" },
  { name: "cover_url", label: "صورة الغلاف", type: "image", folder: "services", colSpan: 2 },
  { name: "summary", label: "ملخص", type: "textarea", colSpan: 2 },
  { name: "overview", label: "نظرة عامة", type: "richtext", colSpan: 2, rows: 8 },
  { name: "technologies", label: "التقنيات", type: "tags", colSpan: 2 },
  { name: "deliverables", label: "المخرجات", type: "tags", colSpan: 2 },
  { name: "starting_price_cents", label: "السعر يبدأ من (بالسنت)", type: "number", min: 0 },
  { name: "currency", label: "العملة", type: "text", dir: "ltr" },
  { name: "benefits", label: "المزايا (JSON)", type: "json", colSpan: 2, help: '["فائدة 1","فائدة 2"] أو [{"title":"...","description":"..."}]' },
  { name: "features", label: "الميزات (JSON)", type: "json", colSpan: 2 },
  { name: "workflow", label: "خطوات العمل (JSON)", type: "json", colSpan: 2, help: '[{"step":"البحث","description":"..."}]' },
  { name: "faq", label: "الأسئلة الشائعة (JSON)", type: "json", colSpan: 2, help: '[{"question":"...","answer":"..."}]' },
  { name: "featured", label: "مميّز", type: "boolean" },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "sort_order", label: "الترتيب", type: "number" },
];

function Page() {
  return (
    <AdminShell title="الخدمات" description="صفحات الخدمات: العرض والتفاصيل.">
      <AdminCrud
        entityName="خدمة"
        entityNamePlural="خدمات"
        fields={FIELDS}
        emptyValues={{ title: "", slug: "", currency: "USD", featured: false, content_status: "draft", technologies: [], deliverables: [], benefits: [], features: [], workflow: [], faq: [], sort_order: 0 }}
        listFn={adminListServices}
        createFn={createService}
        updateFn={updateService}
        deleteFn={deleteService}
        columns={[
          { header: "الخدمة", render: (r: any) => <div><div className="font-medium">{r.title}</div><div className="text-xs text-neutral-500" dir="ltr">/{r.slug}</div></div> },
          { header: "المدة", render: (r: any) => <span className="text-xs text-neutral-500">{r.timeline ?? "—"}</span> },
          { header: "الحالة", render: (r: any) => <span className="text-xs">{r.content_status}</span> },
        ]}
      />
    </AdminShell>
  );
}
