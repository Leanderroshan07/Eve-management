"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Truck,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole, DEMO_PROFILES } from "@/lib/supabase/auth-context";

export function AuthNavControl() {
  const router = useRouter();
  const { user, role, signOut, switchDemoRole, getDashboardUrl } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeStyle = (r: UserRole) => {
    switch (r) {
      case "customer":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "organizer":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "worker":
        return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "rental_provider":
        return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
      case "admin":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
    }
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case "customer":
        return "Customer";
      case "organizer":
        return "Organizer";
      case "worker":
        return "Staff";
      case "rental_provider":
        return "Rentals";
      case "admin":
        return "Admin";
    }
  };

  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      {/* Direct link to Active Role Dashboard */}
      <Link href={getDashboardUrl(role)}>
        <Button variant="champagne" size="sm" className="gap-1 text-xs h-8.5 font-semibold cursor-pointer">
          <span>{getRoleLabel(role)} Dashboard</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </Link>

      {/* Role Profile Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-xl border border-border/80 bg-background/80 hover:bg-card hover:border-primary/50 transition-all text-xs cursor-pointer shadow-xs"
        aria-expanded={isOpen}
      >
        <div className="relative h-6 w-6 rounded-full overflow-hidden border border-border bg-muted shrink-0">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-primary">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        <div className="hidden lg:flex flex-col text-left">
          <span className="text-[11px] font-bold text-foreground leading-tight truncate max-w-[100px]">
            {user?.name || "Veluxe User"}
          </span>
          <span
            className={`text-[9px] uppercase font-semibold tracking-wider px-1 py-0.2 rounded border ${getRoleBadgeStyle(
              role
            )} leading-none mt-0.5 inline-block`}
          >
            {getRoleLabel(role)}
          </span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Luxury Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-72 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="pb-2.5 mb-2.5 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-border shrink-0">
                {user?.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(
                    role
                  )} mt-1 inline-block`}
                >
                  {getRoleLabel(role)} {user?.isDemo ? "(Live Demo)" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Persona Switcher */}
          <div className="space-y-1 mb-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-0.5">
              Switch Live Persona:
            </p>

            {(Object.keys(DEMO_PROFILES) as UserRole[]).map((r) => {
              const profile = DEMO_PROFILES[r];
              const isActive = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    switchDemoRole(r);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs">
                      {r === "customer" && "👑"}
                      {r === "organizer" && "🏛️"}
                      {r === "worker" && "🍸"}
                      {r === "rental_provider" && "🚚"}
                      {r === "admin" && "🛡️"}
                    </span>
                    <span className="truncate">{profile.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {getRoleLabel(r)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border/60 space-y-1">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <LogIn className="h-3.5 w-3.5 text-primary" />
              <span>Supabase Login Portal</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
