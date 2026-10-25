"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Boxes,
  Truck,
  Sparkles,
  Calendar,
  Search,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  X,
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/format";
import { AuthNavControl } from "@/components/shared/auth-nav-control";
import { createLiveRentalOrder } from "@/lib/supabase/db-sync";
import { getAllPublicRentals } from "@/lib/user-scoped-data";
import {
  getStoredRentalProducts,
  getStoredRentalProviders,
  createRentalOrder,
  checkProductAvailability,
  type RentalProduct,
  type RentalCategory,
} from "@/lib/rental-data";

export default function PublicRentalsPage() {
  const [products, setProducts] = React.useState<RentalProduct[]>([]);
  const [providers, setProviders] = React.useState(getStoredRentalProviders());
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Date availability state
  const [filterStartDate, setFilterStartDate] = React.useState("2026-11-20");
  const [filterEndDate, setFilterEndDate] = React.useState("2026-11-22");

  // Booking Modal State
  const [selectedProductForQuote, setSelectedProductForQuote] = React.useState<RentalProduct | null>(null);
  const [bookingQty, setBookingQty] = React.useState(1);
  const [bookingStartDate, setBookingStartDate] = React.useState("2026-11-20");
  const [bookingEndDate, setBookingEndDate] = React.useState("2026-11-22");
  const [clientRole, setClientRole] = React.useState<"customer" | "organizer">("customer");
  const [clientName, setClientName] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [eventName, setEventName] = React.useState("");
  const [venueName, setVenueName] = React.useState("");
  const [venueAddress, setVenueAddress] = React.useState("");
  const [bookingSuccessOrder, setBookingSuccessOrder] = React.useState<any | null>(null);

  React.useEffect(() => {
    setProducts(getAllPublicRentals());
    setProviders(getStoredRentalProviders());
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  // Calculate rental days
  const calculateDays = (start: string, end: string) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e) || e < s) return 1;
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const rentalDays = calculateDays(bookingStartDate, bookingEndDate);

  // Quote Financials
  const baseRentalCost = selectedProductForQuote
    ? selectedProductForQuote.dailyRate * bookingQty * rentalDays
    : 0;
  const setupFee = selectedProductForQuote ? selectedProductForQuote.whiteGloveSetupFee : 0;
  const totalDeposit = selectedProductForQuote
    ? selectedProductForQuote.securityDeposit * bookingQty
    : 0;
  const grandTotal = baseRentalCost + setupFee + totalDeposit;

  // Handle Submit Booking
  const handleConfirmQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForQuote || !clientName || !eventName) return;

    const provider = providers.find((pr) => pr.id === selectedProductForQuote.providerId);

    const order = createRentalOrder({
      providerId: selectedProductForQuote.providerId,
      providerName: provider?.name || "Veluxe Verified Provider",
      requesterRole: clientRole,
      requesterName: clientName,
      requesterEmail: clientEmail || "client@veluxe.events",
      requesterPhone: clientPhone || "+91 98200 00000",
      eventName,
      venueName: venueName || "Private Luxury Estate",
      venueAddress: venueAddress || "Mumbai, India",
      startDate: bookingStartDate,
      endDate: bookingEndDate,
      rentalDays,
      items: [
        {
          productId: selectedProductForQuote.id,
          productName: selectedProductForQuote.name,
          category: selectedProductForQuote.category,
          dailyRate: selectedProductForQuote.dailyRate,
          quantity: bookingQty,
          securityDepositPerUnit: selectedProductForQuote.securityDeposit,
        },
      ],
      subtotal: baseRentalCost,
      deliveryAndSetupFee: setupFee,
      totalDeposit,
      depositStatus: "held",
      grandTotal,
      status: "awaiting_confirmation",
      crewLead: "Assigned upon depot confirmation",
      dispatchTime: `${bookingStartDate}, 08:30 AM`,
      retrievalTime: `${bookingEndDate}, 02:00 AM`,
      notes: "White-glove delivery, on-site rigging, and post-event strike requested via public storefront.",
    });

    // Sync order to live Supabase backend
    createLiveRentalOrder({
      providerId: selectedProductForQuote.providerId,
      eventTitle: eventName,
      venueName: venueName || "Private Luxury Estate",
      venueCity: venueAddress || "Mumbai",
      dispatchDate: bookingStartDate,
      returnDate: bookingEndDate,
      status: "awaiting_confirmation",
      lineItems: [
        {
          productId: selectedProductForQuote.id,
          productName: selectedProductForQuote.name,
          dailyRate: selectedProductForQuote.dailyRate,
          quantity: bookingQty,
        },
      ],
      totalRentalAmount: baseRentalCost,
      securityDepositAmount: totalDeposit,
      logisticsFee: setupFee,
      customerName: clientName,
      customerEmail: clientEmail,
      customerPhone: clientPhone,
      whiteGloveNotes: "Requested via public storefront",
    }).catch(console.warn);

    setBookingSuccessOrder(order);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-primary shadow-xs group-hover:scale-105 transition-transform">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-editorial text-xl font-bold tracking-tight text-foreground">
                VELUXE
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground block -mt-1">
                Equipment Rentals
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <Link href="/marketplace" className="hover:text-foreground transition-colors">
              Marketplace Home
            </Link>
            <Link href="/marketplace?tab=workers" className="hover:text-foreground transition-colors">
              Event Staff
            </Link>
            <Link href="/customer/dashboard" className="hover:text-foreground transition-colors">
              Customer Portal
            </Link>
            <Link href="/rental/dashboard" className="text-gold-headline-accent hover:underline flex items-center gap-1 font-bold">
              <span>Provider Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <AuthNavControl />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-20 border-b border-border/70 bg-gradient-to-b from-card/80 via-background to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <Badge variant="champagne" className="gap-1.5 py-1 px-3 text-xs mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 5 Luxury Equipment & Production Fleet
          </Badge>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-foreground max-w-4xl mx-auto tracking-tight">
            Curated Staging, Audio-Visual & <br />
            <span className="italic text-gold-headline-accent font-normal">
              Palatial Banqueting Rentals.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-hero-subtitle max-w-2xl mx-auto font-normal leading-relaxed">
            Direct access to verified equipment providers. Complete with white-glove transport, on-site rigging, diagnostic testing, and refundable security deposit escrows.
          </p>

          {/* Quick Date & Availability Checker */}
          <div className="mt-8 max-w-3xl mx-auto p-4 rounded-2xl bg-card/90 border border-border shadow-lg backdrop-blur-md flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-gold-primary shrink-0" />
              <div className="text-left text-xs">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Event Start Date
                </span>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="bg-secondary/80 border border-border rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-gold-primary shrink-0" />
              <div className="text-left text-xs">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Event End Date
                </span>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="bg-secondary/80 border border-border rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full sm:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/80 border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 items-center justify-center pb-4 border-b border-border/60">
          {[
            { id: "all", label: "All Collections (12)" },
            { id: "audio_visual_lighting", label: "AV & Stage Lighting (3)" },
            { id: "furniture_seating", label: "Furniture & Seating (3)" },
            { id: "tableware_catering", label: "Fine Tableware & Linens (2)" },
            { id: "structures_decor", label: "Marquees & Structures (4)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-gold-primary text-white shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => {
            const provider = providers.find((p) => p.id === item.providerId);
            const availability = checkProductAvailability(
              item.id,
              filterStartDate,
              filterEndDate,
              1
            );

            return (
              <Card
                key={item.id}
                className="bg-card/90 border-border overflow-hidden hover:border-gold-primary/50 transition-all group flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-56 w-full bg-secondary overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="bg-black/60 backdrop-blur-md text-white border-white/20 text-[10px] capitalize font-medium"
                      >
                        {item.category.replace(/_/g, " ")}
                      </Badge>

                      <Badge
                        className={`text-[10px] font-semibold ${
                          availability.isAvailable
                            ? "bg-emerald-500/90 text-white"
                            : "bg-red-500/90 text-white"
                        }`}
                      >
                        {availability.isAvailable
                          ? `${availability.remainingUnits} Available`
                          : "Fully Booked"}
                      </Badge>
                    </div>

                    {/* Bottom Rates */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] text-white/70 uppercase tracking-wider block">
                          Daily Rental Rate
                        </span>
                        <span className="font-editorial text-2xl font-bold">
                          {formatINR(item.dailyRate)}
                        </span>
                        <span className="text-xs text-white/70"> / day</span>
                      </div>
                      <div className="text-right text-[11px] text-white/80">
                        <span>Deposit: {formatINR(item.securityDeposit)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <CardContent className="p-5 space-y-3.5">
                    {/* Provider Tag */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="w-3.5 h-3.5 text-gold-primary shrink-0" />
                      <span className="font-semibold text-foreground truncate">
                        {provider?.name || "Veluxe Certified Depot"}
                      </span>
                      <span className="text-muted-foreground">· {provider?.location.split(",")[0]}</span>
                    </div>

                    <div>
                      <h2 className="font-editorial text-lg font-bold text-foreground group-hover:text-gold-headline-accent transition-colors">
                        {item.name}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Technical Specs */}
                    <div className="p-2.5 rounded-xl bg-secondary/70 border border-border text-[11px] space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Dimensions:</span>
                        <span className="font-medium text-foreground truncate max-w-[190px]">
                          {item.dimensions}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>White-Glove Setup:</span>
                        <span className="font-medium text-foreground">
                          {formatINR(item.whiteGloveSetupFee)} (Transport & Strike)
                        </span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1">
                      {item.features.slice(0, 2).map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                        >
                          <Sparkles className="w-3 h-3 text-gold-primary shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Button
                    onClick={() => {
                      setSelectedProductForQuote(item);
                      setBookingStartDate(filterStartDate);
                      setBookingEndDate(filterEndDate);
                      setBookingQty(1);
                      setBookingSuccessOrder(null);
                    }}
                    disabled={!availability.isAvailable}
                    variant={availability.isAvailable ? "champagne" : "outline"}
                    className="w-full text-xs font-semibold gap-1.5"
                  >
                    <span>{availability.isAvailable ? "Reserve White-Glove Gear" : "Dates Unavailable"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Booking / Quote Modal */}
      {selectedProductForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-headline-accent block">
                  White-Glove Equipment Reservation
                </span>
                <h3 className="font-editorial text-xl font-bold text-foreground">
                  {selectedProductForQuote.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductForQuote(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccessOrder ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-editorial text-xl font-bold text-foreground">
                    Rental Reservation Submitted!
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Order <span className="font-mono font-bold text-gold-headline-accent">{bookingSuccessOrder.orderNumber}</span> has been logged and sent to {bookingSuccessOrder.providerName}.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/80 border border-border text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event:</span>
                    <span className="font-semibold text-foreground">{bookingSuccessOrder.eventName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dates:</span>
                    <span className="font-semibold text-foreground">{formatDate(bookingSuccessOrder.startDate)} to {formatDate(bookingSuccessOrder.endDate)} ({bookingSuccessOrder.rentalDays} Days)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equipment:</span>
                    <span className="font-semibold text-foreground">{bookingQty}x {selectedProductForQuote.name}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/60 font-bold text-sm">
                    <span>Grand Total (incl. deposit):</span>
                    <span className="text-gold-headline-accent">{formatINR(bookingSuccessOrder.grandTotal)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link href="/rental/orders">
                    <Button variant="champagne" size="sm">
                      View in Rental Orders Portal
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setSelectedProductForQuote(null)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmQuoteRequest} className="space-y-4">
                {/* Dates & Quantities */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Event Start
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingStartDate}
                      onChange={(e) => setBookingStartDate(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Event End
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingEndDate}
                      onChange={(e) => setBookingEndDate(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Units Needed
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={selectedProductForQuote.totalStock}
                      value={bookingQty}
                      onChange={(e) => setBookingQty(Number(e.target.value))}
                      className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                {/* Booking Role Selection */}
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Booking As:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setClientRole("customer")}
                      className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                        clientRole === "customer"
                          ? "bg-gold-primary text-white border-gold-primary"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      Private Host / Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientRole("organizer")}
                      className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                        clientRole === "organizer"
                          ? "bg-gold-primary text-white border-gold-primary"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      Event Organizer Company
                    </button>
                  </div>
                </div>

                {/* Client & Venue Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Your Name / Company *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohini Singhania"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Regal Heritage Wedding Reception"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Venue Name & City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Taj Lake Palace, Udaipur"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 12345"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                {/* Cost Estimation Breakdown */}
                <div className="p-3.5 rounded-xl bg-secondary/80 border border-border space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Equipment Rental ({bookingQty}x @ {formatINR(selectedProductForQuote.dailyRate)}/day × {rentalDays}d):</span>
                    <span className="font-semibold text-foreground">{formatINR(baseRentalCost)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>White-Glove Transport & Rigging:</span>
                    <span className="font-semibold text-foreground">{formatINR(setupFee)}</span>
                  </div>
                  <div className="flex justify-between text-gold-headline-accent">
                    <span>Refundable Security Deposit ({bookingQty}x):</span>
                    <span className="font-semibold">{formatINR(totalDeposit)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-foreground pt-1.5 border-t border-border/60">
                    <span>Total Commitment:</span>
                    <span className="text-gold-headline-accent">{formatINR(grandTotal)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic pt-1">
                    * The security deposit is held in escrow and automatically refunded post-celebration upon pristine return inspection.
                  </p>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedProductForQuote(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="champagne" className="gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit White-Glove Reservation</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
