"use client";

import * as React from "react";
import Link from "next/link";
import {
  Inbox,
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { WorkerHeader } from "@/components/worker/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { formatINR } from "@/lib/format";
import {
  SEEDED_WORKERS_DATA,
  SEEDED_WORKER_REQUESTS,
  WorkerJobRequest,
  acceptWorkerJobRequest,
  counterWorkerJobRequest,
  declineWorkerJobRequest,
} from "@/lib/worker-data";

export default function WorkerRequestsPage() {
  const worker = SEEDED_WORKERS_DATA[0];
  const [filter, setFilter] = React.useState<"all" | "pending" | "countered" | "accepted" | "declined">("all");
  const [requests, setRequests] = React.useState<WorkerJobRequest[]>([]);

  // Counter Modal
  const [counterOpen, setCounterOpen] = React.useState(false);
  const [targetReq, setTargetReq] = React.useState<WorkerJobRequest | null>(null);
  const [counterFee, setCounterFee] = React.useState("");
  const [counterNotes, setCounterNotes] = React.useState("");

  React.useEffect(() => {
    setRequests([...SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === worker.id)]);
  }, [worker.id]);

  const filteredRequests = React.useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((r) => r.status === filter);
  }, [filter, requests]);

  const handleAccept = (req: WorkerJobRequest) => {
    acceptWorkerJobRequest(req.id);
    setRequests([...SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === worker.id)]);
  };

  const handleOpenCounter = (req: WorkerJobRequest) => {
    setTargetReq(req);
    setCounterFee((req.proposed_fee + 4000).toString());
    setCounterNotes("Revised flat fee covering dedicated assistants.");
    setCounterOpen(true);
  };

  const handleSubmitCounter = () => {
    if (!targetReq) return;
    const fee = parseInt(counterFee.replace(/[^0-9]/g, ""), 10);
    if (!fee) return;
    counterWorkerJobRequest(targetReq.id, fee, counterNotes);
    setRequests([...SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === worker.id)]);
    setCounterOpen(false);
  };

  const handleDecline = (req: WorkerJobRequest) => {
    declineWorkerJobRequest(req.id, "Fully booked");
    setRequests([...SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === worker.id)]);
  };

  return (
    <div className="flex-1 flex flex-col">
      <WorkerHeader
        title="Direct Shift Offers & Negotiation"
        description="Filter incoming requests, review proposed flat compensation, and submit binding counter-offers."
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-transparent">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(["all", "pending", "countered", "accepted", "declined"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                  : "bg-[#240e05]/80 border border-amber-500/25 text-amber-200/70 hover:text-amber-100 hover:border-amber-500/40"
              }`}
            >
              {tab === "all" ? "All Requests" : tab}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <Card key={req.id} className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-amber-500">
                        {req.request_number}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        From {req.requester_name} ({req.requester_type})
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${
                          req.status === "accepted"
                            ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                            : req.status === "countered"
                            ? "border-amber-500 text-amber-400 bg-amber-500/10"
                            : req.status === "declined"
                            ? "border-red-500 text-red-400"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {req.status}
                      </Badge>
                    </div>

                    <h3 className="font-editorial text-xl font-bold text-foreground">
                      {req.event_title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-foreground font-medium">{req.event_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{req.reporting_time} ({req.shift_duration_hours}h Shift)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{req.venue_name}, {req.venue_city}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      <span className="font-semibold text-foreground">Scope: </span>
                      {req.scope_of_work}
                    </p>

                    {req.counter_fee && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                        <span className="font-semibold">Your Counter-Offer: </span>
                        {formatINR(req.counter_fee)} — {req.worker_notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-medium">
                        Offered Flat Fee
                      </span>
                      <span className="font-editorial text-3xl font-bold text-foreground">
                        {formatINR(req.proposed_fee)}
                      </span>
                    </div>

                    {req.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(req)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenCounter(req)}
                          className="border-amber-500/40 text-amber-500 hover:bg-amber-500/10 text-xs"
                        >
                          Counter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDecline(req)}
                          className="text-muted-foreground hover:text-red-400 text-xs"
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {req.status === "accepted" && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Assignment
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Counter Modal */}
      <Dialog open={counterOpen} onOpenChange={setCounterOpen}>
        <div className="p-6 space-y-4 bg-[#160803] text-foreground border border-amber-500/30 rounded-xl">
          <h3 className="font-editorial text-xl font-bold text-foreground">
            Counter-Offer Flat Fee
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-amber-200 block mb-1">
                Your Proposed Fee (₹ INR) *
              </label>
              <Input
                value={counterFee}
                onChange={(e) => setCounterFee(e.target.value)}
                className="glass-field font-bold text-base text-amber-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-200 block mb-1">
                Notes for Requester
              </label>
              <textarea
                value={counterNotes}
                onChange={(e) => setCounterNotes(e.target.value)}
                rows={3}
                placeholder="State your specialized experience, travel logistics, or counter rationale..."
                className="w-full rounded-xl glass-field p-3 text-xs text-foreground placeholder:text-amber-200/40"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCounterOpen(false)} className="border-amber-500/30 hover:bg-amber-500/10 text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmitCounter} className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400">
              Submit Counter
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
