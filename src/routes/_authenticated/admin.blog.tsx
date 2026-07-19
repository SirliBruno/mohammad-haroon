import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import { adminListBlogPosts } from "@/lib/cms/admin-list.functions";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/cms/simple.functions";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: Page,
  head: () => ({ meta: [{ title: "إدارة المدونة" }] }),
});

const STATUS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const FIELDS: FieldDef[] = [
  { name: "title", label: "العنوان", type: "text", required: true, colSpan: 2 },
  { name: "slug", label: "المعرّف (slug)", type: "text", required: true, dir: "ltr", help: "بالإنجليزية بدون مسافات، مثل: my-first-post" },
  { name: "category", label: "الفئة", type: "text" },
  { name: "cover_url", label: "صورة الغلاف", type: "image", folder: "blog", colSpan: 2 },
  { name: "excerpt", label: "المقتطف", type: "textarea", colSpan: 2, rows: 3 },
  { name: "content", label: "المحتوى (Markdown)", type: "richtext", colSpan: 2, rows: 14 },
  { name: "tags", label: "الوسوم", type: "tags", colSpan: 2 },
  { name: "reading_minutes", label: "دقائق القراءة", type: "number", min: 1, max: 240 },
  { name: "published_at", label: "تاريخ النشر", type: "datetime" },
  { name: "featured", label: "مميّز", type: "boolean" },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "seo_title", label: "SEO Title", type: "text", colSpan: 2 },
  { name: "seo_description", label: "SEO Description", type: "textarea", colSpan: 2, rows: 2 },
];

function Page() {
  return (
    <AdminShell title="المدونة" description="اكتب وانشر مقالاتك.">
      <AdminCrud
        entityName="مقال"
        entityNamePlural="مقالات"
        fields={FIELDS}
        emptyValues={{ title: "", slug: "", featured: false, content_status: "draft", tags: [] }}
        listFn={adminListBlogPosts}
        createFn={createBlogPost}
        updateFn={updateBlogPost}
        deleteFn={deleteBlogPost}
        columns={[
          { header: "العنوان", render: (r: any) => <div><div className="font-medium">{r.title}</div><div className="text-xs text-neutral-500" dir="ltr">/{r.slug}</div></div> },
          { header: "الحالة", render: (r: any) => <span className="text-xs">{r.content_status}</span> },
          { header: "النشر", render: (r: any) => <span className="text-xs text-neutral-500">{r.published_at ? new Date(r.published_at).toLocaleDateString("ar") : "—"}</span> },
        ]}
      />
    </AdminShell>
  );
}
