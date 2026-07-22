import { useRouter } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

/**
 * Arabic-friendly error boundary for the admin layout.
 * Surfaces runtime errors (network, undefined access, auth) with a clear
 * recovery path rather than a blank page or raw stack trace.
 */
export function AdminErrorBoundary({ error, reset }: AdminErrorBoundaryProps) {
  const router = useRouter();
  const message = error?.message ?? "خطأ غير متوقّع";

  // Map common technical errors to Arabic guidance.
  const friendly = (() => {
    const m = message.toLowerCase();
    if (m.includes("unauthorized") || m.includes("لا تملك"))
      return "انتهت جلستك أو ليس لديك صلاحية. أعد تسجيل الدخول.";
    if (m.includes("network") || m.includes("failed to fetch"))
      return "تعذّر الاتصال بالخادم. تحقّق من الإنترنت وحاول مجدداً.";
    if (m.includes("undefined") && m.includes("from"))
      return "حصل خطأ في تحميل قاعدة البيانات. جرّب إعادة التحميل.";
    return message;
  })();

  return (
    <div
      role="alert"
      className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-7 text-destructive" aria-hidden />
      </div>
      <h1 className="text-xl font-semibold text-foreground">
        حصل خطأ أثناء تحميل هذه الصفحة
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{friendly}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button
          onClick={() => {
            reset();
            router.invalidate();
          }}
          className="gap-2"
        >
          <RefreshCw className="size-4" aria-hidden />
          إعادة المحاولة
        </Button>
        <Button
          variant="outline"
          onClick={() => router.navigate({ to: "/admin" })}
          className="gap-2"
        >
          <Home className="size-4" aria-hidden />
          لوحة الإدارة
        </Button>
      </div>

      {import.meta.env.DEV ? (
        <details className="mt-6 w-full text-left" dir="ltr">
          <summary className="cursor-pointer text-xs text-muted-foreground">
            Technical details (dev only)
          </summary>
          <pre className="mt-2 overflow-auto rounded-md border border-border bg-muted/50 p-3 text-[11px] text-muted-foreground">
            {error?.stack ?? message}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
