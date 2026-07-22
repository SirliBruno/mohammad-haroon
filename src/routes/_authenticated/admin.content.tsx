import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import {
  listSiteContent,
  upsertSiteContent,
  updateSiteContent,
  deleteSiteContent,
} from "@/lib/cms/content.functions";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: Page,
  head: () => ({ meta: [{ title: "نصوص وصور الموقع" }] }),
});

const KIND = [
  { value: "text", label: "نص قصير" },
  { value: "richtext", label: "نص طويل" },
  { value: "image", label: "صورة" },
  { value: "url", label: "رابط" },
  { value: "json", label: "JSON متقدم" },
];

const FIELDS: FieldDef[] = [
  { name: "key", label: "المفتاح (key)", type: "text", required: true, dir: "ltr", help: "معرّف فريد للاستخدام في الكود، مثل: hero.title" },
  { name: "group_name", label: "المجموعة", type: "text", required: true, help: "لتصنيف المحتوى: hero, about, contact, footer…" },
  { name: "label", label: "الاسم الظاهر", type: "text" },
  { name: "description", label: "ملاحظات", type: "textarea", colSpan: 2, rows: 2, help: "شرح مختصر لك عن هذا الحقل" },
  { name: "kind", label: "النوع", type: "select", options: KIND },
  { name: "sort_order", label: "الترتيب", type: "number" },
  { name: "value_ar", label: "القيمة بالعربية", type: "richtext", colSpan: 2, rows: 6 },
  { name: "value_en", label: "القيمة بالإنجليزية", type: "richtext", colSpan: 2, rows: 6, dir: "ltr" },
  { name: "image_url", label: "الصورة", type: "image", folder: "content", colSpan: 2 },
  { name: "metadata", label: "بيانات إضافية (JSON)", type: "json", colSpan: 2 },
];

function Page() {
  return (
    <AdminShell
      title="نصوص وصور الموقع"
      description="مستودع نصوص وصور مرن يعتمد على المفاتيح — استخدمه لأي محتوى ثابت في الموقع: الهيرو، الفوتر، صفحة عني، إلخ."
    >
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
        💡 <strong>كيف يعمل:</strong> كل محتوى له مفتاح فريد. استخدم دالة <code dir="ltr" className="mx-1 rounded bg-blue-100 px-1 dark:bg-blue-900">getSiteContentByKey</code> في الصفحات لجلب القيمة.
      </div>
      <AdminCrud
        entityName="عنصر"
        entityNamePlural="عناصر"
        fields={FIELDS}
        emptyValues={{ key: "", group_name: "general", kind: "text", sort_order: 0, metadata: {} }}
        listFn={listSiteContent}
        createFn={upsertSiteContent}
        updateFn={updateSiteContent}
        deleteFn={deleteSiteContent}
        columns={[
          { header: "المفتاح", render: (r: any) => <div><div className="font-mono text-xs" dir="ltr">{r.key}</div><div className="text-[11px] text-muted-foreground">{r.group_name}</div></div> },
          { header: "المحتوى", render: (r: any) => (
            <div className="max-w-md">
              {r.image_url && <img src={r.image_url} alt="" className="h-10 w-10 rounded object-cover inline-block me-2" />}
              <span className="text-xs text-foreground dark:text-muted-foreground line-clamp-2">{r.value_ar || r.value_en || "—"}</span>
            </div>
          ) },
          { header: "النوع", render: (r: any) => <span className="text-xs text-muted-foreground">{r.kind}</span> },
        ]}
      />
    </AdminShell>
  );
}
