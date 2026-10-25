"use client";

import * as React from "react";
import Link from "next/link";
import { RentalSidebar } from "@/components/rental/sidebar";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Bell, Truck, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RentalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col md:flex-row antialiased">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        <RentalSidebar />
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-editorial text-base font-bold text-foreground">
              VELUXE
            </span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-gold-primary/15 text-gold-headline-accent border border-gold-primary/30">
              Rentals
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/rentals" target="_blank">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <span>Catalog</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-3 p-1.5 rounded-lg text-foreground hover:bg-secondary z-20 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <RentalSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-transparent">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
