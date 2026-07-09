import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "empty" | "error" | "success";

const kindIcon: Record<Kind, typeof Inbox> = {
  empty: Inbox,
  error: AlertCircle,
  success: CheckCircle2,
};

const kindTone: Record<Kind, string> = {
  empty: "text-muted-foreground",
  error: "text-destructive",
  success: "text-emerald-600 dark:text-emerald-400",
};

export function StateBlock({
  kind = "empty",
  title,
  description,
  action,
  className,
}: {
  kind?: Kind;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  const Icon = kindIcon[kind];
  return (
    <div
      role={kind === "error" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/60 px-6 py-16 text-center",
        className,
      )}
    >
      <div className={cn("grid size-10 place-items-center rounded-full bg-muted", kindTone[kind])}>
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export const EmptyState = (p: Omit<React.ComponentProps<typeof StateBlock>, "kind">) => (
  <StateBlock {...p} kind="empty" />
);
export const ErrorState = (p: Omit<React.ComponentProps<typeof StateBlock>, "kind">) => (
  <StateBlock {...p} kind="error" />
);
export const SuccessState = (p: Omit<React.ComponentProps<typeof StateBlock>, "kind">) => (
  <StateBlock {...p} kind="success" />
);
