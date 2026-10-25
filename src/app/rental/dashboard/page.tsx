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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/format";
import {
  getStoredRentalOrders,
  getStoredRentalProducts,
  CURRENT_RENTAL_PROVIDER,
  type RentalOrder,
  type RentalProduct,
} from "@/lib/rental-data";

export default function RentalDashboardPage() {
  const [orders, setOrders] = React.useState<RentalOrder[]>([]);
  const [products, setProducts] = React.useState<RentalProduct[]>([]);

  React.useEffect(() => {
    setOrders(getStoredRentalOrders());
    setProducts(getStoredRentalProducts());
  }, []);

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Equipment Fleet & Depot Overview
            </h1>
            <Badge variant="champagne" className="text-xs">
              Live Fleet
            </Badge>
          </div>
          <p className="text-xs text-hero-subtitle">
            Operations control for {CURRENT_RENTAL_PROVIDER.name} · Managing active dispatches, deposit escrows, and white-glove rigging.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/rental/inventory">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
              <Boxes className="w-3.5 h-3.5" />
              <span>Fleet Inventory</span>
            </Button>
          </Link>
          <Link href="/rental/logistics">
            <Button variant="champagne" size="sm" className="gap-1.5 text-xs">
              <Truck className="w-3.5 h-3.5" />
              <span>Dispatch Board</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Fleet Deployment */}
        <Card className="bg-card/90 border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Fleet Utilization
              </span>
              <div className="p-2 rounded-lg bg-gold-primary/10 text-gold-headline-accent border border-gold-primary/20">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                78.4%
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +5.2%
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {totalStockUnits} cataloged units across 4 luxury categories
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
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {activeOrders.length + preparingOrders.length} Events
              </span>
              <span className="text-xs text-gold-headline-accent font-medium">
                In-Field Rigging
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {activeOrders.length} active in ballroom, {preparingOrders.length} preparing in depot
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Security Deposits Held */}
        <Card className="bg-card/90 border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Deposits in Custody
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {formatINR(totalDepositsHeld)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Pre-authorized escrow; released upon white-glove return
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Monthly Gross Rentals */}
        <Card className="bg-card/90 border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Monthly Pipeline
              </span>
              <div className="p-2 rounded-lg bg-gold-primary/10 text-gold-headline-accent border border-gold-primary/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                {formatINR(totalMonthlyRevenue)}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Active
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Includes per-day gear rentals and rigging technician fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Alerts & Urgent Attention */}
      {(pendingOrders.length > 0 || disputedOrders.length > 0) && (
        <div className="space-y-3">
          {pendingOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">
                      New Booking Request Awaiting Quote Confirmation
                    </span>
                    <Badge variant="warning" className="text-[10px]">
                      Action Required
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-0.5">
                    {ord.eventName} · {ord.venueName} · Requester: {ord.requesterName} ({formatINR(ord.grandTotal)})
                  </p>
                </div>
              </div>
              <Link href={`/rental/orders?order=${ord.id}`}>
                <Button size="sm" variant="champagne" className="text-xs gap-1.5 shrink-0">
                  <span>Review Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          ))}

          {disputedOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">
                      Damage Deduction Disputed by Client ({ord.orderNumber})
                    </span>
                    <Badge variant="destructive" className="text-[10px]">
                      In Arbitration
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-0.5">
                    {ord.disputeReason} · Deposit deduction: {formatINR(ord.depositDeduction)}
                  </p>
                </div>
              </div>
              <Link href={`/rental/orders?order=${ord.id}`}>
                <Button size="sm" variant="outline" className="text-xs gap-1.5 shrink-0 border-red-500/30 text-red-700 dark:text-red-300">
                  <span>View Evidence Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Two Column Section: Today's Logistics Schedule & Active Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Recent Active Rental Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-lg font-bold text-foreground">
                In-Field Event Orders
              </h2>
              <p className="text-xs text-muted-foreground">
                Equipment orders currently deployed across hotel ballrooms and private estates.
              </p>
            </div>
            <Link href="/rental/orders">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-gold-headline-accent">
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((ord) => (
              <Card key={ord.id} className="bg-card/85 border-border hover:border-gold-primary/40 transition-colors">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-semibold text-gold-headline-accent">
                          {ord.orderNumber}
                        </span>
                        <Badge
                          variant={
                            ord.status === "active_rental"
                              ? "champagne"
                              : ord.status === "preparing"
                              ? "warning"
                              : ord.status === "completed"
                              ? "success"
                              : ord.status === "disputed"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-[10px] capitalize"
                        >
                          {ord.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {ord.eventName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {ord.venueName} · {ord.requesterName} ({ord.requesterRole === "organizer" ? "Event Organizer" : "Private Client"})
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-xs font-semibold text-foreground">
                        {formatINR(ord.subtotal + ord.deliveryAndSetupFee)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        + {formatINR(ord.totalDeposit)} deposit ({ord.depositStatus})
                      </p>
                    </div>
                  </div>

                  {/* Item Summary Chips */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {ord.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-[11px] bg-secondary px-2 py-0.5 rounded-md text-foreground border border-border/60"
                        >
                          <span className="font-bold text-gold-headline-accent mr-1">
                            {item.quantity}x
                          </span>
                          {item.productName.split("(")[0]}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gold-primary" />
                        {formatDate(ord.startDate)} - {formatDate(ord.endDate)}
                      </span>
                      <Link href={`/rental/orders?order=${ord.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                          <span>Details</span>
                          <Eye className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right col: Today's White-Glove Dispatch & Fleet Status */}
        <div className="space-y-4">
          <div>
            <h2 className="font-editorial text-lg font-bold text-foreground">
              Today's Rigging Schedule
            </h2>
            <p className="text-xs text-muted-foreground">
              White-glove delivery, venue setup, and teardown windows.
            </p>
          </div>

          <Card className="bg-card/85 border-border">
            <CardContent className="p-4 space-y-4">
              <div className="relative pl-6 pb-4 border-l border-gold-primary/30 last:border-0 last:pb-0">
                <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-gold-primary ring-4 ring-gold-primary/20" />
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-gold-headline-accent">
                    08:30 AM · Outbound Rigging
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    Fleet Van #4
                  </Badge>
                </div>
                <p className="font-semibold text-xs text-foreground">
                  The Taj Mahal Palace, Ballroom
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Astera Tubes & L-Acoustics Sound System. Rigging lead: Vikram Sengupta.
                </p>
              </div>

              <div className="relative pl-6 pb-4 border-l border-gold-primary/30 last:border-0 last:pb-0">
                <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    11:00 AM · Venue Staging
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    Truck #2
                  </Badge>
                </div>
                <p className="font-semibold text-xs text-foreground">
                  The Leela Palace, Grand Terrace
                </p>
                <p className="text-[11px] text-muted-foreground">
                  80 Louis XVI Gilded Chairs + 100 24k Gold Venetian Chargers. Lead: Devansh Nair.
                </p>
              </div>

              <div className="relative pl-6 pb-2 border-l border-gold-primary/30 last:border-0 last:pb-0">
                <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-slate-400/20" />
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-muted-foreground">
                    04:00 AM (Overnight) · Strike & Retrieval
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    Night Crew
                  </Badge>
                </div>
                <p className="font-semibold text-xs text-foreground">
                  Taj Palace Strike & Damage Check
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Acoustic packdown & return inspection before deposit release.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Depot Info Card */}
          <Card className="bg-secondary/70 border-border">
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gold-primary" /> Depot Capacity
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Lower Parel Production Park Hub is operating on 24/7 turnaround schedule with 3 white-glove transport vehicles active.
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                <Link href="/rental/inventory" className="text-gold-headline-accent font-semibold hover:underline">
                  Browse All 12 SKUs →
                </Link>
                <Link href="/rentals" target="_blank" className="text-muted-foreground hover:text-foreground">
                  Live Public Preview
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
