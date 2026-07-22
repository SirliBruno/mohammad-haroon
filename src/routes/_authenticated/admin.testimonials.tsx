import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import { adminListTestimonials } from "@/lib/cms/admin-list.functions";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/cms/simple.functions";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: Page,
  head: () => ({ meta: [{ title: "إدارة التوصيات" }] }),
});

const STATUS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const FIELDS: FieldDef[] = [
  { name: "author_name", label: "اسم العميل", type: "text", required: true },
  { name: "author_role", label: "المنصب", type: "text" },
  { name: "author_company", label: "الشركة", type: "text" },
  { name: "avatar_url", label: "الصورة الشخصية", type: "image", folder: "testimonials" },
  { name: "rating", label: "التقييم (1-5)", type: "number", min: 1, max: 5 },
  { name: "quote", label: "نص التوصية", type: "textarea", required: true, colSpan: 2, rows: 5 },
  { name: "featured", label: "مميّز", type: "boolean" },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "sort_order", label: "الترتيب", type: "number" },
];

function Page() {
  return (
    <AdminShell title="التوصيات" description="شهادات العملاء والتقييمات.">
      <AdminCrud
        entityName="توصية"
        entityNamePlural="توصيات"
        fields={FIELDS}
        emptyValues={{ author_name: "", quote: "", featured: false, content_status: "published", sort_order: 0, rating: 5 }}
        listFn={adminListTestimonials}
        createFn={createTestimonial}
        updateFn={updateTestimonial}
        deleteFn={deleteTestimonial}
        columns={[
          { header: "العميل", render: (r: any) => <div><div className="font-medium">{r.author_name}</div><div className="text-xs text-muted-foreground">{[r.author_role, r.author_company].filter(Boolean).join(" · ")}</div></div> },
          { header: "النص", render: (r: any) => <div className="text-xs text-muted-foreground dark:text-muted-foreground line-clamp-2 max-w-md">{r.quote}</div> },
          { header: "التقييم", render: (r: any) => <span className="text-xs">{"★".repeat(r.rating ?? 0)}</span> },
        ]}
      />
    </AdminShell>
  );
}
