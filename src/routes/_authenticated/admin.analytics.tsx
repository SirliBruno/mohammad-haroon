import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getFunnelSummary } from "@/lib/cms/analytics.functions";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: Page,
  head: () => ({ meta: [{ title: "قياس التحويل" }] }),
});

const EVENT_LABEL: Record<string, string> = {
  page_view: "مشاهدة صفحة",
  home_view: "الرئيسية",
  work_view: "قائمة المشاريع",
  project_view: "تفاصيل مشروع",
  services_view: "قائمة الخدمات",
  service_view: "تفاصيل خدمة",
  contact_view: "صفحة التواصل",
  contact_start: "بدء نموذج التواصل",
  contact_submit: "إرسال نموذج التواصل",
  cta_click: "نقر على زر تحفيزي",
};

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function Page() {
  const fetchSummary = useServerFn(getFunnelSummary);
  const [days, setDays] = useState(30);

  const q = useQuery({
    queryKey: ["admin", "analytics", { days }],
    queryFn: () => fetchSummary({ data: { days } }),
    staleTime: 30_000,
  });

  const data = q.data;

  return (
    <AdminShell
      title="قياس التحويل"
      description="تتبع رحلة الزائر من الصفحة الرئيسية حتى إرسال نموذج التواصل."
    >
      <div className="mb-6 flex items-center gap-2">
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              days === d
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            }`}
          >
            آخر {d} يوم
          </button>
        ))}
      </div>

      {q.isLoading ? (
        <p className="text-sm text-neutral-500">جارٍ التحميل…</p>
      ) : q.isError ? (
        <p className="text-sm text-red-600">
          {q.error instanceof Error ? q.error.message : "تعذّر تحميل البيانات"}
        </p>
      ) : !data ? null : (
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="mb-3 text-xs uppercase tracking-wider text-neutral-500">
              مسار التحويل (جلسات فريدة)
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <Card label="الرئيسية" value={data.uniqueSessions.home_view ?? 0} />
              <Card label="المشاريع" value={data.uniqueSessions.work_view ?? 0} />
              <Card label="تفاصيل مشروع" value={data.uniqueSessions.project_view ?? 0} />
              <Card label="التواصل" value={data.uniqueSessions.contact_view ?? 0} />
              <Card label="إرسال الرسالة" value={data.uniqueSessions.contact_submit ?? 0} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs uppercase tracking-wider text-neutral-500">
              معدلات التحويل
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <Card label="الرئيسية ← المشاريع" value={`${data.conversions.homeToWork}%`} />
              <Card label="المشاريع ← تفاصيل مشروع" value={`${data.conversions.workToProject}%`} />
              <Card label="مشروع ← التواصل" value={`${data.conversions.projectToContact}%`} />
              <Card label="تواصل ← إرسال" value={`${data.conversions.contactToSubmit}%`} />
              <Card
                label="التحويل الكلي"
                value={`${data.conversions.overall}%`}
                hint="من الرئيسية حتى الإرسال"
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs uppercase tracking-wider text-neutral-500">
              إجمالي الأحداث
            </h3>
            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900">
                  <tr>
                    <th className="px-4 py-2 text-start font-medium">الحدث</th>
                    <th className="px-4 py-2 text-start font-medium">العدد</th>
                    <th className="px-4 py-2 text-start font-medium">جلسات فريدة</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.totals)
                    .sort((a, b) => b[1] - a[1])
                    .map(([ev, count]) => (
                      <tr
                        key={ev}
                        className="border-t border-neutral-200 dark:border-neutral-800"
                      >
                        <td className="px-4 py-2">{EVENT_LABEL[ev] ?? ev}</td>
                        <td className="px-4 py-2 tabular-nums">{count}</td>
                        <td className="px-4 py-2 tabular-nums">
                          {data.uniqueSessions[ev] ?? 0}
                        </td>
                      </tr>
                    ))}
                  {Object.keys(data.totals).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-neutral-500">
                        لا توجد بيانات في هذه الفترة بعد.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          {data.topPaths.length > 0 ? (
            <section>
              <h3 className="mb-3 text-xs uppercase tracking-wider text-neutral-500">
                أكثر الصفحات مشاهدة
              </h3>
              <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-sm">
                  <tbody>
                    {data.topPaths.map((p) => (
                      <tr
                        key={p.path}
                        className="border-t border-neutral-200 first:border-t-0 dark:border-neutral-800"
                      >
                        <td className="px-4 py-2 font-mono text-xs" dir="ltr">
                          {p.path}
                        </td>
                        <td className="px-4 py-2 text-end tabular-nums">{p.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      )}
    </AdminShell>
  );
}
