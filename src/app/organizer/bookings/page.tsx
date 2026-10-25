"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Calendar,
  MapPin,
  User,
  Phone,
  FileCheck2,
  ShieldCheck,
  CheckCircle,
  Clock,
  ChevronRight,
  Truck,
} from "lucide-react";
import { OrganizerHeader } from "@/components/organizer/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEEDED_BOOKINGS, ConfirmedBooking } from "@/lib/organizer-data";
import { formatINR, formatDate } from "@/lib/format";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function OrganizerBookingsPage() {
  const [bookings, setBookings] = React.useState<ConfirmedBooking[]>(SEEDED_BOOKINGS);

  return (
    <div className="flex-1 flex flex-col">
      <OrganizerHeader
        title="Confirmed Event Bookings"
        description="View locked contractual agreements, agreed proposal snapshots, and execution timelines."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Notice on Immutable Bookings */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>
              All bookings represent <strong>mutually executed proposals</strong>. Scope, pricing, and dates cannot be
              arbitrarily altered without an authorized contract amendment.
            </span>
          </div>
          <Badge variant="success" className="shrink-0 text-xs">
            1 Active Event
          </Badge>
        </div>

        {/* Bookings List */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {bookings.map((booking) => (
            <motion.div key={booking.id} variants={fadeInUp}>
              <Card className="glass-card overflow-hidden">
                <CardHeader className="bg-[#240e05]/75 border-b border-amber-500/20 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                        <CalendarCheck2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-base">
                            {booking.customer_name}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            ({booking.booking_reference})
                          </span>
                        </div>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          {booking.event_type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="success" className="text-xs">
                        ● Confirmed under Proposal v{booking.proposal_version}
                      </Badge>
                      <span className="text-lg font-bold text-foreground font-mono">
                        {formatINR(booking.total_amount)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-foreground/80">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                        Event Date & Schedule
                      </span>
                      <p className="text-foreground font-medium flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-amber-500" />
                        {formatDate(booking.event_date)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                        Venue & City
                      </span>
                      <p className="text-foreground font-medium flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-amber-500" />
                        {booking.venue_name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                        Primary Client Contact
                      </span>
                      <p className="text-foreground font-medium flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-amber-500" />
                        {booking.customer_phone}
                      </p>
                    </div>
                  </div>

                  {/* Execution Timeline Milestones */}
                  <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                      Execution Milestones
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Advance Contract (50%)</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Scope Locked (v2)</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <Clock className="h-4 w-4" />
                        <span>Vendor & Staff Roster</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>On-site Production</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-[#240e05]/50 border-t border-amber-500/15 py-3 flex justify-between items-center">
                  <span className="text-[11px] text-amber-200/60 font-mono">
                    Agreement Snapshot: {booking.proposal_id}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/organizer/proposals?proposalId=${booking.proposal_id}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs border-amber-500/30 text-amber-200 hover:bg-amber-500/10">
                        View Agreed Scope
                      </Button>
                    </Link>
                    <Link href="/rentals">
                      <Button variant="champagne" size="sm" className="h-8 text-xs gap-1 font-semibold">
                        <Truck className="h-3 w-3" />
                        <span>Equip with Rentals</span>
                      </Button>
                    </Link>
                    <Link href="/organizer/messages">
                      <Button variant="secondary" size="sm" className="h-8 text-xs">
                        Open Client Chat
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
