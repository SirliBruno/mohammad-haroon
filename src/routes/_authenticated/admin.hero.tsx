import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/layout/section";
import {
  adminListHeroProjects,
  createHeroProject,
  updateHeroProject,
  deleteHeroProject,
  signHeroMediaPath,
  backfillHeroVariants,
} from "@/lib/cms/hero.functions";

export const Route = createFileRoute("/_authenticated/admin/hero")({
  component: AdminHeroPage,
  head: () => ({ meta: [{ title: "إدارة مشاريع الهيرو" }] }),
});

type HeroRow = {
  id: string;
  title: string;
  host: string | null;
  category: string | null;
  year: number | null;
  status: "مباشر" | "قيد التطوير";
  accent: "emerald" | "amber" | "sky" | "violet";
  cover_url: string | null;
  mobile_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const EMPTY: Omit<HeroRow, "id"> = {
  title: "",
  host: "",
  category: "",
  year: new Date().getFullYear(),
  status: "مباشر",
  accent: "emerald",
  cover_url: "",
  mobile_url: "",
  is_active: true,
  sort_order: 0,
};

function AdminHeroPage() {
  const navigate = useNavigate();
  const list = useServerFn(adminListHeroProjects);
  const create = useServerFn(createHeroProject);
  const update = useServerFn(updateHeroProject);
  const remove = useServerFn(deleteHeroProject);
  const sign = useServerFn(signHeroMediaPath);
  const backfill = useServerFn(backfillHeroVariants);

  const [rows, setRows] = useState<HeroRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<HeroRow, "id">>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = (await list()) as HeroRow[];
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleUpload = async (
    file: File,
    field: "cover_url" | "mobile_url",
  ) => {
    setBusy(true);
    setMsg(null);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const path = `hero/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { url } = (await sign({ data: { path } })) as { url: string };
      setForm((f) => ({ ...f, [field]: url }));
      setMsg("تم رفع الصورة");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "فشل الرفع");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const payload = {
        ...form,
        host: form.host || null,
        category: form.category || null,
        cover_url: form.cover_url || null,
        mobile_url: form.mobile_url || null,
        year: form.year || null,
      };
      if (editingId) {
        await update({ data: { id: editingId, patch: payload } });
      } else {
        await create({ data: payload });
      }
      setForm(EMPTY);
      setEditingId(null);
      await refresh();
      setMsg("تم الحفظ");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "فشل الحفظ");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (r: HeroRow) => {
    setEditingId(r.id);
    setForm({
      title: r.title,
      host: r.host,
      category: r.category,
      year: r.year,
      status: r.status,
      accent: r.accent,
      cover_url: r.cover_url,
      mobile_url: r.mobile_url,
      is_active: r.is_active,
      sort_order: r.sort_order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذا المشروع؟")) return;
    await remove({ data: { id } });
    await refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <Section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">إدارة مشاريع الهيرو</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            الصور والعناوين هنا تظهر تلقائيًا داخل نوافذ الهيرو في الصفحة الرئيسية.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              setBusy(true);
              try {
                const r = (await backfill()) as { updated: number; total: number };
                setMsg(`تم توليد نسخ محسّنة لـ ${r.updated}/${r.total} مشروع`);
              } catch (e) {
                setMsg(e instanceof Error ? e.message : "فشل التحسين");
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-60"
          >
            توليد نسخ الصور المحسّنة
          </button>
          <button
            onClick={handleLogout}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            خروج
          </button>
        </div>
      </div>

      {msg && (
        <div className="mt-4 rounded-md border border-border bg-muted/40 px-4 py-2 text-sm">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
        <Field label="العنوان">
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="النطاق (host)">
          <input dir="ltr" value={form.host ?? ""} onChange={(e) => set("host", e.target.value)} className={inputCls} />
        </Field>
        <Field label="التصنيف">
          <input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} className={inputCls} />
        </Field>
        <Field label="السنة">
          <input type="number" value={form.year ?? ""} onChange={(e) => set("year", Number(e.target.value) || null)} className={inputCls} />
        </Field>
        <Field label="الحالة">
          <select value={form.status} onChange={(e) => set("status", e.target.value as HeroRow["status"])} className={inputCls}>
            <option value="مباشر">مباشر</option>
            <option value="قيد التطوير">قيد التطوير</option>
          </select>
        </Field>
        <Field label="اللون">
          <select value={form.accent} onChange={(e) => set("accent", e.target.value as HeroRow["accent"])} className={inputCls}>
            <option value="emerald">أخضر</option>
            <option value="amber">كهرماني</option>
            <option value="sky">سماوي</option>
            <option value="violet">بنفسجي</option>
          </select>
        </Field>
        <Field label="ترتيب">
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={inputCls} />
        </Field>
        <Field label="مفعّل">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
            <span>ظاهر في الهيرو</span>
          </label>
        </Field>

        <Field label="صورة المتصفح (Desktop)">
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "cover_url")} className="text-sm" />
          {form.cover_url && <img src={form.cover_url} alt="" className="mt-2 h-24 w-auto rounded border border-border object-cover" />}
        </Field>
        <Field label="صورة الجوال (iPhone)">
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "mobile_url")} className="text-sm" />
          {form.mobile_url && <img src={form.mobile_url} alt="" className="mt-2 h-24 w-auto rounded border border-border object-cover" />}
        </Field>

        <div className="md:col-span-2 flex gap-2">
          <button type="submit" disabled={busy} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60">
            {editingId ? "تحديث" : "إضافة"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); }} className="rounded-md border border-border px-4 py-2 text-sm">
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">المشاريع الحالية</h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">جارِ التحميل...</p>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">لا توجد مشاريع بعد.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center gap-4 p-4">
                {r.cover_url ? (
                  <img src={r.cover_url} alt="" className="h-14 w-20 rounded border border-border object-cover" />
                ) : (
                  <div className="h-14 w-20 rounded border border-border bg-muted" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.category} · {r.year} · {r.status} {!r.is_active && "· مخفي"}
                  </div>
                </div>
                <button onClick={() => handleEdit(r)} className="rounded-md border border-border px-3 py-1 text-xs hover:bg-muted">تعديل</button>
                <button onClick={() => handleDelete(r.id)} className="rounded-md border border-border px-3 py-1 text-xs text-red-600 hover:bg-red-50">حذف</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

const inputCls = "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
