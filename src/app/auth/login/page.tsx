"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole, DEMO_PROFILES } from "@/lib/supabase/auth-context";
import { LuxuryBackground } from "@/components/shared/luxury-background";

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, signUp, switchDemoRole, getDashboardUrl } = useAuth();

  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("customer");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === "signin") {
      const res = await signIn(email, password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage("Authenticated successfully! Redirecting...");
        setTimeout(() => {
          router.push(getDashboardUrl(selectedRole));
        }, 600);
      } else {
        setError(res.error || "Failed to sign in. Please check your credentials.");
      }
    } else {
      if (!name) {
        setError("Please enter your name or business title.");
        setIsLoading(false);
        return;
      }
      const res = await signUp(email, password, selectedRole, name);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage("Account created successfully! Redirecting to your dashboard...");
        setTimeout(() => {
          router.push(getDashboardUrl(selectedRole));
        }, 800);
      } else {
        setError(res.error || "Failed to create account.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <LuxuryBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-8">
        {/* Left Column: Authentication Form */}
        <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
          {/* Brand header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30 transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-xl font-bold tracking-tight text-foreground">
                  VELUXE
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground -mt-1">
                  Auth & Access Gateway
                </span>
              </div>
            </Link>

            <div className="flex rounded-lg border border-border p-1 bg-muted/50">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  mode === "signin"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="font-editorial text-2xl font-bold text-foreground">
              {mode === "signin" ? "Welcome back to Veluxe" : "Create Your Luxury Profile"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {mode === "signin"
                ? "Enter your credentials or choose a 1-click role demo on the right."
                : "Select your platform role and establish your digital presence."}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Full Name / Legal Entity
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lady Vivienne Montgomery"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="concierge@veluxe.luxury"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Select Your Platform Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="customer">Event Host / Customer</option>
                  <option value="organizer">Bespoke Event Organizer</option>
                  <option value="worker">VIP Event Staff / Sommelier / Rigging Crew</option>
                  <option value="rental_provider">Equipment Rental Provider</option>
                  <option value="admin">Platform Governance Admin</option>
                </select>
              </div>
            )}

            <Button
              type="submit"
              variant="champagne"
              className="w-full py-2.5 mt-2 text-sm font-semibold gap-2 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : mode === "signin" ? (
                <>
                  Sign In to Veluxe <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Create Veluxe Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/60 text-center">
            <Link
              href="/marketplace"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              ← Return to Public Marketplace & Directory
            </Link>
          </div>
        </div>

        {/* Right Column: One-Click Demo Role Switcher */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-primary/30 bg-card/85 backdrop-blur-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-editorial text-lg font-bold text-foreground">
                One-Click Role Demonstration
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Explore the entire multi-role platform immediately without typing credentials. Click any role below to switch active persona:
            </p>

            <div className="space-y-2.5">
              {/* 1. Customer Demo */}
              <button
                type="button"
                onClick={() => switchDemoRole("customer")}
                className="w-full group text-left p-3 rounded-2xl border border-border/80 hover:border-primary bg-background/50 hover:bg-primary/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-border shrink-0">
                    <Image
                      src={DEMO_PROFILES.customer.avatarUrl || ""}
                      alt="Customer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">Sarah Kapoor</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Host
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Inquiries, proposals & escrow</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>

              {/* 2. Organizer Demo */}
              <button
                type="button"
                onClick={() => switchDemoRole("organizer")}
                className="w-full group text-left p-3 rounded-2xl border border-border/80 hover:border-primary bg-background/50 hover:bg-primary/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-border shrink-0">
                    <Image
                      src={DEMO_PROFILES.organizer.avatarUrl || ""}
                      alt="Organizer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">Aura Events & Co.</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Organizer
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Royal destination production</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>

              {/* 3. Event Staff / Worker Demo */}
              <button
                type="button"
                onClick={() => switchDemoRole("worker")}
                className="w-full group text-left p-3 rounded-2xl border border-border/80 hover:border-primary bg-background/50 hover:bg-primary/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-border shrink-0">
                    <Image
                      src={DEMO_PROFILES.worker.avatarUrl || ""}
                      alt="Staff"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">Vikram Mehta</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        Staff
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Sommelier shift bidding & QR</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>

              {/* 4. Equipment Rental Provider Demo */}
              <button
                type="button"
                onClick={() => switchDemoRole("rental_provider")}
                className="w-full group text-left p-3 rounded-2xl border border-border/80 hover:border-primary bg-background/50 hover:bg-primary/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-border shrink-0">
                    <Image
                      src={DEMO_PROFILES.rental_provider.avatarUrl || ""}
                      alt="Rental"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">Sound & Light Pro</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        Rentals
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Fleet dispatch & digital inspection</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>

              {/* 5. Platform Admin Demo */}
              <button
                type="button"
                onClick={() => switchDemoRole("admin")}
                className="w-full group text-left p-3 rounded-2xl border border-border/80 hover:border-primary bg-background/50 hover:bg-primary/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-border shrink-0">
                    <Image
                      src={DEMO_PROFILES.admin.avatarUrl || ""}
                      alt="Admin"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">Alexander Vance</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Global verification & escrow oversight</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
