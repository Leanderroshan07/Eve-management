"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileQuestion,
  FileSignature,
  CalendarCheck2,
  MessageSquare,
  Globe,
  Settings,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "champagne" | "warning" | "success";
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
  { label: "Packages", href: "/organizer/packages", icon: Package },
  {
    label: "Inquiries",
    href: "/organizer/inquiries",
    icon: FileQuestion,
    badge: "2 New",
    badgeVariant: "champagne",
  },
  {
    label: "Proposals",
    href: "/organizer/proposals",
    icon: FileSignature,
    badge: "v1/v2",
    badgeVariant: "warning",
  },
  { label: "Bookings", href: "/organizer/bookings", icon: CalendarCheck2 },
  { label: "Messages", href: "/organizer/messages", icon: MessageSquare },
  { label: "Public Profile", href: "/organizer/profile", icon: Globe },
];

export function OrganizerSidebar({
  onCloseMobile,
}: {
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-[#160803]/92 backdrop-blur-2xl border-r border-amber-500/20 text-foreground select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-amber-500/20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#d4af37]/20 text-[#fcd34d] border border-[#d4af37]/40 flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-base font-bold tracking-tight text-foreground">
              VELUXE
            </span>
            <span className="text-[9px] uppercase tracking-widest font-semibold text-amber-400 -mt-1">
              Organizer Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider font-semibold text-amber-200/50">
          Management
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
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group",
                isActive
                  ? "bg-amber-500/15 text-amber-100 border-l-2 border-amber-400 font-semibold shadow-xs"
                  : "text-amber-100/70 hover:text-amber-100 hover:bg-amber-500/10"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-amber-300"
                      : "text-amber-200/60 group-hover:text-amber-200"
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <Badge
                  variant={item.badgeVariant || "default"}
                  className="text-[10px] py-0 px-1.5 h-4"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] uppercase tracking-wider font-semibold text-amber-200/50">
          Live Showcase
        </div>

        {/* View Live Public Site Link */}
        <Link
          href="/organizers/vks-royal-weddings"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="h-4 w-4 text-amber-400" />
            <span>View Public Website</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </Link>
      </div>

      {/* Organizer Business Profile Card at Bottom */}
      <div className="p-4 border-t border-amber-500/15 bg-[#1a0a03]/85">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 p-0.5">
            <div className="h-full w-full rounded-full bg-[#240e05] flex items-center justify-center text-xs font-bold text-amber-300">
              VKS
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground truncate">
              VKS Royal Weddings
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Verified Organizer
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
