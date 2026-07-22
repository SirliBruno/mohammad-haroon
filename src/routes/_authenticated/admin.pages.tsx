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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  PAGE_GROUPS,
  usePageContent,
  useSavePageSection,
  type HomeContentRow,
  type HomeSectionDef,
} from "@/lib/cms/home-content";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: Page,
  head: () => ({ meta: [{ title: "محتوى الصفحات" }] }),
});

function Page() {
  const [active, setActive] = useState<string>(PAGE_GROUPS[0]!.id);

  return (
    <AdminShell
      title="محتوى الصفحات"
      description="عدّل ترويسات وأوصاف كل صفحة عامة (من أنا، تواصل، المسيرة، الأعمال، الخدمات)."
    >
      <Tabs value={active} onValueChange={setActive} className="space-y-6">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          {PAGE_GROUPS.map((g) => (
            <TabsTrigger key={g.id} value={g.id}>
              {g.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAGE_GROUPS.map((g) => (
          <TabsContent key={g.id} value={g.id} className="space-y-6">
            <GroupEditor group={g} />
          </TabsContent>
        ))}
      </Tabs>
    </AdminShell>
  );
}

function GroupEditor({
  group,
}: {
  group: (typeof PAGE_GROUPS)[number];
}) {
  const { data: rows, isLoading } = usePageContent(group.id);
  if (isLoading || !rows) {
    return (
      <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
        جارِ التحميل…
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {group.sections.map((section) => (
        <SectionEditor
          key={section.id}
          groupId={group.id}
          section={section}
          rows={rows}
        />
      ))}
    </div>
  );
}

function SectionEditor({
  groupId,
  section,
  rows,
}: {
  groupId: string;
  section: HomeSectionDef;
  rows: HomeContentRow[];
}) {
  const save = useSavePageSection(groupId);
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
                  className="text-[10px] text-muted-foreground"
                  dir="ltr"
                >
                  {f.key}
                </code>
              </div>
              {f.help ? (
                <p className="mt-1 text-[11px] text-muted-foreground" dir="ltr">
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
                <p className="mt-1 text-[11px] text-destructive">
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
