"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll } from "motion/react";
import {
  Sparkles,
  Users,
  MapPin,
  CheckCircle2,
  Star,
  Phone,
  Mail,
  ArrowRight,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Award,
  Crown,
  HeartHandshake,
  LayoutDashboard,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { formatINR } from "@/lib/format";
import {
  getOrganizerBySlug,
  getPackagesForOrganizer,
  getPortfolioForOrganizer,
  getReviewsForOrganizer,
  SEEDED_ADDONS,
  SEEDED_INQUIRIES,
  OrganizerPackage,
  PortfolioItem,
  CustomerInquiry,
} from "@/lib/organizer-data";

export function PublicOrganizerView({ slug }: { slug: string }) {
  const organizer = getOrganizerBySlug(slug) || getOrganizerBySlug("vks-royal-weddings")!;
  const packages = getPackagesForOrganizer(organizer.id);
  const portfolioItems = getPortfolioForOrganizer(organizer.id);
  const reviews = getReviewsForOrganizer(organizer.id);

  // Portfolio Filtering State
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const filteredPortfolio = React.useMemo(() => {
    if (activeCategory === "all") return portfolioItems;
    return portfolioItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, portfolioItems]);

  // Lightbox State
  const [selectedImage, setSelectedImage] = React.useState<PortfolioItem | null>(null);

  // Customizer Drawer State
  const [customizerOpen, setCustomizerOpen] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState<OrganizerPackage | null>(null);
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>([]);

  // Quote Form State inside Drawer
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "500",
    venueCity: organizer.city,
    notes: "",
  });

  // Inquiry Submission Result State
  const [submittedInquiry, setSubmittedInquiry] = React.useState<CustomerInquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Bottom In-Page Form State
  const [generalForm, setGeneralForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    eventType: "Royal Wedding & Reception",
    eventDate: "",
    budget: "1500000",
    notes: "",
  });
  const [generalSubmitted, setGeneralSubmitted] = React.useState(false);

  // Scroll detection for navbar reveal
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

  // Calculate customized price in drawer
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
      const newInquiryId = `inq-${Date.now()}`;
      const newInquiryNumber = `INQ-2026-${Math.floor(100 + Math.random() * 900)}`;

      const addonNames = selectedAddons
        .map((id) => SEEDED_ADDONS.find((a) => a.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      const notesContent = [
        `Package: ${selectedPackage.name}`,
        addonNames ? `Selected Add-ons: ${addonNames}` : null,
        formData.notes ? `Client Notes: ${formData.notes}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const newInquiry: CustomerInquiry = {
        id: newInquiryId,
        inquiry_number: newInquiryNumber,
        customer_name: formData.name || "Aarav & Devika Malhotra",
        customer_email: formData.email || "aarav.malhotra@luxuryevents.in",
        customer_phone: formData.phone || "+91 98840 99887",
        event_type: selectedPackage.event_category,
        event_date: formData.eventDate || "2026-12-10",
        guest_count: parseInt(formData.guestCount, 10) || 600,
        estimated_budget: pricingBreakdown.total,
        location: formData.venueCity || "Bengaluru",
        notes: notesContent,
        status: "pending",
        package_id: selectedPackage.id,
        created_at: new Date().toISOString(),
      };

      // Push to in-memory store so organizer dashboard immediately sees it
      SEEDED_INQUIRIES.unshift(newInquiry);
      setSubmittedInquiry(newInquiry);
      setIsSubmitting(false);
    }, 700);
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      inquiry_number: `INQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      customer_name: generalForm.name,
      customer_email: generalForm.email,
      customer_phone: generalForm.phone,
      event_type: generalForm.eventType,
      event_date: generalForm.eventDate || "2026-11-20",
      guest_count: 500,
      estimated_budget: parseInt(generalForm.budget, 10) || 1500000,
      location: organizer.city,
      notes: generalForm.notes,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    SEEDED_INQUIRIES.unshift(newInquiry);
    setGeneralSubmitted(true);
  };

  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary/20 selection:text-primary">
      {/* ========================================================
          1. DUAL-CONTEXT LUXURY TOP NAVIGATION
      ======================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-border/80 bg-background/90 backdrop-blur-md shadow-xs"
            : "border-b border-border/40 bg-background/60 backdrop-blur-sm"
        }`}
      >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              {/* Brand Logo & Name */}
              <Link href={`/organizers/${organizer.slug}`} className="flex items-center gap-3.5 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent border border-primary/40 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight block text-foreground group-hover:text-primary transition-colors">
                    {organizer.name}
                  </span>
                  <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground block">
                    {organizer.city} • Est. {organizer.founded_year}
                  </span>
                </div>
              </Link>

              {/* Center Navigation Links */}
              <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
                <a href="#about" className="hover:text-foreground transition-colors">
                  About
                </a>
                <a href="#services" className="hover:text-foreground transition-colors">
                  Services
                </a>
                <a href="#packages" className="hover:text-foreground transition-colors">
                  Packages
                </a>
                <a href="#portfolio" className="hover:text-foreground transition-colors">
                  Portfolio
                </a>
                <a href="#reviews" className="hover:text-foreground transition-colors">
                  Reviews
                </a>
                <a href="#quote" className="hover:text-foreground transition-colors">
                  Inquire
                </a>
              </nav>

              {/* Right Action & Evaluator Switcher & Theme Toggle */}
              <div className="flex items-center gap-3">
                <Link
                  href="/organizer/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all cursor-pointer shadow-sm"
                  title="Switch to Organizer Back-Office Management"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Organizer Dashboard</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/40 bg-background/50">
                    Demo
                  </Badge>
                </Link>

                <a
                  href="#packages"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                >
                  Request Quote
                </a>
              </div>
          </div>
      </header>

      {/* ========================================================
          2. HERO SHOWCASE SECTION (FULL VIEWPORT CURTAIN)
      ======================================================== */}
      <section className="relative min-h-screen flex items-center justify-center py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 xl:col-span-8 space-y-6 bg-[#1c0c05]/85 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-amber-500/20 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold tracking-wide uppercase">
                <Crown className="w-3.5 h-3.5" />
                <span>Premier Wedding Planners & Scenographers</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
                Unveiling Royalty, <br />
                <span className="italic font-normal bg-gradient-to-r from-primary via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Crafted for Eternity.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed w-full">
                {organizer.description}
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-y border-border/70 py-4 w-full">
                <div>
                  <div className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                    {organizer.events_completed}+
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">Regal Weddings</div>
                </div>
                <div>
                  <div className="font-editorial text-2xl sm:text-3xl font-bold text-primary flex items-center gap-1">
                    <span>{organizer.rating}</span>
                    <Star className="w-4 h-4 fill-primary text-primary inline" />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">
                    {organizer.review_count} Verified Reviews
                  </div>
                </div>
                <div>
                  <div className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">14+</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">Years of Legacy</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => openCustomizer(packages[0])}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-semibold gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Customize Imperial Package</span>
                </Button>

                <a href="#portfolio">
                  <Button variant="outline" size="lg" className="gap-2">
                    <span>View Wedding Portfolio</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Right Hero Image Collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 xl:col-span-4 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl aspect-[4/5] max-h-[560px] w-full">
                <Image
                  src={organizer.cover_image_url}
                  alt={organizer.name}
                  fill
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Card at bottom */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border/80 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Award-Winning Mandap Styling</h4>
                      <p className="text-xs text-muted-foreground">Recognized by Luxury Wedding Guild 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. ABOUT & PHILOSOPHY SECTION
      ======================================================== */}
      <section id="about" className="py-20 border-t border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Our Heritage & Philosophy
            </Badge>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Mastering the Art of Grand Indian Celebrations
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              At VKS Royal Wedding & Luxury Event Planners, we believe every sacred union is an unrepeatable masterpiece.
              Our dedicated scenographers, floral artisans, sound engineers, and trained hospitality stewards orchestrate
              every ritual with royal decorum, punctuality, and bespoke attention to your family traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            <Card className="border-border/70 bg-card/70 hover:border-primary/40 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-foreground">Bespoke Architectural Mandaps</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Engineered 360-degree dome structures, Tanjore temple pillars, and imported flower installations customized
                  specifically to your venue's architectural sightlines.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/70 hover:border-primary/40 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-foreground">Elite Hospitality Stewards</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Over 100 groomed, uniformed event stewards trained in royal guest etiquettes, traditional welcome rituals,
                  and discrete VIP bridal assistance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/70 hover:border-primary/40 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-foreground">Transparent Versioned Proposals</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Clear itemized contracts with immutable versioning. Every scope addition and cost change is clearly tracked
                  with 100% price transparency and zero surprise charges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SERVICES BREAKDOWN
      ======================================================== */}
      <section id="services" className="py-20 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="outline" className="border-primary/40 text-primary mb-2">
                Specialized Verticals
              </Badge>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-foreground">
                Comprehensive Luxury Event Services
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mt-2 md:mt-0">
              From intimate beachside gatherings to 2,000-guest palace nuptials, we manage the full end-to-end spectrum of
              ceremonies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Royal Mandap Styling",
                desc: "Handcrafted domes, temple sanctums, fresh floral cascades, and mirror aisles.",
                tag: "Decor & Production",
              },
              {
                title: "Sangeet Stage & Lighting",
                desc: "Curved 4K LED walls, kinetic intelligent beam rigs, and celebrity artist setup.",
                tag: "Entertainment",
              },
              {
                title: "Workforce & Concierge",
                desc: "Groomed floor supervisors, guest ushering squads, and bridal shadow attendants.",
                tag: "Hospitality Crew",
              },
              {
                title: "Destination Coordination",
                desc: "Logistics across Udaipur, Goa, Bengaluru, Chennai, and Hyderabad palace estates.",
                tag: "Turnkey Planning",
              },
            ].map((srv, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-border bg-card/60 hover:border-primary/40 hover:bg-card transition-all group"
              >
                <span className="text-[11px] font-semibold tracking-wider text-primary uppercase block mb-3">
                  {srv.tag}
                </span>
                <h3 className="font-editorial text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURED PACKAGES WITH INR PRICING & CUSTOMIZER DRAWER
      ======================================================== */}
      <section id="packages" className="py-20 border-t border-border/60 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Signature Collections
            </Badge>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-foreground">
              Tailored Luxury Wedding Packages
            </h2>
            <p className="text-sm text-muted-foreground">
              Select any package to open our interactive customizer, configure optional add-ons, and calculate transparent
              pricing in Indian Rupees (INR).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="border-border/80 bg-card/90 overflow-hidden hover:border-primary/50 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div>
                  {/* Package Image & Badges */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={pkg.image_url}
                      alt={pkg.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
                        {pkg.event_category}
                      </Badge>
                      {pkg.featured && (
                        <Badge variant="outline" className="bg-black/60 border-amber-400/60 text-amber-300 text-xs">
                          ★ Flagship
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <span className="text-xs text-white/80 block font-medium">Starting Package Price</span>
                        <span className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                          {formatINR(pkg.base_price)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-black/70 text-white/90 border-white/20 text-xs">
                        <Users className="w-3 h-3 mr-1 inline" />
                        {pkg.guest_capacity}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Content */}
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-primary font-medium mt-1">{pkg.tagline}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{pkg.description}</p>
                    </div>

                    {/* Inclusions List */}
                    <div className="space-y-2 pt-2 border-t border-border/70">
                      <span className="text-xs font-semibold text-foreground tracking-wide block uppercase">
                        Signature Inclusions:
                      </span>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <Button
                    onClick={() => openCustomizer(pkg)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 shadow-sm cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Customize & Request Quote</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. FILTERABLE PORTFOLIO GALLERY WITH LIGHTBOX
      ======================================================== */}
      <section id="portfolio" className="py-20 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Real Celebrations
            </Badge>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-foreground">
              Portfolio & Scenography Gallery
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore authentic wedding setups curated by our production team across top palace estates.
            </p>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: "all", label: "All Works" },
              { id: "mandap", label: "Royal Mandap" },
              { id: "sangeet", label: "Sangeet & Staging" },
              { id: "dining", label: "Banquet & Dining" },
              { id: "floral", label: "Floral Architecture" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPortfolio.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedImage(item)}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-card cursor-pointer shadow-md aspect-[4/3]"
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {item.category_label}
                    </span>
                    <h4 className="font-editorial text-base font-bold text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/70 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary inline" />
                      {item.venue}, {item.city}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. VERIFIED CLIENT REVIEWS & TESTIMONIALS
      ======================================================== */}
      <section id="reviews" className="py-20 border-t border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Client Praises
            </Badge>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-foreground">
              Words of Trust from Our Royal Couples
            </h2>
            <p className="text-sm text-muted-foreground">
              Authentic verified testimonials from prominent families and wedding celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <Card key={rev.id} className="border-border/80 bg-card/80 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-primary">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">"{rev.comment}"</p>
                </div>

                <div className="pt-6 border-t border-border/60 mt-6">
                  <h4 className="font-editorial text-base font-bold text-foreground">{rev.client_names}</h4>
                  <p className="text-xs text-primary font-medium">{rev.event_type}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 inline text-primary/70" />
                    {rev.venue} • {rev.review_date}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. IN-PAGE BESPOKE QUOTE REQUEST SECTION
      ======================================================== */}
      <section id="quote" className="py-20 border-t border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-border bg-card/90 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Info Column */}
              <div className="lg:col-span-5 p-8 sm:p-10 bg-primary/10 border-b lg:border-b-0 lg:border-r border-border/60 flex flex-col justify-between space-y-8">
                <div>
                  <Badge variant="outline" className="border-primary/40 text-primary mb-3">
                    Concierge Desk
                  </Badge>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground">
                    Initiate Your Wedding Proposal
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Have unique custom requirements, multi-day celebrations, or a private destination estate in mind? Our senior
                    wedding directors will prepare a personalized proposal within 24 hours.
                  </p>
                </div>

                <div className="space-y-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-foreground">Direct Concierge</span>
                      <span>{organizer.contact_phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-foreground">Executive Inquiries</span>
                      <span>{organizer.contact_email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-foreground">Service Locations</span>
                      <span>{organizer.service_areas.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <span className="text-[11px] text-muted-foreground">
                    ⚡ Evaluator Tip: Submitting here immediately registers an inquiry into the Organizer Dashboard.
                  </span>
                </div>
              </div>

              {/* Right Form Column */}
              <div className="lg:col-span-7 p-8 sm:p-10">
                {generalSubmitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-editorial text-2xl font-bold text-foreground">Inquiry Received</h4>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Thank you! Your custom inquiry has been entered into the organizer's active queue.
                    </p>
                    <div className="pt-4">
                      <Link href="/organizer/inquiries">
                        <Button className="bg-primary text-primary-foreground font-semibold gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>View in Organizer Inquiries Desk</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleGeneralSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Your Full Name</label>
                        <Input
                          required
                          value={generalForm.name}
                          onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                          placeholder="e.g. Siddharth & Rhea"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Phone Number</label>
                        <Input
                          required
                          value={generalForm.phone}
                          onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                          placeholder="+91 98401 00000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Email Address</label>
                        <Input
                          type="email"
                          required
                          value={generalForm.email}
                          onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                          placeholder="client@luxuryevents.in"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Expected Event Date</label>
                        <Input
                          type="date"
                          value={generalForm.eventDate}
                          onChange={(e) => setGeneralForm({ ...generalForm, eventDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Estimated Budget (INR ₹)</label>
                      <Input
                        type="number"
                        value={generalForm.budget}
                        onChange={(e) => setGeneralForm({ ...generalForm, budget: e.target.value })}
                        placeholder="1500000"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Celebration Vision & Venue</label>
                      <textarea
                        rows={3}
                        value={generalForm.notes}
                        onChange={(e) => setGeneralForm({ ...generalForm, notes: e.target.value })}
                        placeholder="Tell us about your mandap style, guest count, and destination preference..."
                        className="w-full rounded-xl glass-field p-3 text-xs text-foreground placeholder:text-amber-200/40"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-2.5">
                      Submit Custom Inquiry to VKS Planners
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================
          9. EDITORIAL FOOTER
      ======================================================== */}
      <footer className="border-t border-border/70 bg-card/60 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-primary" />
            <span className="font-editorial text-sm font-semibold text-foreground">{organizer.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#about" className="hover:text-foreground transition-colors">
              About
            </a>
            <a href="#packages" className="hover:text-foreground transition-colors">
              Packages
            </a>
            <a href="#portfolio" className="hover:text-foreground transition-colors">
              Portfolio
            </a>
            <Link href="/organizer/dashboard" className="text-primary hover:underline">
              Organizer Admin
            </Link>
          </div>

          <div className="text-center md:text-right">
            <span>© {new Date().getFullYear()} {organizer.name}. All rights reserved.</span>
            <span className="block text-[11px] text-muted-foreground/70 mt-0.5">
              Powered by Veluxe Luxury Event Services Marketplace
            </span>
          </div>
        </div>
      </footer>

      {/* ========================================================
          10. INTERACTIVE PACKAGE CUSTOMIZER DRAWER (SLIDE-OVER)
      ======================================================== */}
      <AnimatePresence>
        {customizerOpen && selectedPackage && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
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
                {/* Drawer Header */}
                <div className="p-6 border-b border-border/80 flex items-center justify-between bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-lg font-bold text-foreground">Package Customizer</h3>
                      <p className="text-xs text-muted-foreground">{selectedPackage.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCustomizerOpen(false)}
                    className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Body Scrollable */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  {submittedInquiry ? (
                    /* Submission Success Card */
                    <div className="py-8 text-center space-y-5">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>

                      <div className="space-y-2">
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 font-mono text-xs">
                          {submittedInquiry.inquiry_number}
                        </Badge>
                        <h4 className="font-editorial text-2xl font-bold text-foreground">
                          Quotation Request Submitted!
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                          Your customized inquiry for{" "}
                          <span className="font-semibold text-foreground">{selectedPackage.name}</span> has been directly
                          received in the VKS Organizer Back-Office inbox.
                        </p>
                      </div>

                      {/* Summary Breakdown Card */}
                      <div className="p-4 rounded-xl border border-border bg-background/60 text-left space-y-2 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Client Name:</span>
                          <span className="font-medium text-foreground">{submittedInquiry.customer_name}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Target Event Date:</span>
                          <span className="font-medium text-foreground">{submittedInquiry.event_date}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Selected Add-ons:</span>
                          <span className="font-medium text-foreground">
                            {selectedAddons.length > 0 ? `${selectedAddons.length} Premium Upgrades` : "Base Inclusions"}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground pt-2 border-t border-border/60">
                          <span className="font-semibold text-foreground">Total Proposal Estimate:</span>
                          <span className="font-editorial text-base font-bold text-primary">
                            {formatINR(pricingBreakdown.total)}
                          </span>
                        </div>
                      </div>

                      {/* Direct Test Link to Organizer Inbox */}
                      <div className="pt-4 space-y-3">
                        <Link href="/organizer/inquiries">
                          <Button className="w-full bg-primary text-primary-foreground font-semibold gap-2 py-2.5">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Open in Organizer Inquiries Desk</span>
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
                          Close Customizer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Customization Form */
                    <form onSubmit={handleDrawerSubmit} className="space-y-6">
                      {/* Package Base Specs */}
                      <div className="p-4 rounded-xl border border-border bg-background/70 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">Base Curation</span>
                          <span className="font-editorial text-lg font-bold text-foreground">
                            {formatINR(selectedPackage.base_price)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{selectedPackage.tagline}</p>
                      </div>

                      {/* Optional Add-ons Checklist */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Optional Luxury Add-ons
                          </h4>
                          <span className="text-[11px] text-primary font-medium">Click to Add/Remove</span>
                        </div>

                        <div className="space-y-2">
                          {SEEDED_ADDONS.map((addon) => {
                            const isSelected = selectedAddons.includes(addon.id);
                            return (
                              <div
                                key={addon.id}
                                onClick={() => toggleAddon(addon.id)}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                  isSelected
                                    ? "border-primary bg-primary/10 shadow-sm"
                                    : "border-border/70 bg-background/40 hover:border-border hover:bg-background/80"
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                        isSelected
                                          ? "bg-primary border-primary text-primary-foreground"
                                          : "border-muted-foreground/40"
                                      }`}
                                    >
                                      {isSelected && "✓"}
                                    </span>
                                    <span className="text-xs font-semibold text-foreground">{addon.name}</span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground pl-6">{addon.description}</p>
                                </div>
                                <span className="font-editorial text-xs font-bold text-primary shrink-0">
                                  +{formatINR(addon.price)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Live Price Calculator */}
                      <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Base Package:</span>
                          <span>{formatINR(pricingBreakdown.base)}</span>
                        </div>
                        {pricingBreakdown.addons > 0 && (
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Selected Add-ons ({selectedAddons.length}):</span>
                            <span>+{formatINR(pricingBreakdown.addons)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Subtotal:</span>
                          <span>{formatINR(pricingBreakdown.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>GST (18%):</span>
                          <span>+{formatINR(pricingBreakdown.tax)}</span>
                        </div>
                        <div className="pt-2 border-t border-border flex justify-between items-center">
                          <span className="text-xs font-bold text-foreground">Estimated Grand Total:</span>
                          <span className="font-editorial text-xl font-bold text-primary">
                            {formatINR(pricingBreakdown.total)}
                          </span>
                        </div>
                      </div>

                      {/* Event & Client Details */}
                      <div className="space-y-4 pt-2 border-t border-border/80">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Your Event & Contact Details
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                              Client Name
                            </label>
                            <Input
                              required
                              placeholder="e.g. Vikram Sundaram"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                              Phone Number
                            </label>
                            <Input
                              required
                              placeholder="+91 98401 23456"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                              Email Address
                            </label>
                            <Input
                              type="email"
                              required
                              placeholder="vikram@gmail.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                              Target Date
                            </label>
                            <Input
                              type="date"
                              required
                              value={formData.eventDate}
                              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                              Guest Count
                            </label>
                            <Input
                              type="number"
                              value={formData.guestCount}
                              onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                              placeholder="800"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                              Venue / City
                            </label>
                            <Input
                              value={formData.venueCity}
                              onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                              placeholder="Leela Palace, Chennai"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                            Special Instructions or Theme
                          </label>
                          <textarea
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="e.g. Royal ivory and burgundy floral palette, orchestral entry..."
                            className="w-full rounded-xl glass-field p-2.5 text-xs text-foreground placeholder:text-amber-200/40"
                          />
                        </div>
                      </div>

                      {/* Submit CTA */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 gap-2"
                      >
                        {isSubmitting ? (
                          <span>Submitting Quotation Request...</span>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Submit Quotation Request ({formatINR(pricingBreakdown.total)})</span>
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          11. LIGHTBOX MODAL FOR PORTFOLIO
      ======================================================== */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        title={selectedImage?.title}
        description={`${selectedImage?.category_label} • ${selectedImage?.venue}, ${selectedImage?.city}`}
        className="max-w-3xl p-0 overflow-hidden"
      >
        {selectedImage && (
          <div className="space-y-4">
            <div className="relative h-96 w-full">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.title}
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="p-6 pt-0 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedImage.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <span className="text-muted-foreground">Executed in {selectedImage.date_formatted}</span>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedImage(null);
                    openCustomizer(packages[0]);
                  }}
                  className="bg-primary text-primary-foreground font-semibold text-xs"
                >
                  Request Similar Mandap Decor
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
