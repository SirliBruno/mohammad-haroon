import { cn } from "@/lib/utils";
import type { StructuredFieldSchema } from "./structured-list-input";

/** Edit a single object with a fixed schema (e.g. testimonial: {quote,author,role}). */
export function ObjectInput({
  value,
  onChange,
  schema,
  className,
}: {
  value: unknown;
  onChange: (v: Record<string, string> | null) => void;
  schema: StructuredFieldSchema[];
  className?: string;
}) {
  const obj: Record<string, string> =
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(
          schema.map((f) => {
            const raw = (value as Record<string, unknown>)[f.name];
            return [f.name, typeof raw === "string" ? raw : raw != null ? String(raw) : ""];
          }),
        )
      : Object.fromEntries(schema.map((f) => [f.name, ""]));

  const isEmpty = schema.every((f) => !(obj[f.name] ?? "").trim());

  const setField = (name: string, val: string) => {
    const next = { ...obj, [name]: val };
    const allEmpty = schema.every((f) => !(next[f.name] ?? "").trim());
    onChange(allEmpty ? null : next);
  };

  const baseInput =
    "w-full rounded-md border border-input bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-border dark:bg-neutral-900 dark:focus:ring-white";

  return (
    <div className={cn("flex flex-col gap-2 rounded-lg border border-border bg-white p-3 dark:border-border dark:bg-neutral-900", className)}>
      {schema.map((f) => (
        <label key={f.name} className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground">{f.label}</span>
          {f.type === "textarea" ? (
            <textarea
              value={obj[f.name] ?? ""}
              onChange={(e) => setField(f.name, e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              className={baseInput}
            />
          ) : (
            <input
              type="text"
              value={obj[f.name] ?? ""}
              onChange={(e) => setField(f.name, e.target.value)}
              placeholder={f.placeholder}
              className={baseInput}
            />
          )}
        </label>
      ))}
      {!isEmpty && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="self-start rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          مسح الحقول
        </button>
      )}
    </div>
  );
}
