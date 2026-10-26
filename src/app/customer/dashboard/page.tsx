"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileSignature,
  FileQuestion,
  CalendarCheck2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Users,
  Compass,
  Crown,
  Edit3,
  PlusCircle,
  Truck,
  Building2,
  DollarSign,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/format";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  getScopedCustomerInquiries,
  getScopedCustomerProposals,
  getScopedCustomerBookings,
  getScopedCustomerProfile,
  saveScopedCustomerProfile,
  addScopedCustomerInquiry,
  isSeededDemoUser,
  CustomerEventProfile,
} from "@/lib/user-scoped-data";
import { CustomerInquiry } from "@/lib/organizer-data";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<CustomerEventProfile | null>(null);
  const [inquiries, setInquiries] = React.useState<CustomerInquiry[]>([]);
  const [proposals, setProposals] = React.useState<any[]>([]);
  const [bookings, setBookings] = React.useState<any[]>([]);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [isNewBriefOpen, setIsNewBriefOpen] = React.useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = React.useState({
    name: "",
    city: "",
    phone: "",
    eventDate: "",
    eventType: "",
    estimatedBudget: 2500000,
    guestCount: 500,
  });

  // New Brief Form state
  const [briefForm, setBriefForm] = React.useState({
    event_type: "Grand Palace Wedding",
    event_date: "2026-11-20",
    guest_count: 500,
    estimated_budget: 3000000,
    location: "Udaipur & Goa",
    notes: "Requires grand floral mandap, concert line array audio, and 20 floor stewarding staff.",
  });

  const loadData = React.useCallback(() => {
    const prof = getScopedCustomerProfile(user);
    setProfile(prof);
    setProfileForm({
      name: prof.name,
      city: prof.city,
      phone: prof.phone,
      eventDate: prof.eventDate,
      eventType: prof.eventType,
      estimatedBudget: prof.estimatedBudget,
      guestCount: prof.guestCount,
    });
    setInquiries(getScopedCustomerInquiries(user));
    setProposals(getScopedCustomerProposals(user));
    setBookings(getScopedCustomerBookings(user));
  }, [user]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    saveScopedCustomerProfile(user, profileForm);
    setProfile({ ...profile!, ...profileForm });
    setIsEditProfileOpen(false);
  };

  const handleCreateBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      inquiry_number: `INQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      organizer_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      customer_name: profileForm.name || user.name || "Client Host",
      customer_email: user.email,
      customer_phone: profileForm.phone || "+91 98000 00000",
      event_type: briefForm.event_type,
      event_date: briefForm.event_date,
      guest_count: briefForm.guest_count,
      estimated_budget: briefForm.estimated_budget,
      location: briefForm.location,
      notes: briefForm.notes,
      status: "pending",
      created_at: new Date().toISOString(),
      source: "Customer Portal Brief",
    };

    addScopedCustomerInquiry(user, newInquiry);
    setInquiries([newInquiry, ...inquiries]);
    setIsNewBriefOpen(false);
  };

  const pendingProposal = proposals.find(
    (p) => p.status === "sent_to_customer" || (!p.customer_accepted && p.organizer_accepted)
  );

  const isNewAccount = !isSeededDemoUser(user) && inquiries.length === 0 && proposals.length === 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {profile ? `${profile.name}'s Celebration Portal` : "Client Wedding Overview"}
            </h1>
            {!isSeededDemoUser(user) && (
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px]">
                New Host Account
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Track quotation requests, review itemized proposals, and coordinate bespoke event services.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditProfileOpen(true)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Event Preferences</span>
          </Button>

          <Link href="/marketplace">
            <Button variant="champagne" size="sm" className="font-bold text-xs gap-2 cursor-pointer">
              <Compass className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Guided Onboarding & Exploration for New Host Accounts */}
      {isNewAccount && (
        <Card className="border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-background p-6 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl font-bold text-foreground">
                    Welcome to Veluxe, {user?.name || "Host"}!
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your luxury celebration dashboard is ready. Follow these guided steps to design your dream event:
                  </p>
                </div>
              </div>

              <Button
                variant="champagne"
                size="sm"
                onClick={() => setIsNewBriefOpen(true)}
                className="gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit Event Brief</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Step 1: Organizers */}
              <Link
                href="/marketplace?tab=organizers"
                className="group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-primary/60 hover:bg-primary/5 transition-all space-y-2 block"
              >
                <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>1. Discover Organizers</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-muted-foreground">
                  Browse verified royal wedding producers in Udaipur, Jaipur, Goa, and Mumbai.
                </p>
              </Link>

              {/* Step 2: Rentals */}
              <Link
                href="/rentals"
                className="group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-primary/60 hover:bg-primary/5 transition-all space-y-2 block"
              >
                <div className="h-8 w-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>2. Rent Staging & AV</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-muted-foreground">
                  Rent concert sound arrays, moving head truss lighting, and royal brass mandaps.
                </p>
              </Link>

              {/* Step 3: Staff */}
              <Link
                href="/marketplace?tab=workers"
                className="group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-primary/60 hover:bg-primary/5 transition-all space-y-2 block"
              >
                <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>3. Hire VIP Staff</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-muted-foreground">
                  Book certified culinary directors, mixologists, and hospitality stewards.
                </p>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Prominent Action Required Alert for Proposal Review (if applicable) */}
      {pendingProposal && (
        <Card className="border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#1c0c05]/85 to-[#120601]/90 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-amber-400 text-amber-400 text-xs font-semibold px-2.5 py-0.5 animate-pulse">
                    Action Required
                  </Badge>
                  <span className="text-xs text-amber-300 font-mono font-medium">
                    Proposal {pendingProposal.proposal_number} (v{pendingProposal.version})
                  </span>
                </div>

                <div>
                  <h3 className="font-editorial text-xl font-bold text-foreground">
                    Official Proposal Ready for Your Review & Acceptance
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                    Customized itemized proposal for{" "}
                    <span className="font-semibold text-foreground">{pendingProposal.event_type}</span> on{" "}
                    <span className="font-semibold text-foreground">{pendingProposal.event_date}</span>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>
                    Estimated Total:{" "}
                    <strong className="text-amber-400 font-editorial text-sm">
                      {formatINR(pendingProposal.total_amount)}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>Line Items: {pendingProposal.items.length} Included</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link href={`/customer/proposals?id=${pendingProposal.id}`}>
                  <Button variant="champagne" size="sm" className="gap-2 font-bold text-xs">
                    Review Proposal <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border bg-card/70 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Inquiries
            </span>
            <FileQuestion className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground font-editorial">{inquiries.length}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Pending response from planners</p>
        </Card>

        <Card className="p-5 border-border bg-card/70 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Official Proposals
            </span>
            <FileSignature className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground font-editorial">{proposals.length}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Ready for contract review</p>
        </Card>

        <Card className="p-5 border-border bg-card/70 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Confirmed Celebrations
            </span>
            <CalendarCheck2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-editorial">{bookings.length}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Deposits locked in escrow</p>
        </Card>

        <Card className="p-5 border-border bg-card/70 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Target Budget
            </span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="text-xl font-bold text-foreground font-editorial">
            {formatINR(profile?.estimatedBudget || 2500000)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{profile?.guestCount || 500} Estimated Guests</p>
        </Card>
      </div>

      {/* Inquiries Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-xl font-bold text-foreground">
            Your Event Inquiries ({inquiries.length})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNewBriefOpen(true)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary" />
            <span>New Inquiry Brief</span>
          </Button>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-12 bg-card/40 rounded-3xl border border-dashed border-border/80 p-6 space-y-3">
            <FileQuestion className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
            <h3 className="font-editorial text-base font-bold text-foreground">
              No Inquiries Created Yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Explore custom packages in the marketplace or click the button below to submit a custom celebration brief.
            </p>
            <Button
              variant="champagne"
              size="sm"
              onClick={() => setIsNewBriefOpen(true)}
              className="text-xs font-semibold cursor-pointer"
            >
              Submit Your First Brief
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inquiries.map((inq) => (
              <Card key={inq.id} className="p-5 border-border bg-card/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-primary font-bold">
                    {inq.inquiry_number}
                  </span>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {inq.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{inq.event_type}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {inq.event_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {inq.location}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-bold text-foreground">{formatINR(inq.estimated_budget)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Edit Event Preferences */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-editorial text-lg font-bold text-foreground">
                Edit Event & Host Preferences
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Host / Couple Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Event Target Date</label>
                  <input
                    type="date"
                    value={profileForm.eventDate}
                    onChange={(e) => setProfileForm({ ...profileForm, eventDate: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Guest Count</label>
                  <input
                    type="number"
                    min={10}
                    value={profileForm.guestCount}
                    onChange={(e) => setProfileForm({ ...profileForm, guestCount: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Estimated Budget (₹)</label>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  value={profileForm.estimatedBudget}
                  onChange={(e) => setProfileForm({ ...profileForm, estimatedBudget: Number(e.target.value) })}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="champagne" size="sm" className="font-semibold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Custom Brief */}
      {isNewBriefOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-editorial text-lg font-bold text-foreground">
                Submit New Event Brief
              </h3>
              <button
                type="button"
                onClick={() => setIsNewBriefOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBrief} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Celebration / Event Type *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Rajputana Heritage Gala"
                  value={briefForm.event_type}
                  onChange={(e) => setBriefForm({ ...briefForm, event_type: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={briefForm.event_date}
                    onChange={(e) => setBriefForm({ ...briefForm, event_date: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Location / Venue</label>
                  <input
                    type="text"
                    required
                    value={briefForm.location}
                    onChange={(e) => setBriefForm({ ...briefForm, location: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Guest Count</label>
                  <input
                    type="number"
                    min={20}
                    value={briefForm.guest_count}
                    onChange={(e) => setBriefForm({ ...briefForm, guest_count: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    min={50000}
                    step={50000}
                    value={briefForm.estimated_budget}
                    onChange={(e) => setBriefForm({ ...briefForm, estimated_budget: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Specific Visions & Requirements</label>
                <textarea
                  rows={3}
                  value={briefForm.notes}
                  onChange={(e) => setBriefForm({ ...briefForm, notes: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl p-3 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewBriefOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="champagne" size="sm" className="font-semibold">
                  Submit Brief
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
