"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  CalendarCheck2,
  WalletCards,
  UserCheck,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEEDED_WORKERS_DATA, SEEDED_WORKER_REQUESTS } from "@/lib/worker-data";

interface WorkerSidebarProps {
  onCloseMobile?: () => void;
}

export function WorkerSidebar({ onCloseMobile }: WorkerSidebarProps) {
  const pathname = usePathname();
  const worker = SEEDED_WORKERS_DATA[0]; // Master Chef K. Ramanathan
  const pendingRequestsCount = SEEDED_WORKER_REQUESTS.filter(
    (r) => r.worker_id === worker.id && r.status === "pending"
  ).length;

  const navItems = [
    {
      title: "Dashboard",
      href: "/worker/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Job Requests",
      href: "/worker/requests",
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} New` : null,
      badgeVariant: "amber" as const,
    },
    {
      title: "Confirmed Schedule",
      href: "/worker/schedule",
      icon: CalendarCheck2,
      badge: null,
    },
    {
      title: "Availability Calendar",
      href: "/worker/availability",
      icon: CalendarDays,
      badge: null,
    },
    {
      title: "Earnings & Payouts",
      href: "/worker/earnings",
      icon: WalletCards,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-amber-500/20 bg-[#160803]/92 backdrop-blur-2xl flex flex-col h-full text-foreground transition-colors">
      {/* Brand & Close button for mobile */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-amber-500/20">
        <Link href="/worker/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-sm font-bold tracking-tight text-foreground leading-tight">
              VELUXE WORKFORCE
            </span>
            <span className="text-[9px] uppercase tracking-wider text-amber-200/60 font-semibold">
              Specialized Event Staff
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-amber-200/70 hover:text-amber-100 md:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Logged in Worker Profile Card */}
      <div className="p-3.5 mx-3 mt-4 rounded-xl border border-amber-500/20 bg-[#200d05]/70">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-500/40 shrink-0">
            <Image
              src={worker.avatar_url}
              alt={worker.full_name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate block">
                {worker.full_name}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-200/70 mt-0.5">
              <div className="flex items-center text-amber-400 font-medium">
                <Star className="w-3 h-3 fill-amber-400 mr-0.5 inline" />
                <span>{worker.rating}</span>
              </div>
              <span>•</span>
              <span className="truncate">{worker.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider text-amber-200/50 uppercase">
          Shift Operations
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-amber-500/15 text-amber-100 border border-amber-500/35 font-semibold shadow-xs"
                  : "text-amber-100/70 hover:text-amber-100 hover:bg-amber-500/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-amber-200/60"}`} />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 border-amber-500/50 ${
                    isActive ? "bg-amber-500/30 text-amber-200" : "bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Profile & Marketplace Links */}
      <div className="p-3 border-t border-amber-500/15 bg-[#1a0a03]/85 space-y-1">
        <Link
          href={`/workers/${worker.id}`}
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-amber-200/70 hover:text-amber-100 hover:bg-amber-500/10 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Public Portfolio</span>
          </div>
          <ExternalLink className="w-3 h-3 text-amber-200/60 group-hover:text-amber-100 transition-colors" />
        </Link>
        <Link
          href="/marketplace?tab=workers"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-amber-200/70 hover:text-amber-100 hover:bg-amber-500/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Explore Marketplace</span>
          </div>
          <ChevronRight className="w-3 h-3 text-amber-200/60" />
        </Link>
      </div>
    </aside>
  );
}
