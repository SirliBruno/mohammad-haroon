import { QueryClient } from "@tanstack/react-query";
import { createRouter, ErrorComponent, Link } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto my-16 max-w-lg rounded-2xl border border-border bg-background p-6 text-start">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">حدث خطأ</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">تعذّر تحميل هذا الجزء</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        وقعت مشكلة غير متوقعة. يمكنك إعادة المحاولة أو الرجوع إلى الصفحة الرئيسية.
      </p>
      <details className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer">تفاصيل تقنية</summary>
        <pre dir="ltr" className="mt-2 whitespace-pre-wrap break-words">
          {error?.message ?? String(error)}
        </pre>
      </details>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          إعادة المحاولة
        </button>
        <Link
          to="/"
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          الرئيسية
        </Link>
      </div>
      {import.meta.env.DEV && <ErrorComponent error={error} />}
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};
