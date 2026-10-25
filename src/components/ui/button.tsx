"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRINGS } from "@/lib/motion";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart"> {
  variant?: "primary" | "secondary" | "champagne" | "outline" | "ghost" | "destructive";
  size?: "sm" | "default" | "lg" | "icon";
  isLoading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-[0_4px_16px_rgba(245,158,11,0.25)] border border-amber-400/50",
  secondary:
    "bg-[#240e05]/75 backdrop-blur-xl text-foreground hover:bg-[#240e05]/95 border border-amber-500/25 shadow-sm",
  champagne:
    "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold hover:brightness-105 shadow-[0_4px_16px_rgba(245,158,11,0.30)] border border-amber-300/60",
  outline:
    "border border-amber-500/25 bg-[#240e05]/60 backdrop-blur-xl text-foreground hover:bg-[#240e05]/90 hover:border-amber-500/40 hover:text-white shadow-[0_4px_16px_0_rgba(18,7,2,0.3)]",
  ghost: "bg-transparent text-foreground hover:bg-amber-500/10 hover:text-amber-300",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm border border-red-500/30",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  default: "h-10 px-4 py-2 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5 font-medium",
  icon: "h-9 w-9 p-0 rounded-lg justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
        transition={SPRINGS.snappy}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...(props as HTMLMotionProps<"button">)}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
