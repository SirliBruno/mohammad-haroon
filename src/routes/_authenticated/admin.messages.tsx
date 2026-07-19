import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { listMessages, updateMessage, deleteMessage } from "@/lib/cms/messages.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: Page,
  head: () => ({ meta: [{ title: "الرسائل الواردة" }] }),
});

type Msg = {
  id: string;
  name: string;
  email: string;
  inquiry_type: string | null;
  budget: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived" | "spam";
  notes: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<Msg["status"], string> = {
  new: "جديد",
  read: "مقروء",
  replied: "تم الرد",
  archived: "مؤرشف",
  spam: "غير مرغوب",
};

function Page() {
  const list = useServerFn(listMessages);
  const update = useServerFn(updateMessage);
  const remove = useServerFn(deleteMessage);

  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Msg | null>(null);
  const [statusFilter, setStatusFilter] = useState<Msg["status"] | "all">("all");
  const [notes, setNotes] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await list({ data: { limit: 200, offset: 0 } });
      setRows((res?.rows ?? []) as Msg[]);
    } finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, []);

  const open = async (m: Msg) => {
    setSelected(m);
    setNotes(m.notes ?? "");
    if (m.status === "new") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await update({ data: { id: m.id, status: "read" } as any });
      void refresh();
    }
  };

  const setStatus = async (id: string, status: Msg["status"]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await update({ data: { id, status } as any });
    await refresh();
    if (selected?.id === id) setSelected((s) => (s ? { ...s, status } : s));
  };

  const saveNotes = async () => {
    if (!selected) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await update({ data: { id: selected.id, notes } as any });
    await refresh();
  };

  const del = async (m: Msg) => {
    if (!confirm("حذف الرسالة؟")) return;
    await remove({ data: { id: m.id } });
    if (selected?.id === m.id) setSelected(null);
    await refresh();
  };

  const filtered = statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter);
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AdminShell title="الرسائل الواردة" description="رسائل نموذج التواصل.">
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setStatusFilter("all")} className={pill(statusFilter === "all")}>الكل ({rows.length})</button>
        {(["new","read","replied","archived","spam"] as Msg["status"][]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={pill(statusFilter === s)}>
            {STATUS_LABEL[s]} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading ? (
              <div className="p-6 text-center text-neutral-500">جارِ التحميل…</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-neutral-500">لا رسائل.</div>
            ) : filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => open(m)}
                className={cn(
                  "w-full text-start p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors",
                  selected?.id === m.id && "bg-neutral-100 dark:bg-neutral-800",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{m.name}</div>
                  {m.status === "new" && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5" dir="ltr">{m.email}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">{m.message}</div>
                <div className="text-[11px] text-neutral-400 mt-1">{new Date(m.created_at).toLocaleString("ar")}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {!selected ? (
            <div className="p-10 text-center text-neutral-500">اختر رسالة لعرض تفاصيلها.</div>
          ) : (
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-sm text-blue-600 hover:underline" dir="ltr">{selected.email}</a>
                </div>
                <div className="flex gap-1">
                  {(["read","replied","archived","spam"] as Msg["status"][]).map((s) => (
                    <button key={s} onClick={() => void setStatus(selected.id, s)} className={cn(pill(selected.status === s), "text-xs")}>
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 text-xs text-neutral-500">
                {selected.inquiry_type && <div>النوع: <span className="text-neutral-800 dark:text-neutral-200">{selected.inquiry_type}</span></div>}
                {selected.budget && <div>الميزانية: <span className="text-neutral-800 dark:text-neutral-200">{selected.budget}</span></div>}
              </div>
              <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4 text-sm whitespace-pre-wrap leading-relaxed dark:bg-neutral-800 dark:border-neutral-700">
                {selected.message}
              </div>
              <div>
                <label className="text-xs font-medium">ملاحظات داخلية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
                <button onClick={() => void saveNotes()} className="mt-2 rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white dark:bg-white dark:text-neutral-900">حفظ الملاحظات</button>
              </div>
              <div className="flex justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button onClick={() => void del(selected)} className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">حذف الرسالة</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function pill(active: boolean) {
  return cn(
    "rounded-full px-3 py-1 text-xs border",
    active
      ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
      : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800 dark:hover:bg-neutral-800",
  );
}
