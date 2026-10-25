"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileQuestion,
  FileSignature,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  ChevronRight,
  User,
  Plus,
} from "lucide-react";
import { OrganizerHeader } from "@/components/organizer/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SEEDED_ORGANIZER,
  SEEDED_INQUIRIES,
  SEEDED_PROPOSALS,
  SEEDED_BOOKINGS,
} from "@/lib/organizer-data";
import { formatINR, formatDate } from "@/lib/format";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function OrganizerDashboardPage() {
  return (
    <div className="flex-1 flex flex-col">
      <OrganizerHeader
        title="Business Overview & Operations"
        description="Monitor active quote inquiries, versioned proposals, and upcoming event milestones."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* ========================================================== */}
        {/* 1. TOP OPERATIONAL KPI CARDS */}
        {/* ========================================================== */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Card 1: Inquiries */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] hover:border-amber-500/35 transition-all">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-medium text-amber-200/70">
                  New Inquiries
                </span>
                <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <FileQuestion className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground tracking-tight">
                  2 Pending
                </span>
                <span className="text-xs text-amber-400 font-medium">
                  Requires Proposal
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Proposals in Negotiation */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] hover:border-amber-500/35 transition-all">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-medium text-amber-200/70">
                  Active Proposals
                </span>
                <div className="h-8 w-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <FileSignature className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground tracking-tight">
                  {formatINR(2242000)}
                </span>
                <span className="text-xs text-blue-400 font-medium">
                  v1 Under Review
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Confirmed Bookings */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] hover:border-amber-500/35 transition-all">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-medium text-amber-200/70">
                  Confirmed Bookings
                </span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <CalendarCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground tracking-tight">
                  1 Event
                </span>
                <span className="text-xs text-emerald-400 font-medium">
                  {formatINR(1003000)}
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Card 4: Total Contract Pipeline */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-[#1c0c05]/80 border border-amber-500/20 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] hover:border-amber-500/35 transition-all">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-medium text-amber-200/70">
                  Pipeline Value
                </span>
                <div className="h-8 w-8 rounded-lg bg-[#d4af37]/20 text-[#fcd34d] flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground tracking-tight">
                  {formatINR(3245000)}
                </span>
                <span className="text-xs text-amber-200/60">
                  Negotiating & Locked
                </span>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* ========================================================== */}
        {/* 2. RECENT INQUIRIES AWAITING ACTION */}
        {/* ========================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                Customer Inquiries Requiring Action
              </h2>
              <p className="text-xs text-muted-foreground">
                Review stated requirements, customize scope, and send a versioned quotation.
              </p>
            </div>
            <Link href="/organizer/inquiries">
              <Button variant="ghost" size="sm" className="text-xs text-amber-400 hover:text-amber-300 gap-1">
                View All Inquiries <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#240e05]/90 text-amber-200/80 uppercase tracking-wider text-[10px] font-semibold border-b border-amber-500/20">
                  <tr>
                    <th className="py-3 px-4">Inquiry Ref</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Event & Date</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Est. Budget</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10 text-foreground">
                  {SEEDED_INQUIRIES.map((inq) => (
                    <tr key={inq.id} className="hover:bg-amber-500/[0.06] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-amber-200/60">
                        {inq.inquiry_number}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div>{inq.customer_name}</div>
                        <div className="text-[11px] text-amber-200/60 font-normal">{inq.location}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>{inq.event_type}</div>
                        <div className="text-[11px] text-amber-400 font-medium">
                          {formatDate(inq.event_date)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-amber-200/70">
                        {inq.guest_count} Guests
                      </td>
                      <td className="py-3.5 px-4 font-medium text-amber-300">
                        {formatINR(inq.estimated_budget)}
                      </td>
                      <td className="py-3.5 px-4">
                        {inq.status === "pending" && (
                          <Badge variant="warning" className="text-[10px]">
                            Pending Proposal
                          </Badge>
                        )}
                        {inq.status === "proposal_sent" && (
                          <Badge variant="champagne" className="text-[10px]">
                            Proposal v1 Sent
                          </Badge>
                        )}
                        {inq.status === "confirmed" && (
                          <Badge variant="success" className="text-[10px]">
                            Confirmed Event
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/organizer/proposals?inquiryId=${inq.id}`}>
                          <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/15">
                            Draft / View Proposal
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 3. CONFIRMED BOOKING TIMELINE & QUICK ACTIONS */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Confirmed Milestone Card */}
          <Card className="lg:col-span-2 border border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground text-base">Next Confirmed Event</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Mutually locked contract under Agreed Proposal Version 2.
                  </CardDescription>
                </div>
                <Badge variant="success" className="text-xs">
                  Locked v2
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {SEEDED_BOOKINGS.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-amber-500/25 bg-[#240e05]/75 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {booking.customer_name}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        ({booking.booking_reference})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {booking.event_type} • {booking.venue_name}
                    </p>
                    <p className="text-xs text-amber-400 font-medium">
                      Event Date: {formatDate(booking.event_date)}
                    </p>
                  </div>
                  <div className="text-right sm:text-right w-full sm:w-auto">
                    <div className="text-base font-bold text-amber-300">
                      {formatINR(booking.total_amount)}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium block">
                      Status: Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="border border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Quick Actions</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Core organizer workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link href="/organizer/packages?action=new" className="block">
                <Button variant="outline" className="w-full justify-between text-xs border-amber-500/20 bg-[#240e05]/50 hover:bg-amber-500/15 text-foreground">
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-amber-400" /> Create New Package
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </Link>

              <Link href="/organizer/profile" className="block">
                <Button variant="outline" className="w-full justify-between text-xs border-amber-500/20 bg-[#240e05]/50 hover:bg-amber-500/15 text-foreground">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-amber-400" /> Edit Business Profile
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </Link>

              <Link href="/organizers/vks-royal-weddings" target="_blank" className="block">
                <Button variant="champagne" className="w-full justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Preview Live Website
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
