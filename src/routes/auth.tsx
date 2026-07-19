import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { DSButton, TextField } from "@/components/ds";
import { buildMeta } from "@/features/seo/build-meta";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: buildMeta({
      title: "تسجيل الدخول",
      description: "بوّابة الإدارة — تسجيل الدخول لإدارة محتوى الموقع.",
      path: "/auth",
    }),
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, status } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") {
    navigate({ to: "/admin", replace: true });
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="الإدارة" title="تسجيل الدخول" description="بوّابة محتوى الموقع." />
      <Section size="sm">
        <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-6" noValidate>
          <TextField
            id="email"
            label="البريد الإلكتروني"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="كلمة المرور"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <DSButton type="submit" disabled={loading}>
            {loading ? "جارٍ الدخول…" : "دخول"}
          </DSButton>
        </form>
      </Section>
    </>
  );
}
