"use client";

import * as React from "react";
import { Sparkles, X, Radio, BellRing, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-context";

interface RealtimeToast {
  id: string;
  title: string;
  description: string;
  roleTarget?: string;
  timestamp: string;
}

export function RealtimeNotifier() {
  const { role } = useAuth();
  const [toasts, setToasts] = React.useState<RealtimeToast[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);

  const addToast = React.useCallback((toast: Omit<RealtimeToast, "id" | "timestamp">) => {
    const newToast: RealtimeToast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 3));

    // Broadcast global custom event so dashboards can reload live data
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("veluxe-db-mutation", { detail: toast }));
    }

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 7000);
  }, []);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    // Connect to Supabase Realtime Channel
    const channel = supabase
      .channel("veluxe-realtime-activity")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "organizer_bookings" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addToast({
              title: "New Booking Inquiry Received",
              description: `Client requested an exclusive gala booking. Inquiry logged to database.`,
              roleTarget: "organizer",
            });
          } else if (payload.eventType === "UPDATE") {
            addToast({
              title: "Booking Status Updated",
              description: `Contract milestone status updated to ${(payload.new as { status?: string }).status || "revised"}.`,
              roleTarget: "organizer",
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rental_orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addToast({
              title: "New Equipment Rental Reservation",
              description: "A client requested luxury gear rental. White-glove dispatch pending.",
              roleTarget: "rental_provider",
            });
          } else if (payload.eventType === "UPDATE") {
            addToast({
              title: "Rental Logistics Updated",
              description: `Dispatch status advanced to ${(payload.new as { status?: string }).status || "updated"}.`,
              roleTarget: "rental_provider",
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "worker_shifts" },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            addToast({
              title: "Event Workforce Shift Assigned",
              description: "VIP staffing shift confirmed on live ledger.",
              roleTarget: "worker",
            });
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addToast]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <aside aria-label="Real-time notifications" className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5 max-w-sm pointer-events-none">
      {/* Toast notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto w-84 sm:w-96 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl p-4 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
                <BellRing className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Supabase Live Event
                  </span>
                  <span className="text-[10px] text-muted-foreground">{toast.timestamp}</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground mt-0.5 truncate">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {toast.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}
