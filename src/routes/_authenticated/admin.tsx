import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { useAuth } from "@/hooks/use-auth";
import { DSButton } from "@/components/ds";
import { buildMeta } from "@/features/seo/build-meta";
import { CMS_COLLECTIONS } from "@/features/cms";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: buildMeta({ title: "لوحة الإدارة", description: "", path: "/admin" }) }),
  component: AdminHome,
});

/**
 * Placeholder admin shell. The visual CMS UI plugs in here later —
 * this route only proves the auth gate + hooks layer wire together.
 */
function AdminHome() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <>
      <PageHeader
        eyebrow="الإدارة"
        title="لوحة المحتوى"
        description={
          isAdmin
            ? "مرحبًا بك. هذه الشاشة تمهيديّة — واجهة تحرير المحتوى ستُبنى فوق هذه البنية."
            : "حسابك ليس مسؤولاً. تواصل مع المشرف لإسناد صلاحيّة الإدارة."
        }
      />
      <Section size="sm">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 text-sm">
            <p className="text-muted-foreground">المستخدم</p>
            <p className="mt-1 font-medium">{user?.email}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              الصلاحيّة: {isAdmin ? "admin" : "user"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">المجموعات المتاحة</p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CMS_COLLECTIONS.map((c) => (
                <li
                  key={c}
                  className="rounded-lg border border-border/60 bg-card px-4 py-3 text-sm"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <DSButton variant="outline" onClick={signOut}>
            تسجيل الخروج
          </DSButton>
        </div>
      </Section>
    </>
  );
}
