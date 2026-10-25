"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  ShieldAlert,
  Scale,
  FileClock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lock,
  Building2,
  CalendarCheck2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import {
  SEEDED_PLATFORM_ACCOUNTS,
  SEEDED_MODERATION_REPORTS,
  SEEDED_DISPUTES,
  SEEDED_AUDIT_LOGS,
} from "@/lib/admin-data";

export default function AdminDashboardPage() {
  const accounts = SEEDED_PLATFORM_ACCOUNTS;
  const reports = SEEDED_MODERATION_REPORTS;
  const disputes = SEEDED_DISPUTES;
  const auditLogs = SEEDED_AUDIT_LOGS;

  const openReportsCount = reports.filter((r) => r.status === "open" || r.status === "investigating").length;
  const activeDisputesCount = disputes.filter((d) => d.status === "open" || d.status === "arbitration_in_progress").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Platform Governance Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System health, compliance auditing, user account safety, and contractual dispute arbitration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-xs px-2.5 py-1">
            Environment: Production-Staging
          </Badge>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200/70">Total Accounts</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-editorial text-2xl font-bold text-white">{accounts.length}</span>
            <span className="text-[11px] text-amber-200/50 block mt-0.5">Across 4 Platform Roles</span>
          </div>
        </Card>

        <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200/70">Gross Event Volume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-editorial text-2xl font-bold text-amber-400">
              {formatINR(3245000)}
            </span>
            <span className="text-[11px] text-emerald-400/80 block mt-0.5">Lakhs & Crores (INR ₹)</span>
          </div>
        </Card>

        <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200/70">Active Grievances</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-editorial text-2xl font-bold text-white">{openReportsCount}</span>
            <span className="text-[11px] text-amber-400/80 block mt-0.5">Reports in queue</span>
          </div>
        </Card>

        <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200/70">Disputes in Arbitration</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-editorial text-2xl font-bold text-white">{activeDisputesCount}</span>
            <span className="text-[11px] text-purple-300/80 block mt-0.5">Contract v2 Under Review</span>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Moderation Queue & Active Dispute */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Moderation Reports (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="font-editorial text-lg font-bold text-white">Active Moderation Queue</h3>
            </div>
            <Link href="/admin/reports" className="text-xs text-amber-400 hover:underline">
              View all reports →
            </Link>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <Card key={rep.id} className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] p-4 hover:border-amber-500/40 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-300/80 font-semibold">{rep.report_number}</span>
                      <Badge
                        variant={rep.status === "open" ? "warning" : "champagne"}
                        className="text-[10px] px-1.5 py-0 capitalize"
                      >
                        {rep.status}
                      </Badge>
                      <span className="text-[11px] text-amber-200/50">
                        Category: {rep.reason_category.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h4 className="font-editorial text-sm font-bold text-white">
                      Target: {rep.target_name}
                    </h4>

                    <p className="text-xs text-amber-100/80 leading-relaxed max-w-xl">
                      {rep.description}
                    </p>

                    <span className="text-[11px] text-amber-200/50 block pt-1">
                      Reported by {rep.reporter_name} ({rep.reporter_role})
                    </span>
                  </div>

                  <Link href={`/admin/reports?id=${rep.id}`}>
                    <Button size="sm" className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs">
                      Take Action
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Active Dispute Case Spotlight (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400" />
            <h3 className="font-editorial text-lg font-bold text-white">Active Arbitration</h3>
          </div>

          {disputes.length > 0 && (
            <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl p-5 space-y-4 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
              <div className="p-4 rounded-xl bg-gradient-to-tr from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-purple-400 text-purple-300 text-[10px]">
                    {disputes[0].dispute_number}
                  </Badge>
                  <span className="font-mono text-xs text-amber-200/60">
                    Booking: {disputes[0].booking_reference}
                  </span>
                </div>

                <h4 className="font-editorial text-base font-bold text-white">
                  {disputes[0].customer_name} vs {disputes[0].organizer_name}
                </h4>

                <div className="flex justify-between items-center text-xs text-amber-100/80 pt-1">
                  <span>Contract Value:</span>
                  <span className="font-editorial text-base font-bold text-amber-400">
                    {formatINR(disputes[0].disputed_amount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-[#240e05]/75 border border-amber-500/25">
                  <strong className="text-amber-300 block mb-1">Customer Claim:</strong>
                  <p className="text-amber-100/70 text-[11px] leading-relaxed">
                    {disputes[0].customer_claim}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#240e05]/75 border border-amber-500/25">
                  <strong className="text-amber-300 block mb-1">Organizer Position:</strong>
                  <p className="text-amber-100/70 text-[11px] leading-relaxed">
                    {disputes[0].organizer_defense}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/admin/disputes">
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs gap-1.5 py-2.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Arbitrate Contract & Issue Settlement Ruling</span>
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Immutable Audit Logs Stream */}
      <div className="space-y-4 pt-4 border-t border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileClock className="w-4 h-4 text-amber-400" />
            <h3 className="font-editorial text-lg font-bold text-white">Immutable Platform Audit Trail</h3>
          </div>
          <Link href="/admin/audit-logs" className="text-xs text-amber-400 hover:underline">
            View full log →
          </Link>
        </div>

        <div className="divide-y divide-amber-500/15 rounded-xl border border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl overflow-hidden text-xs">
          {auditLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#240e05]/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono border-amber-500/40 text-amber-300">
                    {log.action_type.replace(/_/g, " ")}
                  </Badge>
                  <span className="font-semibold text-white">{log.target_entity}</span>
                </div>
                <p className="text-amber-200/60 text-[11px]">{log.justification_notes}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-amber-200 font-medium block">{log.admin_name}</span>
                <span className="text-[11px] text-amber-200/40 block">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
