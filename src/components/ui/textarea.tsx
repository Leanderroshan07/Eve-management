import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <textarea
          className={cn(
            "flex min-h-[90px] w-full rounded-xl glass-field px-4 py-3 text-sm text-foreground",
            "placeholder:text-amber-200/40",
            "disabled:cursor-not-allowed disabled:opacity-45 disabled:bg-[#1c0c05]/50",
            error && "border-destructive! focus-visible:ring-destructive!",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
