"use client";

import * as React from "react";
import {
  WalletCards,
  CheckCircle2,
  Clock,
  ArrowDownToLine,
  Building2,
  ShieldCheck,
  FileText,
  BadgePercent,
} from "lucide-react";
import { WorkerHeader } from "@/components/worker/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import {
  SEEDED_WORKERS_DATA,
  SEEDED_WORKER_ASSIGNMENTS,
} from "@/lib/worker-data";

export default function WorkerEarningsPage() {
  const worker = SEEDED_WORKERS_DATA[0];
  const assignments = SEEDED_WORKER_ASSIGNMENTS.filter((a) => a.worker_id === worker.id);

  const completedEarnings = assignments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.agreed_fee, 0);

  const lockedEscrow = assignments
    .filter((a) => a.status === "confirmed")
    .reduce((sum, a) => sum + a.agreed_fee, 0);

  return (
    <div className="flex-1 flex flex-col">
      <WorkerHeader
        title="Verified Earnings & Escrow Settlements"
        description="Review transparent payout ledgers, escrow deposits, and verified direct bank transfers."
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-transparent">
        {/* KPI Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
            <CardContent className="p-6">
              <span className="text-xs text-muted-foreground block font-medium">
                Completed & Settled Payouts
              </span>
              <span className="font-editorial text-3xl font-bold text-foreground mt-2 block">
                {formatINR(completedEarnings)}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                Disbursed to HDFC Bank •••• 9102
              </span>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
            <CardContent className="p-6">
              <span className="text-xs text-muted-foreground block font-medium">
                Escrow Locked (Upcoming Shifts)
              </span>
              <span className="font-editorial text-3xl font-bold text-amber-500 mt-2 block">
                {formatINR(lockedEscrow)}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-1">
                Auto-released within 24h of shift completion
              </span>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
            <CardContent className="p-6">
              <span className="text-xs text-muted-foreground block font-medium">
                Payout Bank Account
              </span>
              <div className="flex items-center gap-2 mt-2">
                <Building2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="font-bold text-sm text-foreground">
                  HDFC Bank Corporate
                </span>
              </div>
              <Badge variant="outline" className="mt-2 border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-[10px]">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified & Active
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Payout History Ledger */}
        <div className="space-y-4">
          <h2 className="font-editorial text-xl font-bold text-foreground">
            Transaction Ledger & Shift Settlements
          </h2>

          <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
            <CardContent className="p-0">
              <div className="divide-y divide-amber-500/15">
                {assignments.map((asg) => (
                  <div key={asg.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          TXN-{asg.id.toUpperCase()}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            asg.payment_status === "settled"
                              ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                              : "border-amber-500 text-amber-400 bg-amber-500/10"
                          }`}
                        >
                          {asg.payment_status === "settled" ? "Disbursed to Bank" : "Locked in Escrow"}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground">
                        {asg.event_title} ({asg.event_date})
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Hired by: {asg.requester_name} • Venue: {asg.venue_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 sm:text-right">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Net Remitted</span>
                        <span className="font-editorial text-xl font-bold text-foreground">
                          {formatINR(asg.agreed_fee)}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="border-amber-500/30 hover:bg-amber-500/10 gap-1.5 text-xs">
                        <ArrowDownToLine className="w-3.5 h-3.5 text-amber-500" /> Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
