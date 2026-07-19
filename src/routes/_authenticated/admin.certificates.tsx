import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCrud, type FieldDef } from "@/components/admin/admin-crud";
import { adminListCertificates } from "@/lib/cms/admin-list.functions";
import { createCertificate, updateCertificate, deleteCertificate } from "@/lib/cms/simple.functions";

export const Route = createFileRoute("/_authenticated/admin/certificates")({
  component: Page,
  head: () => ({ meta: [{ title: "إدارة الشهادات" }] }),
});

const STATUS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

const FIELDS: FieldDef[] = [
  { name: "title", label: "اسم الشهادة", type: "text", required: true },
  { name: "issuer", label: "الجهة المانحة", type: "text", required: true },
  { name: "issued_on", label: "تاريخ الإصدار", type: "date" },
  { name: "expires_on", label: "تاريخ الانتهاء", type: "date" },
  { name: "credential_id", label: "رقم الاعتماد", type: "text" },
  { name: "credential_url", label: "رابط التحقق", type: "url", dir: "ltr" },
  { name: "image_url", label: "صورة الشهادة", type: "image", folder: "certificates", colSpan: 2 },
  { name: "skills", label: "المهارات المرتبطة", type: "tags", colSpan: 2 },
  { name: "featured", label: "مميّز", type: "boolean" },
  { name: "content_status", label: "الحالة", type: "select", options: STATUS },
  { name: "sort_order", label: "الترتيب", type: "number" },
];

function Page() {
  return (
    <AdminShell title="الشهادات" description="أضف وحرّر الشهادات المهنية.">
      <AdminCrud
        entityName="شهادة"
        entityNamePlural="شهادات"
        fields={FIELDS}
        emptyValues={{ title: "", issuer: "", content_status: "published", featured: false, sort_order: 0, skills: [] }}
        listFn={adminListCertificates}
        createFn={createCertificate}
        updateFn={updateCertificate}
        deleteFn={deleteCertificate}
        columns={[
          { header: "الشهادة", render: (r: any) => <div><div className="font-medium">{r.title}</div><div className="text-xs text-neutral-500">{r.issuer}</div></div> },
          { header: "التاريخ", render: (r: any) => <span className="text-xs text-neutral-500">{r.issued_on ?? "—"}</span> },
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
    archived: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
  };
  const label: Record<string, string> = { published: "منشور", draft: "مسودة", archived: "مؤرشف" };
  return <span className={`rounded-full px-2 py-0.5 text-xs ${map[status] ?? ""}`}>{label[status] ?? status}</span>;
}
