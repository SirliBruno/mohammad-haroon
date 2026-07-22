import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { signHeroMediaPath } from "@/lib/cms/hero.functions";
import { cn } from "@/lib/utils";

/**
 * Reusable image input. Uploads to the private `media` bucket then swaps in
 * a 10-year signed URL. Reuses `signHeroMediaPath` (bucket-agnostic despite
 * the name). Emits the final URL through `onChange`.
 */
export function ImageInput({
  value,
  onChange,
  folder = "content",
  label,
  className,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  className?: string;
}) {
  const sign = useServerFn(signHeroMediaPath);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { url } = (await sign({ data: { path } })) as { url: string };
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل الرفع");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-xs font-medium text-foreground dark:text-muted-foreground">{label}</label>}
      <div className="flex items-start gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-20 w-20 rounded-lg object-cover border border-border dark:border-border"
          />
        ) : (
          <div className="h-20 w-20 rounded-lg border border-dashed border-input bg-neutral-100 flex items-center justify-center text-xs text-muted-foreground dark:border-border dark:bg-neutral-800">
            بدون صورة
          </div>
        )}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-md border border-input bg-white px-3 py-1.5 text-xs hover:bg-muted dark:border-border dark:bg-neutral-800 dark:hover:bg-neutral-700">
              {busy ? "جاري الرفع…" : "رفع صورة"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
              >
                إزالة
              </button>
            )}
          </div>
          <input
            type="url"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="أو ألصق رابط الصورة"
            dir="ltr"
            className="w-full rounded-md border border-input bg-white px-2.5 py-1.5 text-xs dark:border-border dark:bg-neutral-900"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
