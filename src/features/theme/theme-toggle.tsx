import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useHydrated } from "@/hooks/use-hydrated";

export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && resolved === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
