import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { supabase } from "@/integrations/supabase/client";
import { signHeroMediaPath } from "@/lib/cms/hero.functions";
import { adminListMedia } from "@/lib/cms/admin-list.functions";
import { createMedia, updateMedia, deleteMedia } from "@/lib/cms/media.functions";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: Page,
  head: () => ({ meta: [{ title: "مكتبة الوسائط" }] }),
});

type MediaRow = {
  id: string;
  kind: string;
  url: string;
  storage_path: string | null;
  filename: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  alt: string | null;
  caption: string | null;
  created_at: string;
};

function Page() {
  const list = useServerFn(adminListMedia);
  const sign = useServerFn(signHeroMediaPath);
  const create = useServerFn(createMedia);
  const update = useServerFn(updateMedia);
  const remove = useServerFn(deleteMedia);

  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MediaRow | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await list({ data: { limit: 200, offset: 0 } });
      setRows((res?.rows ?? []) as MediaRow[]);
    } finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);

  const handleUpload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
      const path = `library/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { url } = (await sign({ data: { path } })) as { url: string };
      const kind = file.type.startsWith("image/") ? "image"
        : file.type.startsWith("video/") ? "video"
        : file.type.startsWith("audio/") ? "audio"
        : "other";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await create({ data: {
        kind, url, storage_path: path, filename: file.name,
        mime_type: file.type, size_bytes: file.size,
      } as any });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل الرفع");
    } finally { setBusy(false); }
  };

  const del = async (r: MediaRow) => {
    if (!confirm("حذف الملف؟")) return;
    if (r.storage_path) {
      await supabase.storage.from("media").remove([r.storage_path]);
    }
    await remove({ data: { id: r.id } });
    await refresh();
  };

  const saveMeta = async () => {
    if (!editing) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await update({ data: { id: editing.id, patch: { alt: editing.alt, caption: editing.caption } } as any });
    setEditing(null);
    await refresh();
  };

  return (
    <AdminShell
      title="مكتبة الوسائط"
      description="جميع الملفات والصور المرفوعة."
      actions={
        <>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            {busy ? "جارِ الرفع…" : "+ رفع ملف"}
          </button>
        </>
      }
    >
      {error && <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">{error}</div>}
      {loading ? (
        <div className="p-10 text-center text-neutral-500">جارِ التحميل…</div>
      ) : rows.length === 0 ? (
        <div className="p-10 text-center text-neutral-500 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">لم يتم رفع أي وسائط بعد.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {rows.map((r) => (
            <div key={r.id} className="group rounded-xl overflow-hidden border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                {r.kind === "image" ? (
                  <img src={r.url} alt={r.alt ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-neutral-400">{r.kind}</span>
                )}
              </div>
              <div className="p-2">
                <div className="text-xs font-medium truncate">{r.filename ?? "—"}</div>
                <div className="text-[10px] text-neutral-500 truncate">{r.size_bytes ? `${Math.round(r.size_bytes / 1024)} KB` : "—"}</div>
                <div className="mt-1 flex gap-1">
                  <button onClick={() => setEditing(r)} className="flex-1 text-[11px] rounded border border-neutral-300 px-2 py-0.5 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">تعديل</button>
                  <button onClick={() => navigator.clipboard.writeText(r.url)} className="flex-1 text-[11px] rounded border border-neutral-300 px-2 py-0.5 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">نسخ URL</button>
                  <button onClick={() => void del(r)} className="text-[11px] rounded border border-red-200 bg-red-50 px-2 py-0.5 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold mb-3">بيانات الملف</h3>
            <label className="text-xs">النص البديل (alt)</label>
            <input value={editing.alt ?? ""} onChange={(e) => setEditing({ ...editing, alt: e.target.value })} className="mt-1 mb-3 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900" />
            <label className="text-xs">التعليق</label>
            <input value={editing.caption ?? ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} className="mt-1 mb-3 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700">إلغاء</button>
              <button onClick={() => void saveMeta()} className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
