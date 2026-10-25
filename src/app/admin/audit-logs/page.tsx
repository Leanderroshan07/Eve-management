"use client";

import * as React from "react";
import {
  FileClock,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEEDED_AUDIT_LOGS, AdminAuditLogEntry } from "@/lib/admin-data";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = React.useState<AdminAuditLogEntry[]>([]);
  const [filterAction, setFilterAction] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  React.useEffect(() => {
    setLogs([...SEEDED_AUDIT_LOGS]);
  }, []);

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchAction = filterAction === "all" || log.action_type === filterAction;
      const matchQuery =
        !searchQuery ||
        log.target_entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.justification_notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.admin_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAction && matchQuery;
    });
  }, [logs, filterAction, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Immutable Platform Audit Log
            </h1>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs font-mono">
              Tamper-Evident
            </Badge>
          </div>
          <p className="text-xs text-amber-200/60 mt-1">
            Chronological record of sensitive administrative actions, sanctions, dispute rulings, and access changes.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => alert("Audit log export downloaded.")}
          className="text-xs border-amber-500/30 text-amber-200/80 hover:bg-amber-500/10 gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Audit Log (CSV)</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400/80 z-10" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by target entity, admin actor, or justification..."
            className="pl-10 text-xs glass-field text-amber-100 placeholder:text-amber-200/40"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full rounded-xl glass-field px-3 py-2 text-xs text-amber-100 cursor-pointer"
          >
            <option value="all">All Action Types</option>
            <option value="issue_warning">Warnings Issued</option>
            <option value="suspend_account">Suspensions</option>
            <option value="reinstate_account">Reinstatements</option>
            <option value="settle_dispute">Dispute Rulings</option>
            <option value="resolve_report">Report Resolutions</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="border-amber-500/20 bg-[#1c0c05]/80 overflow-hidden shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#240e05]/90 text-amber-200/80 uppercase text-[10px] font-semibold border-b border-amber-500/20">
              <tr>
                <th className="py-3.5 px-4">Timestamp (UTC/IST)</th>
                <th className="py-3.5 px-3">Action Type</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-5">Official Justification / Ruling</th>
                <th className="py-3.5 px-4 text-right">Admin Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/15 text-slate-300">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#240e05]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 shrink-0">
                    <Badge
                      variant={
                        entry.action_type === "suspend_account"
                          ? "destructive"
                          : entry.action_type === "issue_warning"
                          ? "warning"
                          : entry.action_type === "settle_dispute"
                          ? "champagne"
                          : "success"
                      }
                      className="text-[10px] uppercase font-mono px-2 py-0.5"
                    >
                      {entry.action_type.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {entry.target_entity}
                  </td>
                  <td className="py-3.5 px-5 text-slate-300 text-[11px] max-w-md leading-relaxed">
                    {entry.justification_notes}
                  </td>
                  <td className="py-3.5 px-4 text-right shrink-0">
                    <span className="font-semibold text-amber-300 block">{entry.admin_name}</span>
                    <span className="text-[10px] text-slate-500 block">{entry.admin_role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
