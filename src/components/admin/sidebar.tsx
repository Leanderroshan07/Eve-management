"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Scale,
  FileClock,
  ShieldCheck,
  ChevronRight,
  Crown,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CURRENT_ADMIN } from "@/lib/admin-data";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "champagne" | "warning" | "success" | "destructive";
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "User Governance", href: "/admin/users", icon: Users },
  {
    label: "Moderation Queue",
    href: "/admin/reports",
    icon: ShieldAlert,
    badge: "2 Open",
    badgeVariant: "warning",
  },
  {
    label: "Dispute Arbitrations",
    href: "/admin/disputes",
    icon: Scale,
    badge: "1 Active",
    badgeVariant: "champagne",
  },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: FileClock },
];

export function AdminSidebar({
  onCloseMobile,
}: {
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-[#160803]/92 backdrop-blur-2xl border-r border-amber-500/20 text-foreground select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-amber-500/20">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 font-editorial tracking-wider text-foreground hover:text-amber-300 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center text-white shadow-sm">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground leading-none">VELUXE</span>
            <span className="text-[10px] font-sans tracking-widest text-amber-400 font-medium uppercase mt-0.5">
              Platform Admin
            </span>
          </div>
        </Link>
        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-500/40 text-amber-300 font-mono">
          Gov
        </Badge>
      </div>

      {/* Admin Identity Summary */}
      <div className="p-4 border-b border-amber-500/15 bg-[#200d05]/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs">
            PC
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground block truncate">{CURRENT_ADMIN.name}</span>
            <span className="text-[11px] text-amber-300/90 block truncate flex items-center gap-1 font-medium capitalize">
              <ShieldCheck className="w-3 h-3 text-amber-400 inline" />
              {CURRENT_ADMIN.role.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-amber-200/50">
          Governance & Safety
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-amber-500/15 text-amber-100 border border-amber-500/35 font-semibold"
                  : "text-amber-100/70 hover:text-amber-100 hover:bg-amber-500/10"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-amber-300" : "text-amber-200/60 group-hover:text-amber-200"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  variant={item.badgeVariant || "default"}
                  className="text-[10px] px-1.5 py-0 font-medium shrink-0 ml-1.5"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Cross-Role Switcher footer shortcut */}
      <div className="p-3 border-t border-amber-500/15 bg-[#1a0a03]/85">
        <div className="p-3 rounded-xl border border-amber-500/25 bg-[#240e05]/75 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-amber-200/60">Evaluator View:</span>
            <span className="text-amber-400 font-semibold">3-Way Role Mode</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Link
              href="/customer/dashboard"
              className="text-center px-2 py-1.5 rounded-md bg-[#2c1206]/80 border border-amber-500/30 hover:bg-amber-500/20 text-[11px] text-amber-200 transition-colors"
            >
              Customer
            </Link>
            <Link
              href="/organizer/dashboard"
              className="text-center px-2 py-1.5 rounded-md bg-[#2c1206]/80 border border-amber-500/30 hover:bg-amber-500/20 text-[11px] text-amber-200 transition-colors"
            >
              Organizer
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
