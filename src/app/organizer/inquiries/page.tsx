"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileQuestion,
  Calendar,
  MapPin,
  Users,
  FileSignature,
  Clock,
  Phone,
  Mail,
  Search,
} from "lucide-react";
import { OrganizerHeader } from "@/components/organizer/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CustomerInquiry } from "@/lib/organizer-data";
import { formatINR, formatDate } from "@/lib/format";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useAuth } from "@/lib/supabase/auth-context";
import { getScopedOrganizerInquiries } from "@/lib/user-scoped-data";
import { fetchLiveCustomerInquiries } from "@/lib/supabase/db-sync";

export default function OrganizerInquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = React.useState<CustomerInquiry[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    const local = getScopedOrganizerInquiries(user);
    setInquiries(local);

    const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    fetchLiveCustomerInquiries({ organizerId: orgId }).then((dbInquiries) => {
      if (dbInquiries.length > 0) {
        const map = new Map(local.map((i) => [i.id, i]));
        for (const item of dbInquiries) {
          map.set(item.id, item);
        }
        setInquiries(Array.from(map.values()));
      }
    });
  }, [user]);

  const filtered = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    const matchesSearch =
      inq.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      inq.event_type.toLowerCase().includes(search.toLowerCase()) ||
      inq.location.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col">
      <OrganizerHeader
        title="Customer Quote Inquiries"
        description="Review customer event requirements, stated guest counts, budgets, and draft versioned proposals."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-amber-400/80 z-10" />
            <Input
              placeholder="Search by client, event, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 glass-field text-foreground placeholder:text-amber-200/40"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl glass-field text-xs">
            {["all", "pending", "proposal_sent", "confirmed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-amber-200/60 hover:text-amber-100"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Inquiries List */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filtered.map((inq) => (
            <motion.div key={inq.id} variants={fadeInUp}>
              <Card className="glass-card p-5 hover:border-amber-500/40 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Customer & Event Info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-foreground">
                        {inq.customer_name}
                      </span>
                      <span className="text-xs font-mono text-amber-400">
                        {inq.inquiry_number}
                      </span>
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
                          Confirmed Booking
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-amber-200/70">
                      <span className="font-semibold text-amber-400">
                        {inq.event_type}
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-200/70">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        {formatDate(inq.event_date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-200/70">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        {inq.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-200/70">
                        <Users className="h-3.5 w-3.5 text-amber-500" />
                        {inq.guest_count} Guests
                      </span>
                    </div>

                    {inq.notes && (
                      <p className="text-xs text-amber-100/90 italic glass-field p-2.5 rounded-xl border-amber-500/20 max-w-3xl">
                        &ldquo;{inq.notes}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {inq.customer_phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {inq.customer_email}
                      </span>
                    </div>
                  </div>

                  {/* Right: Budget & Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 pt-3 lg:pt-0 border-border gap-3">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                        Estimated Budget
                      </span>
                      <span className="text-base font-bold text-foreground font-mono">
                        {formatINR(inq.estimated_budget)}
                      </span>
                    </div>

                    <Link href={`/organizer/proposals?inquiryId=${inq.id}`}>
                      <Button variant="champagne" size="sm" className="gap-1.5 text-xs font-semibold">
                        <FileSignature className="h-3.5 w-3.5" />
                        {inq.status === "pending" ? "Draft Proposal v1" : "View / Revise Proposal"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
