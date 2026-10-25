"use client";

import * as React from "react";
import {
  FileSignature,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { OrganizerHeader } from "@/components/organizer/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { SEEDED_PROPOSALS, Proposal, ProposalLineItem } from "@/lib/organizer-data";
import { formatINR, formatDate } from "@/lib/format";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function OrganizerProposalsPage() {
  const [proposals, setProposals] = React.useState<Proposal[]>(SEEDED_PROPOSALS);
  const [activeProposal, setActiveProposal] = React.useState<Proposal | null>(null);
  const [builderOpen, setBuilderOpen] = React.useState(false);

  // Line items state inside builder
  const [items, setItems] = React.useState<ProposalLineItem[]>([
    { id: "1", description: "Bespoke Royal Floral Mandap Setup", quantity: 1, unit_price: 650000, subtotal: 650000 },
    { id: "2", description: "Architectural Stage & Runway Lighting", quantity: 1, unit_price: 350000, subtotal: 350000 },
    { id: "3", description: "Event Stewards & Floor Operations Staff", quantity: 25, unit_price: 12000, subtotal: 300000 },
  ]);

  const [newItemDesc, setNewItemDesc] = React.useState("");
  const [newItemQty, setNewItemQty] = React.useState(1);
  const [newItemPrice, setNewItemPrice] = React.useState(50000);

  const calculateSubtotal = () => items.reduce((acc, it) => acc + it.subtotal, 0);
  const calculateTax = () => Math.round(calculateSubtotal() * 0.18);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleAddItem = () => {
    if (!newItemDesc.trim()) return;
    const sub = newItemQty * newItemPrice;
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: newItemDesc.trim(),
        quantity: newItemQty,
        unit_price: newItemPrice,
        subtotal: sub,
      },
    ]);
    setNewItemDesc("");
    setNewItemQty(1);
    setNewItemPrice(50000);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  // Create or Revise to Next Version (v1 -> v2)
  const handleSaveProposalVersion = (isRevision = false) => {
    const sub = calculateSubtotal();
    const tax = calculateTax();
    const tot = calculateTotal();

    if (activeProposal && isRevision) {
      // Create new version
      const nextVer = activeProposal.version + 1;
      const revised: Proposal = {
        ...activeProposal,
        id: `prop-${Date.now()}`,
        proposal_number: `${activeProposal.proposal_number.split("-V")[0]}-V${nextVer}`,
        version: nextVer,
        items,
        subtotal: sub,
        tax_amount: tax,
        total_amount: tot,
        status: "sent_to_customer",
        organizer_accepted: true,
        customer_accepted: false,
        updated_at: new Date().toISOString(),
      };
      setProposals([revised, ...proposals]);
      setActiveProposal(revised);
      alert(`Created and transmitted Proposal Version ${nextVer} to client.`);
    } else {
      // New proposal
      const newProp: Proposal = {
        id: `prop-${Date.now()}`,
        inquiry_id: "inq-101",
        proposal_number: `PROP-2026-V1`,
        version: 1,
        customer_name: "Vikram & Ananya Sundaram",
        customer_email: "vikram.sundaram@gmail.com",
        event_type: "Grand Wedding & Sangeet",
        event_date: "2026-11-28",
        venue_location: "Leela Palace, Chennai",
        items,
        subtotal: sub,
        tax_rate: 0.18,
        tax_amount: tax,
        total_amount: tot,
        terms: "50% advance upon mutual contract signing. Balance 50% 14 days prior to event.",
        status: "sent_to_customer",
        organizer_accepted: true,
        customer_accepted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProposals([newProp, ...proposals]);
      setActiveProposal(newProp);
      alert("Proposal Version 1 transmitted to client.");
    }
    setBuilderOpen(false);
  };

  // SIMULATION FIXTURE: Simulate Customer Acceptance of the specific version
  const handleSimulateCustomerAcceptance = (proposalId: string) => {
    setProposals(
      proposals.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            customer_accepted: true,
            status: "accepted",
            accepted_version: p.version,
            terms: `Mutually accepted on Version ${p.version}. Confirmed booking created.`,
          };
        }
        return p;
      })
    );
    alert(`[TEST FIXTURE]: Client accepted Proposal Version! Mutual acceptance achieved.`);
  };

  const handleSimulateCustomerChangesRequested = (proposalId: string) => {
    setProposals(
      proposals.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            customer_accepted: false,
            status: "changes_requested",
          };
        }
        return p;
      })
    );
    alert(`[TEST FIXTURE]: Client requested changes on this proposal.`);
  };

  return (
    <div className="flex-1 flex flex-col">
      <OrganizerHeader
        title="Proposals, Versioning & Mutual Acceptance"
        description="Draft itemized quotations, create version revisions (v1, v2), and enforce mutual acceptance contracts."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Notice on Mutual Acceptance Rule */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-foreground dark:text-amber-200 block">
              Strict Contract Rule: Mutual Acceptance Required on Same Version
            </span>
            <p className="text-muted-foreground dark:text-amber-300/80 leading-relaxed">
              Chat messages never silently modify pricing or services. Any change generates a new proposal version
              (e.g. Version 1 → Version 2). Both organizer and customer must accept the same version number before
              it transitions into a confirmed booking.
            </p>
          </div>
        </div>

        {/* Proposals List */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {proposals.map((prop) => (
            <motion.div key={prop.id} variants={fadeInUp}>
              <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl p-6 hover:border-amber-500/40 transition-all shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-base font-bold text-foreground">
                        {prop.customer_name}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#240e05]/80 text-amber-300 border border-amber-500/30">
                        {prop.proposal_number} (Version {prop.version})
                      </span>
                      {prop.status === "sent_to_customer" && (
                        <Badge variant="champagne" className="text-[10px]">
                          Sent • Awaiting Client
                        </Badge>
                      )}
                      {prop.status === "changes_requested" && (
                        <Badge variant="warning" className="text-[10px]">
                          Client Requested Changes
                        </Badge>
                      )}
                      {prop.status === "accepted" && (
                        <Badge variant="success" className="text-[10px]">
                          ✓ Mutually Accepted (v{prop.accepted_version})
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-amber-200/60">
                      {prop.event_type} • {prop.venue_location} • Event Date:{" "}
                      <span className="text-amber-400 font-medium">
                        {formatDate(prop.event_date)}
                      </span>
                    </div>

                    {/* Itemized summary */}
                    <div className="rounded-xl border border-amber-500/20 bg-[#240e05]/70 backdrop-blur-md p-3.5 text-xs space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-200/60 block mb-1">
                        Itemized Scope ({prop.items.length} deliverables)
                      </span>
                      {prop.items.map((it) => (
                        <div key={it.id} className="flex justify-between text-foreground/80">
                          <span>
                            {it.quantity}x {it.description}
                          </span>
                          <span className="font-mono text-amber-200/50">
                            {formatINR(it.subtotal)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-amber-500/20 pt-1.5 flex justify-between font-bold text-foreground">
                        <span>Total (incl. 18% GST)</span>
                        <span className="font-mono text-amber-400">
                          {formatINR(prop.total_amount)}
                        </span>
                      </div>
                    </div>

                    {/* Mutual Acceptance Status Check */}
                    <div className="flex items-center gap-4 text-xs pt-1">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <CheckCircle2 className="h-4 w-4" /> Organizer Accepted (v{prop.version})
                      </span>
                      {prop.customer_accepted ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <CheckCircle2 className="h-4 w-4" /> Customer Accepted (v{prop.version})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                          <Clock className="h-4 w-4" /> Customer Reviewing v{prop.version}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions & Development Simulation Fixture */}
                  <div className="flex flex-col items-stretch lg:items-end gap-3 min-w-[240px]">
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                        Contract Value
                      </span>
                      <span className="text-xl font-bold text-foreground font-mono">
                        {formatINR(prop.total_amount)}
                      </span>
                    </div>

                    {prop.status !== "accepted" && (
                      <Button
                        variant="champagne"
                        size="sm"
                        onClick={() => {
                          setActiveProposal(prop);
                          setItems(prop.items);
                          setBuilderOpen(true);
                        }}
                        className="text-xs font-semibold gap-1.5 w-full"
                      >
                        <FileSignature className="h-3.5 w-3.5" /> Revise to Version {prop.version + 1}
                      </Button>
                    )}

                    {/* Development Testing Fixture */}
                    <div className="p-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 text-xs space-y-2 w-full">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        🧪 Development Test Fixture
                      </span>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Simulate customer response to validate organizer state transitions:
                      </p>
                      <div className="flex gap-2">
                        {prop.status !== "accepted" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSimulateCustomerAcceptance(prop.id)}
                              className="h-7 text-[10px] px-2 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 flex-1"
                            >
                              Accept v{prop.version}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSimulateCustomerChangesRequested(prop.id)}
                              className="h-7 text-[10px] px-2 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 flex-1"
                            >
                              Request Changes
                            </Button>
                          </>
                        ) : (
                          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                            ✓ Contract Sealed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Interactive Proposal Builder Dialog */}
      <Dialog
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        title={activeProposal ? `Revise Proposal to Version ${activeProposal.version + 1}` : "Create New Quotation Proposal"}
        description="Adjust line items, quantities, and terms. Any edit automatically increments version number."
        className="max-w-3xl border-amber-500/30 bg-[#160803]/95 backdrop-blur-2xl text-foreground shadow-[0_20px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(245,158,11,0.25)]"
      >
        <div className="space-y-4 py-2 text-xs">
          {/* Add Item Row */}
          <div className="p-3.5 rounded-xl bg-[#240e05]/75 border border-amber-500/25 space-y-2">
            <span className="font-semibold text-foreground block">Add Deliverable / Item</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <Input
                  placeholder="Item description (e.g. Mirror Aisle & Chandeliers)"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="glass-field text-foreground"
                />
              </div>
              <div>
                <Input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(Number(e.target.value))}
                  className="glass-field text-foreground"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Unit Price (₹)"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="glass-field text-foreground font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="champagne" size="sm" onClick={handleAddItem} className="h-8 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Line Item
              </Button>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-amber-500/20 rounded-xl overflow-hidden bg-[#1c0c05]/70 backdrop-blur-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#240e05]/90 text-amber-200/80 border-b border-amber-500/20">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Qty</th>
                  <th className="py-2.5 px-3">Unit Price</th>
                  <th className="py-2.5 px-3">Subtotal</th>
                  <th className="py-2.5 px-3 text-right">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/15">
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-2.5 px-3 font-medium text-foreground">{it.description}</td>
                    <td className="py-2.5 px-3 text-amber-200/60">{it.quantity}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-200/60">{formatINR(it.unit_price)}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-amber-400">{formatINR(it.subtotal)}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleRemoveItem(it.id)}
                        className="text-amber-200/50 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="rounded-xl bg-[#240e05]/75 border border-amber-500/25 p-3.5 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-amber-200/70">
              <span>Subtotal:</span>
              <span className="text-foreground">{formatINR(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-amber-200/70">
              <span>GST (18%):</span>
              <span className="text-foreground">{formatINR(calculateTax())}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-amber-400 border-t border-amber-500/20 pt-1.5">
              <span>Grand Total:</span>
              <span>{formatINR(calculateTotal())}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-amber-500/15">
            <Button variant="outline" size="sm" onClick={() => setBuilderOpen(false)} className="border-amber-500/30 text-amber-200 hover:bg-amber-500/10 text-xs">
              Cancel
            </Button>
            <Button
              variant="champagne"
              size="sm"
              onClick={() => handleSaveProposalVersion(Boolean(activeProposal))}
              className="font-semibold text-xs"
            >
              {activeProposal ? `Issue & Send Version ${activeProposal.version + 1}` : "Issue Proposal v1"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
