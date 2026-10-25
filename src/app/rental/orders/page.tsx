"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Truck,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  FileCheck,
  Calendar,
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  ChevronRight,
  X,
  FileSignature,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/format";
import { CloudinaryUploader } from "@/components/shared/cloudinary-uploader";
import {
  getStoredRentalOrders,
  updateRentalOrderStatus,
  processReturnInspection,
  type RentalOrder,
  type RentalOrderStatus,
} from "@/lib/rental-data";

function RentalOrdersContent() {
  const searchParams = useSearchParams();
  const highlightedOrderId = searchParams.get("order");

  const [orders, setOrders] = React.useState<RentalOrder[]>([]);
  const [selectedStatusTab, setSelectedStatusTab] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [activeOrderModal, setActiveOrderModal] = React.useState<RentalOrder | null>(null);

  // Return Inspection Modal State
  const [inspectionModalOrder, setInspectionModalOrder] = React.useState<RentalOrder | null>(null);
  const [inspectionItems, setInspectionItems] = React.useState<{
    productId: string;
    productName: string;
    returnedCondition: "pristine" | "damaged" | "missing";
    damagePenalty: number;
  }[]>([]);
  const [inspectionNotes, setInspectionNotes] = React.useState("");
  const [inspectionEvidenceUrl, setInspectionEvidenceUrl] = React.useState("");

  React.useEffect(() => {
    const loaded = getStoredRentalOrders();
    setOrders(loaded);

    if (highlightedOrderId) {
      const found = loaded.find((o) => o.id === highlightedOrderId);
      if (found) setActiveOrderModal(found);
    }
  }, [highlightedOrderId]);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      selectedStatusTab === "all" ||
      (selectedStatusTab === "pending" && (o.status === "awaiting_confirmation" || o.status === "request_submitted")) ||
      (selectedStatusTab === "preparing" && o.status === "preparing") ||
      (selectedStatusTab === "active" && (o.status === "active_rental" || o.status === "out_for_delivery")) ||
      (selectedStatusTab === "completed" && (o.status === "completed" || o.status === "returned")) ||
      (selectedStatusTab === "disputed" && o.status === "disputed");

    const matchesSearch =
      searchQuery.trim() === "" ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.venueName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Handle Lifecycle Progression
  const handleAdvanceStatus = (orderId: string, nextStatus: RentalOrderStatus) => {
    const updated = updateRentalOrderStatus(orderId, nextStatus);
    setOrders(updated);
    if (activeOrderModal && activeOrderModal.id === orderId) {
      setActiveOrderModal({ ...activeOrderModal, status: nextStatus });
    }
  };

  // Open Inspection Modal
  const openInspectionModal = (order: RentalOrder) => {
    setInspectionModalOrder(order);
    setInspectionItems(
      order.items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        returnedCondition: it.returnedCondition || "pristine",
        damagePenalty: it.damagePenalty || 0,
      }))
    );
    setInspectionNotes(order.inspectionNotes || "Returned equipment inspected in presence of hotel banqueting captain.");
  };

  // Submit Return Inspection
  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectionModalOrder) return;

    const updated = processReturnInspection(
      inspectionModalOrder.id,
      inspectionItems,
      inspectionNotes
    );

    setOrders(updated);
    setInspectionModalOrder(null);
  };

  const totalDeductions = inspectionItems.reduce((acc, curr) => acc + curr.damagePenalty, 0);
  const calculatedRefund = inspectionModalOrder
    ? Math.max(0, inspectionModalOrder.totalDeposit - totalDeductions)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Rental Orders & Lifecycle
            </h1>
            <Badge variant="champagne" className="text-xs">
              {orders.length} Total Bookings
            </Badge>
          </div>
          <p className="text-xs text-hero-subtitle">
            Track rental agreements from quote request through white-glove setup, active ballroom staging, and deposit return inspection.
          </p>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="p-4 rounded-2xl bg-card/85 border border-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order #, event, client, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Showing:</span>
            <span className="font-bold text-foreground">{filteredOrders.length} Orders</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/60">
          {[
            { id: "all", label: "All Orders" },
            { id: "pending", label: "Awaiting Confirmation" },
            { id: "preparing", label: "Depot Staging" },
            { id: "active", label: "In Delivery / Active" },
            { id: "completed", label: "Completed / Returned" },
            { id: "disputed", label: "Disputed Claims" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedStatusTab === tab.id
                  ? "bg-gold-primary text-white shadow-xs font-semibold"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => {
          const isDepositHeld = ord.depositStatus === "held";
          const isAwaiting = ord.status === "awaiting_confirmation" || ord.status === "request_submitted";
          const isActive = ord.status === "active_rental";
          const isPrep = ord.status === "preparing";
          const isDisputed = ord.status === "disputed";

          return (
            <Card
              key={ord.id}
              className={`bg-card/90 border-border hover:border-gold-primary/50 transition-all ${
                ord.id === highlightedOrderId ? "ring-2 ring-gold-primary/40 bg-gold-primary/5" : ""
              }`}
            >
              <CardContent className="p-5 space-y-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-border/70">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-gold-headline-accent">
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
                        className="text-[10px] capitalize font-semibold"
                      >
                        {ord.status.replace(/_/g, " ")}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium ${
                          ord.depositStatus === "held"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            : ord.depositStatus === "partially_refunded"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                            : "bg-secondary text-muted-foreground border-border"
                        }`}
                      >
                        Deposit: {ord.depositStatus.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <h2 className="font-editorial text-lg font-bold text-foreground">
                      {ord.eventName}
                    </h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-primary shrink-0" />
                      <span>{ord.venueName} ({ord.venueAddress})</span>
                    </p>
                  </div>

                  {/* Financials & Duration */}
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">
                      {formatINR(ord.subtotal + ord.deliveryAndSetupFee)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Deposit Escrow: <span className="font-semibold text-foreground">{formatINR(ord.totalDeposit)}</span>
                    </p>
                    <p className="text-[11px] text-gold-headline-accent font-medium mt-0.5">
                      {ord.rentalDays} {ord.rentalDays > 1 ? "Days Duration" : "Day Duration"}
                    </p>
                  </div>
                </div>

                {/* Items & Logistics Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Left: Deployed Equipment List */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                      Rented Equipment Roster:
                    </span>
                    <div className="space-y-1.5">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/70 border border-border/70 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gold-primary">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-foreground">
                              {item.productName}
                            </span>
                          </div>
                          <div className="text-right text-muted-foreground">
                            <span>{formatINR(item.dailyRate * item.quantity * ord.rentalDays)}</span>
                            {item.returnedCondition && (
                              <span className="ml-2 font-semibold capitalize text-[10px] text-amber-600 dark:text-amber-400">
                                ({item.returnedCondition})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Logistics & Requester */}
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border/80 space-y-2 text-[11px]">
                    <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                      White-Glove Dispatch:
                    </span>
                    <div className="space-y-1">
                      <p className="text-foreground">
                        <span className="text-muted-foreground">Window:</span> {formatDate(ord.startDate)} - {formatDate(ord.endDate)}
                      </p>
                      <p className="text-foreground">
                        <span className="text-muted-foreground">Dispatch:</span> {ord.dispatchTime}
                      </p>
                      <p className="text-foreground">
                        <span className="text-muted-foreground">Teardown:</span> {ord.retrievalTime}
                      </p>
                      <p className="text-foreground">
                        <span className="text-muted-foreground">Rigging Lead:</span> {ord.crewLead}
                      </p>
                      <p className="text-foreground pt-1 border-t border-border/60">
                        <span className="text-muted-foreground">Client:</span> {ord.requesterName} ({ord.requesterRole})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dispute / Notes Alert if Applicable */}
                {ord.disputeReason && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Deposit Dispute Raised: </span>
                      {ord.disputeReason}
                      <span className="block text-[11px] mt-0.5 text-muted-foreground">
                        Deposit Deduction: {formatINR(ord.depositDeduction)} · Retained in Escrow pending admin arbitration.
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveOrderModal(ord)}
                      className="text-xs gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Order Spec</span>
                    </Button>

                    {/* Stage Transitions */}
                    {isAwaiting && (
                      <Button
                        variant="champagne"
                        size="sm"
                        onClick={() => handleAdvanceStatus(ord.id, "confirmed")}
                        className="text-xs gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Lock Inventory</span>
                      </Button>
                    )}

                    {isPrep && (
                      <Button
                        variant="champagne"
                        size="sm"
                        onClick={() => handleAdvanceStatus(ord.id, "active_rental")}
                        className="text-xs gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch White-Glove Crew</span>
                      </Button>
                    )}

                    {isActive && (
                      <Button
                        variant="champagne"
                        size="sm"
                        onClick={() => openInspectionModal(ord)}
                        className="text-xs gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Process Return Inspection</span>
                      </Button>
                    )}
                  </div>

                  {/* Dispute Link */}
                  {isDisputed && (
                    <Link href="/admin/disputes" className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
                      <span>View in Admin Dispute Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Return Inspection Modal */}
      {inspectionModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-editorial text-xl font-bold text-foreground">
                  Post-Event Return & Damage Inspection
                </h2>
                <p className="text-muted-foreground mt-0.5">
                  Order #{inspectionModalOrder.orderNumber} · Venue: {inspectionModalOrder.venueName}
                </p>
              </div>
              <button
                onClick={() => setInspectionModalOrder(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInspection} className="space-y-4">
              <div className="space-y-3">
                <span className="font-semibold text-foreground text-sm block">
                  Verify Item Condition & Report Damages:
                </span>

                {inspectionItems.map((item, idx) => (
                  <div
                    key={item.productId}
                    className="p-3 rounded-xl bg-secondary/80 border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>{item.productName}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                          Inspection Result:
                        </label>
                        <select
                          value={item.returnedCondition}
                          onChange={(e) => {
                            const val = e.target.value as "pristine" | "damaged" | "missing";
                            const updated = [...inspectionItems];
                            updated[idx].returnedCondition = val;
                            if (val === "pristine") updated[idx].damagePenalty = 0;
                            setInspectionItems(updated);
                          }}
                          className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                        >
                          <option value="pristine">Returned Pristine (No Damage)</option>
                          <option value="damaged">Damaged (Requires Repair / Replacement)</option>
                          <option value="missing">Missing / Lost Units</option>
                        </select>
                      </div>

                      {item.returnedCondition !== "pristine" && (
                        <div>
                          <label className="text-[11px] font-semibold text-red-600 dark:text-red-400 block mb-1">
                            Damage / Replacement Deduction (₹):
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={inspectionModalOrder.totalDeposit}
                            value={item.damagePenalty}
                            onChange={(e) => {
                              const updated = [...inspectionItems];
                              updated[idx].damagePenalty = Number(e.target.value);
                              setInspectionItems(updated);
                            }}
                            className="w-full bg-card border border-red-500/40 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inspection Notes */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Inspection Log & Hotel Security Notes *
                </label>
                <textarea
                  rows={2}
                  required
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Record packaging integrity, diagnostic sound test, and banqueting sign-off..."
                  className="w-full bg-secondary border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Photographic Damage Evidence via Cloudinary */}
              <CloudinaryUploader
                value={inspectionEvidenceUrl}
                onChange={setInspectionEvidenceUrl}
                label="Digital Inspection Photographic Proof"
                helperText="Upload photo evidence of item condition upon retrieval via Cloudinary."
              />

              {/* Financial Deposit Breakdown */}
              <div className="p-3.5 rounded-xl bg-secondary/80 border border-border space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Security Deposit Held in Escrow:</span>
                  <span className="font-bold text-foreground">
                    {formatINR(inspectionModalOrder.totalDeposit)}
                  </span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Total Item Damage Deductions:</span>
                  <span className="font-bold">
                    - {formatINR(totalDeductions)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-1.5 border-t border-border/60 text-sm">
                  <span>Net Refund Released to Client:</span>
                  <span>{formatINR(calculatedRefund)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInspectionModalOrder(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="champagne" className="gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign-Off & Complete Order</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Specification Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-mono text-gold-headline-accent block">
                  {activeOrderModal.orderNumber}
                </span>
                <h2 className="font-editorial text-xl font-bold text-foreground">
                  {activeOrderModal.eventName}
                </h2>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-secondary/70 border border-border space-y-1">
                <p className="font-semibold text-foreground">Venue & Schedule:</p>
                <p className="text-muted-foreground">{activeOrderModal.venueName} · {activeOrderModal.venueAddress}</p>
                <p className="text-muted-foreground">Dates: {formatDate(activeOrderModal.startDate)} to {formatDate(activeOrderModal.endDate)} ({activeOrderModal.rentalDays} Days)</p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/70 border border-border space-y-1">
                <p className="font-semibold text-foreground">Client Details:</p>
                <p className="text-muted-foreground">Name: {activeOrderModal.requesterName} ({activeOrderModal.requesterRole})</p>
                <p className="text-muted-foreground">Email: {activeOrderModal.requesterEmail}</p>
                <p className="text-muted-foreground">Phone: {activeOrderModal.requesterPhone}</p>
              </div>

              <div className="space-y-1.5">
                <p className="font-semibold text-foreground">Itemized Rented Gear:</p>
                {activeOrderModal.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between p-2 rounded-lg bg-secondary border border-border">
                    <span>{i.quantity}x {i.productName}</span>
                    <span className="font-semibold text-foreground">
                      {formatINR(i.dailyRate * i.quantity * activeOrderModal.rentalDays)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Equipment Rental:</span>
                  <span className="font-medium text-foreground">{formatINR(activeOrderModal.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">White-Glove Transport & Rigging:</span>
                  <span className="font-medium text-foreground">{formatINR(activeOrderModal.deliveryAndSetupFee)}</span>
                </div>
                <div className="flex justify-between text-gold-headline-accent font-semibold">
                  <span>Refundable Security Deposit:</span>
                  <span>{formatINR(activeOrderModal.totalDeposit)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t border-border">
                  <span>Grand Total (incl. deposit):</span>
                  <span>{formatINR(activeOrderModal.grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Button variant="outline" onClick={() => setActiveOrderModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RentalOrdersPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center min-h-[300px]">
          Loading rental logistics and order dispatch pipeline...
        </div>
      }
    >
      <RentalOrdersContent />
    </React.Suspense>
  );
}
