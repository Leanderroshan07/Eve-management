import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl glass-field px-4 py-2.5 text-sm text-foreground",
            "placeholder:text-amber-200/40",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
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
Input.displayName = "Input";
