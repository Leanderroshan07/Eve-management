"use client";

import * as React from "react";
import Link from "next/link";
import {
  Truck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  FileCheck,
  ChevronRight,
  Sparkles,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import {
  getStoredRentalOrders,
  CURRENT_RENTAL_PROVIDER,
  type RentalOrder,
} from "@/lib/rental-data";

export default function RentalLogisticsPage() {
  const [orders, setOrders] = React.useState<RentalOrder[]>([]);

  React.useEffect(() => {
    setOrders(getStoredRentalOrders());
  }, []);

  const logisticsEvents = [
    {
      id: "log-1",
      orderNumber: "VLX-RENT-2026-0941",
      eventName: "Kapoor & Singhania Sangeet Gala",
      venue: "The Taj Mahal Palace, Ballroom (Mumbai)",
      type: "outbound_rigging",
      time: "14 Nov 2026, 08:30 AM",
      vehicle: "Air-Ride Fleet Van #4",
      crewLead: "Vikram Sengupta",
      crewSize: 6,
      status: "completed",
      manifest: "4x Astera Titan RGB Tubes, 2x L-Acoustics Syva Rig, DMX Controllers",
      notes: "Requires acoustic calibration for Taj ballroom crystal resonance. Hotel passes verified.",
    },
    {
      id: "log-2",
      orderNumber: "VLX-RENT-2026-0942",
      eventName: "Silver Jubilee Anniversary Banquet",
      venue: "The Leela Palace, Grand Terrace (New Delhi)",
      type: "outbound_rigging",
      time: "20 Nov 2026, 11:00 AM",
      vehicle: "Temperature-Controlled Truck #2",
      crewLead: "Devansh Nair",
      crewSize: 8,
      status: "scheduled",
      manifest: "80x French Louis XVI Gilded Chairs, 100x 24k Gold Venetian Chargers",
      notes: "White glove setting team must glove-polish each glass charger plate at tables.",
    },
    {
      id: "log-3",
      orderNumber: "VLX-RENT-2026-0943",
      eventName: "Bespoke Beachfront Vow Renewal",
      venue: "Alila Diwa Resort, Gonsua Beach Lawn (Goa)",
      type: "heavy_transport",
      time: "03 Dec 2026, 06:00 AM",
      vehicle: "Articulated Staging Trailer #1",
      crewLead: "Anand Kulkarni",
      crewSize: 14,
      status: "scheduled",
      manifest: "15m x 25m Clear-Span Glass Marquee, 8m x 8m Golden Mirror Dance Floor",
      notes: "Heavy rigging permit approved. Coastal wind sensor telemetry station active.",
    },
    {
      id: "log-4",
      orderNumber: "VLX-RENT-2026-0941",
      eventName: "Kapoor & Singhania Sangeet Gala",
      venue: "The Taj Mahal Palace, Ballroom (Mumbai)",
      type: "strike_retrieval",
      time: "16 Nov 2026, 04:00 AM (Overnight)",
      vehicle: "Air-Ride Fleet Van #4",
      crewLead: "Vikram Sengupta (Night Shift)",
      crewSize: 6,
      status: "pending_strike",
      manifest: "Acoustic line array strike, diagnostic box return check",
      notes: "Immediate return inspection at ballroom exit before hotel security sign-off.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              White-Glove Logistics & Dispatch
            </h1>
            <Badge variant="champagne" className="text-xs">
              3 Vehicles Active
            </Badge>
          </div>
          <p className="text-xs text-hero-subtitle">
            Coordinate white-glove transport, on-site venue rigging crews, and post-celebration strike schedules.
          </p>
        </div>

        <Link href="/rental/orders">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>View All Orders</span>
          </Button>
        </Link>
      </div>

      {/* Fleet Vehicles Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/90 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Transport Fleet
              </span>
              <span className="font-editorial text-xl font-bold text-foreground">
                {CURRENT_RENTAL_PROVIDER.fleetCount} Custom Vehicles
              </span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Air-Ride & Hydraulic Lift Equipped
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gold-primary/10 text-gold-headline-accent border border-gold-primary/20">
              <Truck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/90 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Rigging & Staging Crew
              </span>
              <span className="font-editorial text-xl font-bold text-foreground">
                {CURRENT_RENTAL_PROVIDER.crewSize} Certified Techs
              </span>
              <p className="text-[11px] text-muted-foreground">
                Acoustic Engineers & Master Riggers
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary text-foreground border border-border">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/90 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Quality Standard
              </span>
              <span className="font-editorial text-xl font-bold text-foreground">
                100% White-Glove
              </span>
              <p className="text-[11px] text-gold-headline-accent font-medium">
                Zero Self-Pickup Required
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logistics Dispatch Timeline */}
      <div className="space-y-4">
        <div>
          <h2 className="font-editorial text-lg font-bold text-foreground">
            Upcoming White-Glove Dispatch & Teardown Timeline
          </h2>
          <p className="text-xs text-muted-foreground">
            Confirmed delivery runs, venue setup windows, and overnight retrieval operations.
          </p>
        </div>

        <div className="space-y-3">
          {logisticsEvents.map((evt) => (
            <Card key={evt.id} className="bg-card/90 border-border hover:border-gold-primary/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-border/60">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold text-gold-headline-accent">
                        {evt.orderNumber}
                      </span>
                      <Badge
                        variant={
                          evt.status === "completed"
                            ? "success"
                            : evt.status === "scheduled"
                            ? "champagne"
                            : "warning"
                        }
                        className="text-[10px] capitalize font-medium"
                      >
                        {evt.status.replace(/_/g, " ")}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {evt.type.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-foreground text-sm">
                      {evt.eventName}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-primary shrink-0" />
                      <span>{evt.venue}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground bg-secondary px-2.5 py-1 rounded-lg border border-border">
                      <Clock className="w-3 h-3 text-gold-primary" />
                      {evt.time}
                    </span>
                  </div>
                </div>

                {/* Logistics Specifications */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-secondary/70 border border-border/80">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Assigned Vehicle & Crew
                    </span>
                    <p className="font-medium text-foreground mt-0.5">{evt.vehicle}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Lead: {evt.crewLead} ({evt.crewSize} Riggers)
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-secondary/70 border border-border/80 lg:col-span-2">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Equipment Cargo Manifest
                    </span>
                    <p className="font-medium text-foreground mt-0.5 truncate">{evt.manifest}</p>
                    <p className="text-[11px] text-muted-foreground italic mt-0.5">
                      "{evt.notes}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
