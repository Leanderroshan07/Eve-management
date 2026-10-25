"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll } from "motion/react";

import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    // Check initial scroll position
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 20);
    }

    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border/80 bg-background/90 backdrop-blur-md shadow-xs"
          : "border-b border-border/40 bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Brand Identity */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#b38e22] dark:text-[#f0cf65] border border-[#d4af37]/30 transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-xl font-bold tracking-tight text-foreground">
                  VELUXE
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground -mt-1">
                  Events Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link
                href="/marketplace"
                className="text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" /> Marketplace
              </Link>
              <Link href="/marketplace?tab=workers" className="hover:text-foreground transition-colors">
                Event Staff
              </Link>
              <Link href="/worker/dashboard" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
                Worker Portal
              </Link>
              <a href="#organizers" className="hover:text-foreground transition-colors">
                Organizers
              </a>
              <a href="#packages" className="hover:text-foreground transition-colors">
                Packages
              </a>
              <Link href="/rentals" className="hover:text-foreground transition-colors">
                Equipment Rentals
              </Link>
            </nav>

            {/* Actions */}
            <div className="hidden sm:flex items-center gap-2.5">
              <Link href="/customer/dashboard">
                <Button variant="outline" size="sm" className="text-xs">
                  Customer Portal
                </Button>
              </Link>

              <Link href="/organizer/dashboard">
                <Button variant="champagne" size="sm" className="gap-1.5 text-xs">
                  Organizer Admin <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-border bg-background px-4 py-5 sm:hidden"
              >
                <div className="flex flex-col gap-4 text-base font-medium">
                  <a
                    href="#organizers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#d4af37]"
                  >
                    Event Organizers
                  </a>
                  <a
                    href="#packages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#d4af37]"
                  >
                    Custom Packages
                  </a>
                  <a
                    href="#workforce"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#d4af37]"
                  >
                    Catering Staff & Workers
                  </a>
                  <a
                    href="#rentals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#d4af37]"
                  >
                    Equipment Rentals
                  </a>
                  <a
                    href="#motion-showcase"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#a07817] dark:text-[#f0cf65] font-semibold"
                  >
                    Motion System Showcase
                  </a>
                  <div className="pt-3 flex flex-col gap-2">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                    <Button variant="champagne" className="w-full">
                      Get Started
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </header>
  );
}
