"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  FileQuestion,
  FileSignature,
  CalendarCheck2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Crown,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CURRENT_CUSTOMER } from "@/lib/customer-data";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "champagne" | "warning" | "success";
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
  { label: "Explore Marketplace", href: "/marketplace", icon: Compass },
  { label: "My Inquiries", href: "/customer/inquiries", icon: FileQuestion },
  {
    label: "Proposals to Review",
    href: "/customer/proposals",
    icon: FileSignature,
    badge: "1 Action",
    badgeVariant: "warning",
  },
  { label: "Confirmed Bookings", href: "/customer/bookings", icon: CalendarCheck2 },
  { label: "Messages", href: "/customer/messages", icon: MessageSquare },
];

export function CustomerSidebar({
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
          href="/customer/dashboard"
          className="flex items-center gap-2.5 font-editorial tracking-wider text-foreground hover:text-amber-300 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-sm">
            <Crown className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground leading-none">VELUXE</span>
            <span className="text-[10px] font-sans tracking-widest text-amber-400 font-medium uppercase mt-0.5">
              Client Portal
            </span>
          </div>
        </Link>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/40 text-amber-300">
          Client
        </Badge>
      </div>

      {/* Client Identity Summary */}
      <div className="p-4 border-b border-amber-500/15 bg-[#200d05]/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-semibold text-xs">
            VA
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground block truncate">{CURRENT_CUSTOMER.name}</span>
            <span className="text-[11px] text-amber-200/70 block truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
              Verified Client
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-amber-200/50">
          Wedding Planning Desk
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

      {/* Role Switcher Pill for paired pair testing */}
      <div className="p-3 border-t border-amber-500/15 bg-[#1a0a03]/85">
        <div className="p-3 rounded-xl border border-amber-500/25 bg-[#240e05]/75 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-amber-200/60">Testing Mode:</span>
            <span className="text-amber-400 font-semibold">Dual Role</span>
          </div>
          <Link
            href="/organizer/dashboard"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all group"
          >
            <span>Organizer Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
