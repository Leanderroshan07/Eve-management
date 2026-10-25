"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileSignature,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR } from "@/lib/format";
import {
  CURRENT_CUSTOMER,
  getCustomerProposals,
  acceptProposalAsCustomer,
  requestChangesAsCustomer,
} from "@/lib/customer-data";
import { Proposal } from "@/lib/organizer-data";

export default function CustomerProposalsPage() {
  const [proposals, setProposals] = React.useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = React.useState<Proposal | null>(null);

  // Version Comparison Toggle State
  const [showVersionComparison, setShowVersionComparison] = React.useState(false);

  // Request Changes Modal State
  const [changeModalOpen, setChangeModalOpen] = React.useState(false);
  const [changeNotes, setChangeNotes] = React.useState("");

  // Confirmation Success Dialog
  const [confirmedBookingRef, setConfirmedBookingRef] = React.useState<string | null>(null);

  React.useEffect(() => {
    const data = getCustomerProposals(CURRENT_CUSTOMER.email);
    setProposals([...data]);
    if (data.length > 0) {
      setSelectedProposal(data[0]);
    }
  }, []);

  const handleAcceptProposal = () => {
    if (!selectedProposal) return;
    const { proposal, booking } = acceptProposalAsCustomer(selectedProposal.id);
    setSelectedProposal({ ...proposal });
    setConfirmedBookingRef(booking.booking_reference);
    setProposals(getCustomerProposals(CURRENT_CUSTOMER.email));
  };

  const handleRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal || !changeNotes.trim()) return;
    const updated = requestChangesAsCustomer(selectedProposal.id, changeNotes);
    setSelectedProposal({ ...updated });
    setChangeModalOpen(false);
    setChangeNotes("");
    setProposals(getCustomerProposals(CURRENT_CUSTOMER.email));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Proposals & Contract Review
            </h1>
            <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-xs">
              Strict Versioning
            </Badge>
          </div>
          <p className="text-xs text-amber-200/60 mt-1">
            Review itemized services, statutory 18% GST, and mutual acceptance status for your wedding celebration.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-200/80 glass-field px-3.5 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Both parties must sign the exact same version number to confirm booking.</span>
        </div>
      </div>

      {/* Main Grid: Proposal List (4 cols) & Inspector (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Proposals List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-semibold text-amber-200/60 uppercase tracking-wider block">
            Your Proposals ({proposals.length})
          </span>

          {proposals.map((prop) => {
            const isSelected = selectedProposal?.id === prop.id;
            return (
              <div
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? "border-amber-500/60 bg-[#240e05]/90 shadow-md ring-1 ring-amber-500/30"
                    : "border-amber-500/20 bg-[#1c0c05]/75 hover:border-amber-500/40 hover:bg-[#240e05]/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-300">
                    {prop.proposal_number}
                  </span>
                  <Badge
                    variant={
                      prop.status === "accepted"
                        ? "success"
                        : prop.status === "changes_requested"
                        ? "warning"
                        : "champagne"
                    }
                    className="text-[10px] px-1.5 py-0"
                  >
                    {prop.status === "accepted"
                      ? "Mutually Accepted"
                      : prop.status === "changes_requested"
                      ? "Revision In Progress"
                      : "Pending Acceptance"}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-editorial text-sm font-bold text-foreground">{prop.event_type}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-500 inline" />
                    {prop.venue_location}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-500/15 text-xs">
                  <span className="text-amber-200/60">Version {prop.version}</span>
                  <span className="font-editorial text-sm font-bold text-amber-400">
                    {formatINR(prop.total_amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive Proposal Inspector */}
        <div className="lg:col-span-8">
          {selectedProposal ? (
            <Card className="border border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              {/* Proposal Header Banner */}
              <div className="p-6 border-b border-amber-500/20 bg-[#240e05]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {selectedProposal.proposal_number}
                    </span>
                    <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">
                      Version {selectedProposal.version}
                    </Badge>
                  </div>
                  <h2 className="font-editorial text-xl font-bold text-foreground">
                    {selectedProposal.event_type}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-3">
                    <span>
                      <MapPin className="w-3 h-3 text-amber-500 inline mr-1" />
                      {selectedProposal.venue_location}
                    </span>
                    <span>•</span>
                    <span>
                      <Calendar className="w-3 h-3 text-amber-500 inline mr-1" />
                      {selectedProposal.event_date}
                    </span>
                  </p>
                </div>

                {/* Dual-Acceptance Status Badges */}
                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Organizer:</span>
                    {selectedProposal.organizer_accepted ? (
                      <Badge variant="success" className="text-[10px] gap-1 px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Signed & Locked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Pending</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Client:</span>
                    {selectedProposal.customer_accepted ? (
                      <Badge variant="success" className="text-[10px] gap-1 px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Accepted & Confirmed
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px] gap-1 px-2 py-0.5">
                        <Clock className="w-3 h-3" /> Awaiting Your Acceptance
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Version Diff / Comparison Switch */}
              <div className="px-6 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-foreground/85">
                    Version Comparison & Scope Audit
                  </span>
                </div>
                <button
                  onClick={() => setShowVersionComparison(!showVersionComparison)}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                >
                  {showVersionComparison ? "Hide Scope Comparison" : "Compare with Initial Draft"}
                </button>
              </div>

              {/* Version Comparison Box (if toggled) */}
              {showVersionComparison && (
                <div className="p-5 border-b border-border bg-muted/30 space-y-3">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wide block">
                    Scope Evolution (Version 1 vs Initial Requirements)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-background border border-border space-y-1">
                      <span className="font-semibold text-muted-foreground block">Initial Inquiry Scope:</span>
                      <p className="text-foreground/80 text-[11px]">
                        Base Imperial Floral Mandap + 15 Floor Stewards.
                      </p>
                      <span className="text-muted-foreground text-[11px] block mt-1">Est: ₹18,50,000</span>
                    </div>

                    <div className="p-3 rounded-lg bg-background border border-emerald-500/30 space-y-1">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">Current Version {selectedProposal.version} Upgrades:</span>
                      <p className="text-foreground/80 text-[11px]">
                        + Upgraded to 30 Trained Stewards (+₹1,00,000)<br />
                        + Custom Ivory & Burgundy Imported Orchids<br />
                        + Mirror Glass Aisle & Crystal Candelabras
                      </p>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] block mt-1">
                        Locked Subtotal: {formatINR(selectedProposal.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Line Items Table */}
              <div className="p-6 space-y-4">
                <span className="text-xs font-bold text-foreground/85 uppercase tracking-wider block">
                  Contractual Line Items
                </span>

                <div className="overflow-x-auto rounded-xl border border-amber-500/20 bg-[#1c0c05]/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#240e05]/90 text-amber-200/80 uppercase text-[10px] font-semibold border-b border-amber-500/20">
                      <tr>
                        <th className="py-3 px-4">Item & Scope Description</th>
                        <th className="py-3 px-3 text-center">Qty</th>
                        <th className="py-3 px-4 text-right">Unit Rate (INR)</th>
                        <th className="py-3 px-4 text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-500/10 text-foreground/90">
                      {selectedProposal.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-amber-500/[0.06] transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">
                            <span className="text-amber-200/50 mr-2 font-mono">{idx + 1}.</span>
                            {item.description}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-amber-200/70">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-amber-200/70">
                            {formatINR(item.unit_price)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-amber-400">
                            {formatINR(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal & 18% GST Breakdown */}
                <div className="flex justify-end pt-2">
                  <div className="w-full sm:w-80 space-y-2 bg-[#240e05]/75 p-4 rounded-xl border border-amber-500/25 text-xs shadow-md">
                    <div className="flex justify-between text-amber-200/70">
                      <span>Services Subtotal:</span>
                      <span className="font-mono text-foreground">{formatINR(selectedProposal.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-amber-200/70">
                      <span>Statutory GST (18%):</span>
                      <span className="font-mono text-amber-400">+{formatINR(selectedProposal.tax_amount)}</span>
                    </div>
                    <div className="pt-2 border-t border-amber-500/20 flex justify-between items-center">
                      <span className="font-bold text-foreground">Contract Grand Total:</span>
                      <span className="font-editorial text-xl font-bold text-amber-400">
                        {formatINR(selectedProposal.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestone Payment Terms */}
                <div className="p-4 rounded-xl bg-[#240e05]/75 border border-amber-500/25 space-y-2">
                  <span className="text-xs font-semibold text-amber-400 block uppercase tracking-wide">
                    Agreed Milestone Terms:
                  </span>
                  <p className="text-xs text-foreground/80 leading-relaxed">{selectedProposal.terms}</p>
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-muted-foreground">
                    Status:{" "}
                    <span className="font-semibold text-foreground capitalize">
                      {selectedProposal.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {!selectedProposal.customer_accepted && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setChangeModalOpen(true)}
                          className="text-xs border-border text-foreground hover:bg-muted"
                        >
                          Request Scope Revisions
                        </Button>

                        <Button
                          variant="champagne"
                          onClick={handleAcceptProposal}
                          className="text-xs font-semibold gap-2 shadow-sm cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Proposal (v{selectedProposal.version}) & Confirm Booking</span>
                        </Button>
                      </>
                    )}

                    {selectedProposal.customer_accepted && (
                      <Link href="/customer/bookings">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>View in Confirmed Bookings</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-12 text-center text-muted-foreground border border-border rounded-2xl bg-card">
              Select a proposal to review its itemized terms.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Success Modal */}
      <Dialog
        open={!!confirmedBookingRef}
        onOpenChange={(open) => !open && setConfirmedBookingRef(null)}
        title="Mutual Acceptance Confirmed!"
        description="Contractually locked under the accepted proposal version."
      >
        <div className="space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              {confirmedBookingRef}
            </Badge>
            <h3 className="font-editorial text-xl font-bold text-foreground">
              Booking Successfully Locked!
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your celebration is officially booked with VKS Royal Wedding Planners. Both parties have accepted the identical terms and version number.
            </p>
          </div>

          <div className="pt-3 space-y-2">
            <Link href="/customer/bookings">
              <Button variant="champagne" className="w-full text-xs font-semibold py-2.5">
                Go to Confirmed Bookings Desk
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setConfirmedBookingRef(null)}
              className="w-full text-xs border-border text-foreground hover:bg-muted"
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Request Scope Changes Modal */}
      <Dialog
        open={changeModalOpen}
        onOpenChange={setChangeModalOpen}
        title="Request Proposal Changes"
        description="Specify additions, removals, or budget adjustments. A revision request will notify the organizer to draft Version 2."
      >
        <form onSubmit={handleRequestChanges} className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-amber-200 block mb-1">
              Scope Revision Details
            </label>
            <textarea
              required
              rows={4}
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="e.g. Please add 10 more trained banquet stewards, include vintage car entry in the itemized items, and adjust guest capacity to 1,400..."
              className="w-full rounded-xl glass-field p-3.5 text-xs text-foreground placeholder:text-amber-200/40 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setChangeModalOpen(false)}
              className="text-xs border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="champagne"
              className="text-xs font-semibold"
            >
              Submit Revision Request to Organizer
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
