"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Save,
  CheckCircle,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Camera,
} from "lucide-react";
import { OrganizerHeader } from "@/components/organizer/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEEDED_ORGANIZER, OrganizerBusiness } from "@/lib/organizer-data";

export default function OrganizerProfilePage() {
  const [profile, setProfile] = React.useState<OrganizerBusiness>(SEEDED_ORGANIZER);
  const [savedFeedback, setSavedFeedback] = React.useState(false);

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2400);
  };

  return (
    <div className="flex-1 flex flex-col">
      <OrganizerHeader
        title="Company Profile & Public Website Configuration"
        description="Manage your business identity, service areas, contact details, and public landing page visibility."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {/* Publication Status Card */}
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground dark:text-emerald-300 block">
                Public Website is LIVE & Published
              </span>
              <span className="text-xs text-muted-foreground">
                Accessible to clients at:{" "}
                <Link
                  href={`/organizers/${profile.slug}`}
                  target="_blank"
                  className="text-amber-600 dark:text-amber-400 underline font-mono font-medium hover:text-foreground"
                >
                  /organizers/{profile.slug}
                </Link>
              </span>
            </div>
          </div>

          <Link href={`/organizers/${profile.slug}`} target="_blank">
            <Button variant="champagne" size="sm" className="gap-1.5 text-xs font-semibold">
              <ExternalLink className="h-3.5 w-3.5" /> Preview Public Page
            </Button>
          </Link>
        </div>

        {/* Profile Edit Form */}
        <Card className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
          <CardHeader>
            <CardTitle className="text-foreground text-base">Business Identity & Branding</CardTitle>
            <CardDescription className="text-xs text-amber-200/60">
              Information displayed to customers on your public landing page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-xs">
            {/* Business Name and Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-amber-200 font-medium block mb-1">
                  Business Name *
                </label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="glass-field text-foreground"
                />
              </div>

              <div>
                <label className="text-amber-200 font-medium block mb-1">
                  URL Slug
                </label>
                <Input
                  value={profile.slug}
                  disabled
                  className="glass-field text-amber-200/50 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-amber-200 font-medium block mb-1">
                Tagline / Value Proposition
              </label>
              <Input
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="glass-field text-foreground"
              />
            </div>

            <div>
              <label className="text-amber-200 font-medium block mb-1">
                Company Description & Story
              </label>
              <textarea
                rows={4}
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="w-full rounded-xl glass-field text-foreground p-3 text-xs leading-relaxed"
              />
            </div>

            {/* Service Area & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-amber-200 font-medium block mb-1">
                  Primary Base City
                </label>
                <Input
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="glass-field text-foreground"
                />
              </div>

              <div>
                <label className="text-amber-200 font-medium block mb-1">
                  Service Area Locations
                </label>
                <Input
                  value={profile.service_areas.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      service_areas: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  className="glass-field text-foreground"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-amber-200 font-medium block mb-1">
                  Concierge Email *
                </label>
                <Input
                  value={profile.contact_email}
                  onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                  className="glass-field text-foreground"
                />
              </div>

              <div>
                <label className="text-amber-200 font-medium block mb-1">
                  Contact Phone / WhatsApp *
                </label>
                <Input
                  value={profile.contact_phone}
                  onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                  className="glass-field text-foreground font-mono"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-amber-500/15 flex justify-between items-center py-4 bg-[#240e05]/50">
            {savedFeedback ? (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Profile changes saved and published!
              </span>
            ) : (
              <span className="text-amber-200/60 text-xs">
                Changes update your live public landing page immediately.
              </span>
            )}
            <Button variant="champagne" size="sm" onClick={handleSave} className="gap-2 font-semibold">
              <Save className="h-4 w-4" /> Save Profile
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
