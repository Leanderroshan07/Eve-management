"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Truck,
  ExternalLink,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  CURRENT_RENTAL_PROVIDER,
  SEEDED_RENTAL_PROVIDERS,
  type RentalProvider,
  getStoredRentalOrders,
} from "@/lib/rental-data";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "champagne" | "warning" | "success";
}

export function RentalSidebar({
  onCloseMobile,
}: {
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const [selectedProvider, setSelectedProvider] = React.useState<RentalProvider>(CURRENT_RENTAL_PROVIDER);
  const [activeOrdersCount, setActiveOrdersCount] = React.useState(2);
  const [pendingInspectionsCount, setPendingInspectionsCount] = React.useState(1);

  React.useEffect(() => {
    const orders = getStoredRentalOrders();
    const active = orders.filter((o) => o.status === "active_rental").length;
    const pendingInsp = orders.filter((o) => o.status === "return_pending" || o.status === "active_rental").length;
    setActiveOrdersCount(active);
    setPendingInspectionsCount(pendingInsp);
  }, [pathname]);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/rental/dashboard", icon: LayoutDashboard },
    { label: "Inventory Fleet", href: "/rental/inventory", icon: Boxes },
    {
      label: "Rental Orders",
      href: "/rental/orders",
      icon: ClipboardList,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} Active` : undefined,
      badgeVariant: "champagne",
    },
    {
      label: "Logistics & Dispatch",
      href: "/rental/logistics",
      icon: Truck,
      badge: "Today: 2",
      badgeVariant: "warning",
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-card/95 backdrop-blur-2xl border-r border-border text-foreground select-none">
      {/* Brand & Provider Identification */}
      <div className="p-5 border-b border-border/70">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-9 w-9 rounded-xl bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-primary shadow-xs">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-editorial text-base font-bold text-foreground tracking-tight">
                VELUXE
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gold-primary/10 text-gold-headline-accent font-semibold border border-gold-primary/20">
                Rentals
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground -mt-0.5 font-medium">
              White-Glove Fleet Ops
            </p>
          </div>
        </div>

        {/* Active Provider Card */}
        <div className="p-2.5 rounded-xl bg-secondary/80 border border-border/80 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3 h-3 text-gold-primary" /> Provider Depot
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>
          <p className="font-semibold text-foreground truncate">
            {selectedProvider.name}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {selectedProvider.location}
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/80">
          Management Console
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer",
                isActive
                  ? "bg-gold-primary text-white shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-105",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-gold-primary"
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-secondary text-foreground border-border"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Public Catalog Link */}
        <div className="pt-4 mt-4 border-t border-border/60">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/80">
            Public Storefront
          </p>
          <Link
            href="/rentals"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-gold-headline-accent" />
              <span>Browse Public Catalog</span>
            </div>
            <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
          </Link>
          <Link
            href="/marketplace?tab=rentals"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Boxes className="h-3.5 w-3.5 text-gold-headline-accent" />
              <span>Marketplace Tab</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
          </Link>
        </div>
      </nav>

      {/* Switcher & System Status Footer */}
      <div className="p-3 border-t border-border/70 bg-secondary/40 space-y-2">
        <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
          <span>Active Depot:</span>
          <span className="font-semibold text-foreground">
            {selectedProvider.fleetCount} Trucks · {selectedProvider.crewSize} Crew
          </span>
        </div>
        <select
          value={selectedProvider.id}
          onChange={(e) => {
            const found = SEEDED_RENTAL_PROVIDERS.find((p) => p.id === e.target.value);
            if (found) setSelectedProvider(found);
          }}
          className="w-full text-[11px] font-medium bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          {SEEDED_RENTAL_PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
