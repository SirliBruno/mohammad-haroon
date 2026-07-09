import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * DS Field — labelled input row with helper text and error slot.
 * Wraps shadcn Input/Textarea to enforce our label rhythm and a11y wiring.
 */
type BaseProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

export function Field({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: BaseProps & { children: React.ReactNode }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id} className="text-sm">
          {label}
          {required ? <span aria-hidden className="ms-0.5 text-destructive">*</span> : null}
        </Label>
      </div>
      {React.cloneElement(children as React.ReactElement, {
        id,
        "aria-invalid": !!error || undefined,
        "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
        "aria-required": required || undefined,
      })}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField(props: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { id, label, hint, error, required, className, ...rest } = props;
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <Input {...rest} />
    </Field>
  );
}

export function TextAreaField(
  props: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { id, label, hint, error, required, className, ...rest } = props;
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <Textarea {...rest} />
    </Field>
  );
}
