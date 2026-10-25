import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
  | "default"
  | "secondary"
  | "champagne"
  | "success"
  | "warning"
  | "destructive"
  | "outline";
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  champagne:
    "border-[#d4af37]/40 bg-[#d4af37]/15 text-[#fcd34d] font-medium",
  success:
    "border-emerald-500/30 bg-emerald-950/50 text-emerald-300 font-medium",
  warning:
    "border-amber-500/35 bg-amber-950/50 text-amber-300 font-medium",
  destructive:
    "border-destructive/30 bg-destructive/20 text-red-300 font-medium",
  outline: "text-foreground border-border",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
