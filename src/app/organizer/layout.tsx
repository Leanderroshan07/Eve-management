"use client";

import * as React from "react";
import { OrganizerSidebar } from "@/components/organizer/sidebar";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export default function OrganizerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col md:flex-row antialiased">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0">
        <OrganizerSidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 w-64 max-w-[80vw] h-full bg-[#160803] border-r border-amber-500/20 shadow-2xl"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-3 p-1.5 rounded-lg text-amber-200/60 hover:text-amber-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <OrganizerSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-transparent">
        {children}
      </div>
    </div>
  );
}
