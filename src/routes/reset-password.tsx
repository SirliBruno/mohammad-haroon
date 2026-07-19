import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/layout/section";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: "إعادة تعيين كلمة المرور" }] }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery hash automatically and fires PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
    if (password !== confirm) return setError("كلمتا المرور غير متطابقتين");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => navigate({ to: "/admin/hero" }), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحديث كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">تعيين كلمة مرور جديدة</h1>
        {!ready ? (
          <p className="mt-4 text-sm text-muted-foreground">
            رابط الاسترجاع غير صالح أو منتهي. <Link to="/auth" className="underline">إعادة المحاولة</Link>
          </p>
        ) : done ? (
          <p className="mt-4 text-sm text-emerald-600">تم تحديث كلمة المرور. جارِ التحويل…</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                minLength={8}
                dir="ltr"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">تأكيد كلمة المرور</label>
              <input
                type="password"
                required
                minLength={8}
                dir="ltr"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "جارِ الحفظ…" : "تحديث كلمة المرور"}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}
