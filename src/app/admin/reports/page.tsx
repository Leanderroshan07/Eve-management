"use client";

import * as React from "react";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  User,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import {
  SEEDED_MODERATION_REPORTS,
  CURRENT_ADMIN,
  ModerationReport,
  resolveModerationReport,
} from "@/lib/admin-data";

export default function AdminReportsPage() {
  const [reports, setReports] = React.useState<ModerationReport[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedReport, setSelectedReport] = React.useState<ModerationReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setReports([...SEEDED_MODERATION_REPORTS]);
  }, []);

  const filteredReports = React.useMemo(() => {
    return reports.filter((rep) => {
      if (statusFilter === "all") return true;
      return rep.status === statusFilter;
    });
  }, [reports, statusFilter]);

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !resolutionNotes.trim()) return;

    const updated = resolveModerationReport(
      selectedReport.id,
      resolutionNotes,
      CURRENT_ADMIN.name
    );

    setReports([...SEEDED_MODERATION_REPORTS]);
    setSelectedReport(null);
    setResolutionNotes("");
    setSuccessMessage(`Report ${updated.report_number} marked RESOLVED. Recorded in platform audit log.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Moderation & Grievance Queue
          </h1>
          <p className="text-xs text-amber-200/60 mt-1">
            Investigate reported accounts, misleading package listings, delivery discrepancies, and terms violations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-xs">
            Open Queue: {reports.filter((r) => r.status === "open").length}
          </Badge>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["all", "open", "investigating", "resolved"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
              statusFilter === st
                ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                : "bg-[#240e05]/80 text-amber-200/70 hover:text-white border border-amber-500/25"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="border-amber-500/20 bg-[#1c0c05]/80 p-6 hover:border-amber-500/40 transition-all shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {report.report_number}
                  </span>
                  <Badge
                    variant={
                      report.status === "resolved"
                        ? "success"
                        : report.status === "investigating"
                        ? "champagne"
                        : "warning"
                    }
                    className="text-[10px] capitalize px-2 py-0.5"
                  >
                    {report.status}
                  </Badge>
                  <span className="text-[11px] text-slate-500">
                    Category: {report.reason_category.replace(/_/g, " ")}
                  </span>
                </div>

                <div>
                  <h3 className="font-editorial text-base font-bold text-white">
                    Target: {report.target_name} ({report.target_type})
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span>Reported by: <strong className="text-slate-400">{report.reporter_name}</strong> ({report.reporter_role})</span>
                  <span>•</span>
                  <span>Filed on: {new Date(report.created_at).toLocaleDateString()}</span>
                </div>

                {report.resolution_notes && (
                  <div className="p-3 rounded-lg bg-[#141a26] border border-emerald-500/30 text-xs text-emerald-300">
                    <strong className="block text-emerald-400 font-semibold mb-0.5">Admin Resolution:</strong>
                    {report.resolution_notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="shrink-0">
                {report.status !== "resolved" ? (
                  <Button
                    onClick={() => {
                      setSelectedReport(report);
                      setResolutionNotes("");
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs gap-1.5"
                  >
                    <span>Investigate & Resolve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-xs">
                    Resolved & Audited
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resolution Dialog */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
        title={`Resolve Report ${selectedReport?.report_number}`}
        description={`Target Entity: ${selectedReport?.target_name}`}
      >
        {selectedReport && (
          <form onSubmit={handleResolve} className="space-y-4 py-2 text-xs">
            <div className="p-3 rounded-xl bg-[#240e05]/85 border border-amber-500/25 space-y-1">
              <span className="text-amber-200/70 block font-semibold">Report Summary:</span>
              <p className="text-amber-100/80 leading-relaxed text-[11px]">{selectedReport.description}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-amber-200 block mb-1">
                Resolution Findings & Action Summary <span className="text-amber-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Verified with provider; delivery timeline adjusted and customer notified. Formal compliance warning recorded..."
                className="w-full rounded-xl glass-field p-3 text-xs text-white placeholder:text-amber-200/40 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedReport(null)}
                className="text-xs border-amber-500/30 text-amber-200/70 hover:bg-amber-500/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Confirm Resolution & Log Audit
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
