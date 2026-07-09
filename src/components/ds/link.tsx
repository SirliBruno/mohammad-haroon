import { Link, type LinkProps } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** DS Link — animated underline (story-link) applied consistently. */
export function DSLink(
  props: LinkProps & { className?: string; children: React.ReactNode },
) {
  const { className, children, ...rest } = props;
  return (
    <Link
      {...rest}
      className={cn(
        "story-link text-foreground transition-colors hover:text-primary",
        className,
      )}
    >
      {children}
    </Link>
  );
}
