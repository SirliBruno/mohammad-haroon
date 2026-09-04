import { useState, useRef, useEffect, type ElementType, type KeyboardEvent } from "react";
import { Pencil, Check } from "lucide-react";
import { useLiveEdit } from "./live-edit-context";
import { cn } from "@/lib/utils";

export interface EditableTextProps {
  contentKey: string;
  defaultText: string;
  groupName?: string;
  multiline?: boolean;
  className?: string;
  as?: ElementType;
}

export function EditableText({
  contentKey,
  defaultText,
  groupName = "home",
  multiline = false,
  className,
  as: Component = "span",
}: EditableTextProps) {
  const { isEditMode, getLiveText, setLiveDraft, dirtyKeys } = useLiveEdit();
  const currentText = getLiveText(contentKey, defaultText);
  const isDirty = dirtyKeys.has(contentKey);

  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(currentText);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Sync val with live text changes
  useEffect(() => {
    setVal(currentText);
  }, [currentText]);

  // Focus and select text when editing begins
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Normal view when not in live edit mode
  if (!isEditMode) {
    return <Component className={className}>{currentText}</Component>;
  }

  const handleCommit = () => {
    setIsEditing(false);
    if (val !== currentText) {
      setLiveDraft(contentKey, val, groupName);
    }
  };

  const handleCancel = () => {
    setVal(currentText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleCommit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  // Active inline input state
  if (isEditing) {
    return (
      <span className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            rows={3}
            className={cn(
              "w-full rounded-lg border-2 border-accent bg-card/95 p-2.5 text-foreground shadow-xl focus:outline-none focus:ring-2 focus:ring-accent/30 font-sans",
              className,
            )}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full rounded-lg border-2 border-accent bg-card/95 px-2.5 py-1 text-foreground shadow-xl focus:outline-none focus:ring-2 focus:ring-accent/30",
              className,
            )}
          />
        )}
        <span className="absolute -top-7 left-2 flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground shadow-md pointer-events-none">
          <Check className="size-3" /> تم التعديل (اضغط خارجاً أو Enter للتثبيت)
        </span>
      </span>
    );
  }

  // Hoverable inline trigger in edit mode
  return (
    <Component
      onClick={() => setIsEditing(true)}
      title="انقر لتعديل هذا النص مباشرة"
      className={cn(
        "group/editable relative inline-block cursor-pointer transition-all duration-200",
        "rounded-md border border-dashed hover:border-accent/70 hover:bg-accent/5 px-1 py-0.5 -mx-1 -my-0.5",
        isDirty
          ? "border-amber-500/80 bg-amber-500/10"
          : "border-transparent hover:border-accent/40",
        className,
      )}
    >
      {currentText}
      <span className="inline-flex size-4 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 group-hover/editable:opacity-100 transition-opacity ms-1.5 align-middle shadow-xs">
        <Pencil className="size-2.5" />
      </span>
      {isDirty && (
        <span
          title="تعديل غير محفوظ"
          className="absolute -top-1.5 -right-1.5 size-2.5 rounded-full bg-amber-500 ring-2 ring-background animate-pulse"
        />
      )}
    </Component>
  );
}
