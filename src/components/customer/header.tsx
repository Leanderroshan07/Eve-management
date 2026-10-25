"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CURRENT_CUSTOMER } from "@/lib/customer-data";

export function CustomerHeader({
  onOpenMobile,
}: {
  onOpenMobile?: () => void;
}) {
  return (
    <header className="h-16 shrink-0 border-b border-amber-500/20 bg-[#160803]/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between text-foreground sticky top-0 z-30 transition-colors">
      {/* Mobile Toggle & Page Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-amber-200/70 hover:text-amber-100 hover:bg-amber-500/10 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Namaste, {CURRENT_CUSTOMER.name}
          </h2>
          <span className="text-[11px] text-amber-200/70">
            Planning Wedding & Sangeet at The Leela Palace
          </span>
        </div>
      </div>

      {/* Right Controls & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* 4-Way Role Switcher Pill */}
        <div className="flex items-center bg-[#240e05]/85 border border-amber-500/25 rounded-full p-1 text-xs shadow-md">
          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-xs">
            Customer
          </span>
          <Link
            href="/organizer/dashboard"
            className="px-2.5 py-1 rounded-full text-amber-200/70 hover:text-amber-100 transition-colors"
            title="Switch to Organizer Back-Office View"
          >
            Organizer
          </Link>
          <Link
            href="/worker/dashboard"
            className="px-2.5 py-1 rounded-full text-amber-200/70 hover:text-amber-100 transition-colors"
            title="Switch to Worker Portal"
          >
            Worker
          </Link>
          <Link
            href="/admin/dashboard"
            className="px-2.5 py-1 rounded-full text-amber-200/70 hover:text-amber-100 transition-colors"
            title="Switch to Admin Console"
          >
            Admin
          </Link>
        </div>

        {/* Marketplace Explore Shortcut */}
        <Link href="/marketplace">
          <Button
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex text-xs font-semibold gap-1.5 border-amber-500/30 text-amber-200 hover:text-white hover:bg-amber-500/15"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Marketplace</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
