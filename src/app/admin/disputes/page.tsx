"use client";

import * as React from "react";
import {
  Scale,
  FileSignature,
  CalendarCheck2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Gavel,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { formatINR } from "@/lib/format";
import {
  SEEDED_DISPUTES,
  CURRENT_ADMIN,
  DisputeCase,
  settleDisputeCase,
} from "@/lib/admin-data";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = React.useState<DisputeCase[]>([]);
  const [selectedDispute, setSelectedDispute] = React.useState<DisputeCase | null>(null);

  // Arbitration Ruling Form State
  const [rulingType, setRulingType] = React.useState<"uphold_contract" | "partial_settlement" | "full_cancellation">("partial_settlement");
  const [settlementAmount, setSettlementAmount] = React.useState<string>("25000");
  const [rulingSummary, setRulingSummary] = React.useState<string>("");
  const [rulingSuccess, setRulingSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDisputes([...SEEDED_DISPUTES]);
    if (SEEDED_DISPUTES.length > 0) {
      setSelectedDispute(SEEDED_DISPUTES[0]);
    }
  }, []);

  const handleIssueRuling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !rulingSummary.trim()) return;

    const amount = rulingType === "partial_settlement" ? parseInt(settlementAmount, 10) || 0 : 0;
    const updated = settleDisputeCase(
      selectedDispute.id,
      rulingType,
      amount,
      rulingSummary,
      CURRENT_ADMIN.name
    );

    setSelectedDispute({ ...updated });
    setDisputes([...SEEDED_DISPUTES]);
    setRulingSuccess(`Dispute ${updated.dispute_number} successfully resolved under official ruling. Logged in Audit Trail.`);
    setTimeout(() => setRulingSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Contract Dispute Arbitration
            </h1>
            <Badge variant="outline" className="border-purple-400 text-purple-300 text-xs">
              Legal Adjudication
            </Badge>
          </div>
          <p className="text-xs text-amber-200/60 mt-1">
            Enforce mutually signed proposal versions, evaluate claims, and issue legally binding platform rulings.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-200/70 bg-[#240e05]/70 px-3.5 py-1.5 rounded-lg border border-amber-500/20">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Arbitrations are referenced against the mutually accepted proposal version.</span>
        </div>
      </div>

      {rulingSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{rulingSuccess}</span>
          </div>
          <button onClick={() => setRulingSuccess(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Disputes List & Arbitration Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dispute Cases (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-semibold text-amber-200/70 uppercase tracking-wider block">
            Escalation Cases ({disputes.length})
          </span>

          {disputes.map((dsp) => {
            const isSelected = selectedDispute?.id === dsp.id;
            return (
              <div
                key={dsp.id}
                onClick={() => setSelectedDispute(dsp)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? "border-amber-500/60 bg-[#240e05]/90 shadow-md ring-1 ring-amber-500/30"
                    : "border-amber-500/20 bg-[#1c0c05]/80 hover:border-amber-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-300">
                    {dsp.dispute_number}
                  </span>
                  <Badge
                    variant={dsp.status === "settled" ? "success" : "warning"}
                    className="text-[10px] px-1.5 py-0 capitalize"
                  >
                    {dsp.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-editorial text-sm font-bold text-white">
                    {dsp.customer_name} vs {dsp.organizer_name}
                  </h4>
                  <span className="text-[11px] text-amber-200/50 block mt-0.5">
                    Booking: {dsp.booking_reference} (Proposal v{dsp.proposal_version})
                  </span>
                </div>

                <div className="pt-2 border-t border-amber-500/15 flex justify-between text-xs">
                  <span className="text-amber-200/60">Total Value:</span>
                  <span className="font-editorial font-bold text-amber-400">
                    {formatINR(dsp.disputed_amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Contractual Evidence Inspector & Arbitration Bench (8 cols) */}
        <div className="lg:col-span-8">
          {selectedDispute ? (
            <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
              {/* Case Header */}
              <div className="p-6 border-b border-amber-500/20 bg-[#240e05]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {selectedDispute.dispute_number}
                    </span>
                    <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">
                      Locked Proposal Version {selectedDispute.proposal_version}
                    </Badge>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-white">
                    {selectedDispute.customer_name} vs {selectedDispute.organizer_name}
                  </h3>
                  <p className="text-xs text-amber-200/60">
                    Booking Reference: <strong className="text-amber-100">{selectedDispute.booking_reference}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-amber-200/60 block">Locked Contract Amount</span>
                  <span className="font-editorial text-2xl font-bold text-amber-400">
                    {formatINR(selectedDispute.disputed_amount)}
                  </span>
                </div>
              </div>

              {/* Claims Comparison */}
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#240e05]/75 border border-blue-500/30 space-y-2">
                    <span className="text-blue-400 font-bold uppercase tracking-wider block">
                      Customer Stated Grievance
                    </span>
                    <p className="text-amber-100/80 leading-relaxed text-[11px]">
                      {selectedDispute.customer_claim}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#240e05]/75 border border-amber-500/30 space-y-2">
                    <span className="text-amber-400 font-bold uppercase tracking-wider block">
                      Organizer Contractual Defense
                    </span>
                    <p className="text-amber-100/80 leading-relaxed text-[11px]">
                      {selectedDispute.organizer_defense}
                    </p>
                  </div>
                </div>

                {/* If already settled */}
                {selectedDispute.status === "settled" ? (
                  <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Official Arbitration Ruling Executed</span>
                    </div>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                      {selectedDispute.ruling_summary}
                    </p>
                    {selectedDispute.settlement_amount ? (
                      <span className="text-xs font-semibold text-emerald-400 block pt-1">
                        Settlement Amount: {formatINR(selectedDispute.settlement_amount)}
                      </span>
                    ) : null}
                  </div>
                ) : (
                  /* Arbitration Ruling Bench */
                  <form onSubmit={handleIssueRuling} className="space-y-4 pt-2 border-t border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <Gavel className="w-4 h-4 text-amber-400" />
                      <h4 className="font-editorial text-base font-bold text-white">
                        Issue Binding Arbitration Ruling
                      </h4>
                    </div>

                    {/* Ruling Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        onClick={() => setRulingType("partial_settlement")}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          rulingType === "partial_settlement"
                            ? "border-amber-500 bg-amber-500/15"
                            : "border-amber-500/20 bg-[#240e05]/70 hover:border-amber-500/40"
                        }`}
                      >
                        <span className="text-xs font-bold text-white block">Partial Settlement</span>
                        <p className="text-[11px] text-amber-200/60 mt-1">Split cost adjustment or overtime waiver</p>
                      </div>

                      <div
                        onClick={() => setRulingType("uphold_contract")}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          rulingType === "uphold_contract"
                            ? "border-amber-500 bg-amber-500/15"
                            : "border-amber-500/20 bg-[#240e05]/70 hover:border-amber-500/40"
                        }`}
                      >
                        <span className="text-xs font-bold text-white block">Uphold Contract v2</span>
                        <p className="text-[11px] text-amber-200/60 mt-1">Enforce organizer overtime surcharge</p>
                      </div>

                      <div
                        onClick={() => setRulingType("full_cancellation")}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          rulingType === "full_cancellation"
                            ? "border-red-500 bg-red-500/15"
                            : "border-amber-500/20 bg-[#240e05]/70 hover:border-amber-500/40"
                        }`}
                      >
                        <span className="text-xs font-bold text-white block">Cancel & Refund</span>
                        <p className="text-[11px] text-amber-200/60 mt-1">Full cancellation of booking</p>
                      </div>
                    </div>

                    {rulingType === "partial_settlement" && (
                      <div>
                        <label className="text-xs font-semibold text-amber-200 block mb-1">
                          Settlement Amount (INR ₹)
                        </label>
                        <Input
                          type="number"
                          value={settlementAmount}
                          onChange={(e) => setSettlementAmount(e.target.value)}
                          placeholder="25000"
                          className="glass-field text-white text-xs font-mono"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-amber-200 block mb-1">
                        Arbitration Ruling Justification & Legal Summary <span className="text-amber-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={rulingSummary}
                        onChange={(e) => setRulingSummary(e.target.value)}
                        placeholder="State legal justification under agreed Proposal Version 2 terms and fair dispute settlement policy..."
                        className="w-full rounded-xl glass-field p-3 text-xs text-white placeholder:text-amber-200/40 leading-relaxed"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 px-5 gap-2"
                      >
                        <Gavel className="w-4 h-4" />
                        <span>Execute Binding Ruling & Log Audit</span>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center text-amber-200/50 border border-amber-500/20 bg-[#1c0c05]/50 rounded-2xl">
              Select an escalation case to review contractual evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
