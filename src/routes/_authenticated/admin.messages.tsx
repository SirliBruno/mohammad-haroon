import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { listMessages, updateMessage, deleteMessage } from "@/lib/cms/messages.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: Page,
  head: () => ({ meta: [{ title: "الرسائل الواردة" }] }),
});

type Status = "new" | "read" | "replied" | "archived" | "spam";

type Msg = {
  id: string;
  name: string;
  email: string;
  inquiry_type: string | null;
  budget: string | null;
  message: string;
  status: Status;
  notes: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<Status, string> = {
  new: "جديد",
  read: "مقروء",
  replied: "تم الرد",
  archived: "مؤرشف",
  spam: "غير مرغوب",
};

const QK = ["admin", "messages"] as const;

function Page() {
  const list = useServerFn(listMessages);
  const update = useServerFn(updateMessage);
  const remove = useServerFn(deleteMessage);
  const qc = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  // Two-step delete: stores the ID pending confirmation
  const [deletePending, setDeletePending] = useState<string | null>(null);

  const query = useQuery({
    queryKey: QK,
    queryFn: async () => {
      const res = (await list({ data: { limit: 200, offset: 0 } })) as {
        rows: Msg[];
        total?: number;
      };
      return res.rows ?? [];
    },
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });

  const rows: Msg[] = query.data ?? [];
  const selected = selectedId ? rows.find((r) => r.id === selectedId) ?? null : null;

  useEffect(() => {
    setNotes(selected?.notes ?? "");
  }, [selected?.id, selected?.notes]);

  const updateMut = useMutation({
    mutationFn: (patch: { id: string; status?: Status; notes?: string | null }) =>
      update({ data: patch }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "تعذّر الحفظ"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: (_r, id) => {
      qc.invalidateQueries({ queryKey: QK });
      if (selectedId === id) setSelectedId(null);
      setDeletePending(null);
      toast.success("تم الحذف");
    },
    onError: (e: unknown) => {
      setDeletePending(null);
      toast.error(e instanceof Error ? e.message : "تعذّر الحذف");
    },
  });

  const openMessage = (m: Msg) => {
    setSelectedId(m.id);
    setDeletePending(null);
    if (m.status === "new") updateMut.mutate({ id: m.id, status: "read" });
  };

  const setStatus = (id: string, status: Status) => updateMut.mutate({ id, status });

  const saveNotes = () => {
    if (!selected) return;
    updateMut.mutate({ id: selected.id, notes });
  };

  const handleDeleteClick = (id: string) => {
    if (deletePending === id) {
      // Second click = confirmed
      deleteMut.mutate(id);
    } else {
      // First click = arm the confirmation
      setDeletePending(id);
    }
  };

  const filtered = statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter);
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AdminShell title="الرسائل الواردة" description="رسائل نموذج التواصل.">
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setStatusFilter("all")} className={pill(statusFilter === "all")}>
          الكل ({rows.length})
        </button>
        {(["new", "read", "replied", "archived", "spam"] as Status[]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={pill(statusFilter === s)}>
            {STATUS_LABEL[s]} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
        <div className="rounded-2xl border border-border bg-white overflow-hidden dark:border-border dark:bg-neutral-900">
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
            {query.isLoading ? (
              <div className="p-6 text-center text-muted-foreground">جارِ التحميل…</div>
            ) : query.isError ? (
              <div className="p-6 text-center text-red-600">تعذّر تحميل الرسائل.</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">لا رسائل.</div>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => openMessage(m)}
                  className={cn(
                    "w-full text-start p-4 hover:bg-muted dark:hover:bg-muted/50 transition-colors",
                    selectedId === m.id && "bg-neutral-100 dark:bg-neutral-800",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{m.name}</div>
                    {m.status === "new" && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                    {m.email}
                  </div>
                  <div className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 line-clamp-2">
                    {m.message}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {new Date(m.created_at).toLocaleString("ar")}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white dark:border-border dark:bg-neutral-900">
          {!selected ? (
            <div className="p-10 text-center text-muted-foreground">اختر رسالة لعرض تفاصيلها.</div>
          ) : (
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{selected.name}</h3>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-blue-600 hover:underline"
                    dir="ltr"
                  >
                    {selected.email}
                  </a>
                </div>
                <div className="flex gap-1">
                  {(["read", "replied", "archived", "spam"] as Status[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(selected.id, s)}
                      disabled={updateMut.isPending}
                      className={cn(pill(selected.status === s), "text-xs")}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                {selected.inquiry_type && (
                  <div>
                    النوع:{" "}
                    <span className="text-foreground dark:text-foreground">
                      {selected.inquiry_type}
                    </span>
                  </div>
                )}
                {selected.budget && (
                  <div>
                    الميزانية:{" "}
                    <span className="text-foreground dark:text-foreground">{selected.budget}</span>
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-neutral-50 border border-border p-4 text-sm whitespace-pre-wrap leading-relaxed dark:bg-neutral-800 dark:border-border">
                {selected.message}
              </div>
              <div>
                <label htmlFor="msg-notes" className="text-xs font-medium">
                  ملاحظات داخلية
                </label>
                <textarea
                  id="msg-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-sm dark:border-border dark:bg-neutral-900"
                />
                <button
                  onClick={saveNotes}
                  disabled={updateMut.isPending}
                  className="mt-2 rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white dark:bg-white dark:text-foreground disabled:opacity-50"
                >
                  {updateMut.isPending ? "جارِ الحفظ…" : "حفظ الملاحظات"}
                </button>
              </div>
              <div className="flex justify-end pt-2 border-t border-border dark:border-border">
                {deletePending === selected.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600">تأكيد الحذف؟</span>
                    <button
                      onClick={() => handleDeleteClick(selected.id)}
                      disabled={deleteMut.isPending}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
                    >
                      {deleteMut.isPending ? "جارِ الحذف…" : "نعم، احذف"}
                    </button>
                    <button
                      onClick={() => setDeletePending(null)}
                      className="rounded-md border border-input px-3 py-1.5 text-xs dark:border-border"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(selected.id)}
                    disabled={deleteMut.isPending}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300 disabled:opacity-50"
                  >
                    حذف الرسالة
                  </button>
                )}
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
      ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-foreground dark:border-white"
      : "bg-white text-muted-foreground border-border hover:bg-muted dark:bg-neutral-900 dark:text-muted-foreground dark:border-border dark:hover:bg-muted",
  );
}
