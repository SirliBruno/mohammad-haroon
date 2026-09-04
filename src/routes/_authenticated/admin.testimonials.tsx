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
          { header: "الحالة", render: (r: any) => <StatusPill status={r.content_status} /> },
        ]}
      />
    </AdminShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    draft: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    archived: "bg-neutral-100 text-muted-foreground dark:bg-neutral-800 dark:text-muted-foreground",
  };
  const label: Record<string, string> = { published: "منشور", draft: "مسودة", archived: "مؤرشف" };
  return <span className={`rounded-full px-2 py-0.5 text-xs ${map[status] ?? ""}`}>{label[status] ?? status}</span>;
}
