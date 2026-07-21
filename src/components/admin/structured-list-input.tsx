import { cn } from "@/lib/utils";

export type StructuredFieldSchema = {
  name: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
};

/**
 * Edit an array of objects with a fixed schema (e.g. metrics: {label, value}).
 * Renders one row per item with add/remove/reorder controls.
 */
export function StructuredListInput({
  value,
  onChange,
  schema,
  className,
  addLabel = "+ إضافة عنصر",
}: {
  value: unknown;
  onChange: (items: Record<string, string>[]) => void;
  schema: StructuredFieldSchema[];
  className?: string;
  addLabel?: string;
}) {
  const items: Record<string, string>[] = Array.isArray(value)
    ? (value as unknown[]).map((v) => {
        if (v && typeof v === "object") {
          const out: Record<string, string> = {};
          for (const f of schema) {
            const raw = (v as Record<string, unknown>)[f.name];
            out[f.name] = typeof raw === "string" ? raw : raw != null ? String(raw) : "";
          }
          return out;
        }
        return Object.fromEntries(schema.map((f) => [f.name, ""]));
      })
    : [];

  const emptyRow = () => Object.fromEntries(schema.map((f) => [f.name, ""])) as Record<string, string>;

  const add = () => onChange([...items, emptyRow()]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, name: string, val: string) =>
    onChange(items.map((row, idx) => (idx === i ? { ...row, [name]: val } : row)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const baseInput =
    "w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-white";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((row, i) => (
            <li
              key={i}
              className="grid grid-cols-1 gap-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-[1fr_auto]"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {schema.map((f) => (
                  <label key={f.name} className="flex flex-col gap-1">
                    <span className="text-[11px] text-neutral-500">{f.label}</span>
                    {f.type === "textarea" ? (
                      <textarea
                        value={row[f.name] ?? ""}
                        onChange={(e) => update(i, f.name, e.target.value)}
                        placeholder={f.placeholder}
                        rows={3}
                        className={baseInput}
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[f.name] ?? ""}
                        onChange={(e) => update(i, f.name, e.target.value)}
                        placeholder={f.placeholder}
                        className={baseInput}
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="flex sm:flex-col items-start gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
        <button
          type="button"
          onClick={add}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}
