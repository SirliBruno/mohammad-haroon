import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HOME_SECTIONS,
  useHomeContent,
  useSaveHomeSection,
  type HomeContentRow,
  type HomeSectionDef,
} from "@/lib/cms/home-content";

export const Route = createFileRoute("/_authenticated/admin/home")({
  component: Page,
  head: () => ({ meta: [{ title: "الصفحة الرئيسية" }] }),
});

function Page() {
  const { data: rows, isLoading } = useHomeContent();

  return (
    <AdminShell
      title="الصفحة الرئيسية"
      description="عدّل نصوص وأزرار وقوائم كل قسم من أقسام الصفحة الرئيسية."
    >
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
        💡 كل قسم يحفظ حقوله دفعة واحدة. الحقول من نوع JSON يجب أن تبقى بصيغة JSON صحيحة.
        بطاقات المشاريع، الخدمات (كصفحات كاملة)، الشهادات (الجدول)، والتوصيات تُدار من صفحاتها المخصّصة.
      </div>

      {isLoading || !rows ? (
        <div className="rounded-xl border border-neutral-200 p-6 text-sm text-neutral-500 dark:border-neutral-800">
          جارِ التحميل…
        </div>
      ) : (
        <div className="space-y-6">
          {HOME_SECTIONS.map((section) => (
            <SectionEditor key={section.id} section={section} rows={rows} />
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function SectionEditor({
  section,
  rows,
}: {
  section: HomeSectionDef;
  rows: HomeContentRow[];
}) {
  const save = useSaveHomeSection();
  const [values, setValues] = useState<Record<string, string>>({});
  const [jsonErrors, setJsonErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const f of section.fields) {
      const row = rows.find((r) => r.key === f.key);
      if (f.kind === "json") {
        const source =
          row?.metadata && Object.keys(row.metadata).length > 0
            ? row.metadata
            : (f.defaultValue as Record<string, unknown> | undefined) ?? {};
        next[f.key] = JSON.stringify(source, null, 2);
      } else {
        next[f.key] =
          row?.value_ar ??
          (typeof f.defaultValue === "string" ? f.defaultValue : "");
      }
    }
    setValues(next);
    setJsonErrors({});
  }, [rows, section]);

  const onSave = () => {
    const errors: Record<string, string | null> = {};
    for (const f of section.fields) {
      if (f.kind === "json") {
        const raw = values[f.key] ?? "";
        try {
          if (raw.trim()) JSON.parse(raw);
          errors[f.key] = null;
        } catch {
          errors[f.key] = "صيغة JSON غير صالحة.";
        }
      }
    }
    setJsonErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    save.mutate({ section, values });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg">{section.label}</CardTitle>
          {section.description ? (
            <CardDescription>{section.description}</CardDescription>
          ) : null}
        </div>
        <Button size="sm" onClick={onSave} disabled={save.isPending}>
          {save.isPending ? "جارِ الحفظ…" : "حفظ القسم"}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {section.fields.map((f) => {
          const isFullWidth = f.kind !== "text";
          return (
            <div key={f.key} className={isFullWidth ? "md:col-span-2" : ""}>
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">{f.label}</Label>
                <code
                  className="text-[10px] text-neutral-400 dark:text-neutral-500"
                  dir="ltr"
                >
                  {f.key}
                </code>
              </div>
              {f.help ? (
                <p
                  className="mt-1 text-[11px] text-neutral-500"
                  dir="ltr"
                >
                  {f.help}
                </p>
              ) : null}
              {f.kind === "text" ? (
                <Input
                  className="mt-1"
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                />
              ) : (
                <Textarea
                  className={
                    f.kind === "json"
                      ? "mt-1 font-mono text-xs"
                      : "mt-1 text-sm"
                  }
                  dir={f.kind === "json" ? "ltr" : "rtl"}
                  rows={f.rows ?? 4}
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                />
              )}
              {jsonErrors[f.key] ? (
                <p className="mt-1 text-[11px] text-red-600">
                  {jsonErrors[f.key]}
                </p>
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
