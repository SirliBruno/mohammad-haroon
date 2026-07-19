import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import { adminListIdeas } from "@/lib/cms/admin-list.functions";
import { createIdea, updateIdea, deleteIdea } from "@/lib/cms/simple.functions";

export const Route = createFileRoute("/_authenticated/admin/ideas")({
  component: Page,
  head: () => ({ meta: [{ title: "إدارة الأفكار" }] }),
});

const STATUS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const FIELDS: FieldDef[] = [
  { name: "title", label: "العنوان", type: "text", required: true, colSpan: 2 },
  { name: "stage", label: "المرحلة", type: "text", help: "مثل: بذرة، قيد التطوير، جاهزة" },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "summary", label: "ملخص", type: "textarea", colSpan: 2 },
  { name: "body", label: "التفاصيل", type: "richtext", colSpan: 2, rows: 10 },
  { name: "tags", label: "الوسوم", type: "tags", colSpan: 2 },
];

function Page() {
  return (
    <AdminShell title="الأفكار" description="مسودات وأفكار مبكرة.">
      <AdminCrud
        entityName="فكرة"
        entityNamePlural="أفكار"
        fields={FIELDS}
        emptyValues={{ title: "", content_status: "draft", tags: [] }}
        listFn={adminListIdeas}
        createFn={createIdea}
        updateFn={updateIdea}
        deleteFn={deleteIdea}
        columns={[
          { header: "الفكرة", render: (r: any) => <div><div className="font-medium">{r.title}</div><div className="text-xs text-neutral-500 line-clamp-1">{r.summary}</div></div> },
          { header: "المرحلة", render: (r: any) => <span className="text-xs text-neutral-500">{r.stage ?? "—"}</span> },
          { header: "الحالة", render: (r: any) => <span className="text-xs">{r.content_status}</span> },
        ]}
      />
    </AdminShell>
  );
}
