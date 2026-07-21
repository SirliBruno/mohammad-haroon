import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import { adminListProducts } from "@/lib/cms/admin-list.functions";
import { createProduct, updateProduct, deleteProduct } from "@/lib/cms/simple.functions";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: Page,
  head: () => ({ meta: [{ title: "إدارة المنتجات" }] }),
});

const STATUS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const FIELDS: FieldDef[] = [
  { name: "name", label: "اسم المنتج", type: "text", required: true },
  { name: "slug", label: "المعرّف (slug)", type: "text", required: true, dir: "ltr" },
  { name: "tagline", label: "الشعار المختصر", type: "text", colSpan: 2 },
  { name: "cover_url", label: "صورة الغلاف", type: "image", folder: "products", colSpan: 2 },
  { name: "description", label: "الوصف", type: "richtext", colSpan: 2, rows: 8 },
  { name: "price_cents", label: "السعر (بالسنت)", type: "number", min: 0, help: "مثال: 4900 = 49.00" },
  { name: "currency", label: "العملة", type: "text", help: "USD أو SAR", dir: "ltr" },
  { name: "external_url", label: "رابط خارجي", type: "url", dir: "ltr", colSpan: 2 },
  { name: "tags", label: "الوسوم", type: "tags", colSpan: 2 },
  { name: "gallery", label: "معرض الصور", type: "gallery", folder: "products/gallery", colSpan: 2, help: "ارفع صورًا متعددة مع نص بديل لكل صورة." },
  { name: "featured", label: "مميّز", type: "boolean" },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "sort_order", label: "الترتيب", type: "number" },
];

function Page() {
  return (
    <AdminShell title="المنتجات" description="منتجات رقمية للعرض أو البيع.">
      <AdminCrud
        entityName="منتج"
        entityNamePlural="منتجات"
        fields={FIELDS}
        emptyValues={{ name: "", slug: "", currency: "USD", featured: false, content_status: "draft", tags: [], gallery: [], sort_order: 0 }}
        listFn={adminListProducts}
        createFn={createProduct}
        updateFn={updateProduct}
        deleteFn={deleteProduct}
        columns={[
          { header: "المنتج", render: (r: any) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-neutral-500" dir="ltr">/{r.slug}</div></div> },
          { header: "السعر", render: (r: any) => <span className="text-xs">{r.price_cents != null ? `${(r.price_cents / 100).toFixed(2)} ${r.currency}` : "—"}</span> },
          { header: "الحالة", render: (r: any) => <span className="text-xs">{r.content_status}</span> },
        ]}
      />
    </AdminShell>
  );
}
