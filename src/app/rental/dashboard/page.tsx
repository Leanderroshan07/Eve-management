"use client";

import * as React from "react";
import Link from "next/link";
import {
  Boxes,
  Truck,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Search,
  Eye,
  PlusCircle,
  Edit3,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/format";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  getScopedRentalProducts,
  getScopedRentalOrders,
  getScopedRentalProviderProfile,
  saveScopedRentalProviderProfile,
  isSeededDemoUser,
} from "@/lib/user-scoped-data";
import { RentalOrder, RentalProduct, RentalProvider } from "@/lib/rental-data";

export default function RentalDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<RentalProvider | null>(null);
  const [orders, setOrders] = React.useState<RentalOrder[]>([]);
  const [products, setProducts] = React.useState<RentalProduct[]>([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = React.useState({
    name: "",
    tagline: "",
    location: "",
    warehouseAddress: "",
    contactEmail: "",
    contactPhone: "",
  });

  const loadData = React.useCallback(() => {
    const prof = getScopedRentalProviderProfile(user);
    setProfile(prof);
    setProfileForm({
      name: prof.name,
      tagline: prof.tagline,
      location: prof.location,
      warehouseAddress: prof.warehouseAddress,
      contactEmail: prof.contactEmail,
      contactPhone: prof.contactPhone,
    });
    setOrders(getScopedRentalOrders(user));
    setProducts(getScopedRentalProducts(user));
  }, [user]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    saveScopedRentalProviderProfile(user, profileForm);
    loadData();
    setIsEditProfileOpen(false);
  };

  // Compute metrics
  const activeOrders = orders.filter((o) => o.status === "active_rental");
  const pendingOrders = orders.filter((o) => o.status === "awaiting_confirmation");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const disputedOrders = orders.filter((o) => o.status === "disputed");

  const totalDepositsHeld = orders
    .filter((o) => o.depositStatus === "held")
    .reduce((acc, curr) => acc + curr.totalDeposit, 0);

  const totalMonthlyRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + curr.subtotal + curr.deliveryAndSetupFee, 0);

  const totalStockUnits = products.reduce((acc, curr) => acc + curr.totalStock, 0);

  const isNewAccount = !isSeededDemoUser(user) && products.length === 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {profile?.name || "Equipment Fleet & Depot Overview"}
            </h1>
            {!isSeededDemoUser(user) ? (
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px]">
                New Renter Account
              </Badge>
            ) : (
              <Badge variant="champagne" className="text-xs">
                Live Fleet
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {profile?.tagline} · {profile?.location} Depot
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditProfileOpen(true)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Depot Profile</span>
          </Button>

          <Link href="/rental/inventory">
            <Button variant="champagne" size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
              <Boxes className="w-3.5 h-3.5" />
              <span>Fleet Inventory</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Guided Onboarding & Explore Card for New Renter Accounts */}
      {isNewAccount && (
        <Card className="border border-sky-500/30 bg-gradient-to-r from-sky-950/20 via-card to-background p-6 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-sky-500/20 text-sky-500 flex items-center justify-center border border-sky-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl font-bold text-foreground">
                    Welcome to Your Rental Hub, {user?.name || "Provider"}!
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your equipment rental fleet is ready to be cataloged. Start by adding hardware SKUs to receive orders:
                  </p>
                </div>
              </div>

              <Link href="/rental/inventory">
                <Button variant="champagne" size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add First Equipment SKU</span>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <Link
                href="/rental/inventory"
                className="group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-sky-500/60 hover:bg-sky-500/5 transition-all space-y-2 block"
              >
                <div className="h-8 w-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground group-hover:text-sky-500 transition-colors flex items-center justify-between">
                  <span>1. Catalog Staging & AV</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-muted-foreground">
                  Add line arrays, lighting rigs, crystal chandeliers, and tableware with daily rates.
                </p>
              </Link>

              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="text-left group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-sky-500/60 hover:bg-sky-500/5 transition-all space-y-2 block cursor-pointer"
              >
                <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground group-hover:text-sky-500 transition-colors flex items-center justify-between">
                  <span>2. Set Depot & Dispatch City</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-muted-foreground">
                  Specify your warehouse address, logistics service area, and technician team size.
                </p>
              </button>

              <Link
                href="/rentals"
                className="group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-sky-500/60 hover:bg-sky-500/5 transition-all space-y-2 block"
              >
                <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground group-hover:text-sky-500 transition-colors flex items-center justify-between">
                  <span>3. Preview Storefront</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-muted-foreground">
                  View how clients and wedding planners discover and request quotes for your gear.
                </p>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Fleet Deployment */}
        <Card className="bg-card/90 border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Fleet Catalog
              </span>
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {products.length} SKUs
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {totalStockUnits} cataloged units ready for deployment
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Active Deployments */}
        <Card className="bg-card/90 border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Deployments
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {activeOrders.length + preparingOrders.length} Events
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {activeOrders.length} active on site, {preparingOrders.length} preparing in depot
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Security Deposits Held */}
        <Card className="bg-card/90 border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Deposits in Escrow
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {formatINR(totalDepositsHeld)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Protected in custody until post-event return inspection
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Monthly Gross Rentals */}
        <Card className="bg-card/90 border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Gross Pipeline
              </span>
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {formatINR(totalMonthlyRevenue)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Includes daily rates and white-glove rigging fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modal: Edit Depot Profile */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-editorial text-lg font-bold text-foreground">
                Edit Rental Depot & Provider Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Company / Depot Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Tagline</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Depot City *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Dispatch Phone</label>
                  <input
                    type="text"
                    value={profileForm.contactPhone}
                    onChange={(e) => setProfileForm({ ...profileForm, contactPhone: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Warehouse Address</label>
                <input
                  type="text"
                  value={profileForm.warehouseAddress}
                  onChange={(e) => setProfileForm({ ...profileForm, warehouseAddress: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="champagne" size="sm" className="font-semibold">
                  Save Depot Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
