"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  Crown,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR } from "@/lib/format";
import {
  CURRENT_CUSTOMER,
  getCustomerBookings,
} from "@/lib/customer-data";
import { ConfirmedBooking } from "@/lib/organizer-data";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = React.useState<ConfirmedBooking[]>([]);
  const [selectedInvoice, setSelectedInvoice] = React.useState<ConfirmedBooking | null>(null);

  React.useEffect(() => {
    setBookings(getCustomerBookings(CURRENT_CUSTOMER.name));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Confirmed Event Bookings
            </h1>
            <Badge variant="success" className="text-xs">
              Immutable Contracts
            </Badge>
          </div>
          <p className="text-xs text-amber-200/60 mt-1">
            Celebrations confirmed through mutual proposal sign-off with VKS Royal Wedding Planners.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-200/80 glass-field px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Contracts are locked under agreed proposal versions.</span>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
              {/* Card Header */}
              <div className="p-6 border-b border-amber-500/15 bg-[#240e05]/75 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {booking.booking_reference}
                    </span>
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
                      Locked under Proposal v{booking.proposal_version}
                    </Badge>
                    <Badge variant="success" className="text-[10px] capitalize">
                      {booking.status}
                    </Badge>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-foreground">
                    {booking.event_type}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-3">
                    <span>
                      <MapPin className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
                      {booking.venue_name}
                    </span>
                    <span>•</span>
                    <span>
                      <Calendar className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
                      {booking.event_date}
                    </span>
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="text-xs text-amber-200/60 block">Agreed Contract Value</span>
                  <span className="font-editorial text-2xl font-bold text-amber-400 block">
                    {formatINR(booking.total_amount)}
                  </span>
                  <span className="text-[11px] text-amber-200/40 block">Includes 18% GST</span>
                </div>
              </div>

              {/* Execution Timeline Stepper */}
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-foreground/85 uppercase tracking-wider mb-4">
                    Production & Execution Schedule
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>1. Contract Signed</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Proposal accepted & deposit scheduled</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">Completed</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-1">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span>2. Scenography Prep</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Mandap dome blueprints & floral bookings</p>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">Active Stage</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1 opacity-75">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                        <span>3. Staff Roster</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">30 banquet stewards & bridal concierge</p>
                      <span className="text-[10px] text-muted-foreground block mt-1">Scheduled</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1 opacity-75">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                        <span>4. Royal Execution</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">On-site event direction & hospitality</p>
                      <span className="text-[10px] text-muted-foreground block mt-1">{booking.event_date}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Actions */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Organizer: VKS Royal Wedding Planners</span>
                    <span>•</span>
                    <span>Concierge: +91 98401 23456</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInvoice(booking)}
                      className="text-xs border-border text-foreground hover:bg-muted gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      <span>View Invoice & Tax Receipt</span>
                    </Button>

                    <Link href="/customer/messages">
                      <Button variant="champagne" size="sm" className="text-xs font-semibold gap-1.5">
                        <span>Message Event Director</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-editorial text-lg font-bold text-foreground">No Confirmed Bookings Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Once you review and accept an organizer's versioned proposal in Proposals to Review, your celebration will be officially locked here.
            </p>
          </div>
          <Link href="/customer/proposals">
            <Button variant="champagne" size="sm" className="font-semibold text-xs">
              Go to Proposals to Review
            </Button>
          </Link>
        </Card>
      )}

      {/* Invoice Summary Modal */}
      <Dialog
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
        title="Official Tax Invoice & Milestone Schedule"
        description="Statutory receipt generated under agreed proposal terms."
      >
        {selectedInvoice && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-4 rounded-xl glass-field space-y-2">
              <div className="flex justify-between items-center text-amber-200/70">
                <span>Invoice Ref:</span>
                <span className="font-mono text-white font-bold">{selectedInvoice.booking_reference}</span>
              </div>
              <div className="flex justify-between items-center text-amber-200/70">
                <span>Customer:</span>
                <span className="text-white font-medium">{selectedInvoice.customer_name}</span>
              </div>
              <div className="flex justify-between items-center text-amber-200/70">
                <span>Organizer:</span>
                <span className="text-white font-medium">VKS Royal Wedding & Luxury Event Planners</span>
              </div>
              <div className="flex justify-between items-center text-amber-200/70">
                <span>GSTIN:</span>
                <span className="font-mono text-amber-400">33AABCV9901M1Z5</span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-field space-y-2">
              <div className="flex justify-between text-amber-200/70">
                <span>Agreed Scope Version:</span>
                <span className="font-bold text-white">Version {selectedInvoice.proposal_version}</span>
              </div>
              <div className="flex justify-between text-amber-200/70">
                <span>Total Contract Value:</span>
                <span className="font-bold font-editorial text-sm text-amber-400">
                  {formatINR(selectedInvoice.total_amount)}
                </span>
              </div>
              <div className="flex justify-between text-amber-200/70">
                <span>GST (18% Included):</span>
                <span className="font-mono text-white">
                  {formatINR(Math.round(selectedInvoice.total_amount * (0.18 / 1.18)))}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedInvoice(null)}
                className="text-xs border-amber-500/30 text-amber-200 hover:text-white hover:bg-amber-500/15"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  alert("Invoice PDF download simulated for demo purposes.");
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDF</span>
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
