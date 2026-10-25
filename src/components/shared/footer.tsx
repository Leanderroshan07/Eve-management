import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/50 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4af37]/15 text-[#b38e22] dark:text-[#f0cf65] border border-[#d4af37]/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-editorial text-lg font-bold tracking-tight text-foreground">
              VELUXE
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              Phase 0 Foundation Architecture
            </span>
          </div>

          <p className="text-xs text-muted-foreground text-center md:text-right">
            Designed for high-end wedding & corporate event marketplaces.
            Strict typed contracts, accessible tokens, and GPU-accelerated motion.
          </p>
        </div>
      </div>
    </footer>
  );
}
