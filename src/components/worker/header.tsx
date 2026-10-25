"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Globe, CalendarCheck2, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkerHeaderProps {
  onOpenMobile?: () => void;
  title?: string;
  description?: string;
}

export function WorkerHeader({
  onOpenMobile,
  title = "Staffing Operations & Shift Control",
  description = "Review incoming job offers, lock event dates, and track verified daily payouts",
}: WorkerHeaderProps) {
  return (
    <header className="h-16 shrink-0 border-b border-amber-500/20 bg-[#160803]/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between text-foreground sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button
            onClick={onOpenMobile}
            className="p-2 rounded-lg text-amber-200/70 hover:text-amber-100 hover:bg-amber-500/10 md:hidden cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight leading-none">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-amber-200/70 mt-1 hidden sm:block">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Availability Badge */}
        <Badge variant="outline" className="hidden lg:inline-flex items-center gap-1.5 border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs px-2.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Available for Hire</span>
        </Badge>

        {/* 4-Way Universal Role Switcher Pill */}
        <div className="flex items-center bg-[#240e05]/85 border border-amber-500/25 rounded-full p-1 text-xs shadow-md">
          <Link
            href="/customer/dashboard"
            className="px-2.5 py-1 rounded-full text-amber-200/70 hover:text-amber-100 transition-colors"
            title="Switch to Customer Portal"
          >
            Customer
          </Link>
          <Link
            href="/organizer/dashboard"
            className="px-2.5 py-1 rounded-full text-amber-200/70 hover:text-amber-100 transition-colors"
            title="Switch to Organizer Portal"
          >
            Organizer
          </Link>
          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-xs">
            Worker
          </span>
          <Link
            href="/admin/dashboard"
            className="px-2.5 py-1 rounded-full text-amber-200/70 hover:text-amber-100 transition-colors"
            title="Switch to Platform Admin Console"
          >
            Admin
          </Link>
        </div>

        {/* Public Showcase Preview Link */}
        <Link href="/workers/wrk-001" target="_blank" className="hidden sm:inline-block">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium border-amber-500/30 text-amber-200 hover:text-white hover:bg-amber-500/15">
            <Globe className="h-3.5 w-3.5 text-amber-400" /> Public Profile
          </Button>
        </Link>
      </div>
    </header>
  );
}
