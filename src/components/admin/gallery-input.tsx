import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { signHeroMediaPath } from "@/lib/cms/hero.functions";
import { cn } from "@/lib/utils";

export type GalleryItem = { src: string; alt: string };

/** Normalize legacy shapes: string[] or {url,alt}[] → {src,alt}[]. */
function normalize(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v): GalleryItem | null => {
      if (typeof v === "string") return { src: v, alt: "" };
      if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        const src = (o.src ?? o.url ?? o.href) as string | undefined;
        if (typeof src !== "string" || !src) return null;
        const alt = typeof o.alt === "string" ? o.alt : "";
        return { src, alt };
      }
      return null;
    })
    .filter((x): x is GalleryItem => x !== null);
}

export function GalleryInput({
  value,
  onChange,
  folder = "gallery",
  className,
}: {
  value: unknown;
  onChange: (items: GalleryItem[]) => void;
  folder?: string;
  className?: string;
}) {
  const items = normalize(value);
  const sign = useServerFn(signHeroMediaPath);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadOne = async (file: File): Promise<GalleryItem | null> => {
    const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) throw upErr;
    const { url } = (await sign({ data: { path } })) as { url: string };
    return { src: url, alt: "" };
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    setError(null);
    try {
      const next: GalleryItem[] = [...items];
      for (const f of Array.from(files)) {
        const it = await uploadOne(f);
        if (it) next.push(it);
      }
      onChange(next);
    } catch (e) {
      let msg = "فشل الرفع";
      if (e instanceof Error) {
        msg = e.message;
        try {
          const parsed = JSON.parse(e.message);
          if (Array.isArray(parsed) && parsed[0]?.message) {
            msg = parsed[0].message;
          }
        } catch {
          // keep original message
        }
      }
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const updateItem = (i: number, patch: Partial<GalleryItem>) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    onChange(next);
  };
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const addByUrl = () => {
    const url = window.prompt("ألصق رابط الصورة");
    if (!url) return;
    onChange([...items, { src: url.trim(), alt: "" }]);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-md border border-input bg-white px-3 py-1.5 text-xs hover:bg-muted dark:border-border dark:bg-neutral-800 dark:hover:bg-neutral-700">
          {busy ? "جاري الرفع…" : "+ إضافة صور"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={addByUrl}
          className="rounded-md border border-input bg-white px-3 py-1.5 text-xs hover:bg-muted dark:border-border dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          إضافة برابط
        </button>
        <span className="text-xs text-muted-foreground">
          {items.length ? `${items.length} صورة` : "لا توجد صور بعد"}
        </span>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {items.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((it, i) => (
            <li
              key={`${it.src}-${i}`}
              className="flex gap-3 rounded-lg border border-border bg-white p-3 dark:border-border dark:bg-neutral-900"
            >
              <img
                src={it.src}
                alt={it.alt}
                className="h-20 w-24 flex-none rounded-md object-cover border border-border dark:border-border"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  type="text"
                  value={it.alt}
                  onChange={(e) => updateItem(i, { alt: e.target.value })}
                  placeholder="نص بديل للصورة (alt)"
                  className="w-full rounded-md border border-input bg-white px-2.5 py-1.5 text-xs dark:border-border dark:bg-neutral-900"
                />
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded-md border border-input bg-white px-2 py-1 text-xs disabled:opacity-40 dark:border-border dark:bg-neutral-800"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="rounded-md border border-input bg-white px-2 py-1 text-xs disabled:opacity-40 dark:border-border dark:bg-neutral-800"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
