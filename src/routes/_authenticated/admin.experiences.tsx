import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import { adminListExperiences } from "@/lib/cms/admin-list.functions";
import { createExperience, updateExperience, deleteExperience } from "@/lib/cms/simple.functions";

export const Route = createFileRoute("/_authenticated/admin/experiences")({
  component: Page,
  head: () => ({ meta: [{ title: "إدارة الخبرات" }] }),
});

const EMPLOYMENT = [
  { value: "full_time", label: "دوام كامل" },
  { value: "part_time", label: "دوام جزئي" },
  { value: "contract", label: "عقد" },
  { value: "freelance", label: "عمل حر" },
  { value: "internship", label: "تدريب" },
];
const STATUS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const FIELDS: FieldDef[] = [
  { name: "company", label: "الشركة", type: "text", required: true },
  { name: "role", label: "المنصب", type: "text", required: true },
  { name: "location", label: "الموقع", type: "text" },
  { name: "employment_type", label: "نوع التوظيف", type: "select", options: EMPLOYMENT },
  { name: "started_on", label: "تاريخ البداية", type: "date", required: true },
  { name: "ended_on", label: "تاريخ النهاية", type: "date" },
  { name: "is_current", label: "أعمل هنا حاليًا", type: "boolean" },
  { name: "url", label: "رابط الشركة", type: "url", dir: "ltr" },
  { name: "logo_url", label: "شعار الشركة", type: "image", folder: "experiences", colSpan: 2 },
  { name: "summary", label: "ملخص الدور", type: "textarea", colSpan: 2 },
  { name: "highlights", label: "أبرز الإنجازات", type: "tags", colSpan: 2, help: "افصل بفواصل" },
  { name: "technologies", label: "التقنيات", type: "tags", colSpan: 2 },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "sort_order", label: "الترتيب", type: "number" },
];

function Page() {
  return (
    <AdminShell title="الخبرات" description="سجّل مسيرتك المهنية.">
      <AdminCrud
        entityName="خبرة"
        entityNamePlural="خبرات"
        fields={FIELDS}
        emptyValues={{ company: "", role: "", employment_type: "full_time", is_current: false, content_status: "published", sort_order: 0, highlights: [], technologies: [] }}
        listFn={adminListExperiences}
        createFn={createExperience}
        updateFn={updateExperience}
        deleteFn={deleteExperience}
        columns={[
          { header: "الدور", render: (r: any) => <div><div className="font-medium">{r.role}</div><div className="text-xs text-neutral-500">{r.company}</div></div> },
          { header: "المدة", render: (r: any) => <span className="text-xs text-neutral-500">{r.started_on} → {r.is_current ? "الآن" : (r.ended_on ?? "—")}</span> },
        ]}
      />
    </AdminShell>
  );
}
