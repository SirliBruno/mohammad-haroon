import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/layout/section";
import {
  adminListProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/cms/projects.functions";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: AdminProjectsPage,
  head: () => ({ meta: [{ title: "إدارة المشاريع" }] }),
});

type Row = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  year: number | null;
  content_status: "draft" | "published" | "archived";
  status: "concept" | "in_progress" | "live" | "archived";
  featured: boolean;
  sort_order: number;
  cover_url: string | null;
};

type FormState = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  year: number | null;
  status: Row["status"];
  content_status: Row["content_status"];
  featured: boolean;
  sort_order: number;
  cover_url: string;
  live_url: string;
  github_url: string;
};

const EMPTY: FormState = {
  slug: "",
  title: "",
  summary: "",
  category: "",
  year: new Date().getFullYear(),
  status: "live",
  content_status: "published",
  featured: false,
  sort_order: 0,
  cover_url: "",
  live_url: "",
  github_url: "",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function AdminProjectsPage() {
  const navigate = useNavigate();
  const list = useServerFn(adminListProjects);
  const getById = useServerFn(getAdminProjectById);
  const create = useServerFn(createProject);
  const update = useServerFn(updateProject);
  const remove = useServerFn(deleteProject);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = (await list({ data: { limit: 200, offset: 0, ascending: true, orderBy: "sort_order" } })) as {
        rows: Row[];
      } | Row[];
      setRows(Array.isArray(data) ? data : data.rows ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleUpload = async (file: File) => {
    setBusy(true);
    setMsg(null);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const path = `projects/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = await supabase.storage
        .from("media")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (data?.signedUrl) setForm((f) => ({ ...f, cover_url: data.signedUrl }));
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
        slug: form.slug || slugify(form.title),
        title: form.title,
        summary: form.summary || null,
        category: form.category || null,
        year: form.year || null,
        status: form.status,
        content_status: form.content_status,
        featured: form.featured,
        sort_order: form.sort_order,
        cover_url: form.cover_url || null,
        live_url: form.live_url || null,
        github_url: form.github_url || null,
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

  const handleEdit = (r: Row) => {
    setEditingId(r.id);
    setForm({
      slug: r.slug,
      title: r.title,
      summary: "",
      category: r.category ?? "",
      year: r.year,
      status: r.status,
      content_status: r.content_status,
      featured: r.featured,
      sort_order: r.sort_order,
      cover_url: r.cover_url ?? "",
      live_url: "",
      github_url: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذا المشروع؟")) return;
    await remove({ data: { id } });
    await refresh();
  };

  const bumpOrder = async (r: Row, delta: number) => {
    await update({ data: { id: r.id, patch: { sort_order: r.sort_order + delta } } });
    await refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <Section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">إدارة المشاريع</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            أضف وعدّل واحذف مشاريعك، وتحكّم بترتيب ظهورها.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/hero"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            مشاريع الهيرو
          </Link>
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

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-2"
      >
        <Field label="العنوان">
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="المعرّف (slug)">
          <input
            dir="ltr"
            placeholder="auto"
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="التصنيف">
          <input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="السنة">
          <input
            type="number"
            value={form.year ?? ""}
            onChange={(e) => set("year", Number(e.target.value) || null)}
            className={inputCls}
          />
        </Field>
        <Field label="حالة المشروع">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as Row["status"])}
            className={inputCls}
          >
            <option value="live">مباشر</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="concept">تصوّر</option>
            <option value="archived">مؤرشف</option>
          </select>
        </Field>
        <Field label="حالة النشر">
          <select
            value={form.content_status}
            onChange={(e) =>
              set("content_status", e.target.value as Row["content_status"])
            }
            className={inputCls}
          >
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </Field>
        <Field label="ترتيب الظهور">
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="مميّز">
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            <span>عرض ضمن المشاريع المميزة</span>
          </label>
        </Field>
        <Field label="ملخّص" className="md:col-span-2">
          <textarea
            rows={3}
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="رابط مباشر">
          <input
            dir="ltr"
            value={form.live_url}
            onChange={(e) => set("live_url", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="رابط GitHub">
          <input
            dir="ltr"
            value={form.github_url}
            onChange={(e) => set("github_url", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="صورة الغلاف" className="md:col-span-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            className="text-sm"
          />
          {form.cover_url && (
            <img
              src={form.cover_url}
              alt=""
              className="mt-2 h-28 w-auto rounded border border-border object-cover"
            />
          )}
        </Field>

        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
          >
            {editingId ? "تحديث" : "إضافة"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY);
              }}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">كل المشاريع</h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">جارِ التحميل...</p>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">لا توجد مشاريع بعد.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 p-4">
                {r.cover_url ? (
                  <img
                    src={r.cover_url}
                    alt=""
                    className="h-14 w-20 rounded border border-border object-cover"
                  />
                ) : (
                  <div className="h-14 w-20 rounded border border-border bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium">
                    {r.title}
                    {r.featured && (
                      <span className="ms-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-600">
                        مميّز
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {r.category || "—"} · {r.year || "—"} · {r.status} ·{" "}
                    {r.content_status} · ترتيب {r.sort_order}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => bumpOrder(r, -1)}
                    title="أعلى"
                    className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => bumpOrder(r, 1)}
                    title="أسفل"
                    className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                  >
                    ↓
                  </button>
                </div>
                <button
                  onClick={() => handleEdit(r)}
                  className="rounded-md border border-border px-3 py-1 text-xs hover:bg-muted"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="rounded-md border border-border px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

const inputCls =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
