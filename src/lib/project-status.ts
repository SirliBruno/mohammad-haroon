import type { Project } from "@/features/projects/schema";

export type StatusMeta = { label: string; dot: string };

export function statusMeta(status: Project["status"]): StatusMeta {
  switch (status) {
    case "live":
      return { label: "منشور", dot: "bg-emerald-500" };
    case "in-progress":
      return { label: "قيد التنفيذ", dot: "bg-amber-500" };
    case "concept":
      return { label: "تصوّر", dot: "bg-sky-500" };
    case "archived":
      return { label: "مؤرشف", dot: "bg-muted-foreground" };
  }
}
