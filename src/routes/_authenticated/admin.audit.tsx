import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminListAuditLog, type AuditLogRow } from "@/lib/cms/audit.functions";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AdminAuditPage,
  head: () => ({ meta: [{ title: "سجل التدقيق" }] }),
});

const TABLES: { value: string; label: string }[] = [
  { value: "", label: "كل الجداول" },
  { value: "projects", label: "المشاريع" },
  { value: "services", label: "الخدمات" },
  { value: "hero_projects", label: "الهيرو" },
  { value: "testimonials", label: "التوصيات" },
  { value: "certificates", label: "الشهادات" },
  { value: "experiences", label: "الخبرات" },
  { value: "skills", label: "المهارات" },
  { value: "blog_posts", label: "المدونة" },
  { value: "products", label: "المنتجات" },
  { value: "ideas", label: "الأفكار" },
  { value: "site_content", label: "المحتوى العام" },
];

const ACTION_LABELS = {
  INSERT: { text: "إضافة", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  UPDATE: { text: "تعديل", cls: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  DELETE: { text: "حذف", cls: "bg-red-500/10 text-red-700 dark:text-red-300" },
} as const;

const PAGE_SIZE = 50;

function AdminAuditPage() {
  const list = useServerFn(adminListAuditLog);
  const [table, setTable] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["audit-log", { table, page }],
    queryFn: async () => {
      const args: { limit: number; offset: number; table?: string } = {
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      };
      if (table) args.table = table;
      return list({ data: args });
    },
    staleTime: 30_000,
  });

  const rows: AuditLogRow[] = query.data?.rows ?? [];
  const count = query.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("ar-SA", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  return (
    <AdminShell
      title="سجل التدقيق"
      description="سجل زمني لكل عملية إضافة أو تعديل أو حذف في محتوى الموقع."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={table}
              onChange={(e) => {
                setTable(e.target.value);
                setPage(0);
              }}
              className="rounded-md border border-input bg-white px-3 py-1.5 text-sm dark:border-border dark:bg-neutral-900"
            >
              {TABLES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="rounded-md border border-input bg-white px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-60 dark:border-border dark:bg-neutral-900 dark:hover:bg-muted"
            >
              {query.isFetching ? "…" : "تحديث"}
            </button>
            <span className="text-xs text-muted-foreground">
              {count === 0 ? "لا توجد سجلات" : `${count} سجل`}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white overflow-hidden dark:border-border dark:bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground dark:text-muted-foreground w-40">التاريخ</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground dark:text-muted-foreground w-24">العملية</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground dark:text-muted-foreground">الجدول</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground dark:text-muted-foreground hidden md:table-cell">معرّف السجل</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground dark:text-muted-foreground w-24">تفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {query.isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      جارِ التحميل…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      لا توجد سجلات مطابقة.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const isOpen = expanded === row.id;
                    const action = ACTION_LABELS[row.action];
                    return (
                      <Fragment key={row.id}>
                        <tr
                          className="border-t border-border dark:border-border hover:bg-muted/50 dark:hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 align-top text-xs tabular-nums text-muted-foreground dark:text-muted-foreground">
                            {fmt.format(new Date(row.created_at))}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${action.cls}`}
                            >
                              {action.text}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top" dir="ltr">
                            <span className="font-mono text-xs">{row.table_name}</span>
                          </td>
                          <td className="px-4 py-3 align-top hidden md:table-cell" dir="ltr">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {row.row_id?.slice(0, 8) ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <button
                              onClick={() => setExpanded(isOpen ? null : row.id)}
                              className="rounded-md border border-input bg-white px-2 py-1 text-xs hover:bg-muted dark:border-border dark:bg-neutral-800"
                            >
                              {isOpen ? "إخفاء" : "عرض"}
                            </button>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="border-t border-border dark:border-border">
                            <td colSpan={5} className="bg-neutral-50/60 px-4 py-3 dark:bg-neutral-950/40">
                              <pre
                                dir="ltr"
                                className="max-h-96 overflow-auto rounded-md bg-white p-3 text-[11px] leading-relaxed text-foreground shadow-inner dark:bg-neutral-900 dark:text-foreground"
                              >
                                {JSON.stringify(row.diff, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs dark:border-border">
              <div className="text-muted-foreground">
                صفحة {page + 1} من {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || query.isFetching}
                  className="rounded-md border border-input bg-white px-2.5 py-1 disabled:opacity-40 dark:border-border dark:bg-neutral-900"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page + 1 >= totalPages || query.isFetching}
                  className="rounded-md border border-input bg-white px-2.5 py-1 disabled:opacity-40 dark:border-border dark:bg-neutral-900"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
