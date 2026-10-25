"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileQuestion,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  FileSignature,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import {
  CURRENT_CUSTOMER,
  getCustomerInquiries,
} from "@/lib/customer-data";
import { CustomerInquiry } from "@/lib/organizer-data";

export default function CustomerInquiriesPage() {
  const [inquiries, setInquiries] = React.useState<CustomerInquiry[]>([]);

  React.useEffect(() => {
    setInquiries(getCustomerInquiries(CURRENT_CUSTOMER.email));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            My Quote Requests
          </h1>
          <p className="text-xs text-amber-200/60 mt-1">
            Track quotation inquiries submitted across wedding planners and luxury packages.
          </p>
        </div>

        <Link href="/marketplace">
          <Button variant="champagne" className="text-xs font-semibold gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover More Packages</span>
          </Button>
        </Link>
      </div>

      {/* Inquiries Table / Grid */}
      <div className="space-y-4">
        {inquiries.map((inq) => (
          <Card key={inq.id} className="glass-card p-6 hover:border-amber-500/40 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {inq.inquiry_number}
                  </span>
                  <Badge
                    variant={
                      inq.status === "confirmed"
                        ? "success"
                        : inq.status === "proposal_sent"
                        ? "warning"
                        : "default"
                    }
                    className="text-[10px] px-2 py-0.5"
                  >
                    {inq.status === "confirmed"
                      ? "Booking Confirmed"
                      : inq.status === "proposal_sent"
                      ? "Proposal Ready for Review"
                      : "Pending Organizer Review"}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Submitted on {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-editorial text-lg font-bold text-foreground">
                  {inq.event_type}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 inline" />
                    {inq.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500 inline" />
                    {inq.event_date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-500 inline" />
                    {inq.guest_count} Expected Guests
                  </span>
                </div>

                {inq.notes && (
                  <p className="text-xs text-muted-foreground pt-1 border-t border-border mt-2 max-w-3xl leading-relaxed">
                    <strong className="text-foreground font-semibold">Stated Requirements: </strong>
                    {inq.notes}
                  </p>
                )}
              </div>

              {/* Action Column */}
              <div className="shrink-0 flex flex-col sm:items-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                <span className="text-xs text-muted-foreground">Budget Range</span>
                <span className="font-editorial text-xl font-bold text-amber-600 dark:text-amber-400">
                  {formatINR(inq.estimated_budget)}
                </span>

                {inq.status === "proposal_sent" ? (
                  <Link href="/customer/proposals">
                    <Button variant="champagne" className="mt-2 text-xs font-semibold gap-1.5">
                      <FileSignature className="w-3.5 h-3.5" />
                      <span>Review & Accept Proposal</span>
                    </Button>
                  </Link>
                ) : inq.status === "confirmed" ? (
                  <Link href="/customer/bookings">
                    <Button variant="outline" className="mt-2 text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400 gap-1.5">
                      <span>View Confirmed Booking</span>
                    </Button>
                  </Link>
                ) : (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 inline" />
                    Organizer drafting proposal...
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
