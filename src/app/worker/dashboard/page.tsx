"use client";

import * as React from "react";
import Link from "next/link";
import {
  Inbox,
  CalendarCheck2,
  WalletCards,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Lock,
  Calendar,
  X,
  AlertCircle,
  FileSignature,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { WorkerHeader } from "@/components/worker/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { formatINR } from "@/lib/format";
import {
  SEEDED_WORKERS_DATA,
  SEEDED_WORKER_REQUESTS,
  SEEDED_WORKER_ASSIGNMENTS,
  WorkerJobRequest,
  WorkerAssignment,
  acceptWorkerJobRequest,
  counterWorkerJobRequest,
  declineWorkerJobRequest,
  isWorkerDateBlocked,
  toggleWorkerDateAvailability,
} from "@/lib/worker-data";

export default function WorkerDashboardPage() {
  const worker = SEEDED_WORKERS_DATA[0]; // Master Chef K. Ramanathan

  // Component states
  const [requests, setRequests] = React.useState<WorkerJobRequest[]>([]);
  const [assignments, setAssignments] = React.useState<WorkerAssignment[]>([]);
  const [calendarTick, setCalendarTick] = React.useState(0);

  // Counter-offer modal state
  const [counterModalOpen, setCounterModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<WorkerJobRequest | null>(null);
  const [counterFeeInput, setCounterFeeInput] = React.useState("");
  const [counterNotesInput, setCounterNotesInput] = React.useState("");
  const [counterError, setCounterError] = React.useState("");

  // Notification feedback state
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  // Sync initial state
  React.useEffect(() => {
    setRequests([...SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === worker.id)]);
    setAssignments([...SEEDED_WORKER_ASSIGNMENTS.filter((a) => a.worker_id === worker.id)]);
  }, [worker.id]);

  // Derived metrics
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const confirmedAssignments = assignments.filter((a) => a.status === "confirmed");
  const totalEarnings = assignments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => sum + a.agreed_fee, 0);

  // Handlers
  const handleAccept = (req: WorkerJobRequest) => {
    const { request, assignment } = acceptWorkerJobRequest(req.id);
    setRequests(SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === worker.id));
    setAssignments([...SEEDED_WORKER_ASSIGNMENTS.filter((a) => a.worker_id === worker.id)]);
    setActionNotice(`Successfully accepted ${req.request_number} for ${req.event_date}. Date locked on your calendar!`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const openCounterModal = (req: WorkerJobRequest) => {
    setSelectedRequest(req);
    setCounterFeeInput((req.proposed_fee + 5000).toString());
    setCounterNotesInput("Includes senior chef supervision and dedicated kitchen prep team.");
    setCounterError("");
    setCounterModalOpen(true);
  };

  const handleSubmitCounter = () => {
    if (!selectedRequest) return;
    const numFee = parseInt(counterFeeInput.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numFee) || numFee <= 0) {
      setCounterError("Please enter a valid flat fee in ₹ INR.");
      return;
    }
    counterWorkerJobRequest(selectedRequest.id, numFee, counterNotesInput);
    setRequests([...SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === worker.id)]);
    setCounterModalOpen(false);
    setActionNotice(`Counter-offer of ${formatINR(numFee)} sent to ${selectedRequest.requester_name}.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleDecline = (req: WorkerJobRequest) => {
    declineWorkerJobRequest(req.id, "Shift conflict / fully booked");
    setRequests([...SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === worker.id)]);
    setActionNotice(`Declined request ${req.request_number}.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleToggleDay = (dateStr: string) => {
    toggleWorkerDateAvailability(worker.id, dateStr);
    setCalendarTick((prev) => prev + 1);
  };

  // Sample calendar days for quick availability preview (Next 14 days)
  const sampleDays = React.useMemo(() => {
    const days = [];
    const base = new Date(2026, 10, 20); // November 2026
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const str = d.toISOString().split("T")[0];
      const hasAssignment = assignments.some((a) => a.event_date === str);
      const isBlocked = isWorkerDateBlocked(worker.id, str);
      days.push({
        dateStr: str,
        dayNum: d.getDate(),
        weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
        hasAssignment,
        isBlocked,
      });
    }
    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, calendarTick]);

  return (
    <div className="flex-1 flex flex-col">
      <WorkerHeader
        title="Staffing Operations & Shift Control"
        description="Monitor active quote inquiries, versioned proposals, and upcoming event milestones."
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-transparent">
        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-foreground flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-sm font-medium">{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-muted-foreground hover:text-foreground text-xs font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ========================================================
            1. KPI METRIC CARDS
        ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Pending Shift Offers */}
          <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Direct Job Requests</span>
                <Inbox className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-editorial text-3xl font-bold text-foreground">
                  {pendingRequests.length} Pending
                </span>
                {pendingRequests.length > 0 && (
                  <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-400 text-[11px]">
                    Requires Action
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting your flat-fee acceptance or counter
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Confirmed Bookings */}
          <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Confirmed Shifts</span>
                <CalendarCheck2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-editorial text-3xl font-bold text-foreground">
                  {confirmedAssignments.length} Events
                </span>
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[11px]">
                  Calendar Locked
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Next event: {confirmedAssignments[0]?.event_date || "28 Nov 2026"}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Total Earnings Pipeline */}
          <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Earnings & Escrow</span>
                <WalletCards className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-editorial text-3xl font-bold text-foreground">
                  {formatINR(totalEarnings)}
                </span>
                <span className="text-[11px] text-emerald-500 font-semibold">
                  100% Guaranteed
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Locked in Veluxe Smart Escrow
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Rating & Trust */}
          <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Client Reputation</span>
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-editorial text-3xl font-bold text-amber-500 flex items-center gap-1">
                  <span>{worker.rating}</span>
                  <Star className="w-4 h-4 fill-amber-500 inline" />
                </span>
                <Badge variant="outline" className="border-amber-500/30 text-amber-300 text-[11px]">
                  Top 1% Chef
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {worker.review_count} Verified Organizer & Customer Reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================
            2. INCOMING DIRECT SHIFT REQUESTS (FLAT FEE OFFERS)
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Direct Shift Requests Requiring Action
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review client event scope, proposed flat fee in INR, and confirm or negotiate your compensation.
              </p>
            </div>
            <Link
              href="/worker/requests"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {requests.map((req) => {
              const isDateBlocked = isWorkerDateBlocked(worker.id, req.event_date);
              const isPending = req.status === "pending";
              const isCountered = req.status === "countered";
              const isAccepted = req.status === "accepted";

              return (
                <Card
                  key={req.id}
                  className={`border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] transition-all ${
                    isPending ? "border-amber-500/50 shadow-amber-950/30" : ""
                  }`}
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Event Details */}
                      <div className="space-y-2.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                            {req.request_number}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold ${
                              req.requester_type === "organizer"
                                ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            Hired by {req.requester_type === "organizer" ? "Organizer" : "Private Client"}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-medium">
                            {req.requester_name}
                          </span>
                          {req.status === "accepted" && (
                            <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px]">
                              Confirmed Assignment
                            </Badge>
                          )}
                          {req.status === "countered" && (
                            <Badge variant="outline" className="border-amber-500 text-amber-500 text-[10px]">
                              Counter-Offer Sent
                            </Badge>
                          )}
                          {req.status === "declined" && (
                            <Badge variant="outline" className="border-red-500/40 text-red-400 text-[10px]">
                              Declined
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-editorial text-lg sm:text-xl font-bold text-foreground">
                          {req.event_title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span className="font-medium text-foreground">{req.event_date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Reporting: {req.reporting_time} ({req.shift_duration_hours}h Shift)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{req.venue_name}, {req.venue_city}</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                          <span className="font-medium text-foreground">Scope of Work: </span>
                          {req.scope_of_work}
                        </p>

                        {req.counter_fee && (
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
                            <span className="font-semibold">Your Counter-Offer: </span>
                            {formatINR(req.counter_fee)} — <em>{req.worker_notes}</em>
                          </div>
                        )}
                      </div>

                      {/* Right: Compensation & Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 lg:min-w-[220px]">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-medium">
                            Offered Flat Fee
                          </span>
                          <span className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                            {formatINR(req.proposed_fee)}
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            Direct Bank Settlement via Escrow
                          </span>
                        </div>

                        {/* Interactive Decision Actions */}
                        {isPending && (
                          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <Button
                              size="sm"
                              onClick={() => handleAccept(req)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5 text-xs shadow-sm flex-1 sm:flex-initial"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept Shift
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openCounterModal(req)}
                              className="border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs flex-1 sm:flex-initial"
                            >
                              Counter Fee
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

                        {isCountered && (
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block">
                              Awaiting client response to your {formatINR(req.counter_fee || 0)} proposal
                            </span>
                          </div>
                        )}

                        {isAccepted && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmed & Calendar Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            3. NEXT CONFIRMED EVENT & INTERACTIVE CALENDAR
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Next Confirmed Milestone */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-editorial text-xl font-bold text-foreground tracking-tight">
              Next Confirmed Event Briefing
            </h2>

            {confirmedAssignments[0] ? (
              <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
                    <div>
                      <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px]">
                        Mutually Confirmed
                      </Badge>
                      <h3 className="font-editorial text-xl font-bold text-foreground mt-1">
                        {confirmedAssignments[0].event_title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">Agreed Compensation</span>
                      <span className="font-editorial text-2xl font-bold text-foreground">
                        {formatINR(confirmedAssignments[0].agreed_fee)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#240e05]/70 border border-amber-500/20">
                      <span className="text-amber-200/60 block text-[11px]">Event Date & Time</span>
                      <span className="font-semibold text-foreground mt-0.5 block">
                        {confirmedAssignments[0].event_date} • Reporting {confirmedAssignments[0].reporting_time}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#240e05]/70 border border-amber-500/20">
                      <span className="text-amber-200/60 block text-[11px]">Client & Venue</span>
                      <span className="font-semibold text-foreground mt-0.5 block truncate">
                        {confirmedAssignments[0].requester_name} ({confirmedAssignments[0].venue_city})
                      </span>
                    </div>
                  </div>

                  {confirmedAssignments[0].uniform_instructions && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs">
                      <span className="font-semibold text-amber-300 block mb-1">
                        Dress Code & Protocol Instructions:
                      </span>
                      <span className="text-foreground/90 leading-relaxed">
                        {confirmedAssignments[0].uniform_instructions}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 text-amber-500" />
                      <span>Client Emergency: {confirmedAssignments[0].requester_phone}</span>
                    </div>

                    <Link href="/worker/schedule">
                      <Button variant="outline" size="sm" className="border-amber-500/30 hover:bg-amber-500/10 gap-1.5 text-xs">
                        <span>Full Schedule Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No upcoming confirmed shifts. Accept an incoming request above!
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Schedule & Availability Collision Prevention */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-xl font-bold text-foreground tracking-tight">
                Availability Calendar
              </h2>
              <span className="text-[11px] text-muted-foreground">
                Click a day to toggle availability
              </span>
            </div>

            <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-amber-500/15 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Confirmed Event</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                    <span>Blocked Off</span>
                  </div>
                </div>

                {/* 14-Day Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {sampleDays.map((day) => {
                    const isBookedEvent = day.hasAssignment;
                    const isBlocked = day.isBlocked && !isBookedEvent;
                    const isAvailable = !day.isBlocked && !isBookedEvent;

                    return (
                      <button
                        key={day.dateStr}
                        onClick={() => !isBookedEvent && handleToggleDay(day.dateStr)}
                        disabled={isBookedEvent}
                        className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isBookedEvent
                            ? "bg-amber-500/20 border border-amber-500/60 text-amber-500 cursor-not-allowed"
                            : isBlocked
                            ? "bg-muted/40 border border-border text-muted-foreground/60"
                            : "bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:scale-105"
                        }`}
                        title={
                          isBookedEvent
                            ? "Locked: Confirmed Event Booked"
                            : isBlocked
                            ? "Click to Mark Available"
                            : "Click to Block Day Off"
                        }
                      >
                        <span className="text-[10px] font-medium uppercase opacity-75">
                          {day.weekday}
                        </span>
                        <span className="text-sm font-bold mt-0.5">
                          {day.dayNum}
                        </span>
                        {isBookedEvent ? (
                          <Lock className="w-3 h-3 text-amber-500 mt-1" />
                        ) : isAvailable ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                        ) : (
                          <X className="w-3 h-3 text-muted-foreground mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-lg bg-[#240e05]/70 border border-amber-500/20 text-xs text-amber-200/70 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Veluxe Smart Collision Prevention automatically blocks event dates once accepted.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ========================================================
          4. COUNTER-OFFER FLAT-FEE MODAL DIALOG
      ======================================================== */}
      <Dialog open={counterModalOpen} onOpenChange={setCounterModalOpen}>
        <div className="p-6 space-y-5 bg-[#160803] text-foreground border border-amber-500/30 rounded-xl">
          <div>
            <h3 className="font-editorial text-xl font-bold text-foreground">
              Propose Counter Flat-Fee
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Revise your compensation for {selectedRequest?.event_title} ({selectedRequest?.event_date}).
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Client's Original Offer:
              </label>
              <div className="p-3 rounded-xl glass-field text-sm font-bold text-amber-300">
                {selectedRequest ? formatINR(selectedRequest.proposed_fee) : "₹0"}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Your Counter Flat-Fee (₹ INR) *
              </label>
              <Input
                value={counterFeeInput}
                onChange={(e) => setCounterFeeInput(e.target.value)}
                placeholder="e.g. 35000"
                className="glass-field text-amber-200 font-bold text-base"
              />
              {counterError && (
                <p className="text-xs text-red-500 mt-1 font-medium">{counterError}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Reason / Scope Justification (Visible to Client)
              </label>
              <textarea
                value={counterNotesInput}
                onChange={(e) => setCounterNotesInput(e.target.value)}
                rows={3}
                className="w-full rounded-xl glass-field p-3 text-xs text-foreground placeholder:text-amber-200/40"
                placeholder="Explain any extra staffing, travel, or prep requirements..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCounterModalOpen(false)}
              className="border-amber-500/30 hover:bg-amber-500/10 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitCounter}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              Send Counter-Offer
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
