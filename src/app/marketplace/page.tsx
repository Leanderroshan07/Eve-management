"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Search,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  Crown,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Utensils,
  Truck,
  Building2,
  LayoutDashboard,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/format";
import {
  MARKETPLACE_ORGANIZERS,
  SEEDED_WORKERS,
  SEEDED_RENTALS,
  CURRENT_CUSTOMER,
} from "@/lib/customer-data";
import {
  SEEDED_PACKAGES,
  SEEDED_ADDONS,
  SEEDED_INQUIRIES,
  OrganizerPackage,
  CustomerInquiry,
} from "@/lib/organizer-data";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AuthNavControl } from "@/components/shared/auth-nav-control";

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = React.useState<"organizers" | "packages" | "workers" | "rentals">("organizers");
  const [selectedCity, setSelectedCity] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Customizer Drawer State
  const [customizerOpen, setCustomizerOpen] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState<OrganizerPackage | null>(null);
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>([]);

  // Quote Form State inside Drawer
  const [formData, setFormData] = React.useState({
    name: CURRENT_CUSTOMER.name,
    email: CURRENT_CUSTOMER.email,
    phone: CURRENT_CUSTOMER.phone,
    eventDate: "2026-11-28",
    guestCount: "800",
    venueCity: "Chennai",
    notes: "",
  });

  // Scroll detection for upper bar reveal
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 50);
    }
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);
  const [submittedInquiry, setSubmittedInquiry] = React.useState<CustomerInquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Filtered Organizers
  const filteredOrganizers = React.useMemo(() => {
    return MARKETPLACE_ORGANIZERS.filter((org) => {
      const matchCity =
        selectedCity === "all" ||
        org.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
        org.service_areas.some((a) => a.toLowerCase().includes(selectedCity.toLowerCase()));
      const matchQuery =
        !searchQuery ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchQuery;
    });
  }, [selectedCity, searchQuery]);

  // Filtered Packages
  const filteredPackages = React.useMemo(() => {
    return SEEDED_PACKAGES.filter((pkg) => {
      const matchQuery =
        !searchQuery ||
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.event_category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  }, [searchQuery]);

  // Filtered Workers
  const filteredWorkers = React.useMemo(() => {
    return SEEDED_WORKERS.filter((wrk) => {
      const matchCity =
        selectedCity === "all" || wrk.city.toLowerCase().includes(selectedCity.toLowerCase());
      const matchQuery =
        !searchQuery ||
        wrk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wrk.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchQuery;
    });
  }, [selectedCity, searchQuery]);

  // Filtered Rentals
  const filteredRentals = React.useMemo(() => {
    return SEEDED_RENTALS.filter((rent) => {
      const matchCity =
        selectedCity === "all" || rent.city.toLowerCase().includes(selectedCity.toLowerCase());
      const matchQuery =
        !searchQuery ||
        rent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rent.category_label.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchQuery;
    });
  }, [selectedCity, searchQuery]);

  // Price calculations in drawer
  const pricingBreakdown = React.useMemo(() => {
    if (!selectedPackage) return { base: 0, addons: 0, subtotal: 0, tax: 0, total: 0 };
    const base = selectedPackage.base_price;
    const addonsTotal = selectedAddons.reduce((acc, addonId) => {
      const addon = SEEDED_ADDONS.find((a) => a.id === addonId);
      return acc + (addon?.price || 0);
    }, 0);
    const subtotal = base + addonsTotal;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    return { base, addons: addonsTotal, subtotal, tax, total };
  }, [selectedPackage, selectedAddons]);

  const openCustomizer = (pkg: OrganizerPackage) => {
    setSelectedPackage(pkg);
    setSelectedAddons([]);
    setSubmittedInquiry(null);
    setCustomizerOpen(true);
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleDrawerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: CustomerInquiry = {
        id: `inq-${Date.now()}`,
        inquiry_number: `INQ-2026-${Math.floor(100 + Math.random() * 900)}`,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        event_type: selectedPackage.event_category,
        event_date: formData.eventDate,
        guest_count: parseInt(formData.guestCount, 10) || 600,
        estimated_budget: pricingBreakdown.total,
        location: formData.venueCity,
        notes: `Selected Package: ${selectedPackage.name} | Add-ons: ${selectedAddons.length} chosen`,
        status: "pending",
        package_id: selectedPackage.id,
        created_at: new Date().toISOString(),
      };
      SEEDED_INQUIRIES.unshift(newInquiry);
      setSubmittedInquiry(newInquiry);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen text-foreground pb-20">
      {/* Top Navigation Bar with Dual-Role Switcher */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs"
            : "border-b border-border/40 bg-background/70 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center text-primary shadow-sm">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight block text-foreground">
                VELUXE MARKETPLACE
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block">
                Luxury Event Ecosystem
              </span>
            </div>
          </Link>

          {/* Quick Multi-Role Switcher & Theme Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-card border border-border rounded-full p-1 text-xs shadow-sm">
              <Link
                href="/customer/dashboard"
                className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-bold shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </Link>
              <Link
                href="/organizer/dashboard"
                className="px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Organizer</span>
              </Link>
              <Link
                href="/worker/dashboard"
                className="px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Worker</span>
              </Link>
              <Link
                href="/rental/dashboard"
                className="px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-gold-headline-accent" />
                <span>Rentals</span>
              </Link>
            </div>
            <AuthNavControl />
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="pt-8 pb-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <Badge variant="outline" className="border-amber-400/40 text-amber-300 bg-amber-400/10 backdrop-blur-md">
              Curated Event Marketplace
            </Badge>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Discover India's Premier Event Services
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore verified event organizer companies, turnkey signature packages, certified catering workforce, and
              independent equipment rentals across royal destination wedding hubs.
            </p>
          </div>

          {/* Liquid Glassmorphic Filter Pod */}
          <div className="p-4 sm:p-5 rounded-3xl border border-amber-500/25 bg-[#1c0c05]/80 backdrop-blur-2xl shadow-[0_12px_40px_rgba(18,7,2,0.55),inset_0_1px_1px_rgba(245,158,11,0.15)] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search Input */}
              <div className="sm:col-span-7 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400/80 z-10" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search organizers, mandap packages, master chefs, lighting rigs..."
                  className="pl-10 text-xs glass-field placeholder:text-amber-200/40"
                />
              </div>

              {/* City Selector */}
              <div className="sm:col-span-5 flex gap-2">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-xl glass-field px-3.5 py-2.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="all" className="bg-[#1a0c04] text-amber-100">All Cities & Destination Hubs</option>
                  <option value="chennai" className="bg-[#1a0c04] text-amber-100">Chennai</option>
                  <option value="bengaluru" className="bg-[#1a0c04] text-amber-100">Bengaluru</option>
                  <option value="hyderabad" className="bg-[#1a0c04] text-amber-100">Hyderabad</option>
                  <option value="udaipur" className="bg-[#1a0c04] text-amber-100">Udaipur & Rajasthan</option>
                  <option value="goa" className="bg-[#1a0c04] text-amber-100">Goa</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-500/15">
              {[
                { id: "organizers", label: "Event Organizers", count: filteredOrganizers.length, icon: Building2 },
                { id: "packages", label: "Curated Packages", count: filteredPackages.length, icon: Layers },
                { id: "workers", label: "Catering Workforce", count: filteredWorkers.length, icon: Utensils },
                { id: "rentals", label: "Equipment Rentals", count: filteredRentals.length, icon: Truck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                        : "glass-field text-amber-200/70 hover:text-amber-100 hover:bg-[#240e05]/90 border-amber-500/20"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-black/30 text-slate-950 font-bold" : "bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Showcase */}
      <section className="pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TAB 1: EVENT ORGANIZERS */}
          {activeTab === "organizers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOrganizers.map((org) => (
                <Card
                  key={org.id}
                  className="border-border bg-card/90 overflow-hidden shadow-lg hover:border-primary/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Photo */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={org.cover_image_url}
                        alt={org.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Organizer</span>
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{org.rating}</span>
                          <span className="text-white/70">({org.review_count})</span>
                        </span>
                        <span className="text-white/80">{org.events_completed}+ Weddings</span>
                      </div>
                    </div>

                    {/* Body */}
                    <CardContent className="p-6 space-y-3">
                      <div>
                        <h3 className="font-editorial text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {org.name}
                        </h3>
                        <span className="text-[11px] text-primary font-medium block mt-0.5">{org.tagline}</span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{org.description}</p>

                      <div className="pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{org.service_areas.join(", ")}</span>
                      </div>
                    </CardContent>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex items-center gap-3">
                    <Link href={`/organizers/${org.slug}`} className="w-full">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs gap-1.5 shadow-sm">
                        <span>View Public Showcase & Packages</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 2: PACKAGES */}
          {activeTab === "packages" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="border-border bg-card/90 overflow-hidden shadow-lg hover:border-primary/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={pkg.image_url}
                        alt={pkg.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                          {pkg.event_category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                        <div>
                          <span className="text-[11px] text-white/80 block">Starting Base Price</span>
                          <span className="font-editorial text-2xl font-bold">{formatINR(pkg.base_price)}</span>
                        </div>
                        <Badge variant="secondary" className="bg-black/60 text-white border-white/20 text-xs">
                          <Users className="w-3 h-3 mr-1 inline" />
                          {pkg.guest_capacity}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-3">
                      <h3 className="font-editorial text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{pkg.description}</p>

                      <div className="space-y-1.5 pt-2 border-t border-border">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
                          Included In Curation:
                        </span>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {pkg.inclusions.slice(0, 3).map((inc, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="truncate">{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-6 pt-0">
                    <Button
                      onClick={() => openCustomizer(pkg)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs gap-2"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Customize Package & Inquire</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 3: WORKFORCE PREVIEW */}
          {activeTab === "workers" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredWorkers.map((wrk) => (
                <Card key={wrk.id} className="border-border bg-card p-5 space-y-4 hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary/30 shrink-0">
                      <Image src={wrk.avatar_url} alt={wrk.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-editorial text-sm font-bold text-foreground">{wrk.name}</h4>
                      <Badge variant="success" className="text-[9px] px-1.5 py-0 mt-0.5">
                        Available
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-primary block">{wrk.role}</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{wrk.specialty}</p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Daily Rate</span>
                      <span className="font-editorial font-bold text-foreground">{formatINR(wrk.daily_rate)}/day</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">Rating</span>
                      <span className="font-semibold text-primary flex items-center gap-1">
                        <Star className="w-3 h-3 fill-primary inline" /> {wrk.rating}
                      </span>
                    </div>
                  </div>

                  <Link href={`/workers/${wrk.id}`} className="block w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold gap-1.5">
                      <span>View Profile & Hire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 4: RENTALS PREVIEW */}
          {activeTab === "rentals" && (
            <div className="space-y-6">
              {/* Feature Banner linking to dedicated storefront */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-card via-secondary/70 to-card border border-gold-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-editorial text-lg font-bold text-foreground">
                      Explore the Complete White-Glove Rentals Catalog
                    </span>
                    <Badge variant="champagne" className="text-[10px]">
                      Phase 5 Storefront
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Discover concert-grade acoustic line arrays, 24k gold charger plates, and clear-span marquee pavilions with live date conflict checking.
                  </p>
                </div>
                <Link href="/rentals">
                  <Button variant="champagne" size="sm" className="gap-1.5 text-xs font-semibold shrink-0">
                    <span>Open Public Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRentals.map((rent) => (
                  <Card key={rent.id} className="border-border bg-card overflow-hidden hover:border-gold-primary/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 w-full">
                        <Image src={rent.image_url} alt={rent.name} fill className="object-cover" />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-black/70 text-white border-white/20 text-[10px]">
                            {rent.category_label}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-2">
                        <h4 className="font-editorial text-sm font-bold text-foreground truncate">{rent.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{rent.provider_name} • {rent.city}</p>

                        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Daily Rental</span>
                            <span className="font-editorial font-bold text-gold-headline-accent">{formatINR(rent.daily_rate)}/day</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">Qty: {rent.available_quantity} Avail.</span>
                        </div>
                      </CardContent>
                    </div>

                    <div className="p-4 pt-0">
                      <Link href="/rentals" className="block w-full">
                        <Button variant="outline" size="sm" className="w-full text-xs border-gold-primary/30 text-gold-headline-accent hover:bg-gold-primary/10 mt-1 font-semibold gap-1">
                          <span>Check Dates & Reserve</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Package Customizer Slide-over Drawer */}
      <AnimatePresence>
        {customizerOpen && selectedPackage && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col justify-between"
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-foreground">Package Customizer</h3>
                    <p className="text-xs text-muted-foreground">{selectedPackage.name}</p>
                  </div>
                  <button onClick={() => setCustomizerOpen(false)} className="p-1 rounded-full hover:bg-muted cursor-pointer">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  {submittedInquiry ? (
                    <div className="py-8 text-center space-y-5">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 font-mono text-xs">
                          {submittedInquiry.inquiry_number}
                        </Badge>
                        <h4 className="font-editorial text-xl font-bold text-foreground">Inquiry Registered!</h4>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          Your quote request is now visible in both your Customer Portal and the Organizer Dashboard.
                        </p>
                      </div>

                      <div className="pt-3 space-y-2">
                        <Link href="/customer/inquiries">
                          <Button className="w-full bg-primary text-primary-foreground font-semibold text-xs py-2.5">
                            View in Customer Inquiries Desk
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSubmittedInquiry(null);
                            setCustomizerOpen(false);
                          }}
                          className="w-full text-xs"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleDrawerSubmit} className="space-y-6">
                      <div className="p-4 rounded-xl border border-border bg-background/50 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Base Package</span>
                        <div className="flex justify-between items-center">
                          <span className="font-editorial text-lg font-bold text-foreground">
                            {formatINR(selectedPackage.base_price)}
                          </span>
                          <span className="text-xs text-muted-foreground">{selectedPackage.guest_capacity}</span>
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                          Optional Luxury Add-ons
                        </span>
                        <div className="space-y-2">
                          {SEEDED_ADDONS.map((addon) => {
                            const isSelected = selectedAddons.includes(addon.id);
                            return (
                              <div
                                key={addon.id}
                                onClick={() => toggleAddon(addon.id)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                  isSelected ? "border-primary bg-primary/10" : "border-border bg-background/40"
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-foreground">{addon.name}</span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground">{addon.description}</p>
                                </div>
                                <span className="font-editorial text-xs font-bold text-primary shrink-0">
                                  +{formatINR(addon.price)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pricing breakdown */}
                      <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal:</span>
                          <span>{formatINR(pricingBreakdown.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>GST (18%):</span>
                          <span>+{formatINR(pricingBreakdown.tax)}</span>
                        </div>
                        <div className="pt-2 border-t border-border flex justify-between font-bold text-foreground">
                          <span>Grand Total Estimate:</span>
                          <span className="font-editorial text-lg text-primary">{formatINR(pricingBreakdown.total)}</span>
                        </div>
                      </div>

                      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-semibold py-2.5">
                        {isSubmitting ? "Submitting..." : `Submit Quote Inquiry (${formatINR(pricingBreakdown.total)})`}
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
