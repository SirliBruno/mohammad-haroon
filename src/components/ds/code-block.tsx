import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** CodeBlock — compact, monochrome. Toggles a copy button, no syntax highlighting. */
export function CodeBlock({
  code,
  language,
  filename,
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }, [code]);

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/60 bg-card", className)}>
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-xs text-muted-foreground">
          <span className="truncate font-mono">{filename ?? language}</span>
          {language && filename ? <span className="font-mono">{language}</span> : null}
        </div>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md border border-border/60 bg-background/70 text-muted-foreground opacity-0 backdrop-blur transition group-hover:opacity-100 hover:text-foreground"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
        <pre className="group overflow-x-auto p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-foreground/90">{code}</code>
        </pre>
      </div>
    </div>
  );
}
