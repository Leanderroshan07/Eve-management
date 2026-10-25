"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileQuestion,
  FileSignature,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  ChevronRight,
  User,
  Plus,
  Edit3,
  Building2,
  Truck,
  Users,
  Compass,
  X,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { OrganizerHeader } from "@/components/organizer/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/format";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  getScopedOrganizerProfile,
  getScopedOrganizerPackages,
  getScopedOrganizerInquiries,
  saveScopedOrganizerProfile,
  isSeededDemoUser,
} from "@/lib/user-scoped-data";
import { OrganizerBusiness, CustomerInquiry, OrganizerPackage } from "@/lib/organizer-data";

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<OrganizerBusiness | null>(null);
  const [packages, setPackages] = React.useState<OrganizerPackage[]>([]);
  const [inquiries, setInquiries] = React.useState<CustomerInquiry[]>([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = React.useState({
    name: "",
    tagline: "",
    city: "",
    contact_email: "",
    contact_phone: "",
    instagram: "",
  });

  const loadData = React.useCallback(() => {
    const prof = getScopedOrganizerProfile(user);
    setProfile(prof);
    setProfileForm({
      name: prof.name,
      tagline: prof.tagline,
      city: prof.city,
      contact_email: prof.contact_email,
      contact_phone: prof.contact_phone,
      instagram: prof.socials?.instagram || "",
    });
    setPackages(getScopedOrganizerPackages(user));
    setInquiries(getScopedOrganizerInquiries(user));
  }, [user]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    saveScopedOrganizerProfile(user, {
      name: profileForm.name,
      tagline: profileForm.tagline,
      city: profileForm.city,
      contact_email: profileForm.contact_email,
      contact_phone: profileForm.contact_phone,
      socials: {
        instagram: profileForm.instagram,
      },
    });
    loadData();
    setIsEditProfileOpen(false);
  };

  const isNewAccount = !isSeededDemoUser(user) && packages.length === 0 && inquiries.length === 0;

  return (
    <div className="flex-1 flex flex-col">
      <OrganizerHeader
        title={profile ? `${profile.name} — Operations Hub` : "Business Overview & Operations"}
        description="Monitor active quote inquiries, versioned proposals, and upcoming event milestones."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Profile Quick Edit Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground text-sm">
                  {profile?.name}
                </h2>
                {!isSeededDemoUser(user) && (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px]">
                    New Agency Account
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{profile?.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(true)}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Agency Profile</span>
            </Button>
            <Link href="/organizer/packages">
              <Button variant="champagne" size="sm" className="text-xs gap-1.5 font-semibold cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Manage Packages</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Guided Luxury Onboarding for New Organizer Accounts */}
        {isNewAccount && (
          <Card className="border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-card to-background p-6 rounded-3xl shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-foreground">
                      Welcome, {user?.name || "Organizer"}! Set Up Your Luxury Presence
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Your agency portal is active. Complete these setup actions to launch your packages and receive client inquiries:
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Step 1: Packages */}
                <Link
                  href="/organizer/packages"
                  className="group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all space-y-2 block"
                >
                  <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-amber-500 transition-colors flex items-center justify-between">
                    <span>1. Publish First Package</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Define custom floral mandaps, staging tiers, guest capacities, and base rates.
                  </p>
                </Link>

                {/* Step 2: Equip via Rentals */}
                <Link
                  href="/rentals"
                  className="group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all space-y-2 block"
                >
                  <div className="h-8 w-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-amber-500 transition-colors flex items-center justify-between">
                    <span>2. Equip with Rentals</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Reserve sound line arrays, moving heads, and chiavari chairs for upcoming galas.
                  </p>
                </Link>

                {/* Step 3: Hire Staff */}
                <Link
                  href="/marketplace?tab=workers"
                  className="group p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all space-y-2 block"
                >
                  <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-amber-500 transition-colors flex items-center justify-between">
                    <span>3. Hire Event Staff</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Book certified floor stewards, head chefs, and rigging specialists.
                  </p>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Operational KPI Cards */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Card 1: Inquiries */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-card/70 border-border p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  New Inquiries
                </span>
                <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <FileQuestion className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground font-editorial">
                  {inquiries.length} Pending
                </span>
                <span className="text-xs text-amber-500 font-medium">
                  Client Briefs
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Packages Published */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-card/70 border-border p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Published Packages
                </span>
                <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground font-editorial">
                  {packages.length} Active
                </span>
                <span className="text-xs text-primary font-medium">
                  Live on Marketplace
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Agency Rating */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-card/70 border-border p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Verified Rating
                </span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <CalendarCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground font-editorial">
                  {profile?.rating.toFixed(2)} ★
                </span>
                <span className="text-xs text-emerald-500 font-medium">
                  {profile?.review_count} Client Reviews
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Card 4: Operating Region */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-card/70 border-border p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Primary Hub
                </span>
                <div className="h-8 w-8 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center">
                  <Compass className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-foreground font-editorial truncate">
                  {profile?.city || "Mumbai"}
                </span>
                <span className="text-xs text-sky-500 font-medium">
                  {profile?.service_areas.length || 1} Cities
                </span>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Inquiries Table / Empty State */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-tight font-editorial">
                Customer Inquiries Requiring Action ({inquiries.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Review stated requirements and draft custom itemized proposals.
              </p>
            </div>
            <Link href="/organizer/packages">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                Manage Service Tiers <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-16 bg-card/40 rounded-3xl border border-dashed border-border/80 p-8 space-y-3">
              <FileQuestion className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
              <h3 className="font-editorial text-lg font-bold text-foreground">
                No Inquiries Awaiting Action
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {!isSeededDemoUser(user)
                  ? "When customers discover your published packages in the marketplace, their custom event requests will arrive here."
                  : "All inquiries have been handled."}
              </p>
              <Link href="/organizer/packages">
                <Button variant="champagne" size="sm" className="text-xs font-semibold mt-2 cursor-pointer">
                  Publish Another Package
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted text-foreground/80 uppercase tracking-wider text-[10px] font-semibold border-b border-border">
                    <tr>
                      <th className="py-3 px-4">Inquiry Ref</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Event & Date</th>
                      <th className="py-3 px-4">Guests</th>
                      <th className="py-3 px-4">Est. Budget</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-primary">
                          {inq.inquiry_number}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-foreground">
                          <div>{inq.customer_name}</div>
                          <div className="text-[11px] text-muted-foreground font-normal">{inq.location}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{inq.event_type}</div>
                          <div className="text-[11px] text-primary font-medium">
                            {formatDate(inq.event_date)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {inq.guest_count} Guests
                        </td>
                        <td className="py-3.5 px-4 font-medium text-foreground">
                          {formatINR(inq.estimated_budget)}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {inq.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link href="/organizer/proposal-builder">
                            <Button variant="champagne" size="sm" className="h-7 text-xs font-semibold">
                              Draft Proposal
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal: Edit Agency Profile */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-editorial text-lg font-bold text-foreground">
                Edit Agency Business Profile
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
                <label className="font-semibold text-foreground block mb-1">Agency / Business Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Tagline / Mission</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Headquarters City *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={profileForm.instagram}
                    onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={profileForm.contact_email}
                    onChange={(e) => setProfileForm({ ...profileForm, contact_email: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.contact_phone}
                    onChange={(e) => setProfileForm({ ...profileForm, contact_phone: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
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
                  Save Agency Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
