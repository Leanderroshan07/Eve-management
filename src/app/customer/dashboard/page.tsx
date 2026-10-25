"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileSignature,
  FileQuestion,
  CalendarCheck2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Users,
  Compass,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import {
  CURRENT_CUSTOMER,
  getCustomerProposals,
  getCustomerInquiries,
  getCustomerBookings,
} from "@/lib/customer-data";

export default function CustomerDashboardPage() {
  const proposals = getCustomerProposals(CURRENT_CUSTOMER.email);
  const inquiries = getCustomerInquiries(CURRENT_CUSTOMER.email);
  const bookings = getCustomerBookings(CURRENT_CUSTOMER.name);

  // The proposal needing review
  const pendingProposal = proposals.find(
    (p) => p.status === "sent_to_customer" || (!p.customer_accepted && p.organizer_accepted)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Client Wedding Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track your custom proposals, quotation requests, and confirmed celebration milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs gap-2">
              <Compass className="w-4 h-4" />
              <span>Browse Marketplace</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Prominent Action Required Alert for Proposal Review */}
      {pendingProposal && (
        <Card className="border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#1c0c05]/85 to-[#120601]/90 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" className="text-xs font-semibold px-2.5 py-0.5 animate-pulse">
                    Action Required
                  </Badge>
                  <span className="text-xs text-amber-300 font-mono font-medium">
                    Proposal {pendingProposal.proposal_number} (v{pendingProposal.version})
                  </span>
                </div>

                <div>
                  <h3 className="font-editorial text-xl font-bold text-foreground">
                    Official Proposal Ready for Your Review & Acceptance
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                    VKS Royal Wedding Planners has drafted your customized itemized proposal for{" "}
                    <span className="font-semibold text-foreground">{pendingProposal.event_type}</span> at{" "}
                    <span className="font-semibold text-foreground">{pendingProposal.venue_location}</span> on{" "}
                    <span className="font-semibold text-foreground">{pendingProposal.event_date}</span>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>
                    Estimated Total:{" "}
                    <strong className="text-amber-400 font-editorial text-sm">
                      {formatINR(pendingProposal.total_amount)}
                    </strong>{" "}
                    (incl. 18% GST)
                  </span>
                  <span>•</span>
                  <span>Line Items: {pendingProposal.items.length} Included</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline" /> Organizer Signed
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link href={`/customer/proposals?id=${pendingProposal.id}`}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2 text-xs py-2.5 px-4 shadow-md">
                    <span>Inspect & Accept Proposal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] hover:border-amber-500/35 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200/70">Proposals to Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <FileSignature className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-editorial text-2xl font-bold text-foreground">
              {proposals.filter((p) => p.status === "sent_to_customer").length}
            </span>
            <span className="text-[11px] text-amber-400/80 block mt-0.5">Pending your sign-off</span>
          </div>
        </Card>

        <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] hover:border-amber-500/35 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200/70">Active Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-editorial text-2xl font-bold text-foreground">{inquiries.length}</span>
            <span className="text-[11px] text-amber-200/60 block mt-0.5">Under evaluation</span>
          </div>
        </Card>

        <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] hover:border-amber-500/35 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200/70">Confirmed Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-editorial text-2xl font-bold text-foreground">{bookings.length}</span>
            <span className="text-[11px] text-emerald-400/80 block mt-0.5">Mutually confirmed</span>
          </div>
        </Card>

        <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] hover:border-amber-500/35 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-200/70">Messages</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-editorial text-2xl font-bold text-foreground">2</span>
            <span className="text-[11px] text-amber-200/60 block mt-0.5">With VKS Concierge</span>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Inquiries Table & Celebration Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Your Inquiries & Quotes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-lg font-bold text-foreground">Your Quotation Requests</h3>
            <Link href="/customer/inquiries" className="text-xs text-amber-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <Card key={inq.id} className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-4 hover:border-amber-500/40 transition-all shadow-[0_8px_32px_0_rgba(18,7,2,0.35)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-200/60 font-semibold">{inq.inquiry_number}</span>
                      <Badge
                        variant={
                          inq.status === "confirmed"
                            ? "success"
                            : inq.status === "proposal_sent"
                            ? "warning"
                            : "default"
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {inq.status === "confirmed"
                          ? "Booking Confirmed"
                          : inq.status === "proposal_sent"
                          ? "Proposal Received"
                          : "Under Review"}
                      </Badge>
                    </div>
                    <h4 className="font-editorial text-sm font-bold text-foreground">{inq.event_type}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-3">
                      <span>
                        <MapPin className="w-3 h-3 inline mr-1 text-amber-400" />
                        {inq.location}
                      </span>
                      <span>
                        <Calendar className="w-3 h-3 inline mr-1 text-amber-400" />
                        {inq.event_date}
                      </span>
                      <span>
                        <Users className="w-3 h-3 inline mr-1 text-amber-400" />
                        {inq.guest_count} Guests
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400 font-editorial block">
                      {formatINR(inq.estimated_budget)}
                    </span>
                    {inq.status === "proposal_sent" && (
                      <Link href="/customer/proposals">
                        <Button size="sm" className="mt-2 text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40">
                          Review Proposal
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Next Confirmed Event or Planning Milestone (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-editorial text-lg font-bold text-foreground">Upcoming Event Roadmap</h3>

          <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 space-y-4 shadow-[0_8px_32px_0_rgba(18,7,2,0.35)]">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Target Celebration
              </span>
              <h4 className="font-editorial text-base font-bold text-foreground mt-1">
                Grand Wedding & Sangeet Gala
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                The Leela Palace, Chennai • Target: 28 Nov 2026
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                Milestone Stages:
              </span>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Quotation Inquired</span>
                    <span className="text-[11px] text-muted-foreground">Requirements and guest count submitted</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                    ●
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Proposal Sign-Off & Contract</span>
                    <span className="text-[11px] text-amber-700 dark:text-amber-300">Awaiting your mutual acceptance of Proposal v1</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Vendor & Floor Staff Allocation</span>
                    <span className="text-[11px] text-muted-foreground">Floral imports & steward scheduling</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground">
                    4
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Event Day Execution</span>
                    <span className="text-[11px] text-muted-foreground">Live scenography and royal banquet production</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/customer/messages">
                <Button variant="outline" className="w-full text-xs text-foreground gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Chat with VKS Concierge</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
