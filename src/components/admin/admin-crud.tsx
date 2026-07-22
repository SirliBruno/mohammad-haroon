import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImageInput } from "./image-input";
import { GalleryInput } from "./gallery-input";
import { StructuredListInput, type StructuredFieldSchema } from "./structured-list-input";
import { ObjectInput } from "./object-input";
import { cn } from "@/lib/utils";

export type FieldDef =
  | {
      name: string;
      label: string;
      type: "text" | "url" | "textarea" | "richtext" | "date" | "datetime";
      required?: boolean;
      placeholder?: string;
      help?: string;
      dir?: "ltr" | "rtl";
      rows?: number;
      colSpan?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "number";
      required?: boolean;
      help?: string;
      min?: number;
      max?: number;
      step?: number;
      colSpan?: 1 | 2;
    }
  | { name: string; label: string; type: "boolean"; help?: string; colSpan?: 1 | 2 }
  | {
      name: string;
      label: string;
      type: "select";
      options: { value: string; label: string }[];
      required?: boolean;
      help?: string;
      colSpan?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "tags";
      placeholder?: string;
      help?: string;
      colSpan?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "image";
      folder?: string;
      help?: string;
      colSpan?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "gallery";
      folder?: string;
      help?: string;
      colSpan?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "structured";
      schema: StructuredFieldSchema[];
      addLabel?: string;
      help?: string;
      colSpan?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "object";
      schema: StructuredFieldSchema[];
      help?: string;
      colSpan?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "json";
      help?: string;
      rows?: number;
      colSpan?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "sortable";
      items: { value: string; label: string }[];
      help?: string;
      colSpan?: 1 | 2;
    };

export type ListColumn<Row> = {
  header: string;
  render: (row: Row) => React.ReactNode;
  className?: string;
};

export type AdminCrudProps<Row extends { id: string }> = {
  entityName: string;
  entityNamePlural: string;
  /** Stable identifier for TanStack Query cache. Defaults to entityName. */
  queryKey?: string;
  fields: FieldDef[];
  columns: ListColumn<Row>[];
  emptyValues: Record<string, unknown>;
  listFn: (arg: { data: Record<string, unknown> }) => Promise<Row[] | { rows: Row[]; count?: number } | unknown>;
  createFn: (arg: { data: Record<string, unknown> }) => Promise<Row | unknown>;
  updateFn: (arg: { data: { id: string; patch: Record<string, unknown> } }) => Promise<Row | unknown>;
  deleteFn: (arg: { data: { id: string } }) => Promise<unknown>;
  toForm?: (row: Row) => Record<string, unknown>;
  fromForm?: (form: Record<string, unknown>) => Record<string, unknown>;
  searchable?: boolean;
  /** Rows per page. Default 25. */
  pageSize?: number;
};

function coerceListResult<Row>(res: unknown): { rows: Row[]; count: number | null } {
  if (Array.isArray(res)) return { rows: res as Row[], count: null };
  if (res && typeof res === "object" && "rows" in res) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = res as any;
    return { rows: Array.isArray(r.rows) ? r.rows : [], count: typeof r.count === "number" ? r.count : null };
  }
  return { rows: [], count: null };
}

export function AdminCrud<Row extends { id: string }>(props: AdminCrudProps<Row>) {
  const {
    entityName,
    entityNamePlural,
    fields,
    columns,
    emptyValues,
    toForm,
    fromForm,
    searchable = true,
    pageSize = 25,
  } = props;

  const qc = useQueryClient();
  const cacheKey = props.queryKey ?? entityName;

  const list = useServerFn(props.listFn as never) as unknown as (arg: { data: Record<string, unknown> }) => Promise<unknown>;
  const create = useServerFn(props.createFn as never) as unknown as (arg: { data: Record<string, unknown> }) => Promise<unknown>;
  const update = useServerFn(props.updateFn as never) as unknown as (arg: { data: { id: string; patch: Record<string, unknown> } }) => Promise<unknown>;
  const remove = useServerFn(props.deleteFn as never) as unknown as (arg: { data: { id: string } }) => Promise<unknown>;

  const hasStatus = useMemo(
    () => fields.some((f) => f.name === "content_status"),
    [fields],
  );

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "draft" | "published" | "archived">("");
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(emptyValues);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Debounce search input → committed search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const listQuery = useQuery({
    queryKey: ["admin-crud", cacheKey, { search, page, pageSize, statusFilter }],
    queryFn: async () => {
      const res = await list({
        data: {
          limit: pageSize,
          offset: page * pageSize,
          ...(search ? { search } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        },
      });
      return coerceListResult<Row>(res);
    },
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });

  const rows = listQuery.data?.rows ?? [];
  const count = listQuery.data?.count ?? null;
  const totalPages = count != null ? Math.max(1, Math.ceil(count / pageSize)) : null;
  const loading = listQuery.isLoading;
  const refetching = listQuery.isFetching && !listQuery.isLoading;

  const invalidateList = () =>
    qc.invalidateQueries({ queryKey: ["admin-crud", cacheKey] });

  const createMut = useMutation({
    mutationFn: (payload: Record<string, unknown>) => create({ data: payload }),
    onSuccess: () => {
      toast.success("تمت الإضافة");
      setShowForm(false);
      void invalidateList();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحفظ"),
  });

  const updateMut = useMutation({
    mutationFn: (vars: { id: string; patch: Record<string, unknown> }) =>
      update({ data: vars }),
    onSuccess: () => {
      toast.success("تم الحفظ");
      setShowForm(false);
      void invalidateList();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحفظ"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("تم الحذف");
      setConfirmDelete(null);
      void invalidateList();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحذف"),
  });

  const busy = createMut.isPending || updateMut.isPending || deleteMut.isPending;

  // Surface fetch errors as toasts (once per error object)
  useEffect(() => {
    if (listQuery.error) {
      toast.error(listQuery.error instanceof Error ? listQuery.error.message : "فشل التحميل");
    }
  }, [listQuery.error]);

  const rangeLabel = useMemo(() => {
    if (count == null) return `${rows.length} عنصر`;
    if (count === 0) return "لا توجد نتائج";
    const from = page * pageSize + 1;
    const to = Math.min((page + 1) * pageSize, count);
    return `${from}–${to} من ${count}`;
  }, [count, page, pageSize, rows.length]);



  const closeForm = () => {
    if (busy) return;
    setConfirmDiscard(true);
  };

  const doDiscard = () => {
    setConfirmDiscard(false);
    setShowForm(false);
  };

  useEffect(() => {
    if (!showForm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeForm();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, busy]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyValues);
    setShowForm(true);
  };

  const openEdit = (row: Row) => {
    setEditingId(row.id);
    setForm(toForm ? toForm(row) : (row as unknown as Record<string, unknown>));
    setShowForm(true);
  };


  const performDelete = () => {
    if (!confirmDelete) return;
    deleteMut.mutate(confirmDelete.id);
  };

  const submitForm = (overrideStatus?: "draft" | "published") => {
    const source = overrideStatus
      ? { ...form, content_status: overrideStatus }
      : form;
    const payload = fromForm ? fromForm(source) : sanitizeForm(source, fields);
    if (editingId) {
      updateMut.mutate({ id: editingId, patch: payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const quickSetStatus = (row: Row, next: "draft" | "published") => {
    updateMut.mutate({ id: row.id, patch: { content_status: next } });
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {searchable && (
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="بحث…"
              className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          )}
          <button
            type="button"
            onClick={() => void listQuery.refetch()}
            disabled={refetching}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            {refetching ? "…" : "تحديث"}
          </button>
          <span className="text-xs text-neutral-500">{rangeLabel}</span>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          + إضافة {entityName}
        </button>
      </div>

      {hasStatus && (
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {([
            { v: "", label: "الكل" },
            { v: "published", label: "منشور" },
            { v: "draft", label: "مسودة" },
            { v: "archived", label: "مؤرشف" },
          ] as const).map((t) => {
            const active = statusFilter === t.v;
            return (
              <button
                key={t.v || "all"}
                type="button"
                onClick={() => {
                  setStatusFilter(t.v as typeof statusFilter);
                  setPage(0);
                }}
                className={cn(
                  "rounded-full px-3 py-1 border transition",
                  active
                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                    : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className={cn("text-start px-4 py-3 font-medium text-neutral-600 dark:text-neutral-300", col.className)}>
                    {col.header}
                  </th>
                ))}
                <th className="text-start px-4 py-3 font-medium text-neutral-600 dark:text-neutral-300 w-32">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-neutral-500">جارِ التحميل…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-neutral-500">لا توجد {entityNamePlural} بعد.</td></tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    {columns.map((col, i) => (
                      <td key={i} className={cn("px-4 py-3 align-top", col.className)}>
                        {col.render(row)}
                      </td>
                    ))}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => openEdit(row)}
                          className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                        >
                          تعديل
                        </button>
                        {hasStatus && (() => {
                          const cs = (row as unknown as { content_status?: string }).content_status;
                          if (cs === "published") {
                            return (
                              <button
                                onClick={() => quickSetStatus(row, "draft")}
                                disabled={busy}
                                className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
                              >
                                تحويل لمسودة
                              </button>
                            );
                          }
                          return (
                            <button
                              onClick={() => quickSetStatus(row, "published")}
                              disabled={busy}
                              className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                            >
                              نشر
                            </button>
                          );
                        })()}
                        <button
                          onClick={() => setConfirmDelete(row)}
                          disabled={busy}
                          className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 text-xs dark:border-neutral-800">
            <div className="text-neutral-500">
              صفحة {page + 1} من {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || refetching}
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => (totalPages ? Math.min(totalPages - 1, p + 1) : p + 1))}
                disabled={page + 1 >= totalPages || refetching}
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>


      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-crud-title"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <div className="w-full max-w-3xl my-8 rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <h2 id="admin-crud-title" className="text-lg font-semibold">
                {editingId ? `تعديل ${entityName}` : `إضافة ${entityName}`}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                aria-label="إغلاق"
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                ✕
              </button>

            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={(v) => setForm((f) => ({ ...f, [field.name]: v }))}
                />
              ))}
              <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                >
                  إلغاء
                </button>

                {hasStatus && (
                  <button
                    type="button"
                    onClick={() => submitForm("draft")}
                    disabled={busy}
                    className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
                  >
                    حفظ كمسودة
                  </button>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                >
                  {busy ? "جارِ الحفظ…" : editingId ? "حفظ التعديلات" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !busy) setConfirmDelete(null);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold">حذف {entityName}؟</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              هذا الإجراء لا يمكن التراجع عنه. سيُحذف العنصر نهائيًا.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={busy}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void performDelete()}
                disabled={busy}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {busy ? "جارِ الحذف…" : "حذف نهائي"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDiscard && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmDiscard(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-semibold">تجاهل التغييرات؟</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              لديك تغييرات لم تُحفظ بعد. هل تريد الخروج وتجاهلها؟
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDiscard(false)}
                className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                متابعة التعديل
              </button>
              <button
                type="button"
                onClick={doDiscard}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                تجاهل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const colSpan = field.colSpan === 2 || field.type === "textarea" || field.type === "richtext" ? "md:col-span-2" : "";
  const baseInput =
    "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-white";

  const labelEl = (
    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
      {field.label}
      {"required" in field && field.required && <span className="text-red-500">*</span>}
    </label>
  );
  const helpEl = "help" in field && field.help ? (
    <p className="text-[11px] text-neutral-500">{field.help}</p>
  ) : null;

  if (field.type === "boolean") {
    return (
      <div className={cn("flex items-center gap-3", colSpan)}>
        <input
          id={`f-${field.name}`}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor={`f-${field.name}`} className="text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
          {field.label}
        </label>
        {helpEl}
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <div className={cn("flex flex-col gap-1", colSpan)}>
        <ImageInput
          label={field.label}
          value={(value as string) ?? null}
          onChange={(url) => onChange(url)}
          folder={field.folder ?? "content"}
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={cn("flex flex-col gap-1", colSpan)}>
        {labelEl}
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        >
          <option value="">— اختر —</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {helpEl}
      </div>
    );
  }

  if (field.type === "tags") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    const addTokens = (raw: string) => {
      const parts = raw
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (!parts.length) return;
      const next = [...arr];
      for (const p of parts) if (!next.includes(p)) next.push(p);
      onChange(next);
    };
    const commitInput = (input: HTMLInputElement) => {
      const text = input.value.trim();
      if (!text) return;
      addTokens(text);
      input.value = "";
    };
    return (
      <div className={cn("flex flex-col gap-1", colSpan)}>
        {labelEl}
        <div
          className={cn(
            baseInput,
            "flex flex-wrap items-center gap-1.5 min-h-10 h-auto py-1.5 cursor-text",
          )}
          onClick={(e) => {
            const input = (e.currentTarget.querySelector("input") as HTMLInputElement | null);
            input?.focus();
          }}
          onKeyDownCapture={(e) => {
            if (e.key !== "Enter" && e.key !== ",") return;
            if (!(e.target instanceof HTMLInputElement)) return;
            e.preventDefault();
            e.stopPropagation();
            commitInput(e.target);
          }}
        >
          {arr.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onChange(arr.filter((_, j) => j !== i))}
                className="text-neutral-500 hover:text-red-600"
                aria-label="حذف"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            enterKeyHint="done"
            data-admin-tags-input="true"
            placeholder={field.placeholder ?? "اكتب واضغط Enter"}
            className="flex-1 min-w-24 bg-transparent outline-none text-sm py-0.5"
            onKeyDown={(e) => {
              const el = e.currentTarget;
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                e.stopPropagation();
                commitInput(el);
              } else if (e.key === "Backspace" && !el.value && arr.length) {
                onChange(arr.slice(0, -1));
              }
            }}
            onBlur={(e) => {
              if (e.currentTarget.value.trim()) {
                addTokens(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              if (/[,\n]/.test(text)) {
                e.preventDefault();
                addTokens(text);
              }
            }}
          />
        </div>
        {helpEl}
      </div>
    );
  }

  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <div className={cn("flex flex-col gap-1", colSpan)}>
        {labelEl}
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? (field.type === "richtext" ? 10 : 4)}
          placeholder={field.placeholder}
          dir={field.dir}
          className={cn(baseInput, "font-normal leading-relaxed")}
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div className={cn("flex flex-col gap-1", colSpan)}>
        {labelEl}
        <input
          type="number"
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          min={field.min}
          max={field.max}
          step={field.step}
          className={baseInput}
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "json") {
    let display: string;
    if (typeof value === "string") display = value;
    else if (value === null || value === undefined) display = "";
    else {
      try { display = JSON.stringify(value, null, 2); } catch { display = ""; }
    }
    return (
      <div className={cn("flex flex-col gap-1", colSpan)}>
        {labelEl}
        <textarea
          value={display}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? 8}
          dir="ltr"
          className={cn(baseInput, "font-mono text-xs")}
          placeholder='[]  أو  {"key":"value"}'
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "gallery") {
    return (
      <div className={cn("flex flex-col gap-2", colSpan)}>
        {labelEl}
        <GalleryInput
          value={value}
          onChange={(items) => onChange(items)}
          folder={field.folder ?? "gallery"}
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "structured") {
    return (
      <div className={cn("flex flex-col gap-2", colSpan)}>
        {labelEl}
        <StructuredListInput
          value={value}
          onChange={(items) => onChange(items)}
          schema={field.schema}
          addLabel={field.addLabel}
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "object") {
    return (
      <div className={cn("flex flex-col gap-2", colSpan)}>
        {labelEl}
        <ObjectInput
          value={value}
          onChange={(v) => onChange(v)}
          schema={field.schema}
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "sortable") {
    const stored = Array.isArray(value) ? (value as string[]) : [];
    const known = new Set(field.items.map((i) => i.value));
    const validStored = stored.filter((v) => known.has(v));
    const missing = field.items.map((i) => i.value).filter((v) => !validStored.includes(v));
    const order = [...validStored, ...missing];
    const move = (idx: number, dir: -1 | 1) => {
      const target = idx + dir;
      if (target < 0 || target >= order.length) return;
      const next = [...order];
      [next[idx], next[target]] = [next[target], next[idx]];
      onChange(next);
    };
    const reset = () => onChange(field.items.map((i) => i.value));
    return (
      <div className={cn("flex flex-col gap-2", colSpan)}>
        <div className="flex items-center justify-between">
          {labelEl}
          <button
            type="button"
            onClick={reset}
            className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            إعادة الترتيب الافتراضي
          </button>
        </div>
        <ol className="flex flex-col gap-1.5 rounded-md border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
          {order.map((key, i) => {
            const item = field.items.find((it) => it.value === key);
            if (!item) return null;
            return (
              <li
                key={key}
                className="flex items-center justify-between gap-3 rounded-md bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-800/50"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] tabular-nums text-neutral-500 w-5" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded border border-neutral-200 px-2 py-0.5 text-xs disabled:opacity-40 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    aria-label="نقل لأعلى"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    className="rounded border border-neutral-200 px-2 py-0.5 text-xs disabled:opacity-40 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    aria-label="نقل لأسفل"
                  >
                    ↓
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
        {helpEl}
      </div>
    );
  }

  // text/url/date/datetime
  let displayVal = (value as string) ?? "";
  if (field.type === "date" && displayVal) displayVal = displayVal.slice(0, 10);
  if (field.type === "datetime" && displayVal) {
    // ISO → local datetime input (YYYY-MM-DDTHH:mm)
    const d = new Date(displayVal);
    if (!isNaN(d.getTime())) {
      const pad = (n: number) => String(n).padStart(2, "0");
      displayVal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
  }
  return (
    <div className={cn("flex flex-col gap-1", colSpan)}>
      {labelEl}
      <input
        type={field.type === "url" ? "url" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text"}
        value={displayVal}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        dir={field.dir}
        className={baseInput}
      />
      {helpEl}
    </div>
  );
}

function sanitizeForm(form: Record<string, unknown>, fields: FieldDef[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const v = form[field.name];
    if (field.type === "boolean") {
      out[field.name] = Boolean(v);
    } else if (field.type === "number") {
      out[field.name] = v === "" || v === null || v === undefined ? null : Number(v);
    } else if (field.type === "tags") {
      out[field.name] = Array.isArray(v) ? v : [];
    } else if (field.type === "gallery" || field.type === "structured") {
      out[field.name] = Array.isArray(v) ? v : [];
    } else if (field.type === "object") {
      out[field.name] = v && typeof v === "object" && !Array.isArray(v) ? v : null;
    } else if (field.type === "image" || field.type === "url") {
      const s = typeof v === "string" ? v.trim() : "";
      out[field.name] = s || null;
    } else if (field.type === "date") {
      const s = typeof v === "string" ? v.trim() : "";
      out[field.name] = s || null;
    } else if (field.type === "datetime") {
      const s = typeof v === "string" ? v.trim() : "";
      // Convert local datetime → ISO
      out[field.name] = s ? new Date(s).toISOString() : null;
    } else if (field.type === "json") {
      const s = typeof v === "string" ? v.trim() : "";
      if (!s) { out[field.name] = []; continue; }
      try {
        out[field.name] = JSON.parse(s);
      } catch {
        throw new Error(`تنسيق JSON غير صالح في الحقل "${field.label}"`);
      }
    } else {
      const s = typeof v === "string" ? v : "";
      out[field.name] = s.trim() === "" ? null : s;
    }
  }
  return out;
}
