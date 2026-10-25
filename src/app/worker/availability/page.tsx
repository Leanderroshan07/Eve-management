"use client";

import * as React from "react";
import {
  CalendarDays,
  Lock,
  CheckCircle2,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { WorkerHeader } from "@/components/worker/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SEEDED_WORKERS_DATA,
  SEEDED_WORKER_ASSIGNMENTS,
  isWorkerDateBlocked,
  toggleWorkerDateAvailability,
} from "@/lib/worker-data";

export default function WorkerAvailabilityPage() {
  const worker = SEEDED_WORKERS_DATA[0];
  const [currentMonth, setCurrentMonth] = React.useState({ year: 2026, month: 10 }); // November 2026 (0-indexed: 10)
  const [calendarTick, setCalendarTick] = React.useState(0);

  const assignments = SEEDED_WORKER_ASSIGNMENTS.filter((a) => a.worker_id === worker.id);

  const daysInMonth = React.useMemo(() => {
    const { year, month } = currentMonth;
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayIndex = date.getDay(); // 0 is Sunday

    // Padding for first week
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      const dayDate = new Date(year, month, i);
      const str = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const isConfirmed = assignments.some((a) => a.event_date === str);
      const isBlocked = isWorkerDateBlocked(worker.id, str);

      days.push({
        dayNum: i,
        dateStr: str,
        isConfirmed,
        isBlocked: isBlocked && !isConfirmed,
        isAvailable: !isBlocked && !isConfirmed,
      });
    }

    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, calendarTick, assignments]);

  const handleToggle = (dateStr: string) => {
    toggleWorkerDateAvailability(worker.id, dateStr);
    setCalendarTick((t) => t + 1);
  };

  const monthName = new Date(currentMonth.year, currentMonth.month).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1 flex flex-col">
      <WorkerHeader
        title="Availability Calendar & Shift Lock"
        description="Manage your working dates. Confirmed event bookings are automatically locked to eliminate double-booking."
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-transparent">
        {/* Month Navigation & Legend Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-editorial text-2xl font-bold text-foreground">
              {monthName}
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentMonth((prev) => ({
                    year: prev.month === 0 ? prev.year - 1 : prev.year,
                    month: prev.month === 0 ? 11 : prev.month - 1,
                  }))
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentMonth((prev) => ({
                    year: prev.month === 11 ? prev.year + 1 : prev.year,
                    month: prev.month === 11 ? 0 : prev.month + 1,
                  }))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Available for Direct Hire</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Confirmed Event (Locked)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">Personal Leave / Blocked</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
          <CardContent className="p-6">
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-amber-200/70 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="h-24 rounded-xl border border-transparent" />;
                }

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => !day.isConfirmed && handleToggle(day.dateStr)}
                    disabled={day.isConfirmed}
                    className={`h-24 p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer text-left ${
                      day.isConfirmed
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-400 cursor-not-allowed shadow-xs"
                        : day.isBlocked
                        ? "bg-[#240e05]/50 border-amber-500/15 text-muted-foreground/50"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-500 hover:scale-[1.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm text-foreground">
                        {day.dayNum}
                      </span>
                      {day.isConfirmed && (
                        <Badge className="bg-amber-500 text-slate-950 font-bold text-[9px] px-1 py-0">
                          Booked
                        </Badge>
                      )}
                    </div>

                    <div className="text-[11px] truncate">
                      {day.isConfirmed ? (
                        <div className="flex items-center gap-1 font-semibold text-amber-500">
                          <Lock className="w-3 h-3" /> Locked
                        </div>
                      ) : day.isAvailable ? (
                        <span className="text-emerald-500 font-medium">Available</span>
                      ) : (
                        <span className="text-muted-foreground">Blocked Off</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
