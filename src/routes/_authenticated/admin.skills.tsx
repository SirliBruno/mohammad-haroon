import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import { adminListSkills } from "@/lib/cms/admin-list.functions";
import { createSkill, updateSkill, deleteSkill } from "@/lib/cms/simple.functions";

export const Route = createFileRoute("/_authenticated/admin/skills")({
  component: Page,
  head: () => ({ meta: [{ title: "إدارة المهارات" }] }),
});

const STATUS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const FIELDS: FieldDef[] = [
  { name: "name", label: "المهارة", type: "text", required: true },
  { name: "category", label: "الفئة", type: "text", help: "مثل: تصميم، تطوير، تسويق" },
  { name: "level", label: "المستوى (0-100)", type: "number", min: 0, max: 100 },
  { name: "years_experience", label: "سنوات الخبرة", type: "number", min: 0, max: 60, step: 0.5 },
  { name: "icon", label: "الأيقونة", type: "text", help: "اسم أيقونة (اختياري)" },
  { name: "color", label: "اللون", type: "text", help: "hex مثل #6366F1", dir: "ltr" },
  { name: "featured", label: "مميّز", type: "boolean" },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "sort_order", label: "الترتيب", type: "number" },
];

function Page() {
  return (
    <AdminShell title="المهارات" description="أدر قائمة المهارات ومستوى إتقانها.">
      <AdminCrud
        entityName="مهارة"
        entityNamePlural="مهارات"
        fields={FIELDS}
        emptyValues={{ name: "", featured: false, content_status: "published", sort_order: 0, level: 80 }}
        listFn={adminListSkills}
        createFn={createSkill}
        updateFn={updateSkill}
        deleteFn={deleteSkill}
        columns={[
          { header: "الاسم", render: (r: any) => <div className="font-medium">{r.name}</div> },
          { header: "الفئة", render: (r: any) => <span className="text-xs text-neutral-500">{r.category ?? "—"}</span> },
          { header: "المستوى", render: (r: any) => <span className="text-xs">{r.level != null ? `${r.level}%` : "—"}</span> },
        ]}
      />
    </AdminShell>
  );
}
