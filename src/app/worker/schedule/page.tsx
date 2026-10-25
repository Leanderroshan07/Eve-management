"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";
import { WorkerHeader } from "@/components/worker/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import {
  SEEDED_WORKERS_DATA,
  SEEDED_WORKER_ASSIGNMENTS,
  WorkerAssignment,
} from "@/lib/worker-data";

export default function WorkerSchedulePage() {
  const worker = SEEDED_WORKERS_DATA[0];
  const assignments = SEEDED_WORKER_ASSIGNMENTS.filter((a) => a.worker_id === worker.id);

  return (
    <div className="flex-1 flex flex-col">
      <WorkerHeader
        title="Confirmed Schedule & Event Briefings"
        description="Access reporting times, venue directions, client emergency contacts, and uniform protocols."
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-transparent">
        <div className="space-y-4">
          {assignments.map((asg) => (
            <Card key={asg.id} className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/15 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px]">
                        {asg.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Booked by {asg.requester_name}
                      </span>
                    </div>
                    <h3 className="font-editorial text-2xl font-bold text-foreground mt-1">
                      {asg.event_title}
                    </h3>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs text-muted-foreground block">Agreed Compensation</span>
                    <span className="font-editorial text-3xl font-bold text-foreground">
                      {formatINR(asg.agreed_fee)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium block">
                      Escrow Vault Locked (100% Payout Guaranteed)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#240e05]/70 border border-amber-500/20 space-y-1">
                    <span className="text-amber-200/60 text-[11px] block">Event Date & Reporting</span>
                    <span className="font-bold text-foreground block text-sm">
                      {asg.event_date}
                    </span>
                    <span className="text-amber-400 font-semibold block">
                      Reporting Time: {asg.reporting_time}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#240e05]/70 border border-amber-500/20 space-y-1">
                    <span className="text-amber-200/60 text-[11px] block">Venue & Location</span>
                    <span className="font-bold text-foreground block text-sm truncate">
                      {asg.venue_name}
                    </span>
                    <span className="text-muted-foreground block">
                      {asg.venue_city}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#240e05]/70 border border-amber-500/20 space-y-1">
                    <span className="text-amber-200/60 text-[11px] block">Client Contact</span>
                    <span className="font-bold text-foreground block text-sm">
                      {asg.requester_name}
                    </span>
                    <a
                      href={`tel:${asg.requester_phone}`}
                      className="text-amber-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3 h-3" /> {asg.requester_phone}
                    </a>
                  </div>
                </div>

                {asg.uniform_instructions && (
                  <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-foreground/90">
                    <span className="font-semibold text-amber-300 block mb-1">
                      Staff Uniform & Protocol Guidelines:
                    </span>
                    {asg.uniform_instructions}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
