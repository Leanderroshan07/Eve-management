"use client";

import * as React from "react";
import Image from "next/image";
import {
  Package as PackageIcon,
  Plus,
  Check,
  Edit3,
  Eye,
  Trash2,
  Users,
  Sparkles,
  Search,
} from "lucide-react";
import { OrganizerHeader } from "@/components/organizer/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { SEEDED_PACKAGES, OrganizerPackage } from "@/lib/organizer-data";
import { formatINR } from "@/lib/format";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function OrganizerPackagesPage() {
  const [packages, setPackages] = React.useState<OrganizerPackage[]>(SEEDED_PACKAGES);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Form states for new package
  const [newTitle, setNewTitle] = React.useState("");
  const [newTagline, setNewTagline] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Royal Wedding");
  const [newPrice, setNewPrice] = React.useState("");
  const [newCapacity, setNewCapacity] = React.useState("500 – 1,000 Guests");
  const [newInclusion, setNewInclusion] = React.useState("");
  const [inclusionsList, setInclusionsList] = React.useState<string[]>([
    "Architectural Floral Mandap Structure",
    "Crystal Chandeliers & Amber Spotlights",
    "15 Dedicated Hospitality Floor Stewards",
  ]);
  const [formError, setFormError] = React.useState("");

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    setInclusionsList([...inclusionsList, newInclusion.trim()]);
    setNewInclusion("");
  };

  const handleRemoveInclusion = (index: number) => {
    setInclusionsList(inclusionsList.filter((_, i) => i !== index));
  };

  const handleCreatePackage = () => {
    if (!newTitle.trim() || !newPrice.trim()) {
      setFormError("Please provide both package title and base price.");
      return;
    }
    const numPrice = Number(newPrice.replace(/[^0-9]/g, ""));
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError("Please enter a valid numeric price.");
      return;
    }

    const created: OrganizerPackage = {
      id: `pkg-${Date.now()}`,
      organizer_id: "org-vks-001",
      name: newTitle,
      tagline: newTagline || "Custom tailored wedding experience",
      description: "Bespoke package tailored to client specifications.",
      event_category: newCategory,
      base_price: numPrice,
      currency: "INR",
      guest_capacity: newCapacity,
      image_url:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
      inclusions: inclusionsList,
      items: [],
      is_published: true,
      featured: false,
    };

    setPackages([created, ...packages]);
    setDialogOpen(false);
    // Reset form
    setNewTitle("");
    setNewTagline("");
    setNewPrice("");
    setFormError("");
  };

  const togglePublish = (id: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === id ? { ...pkg, is_published: !pkg.is_published } : pkg
      )
    );
  };

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.event_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <OrganizerHeader
        title="Package & Service Catalog"
        description="Publish customizable event packages, tiered pricing, and inclusions."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-amber-400/80 z-10" />
            <Input
              type="text"
              placeholder="Search packages by title or category..."
              className="pl-9 h-10 glass-field text-foreground placeholder:text-amber-200/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant="champagne"
            onClick={() => setDialogOpen(true)}
            className="gap-2 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" /> Create New Package
          </Button>
        </div>

        {/* Packages Grid */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filtered.map((pkg) => (
            <motion.div key={pkg.id} variants={fadeInUp}>
              <Card className="border-border bg-card overflow-hidden flex flex-col h-full hover:border-border/80 transition-all shadow-sm">
                {/* Package Cover Image */}
                <div className="relative h-48 w-full bg-slate-900">
                  <Image
                    src={pkg.image_url}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  
                  {/* Category and Status Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="outline" className="bg-black/60 backdrop-blur border-white/20 text-white text-[11px]">
                      {pkg.event_category}
                    </Badge>
                    {pkg.featured && (
                      <Badge variant="champagne" className="text-[11px] gap-1">
                        <Sparkles className="h-3 w-3" /> Featured
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={() => togglePublish(pkg.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        pkg.is_published
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {pkg.is_published ? "● Live / Published" : "○ Draft"}
                    </button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-foreground text-lg font-bold">
                        {pkg.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {pkg.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold text-base">
                      {formatINR(pkg.base_price)}
                    </span>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {pkg.guest_capacity}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-2 pt-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Included Services ({pkg.inclusions.length})
                  </span>
                  <div className="space-y-1.5">
                    {pkg.inclusions.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                    {pkg.inclusions.length > 4 && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-1 font-medium">
                        +{pkg.inclusions.length - 4} more specialized inclusions
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border pt-3 flex justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    ID: {pkg.id}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-border text-foreground hover:bg-muted">
                      <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Create New Package Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Create New Customizable Package"
        description="Add a new event tier with price, inclusions, and guest capacity."
        className="max-w-2xl border-border bg-card text-foreground"
      >
        <div className="space-y-4 py-2 text-xs">
          {formError && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-amber-200 block mb-1">
                Package Name *
              </label>
              <Input
                placeholder="e.g. Royal Emerald Wedding Gala"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="glass-field text-foreground"
              />
            </div>

            <div>
              <label className="font-medium text-amber-200 block mb-1">
                Event Category
              </label>
              <Input
                placeholder="e.g. Royal Wedding, Sangeet"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="glass-field text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-amber-200 block mb-1">
                Base Price (INR ₹) *
              </label>
              <Input
                placeholder="e.g. 1500000"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="glass-field text-foreground font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-amber-200 block mb-1">
                Guest Capacity
              </label>
              <Input
                placeholder="e.g. 500 – 1,000 Guests"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
                className="glass-field text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-amber-200 block mb-1">
              Tagline / Short Hook
            </label>
            <Input
              placeholder="e.g. Grand floral mandap with signature stage lighting"
              value={newTagline}
              onChange={(e) => setNewTagline(e.target.value)}
              className="glass-field text-foreground"
            />
          </div>

          {/* Inclusions Builder */}
          <div>
            <label className="font-medium text-amber-200 block mb-1">
              Included Services & Deliverables
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add service (e.g. 24ft LED Backdrop Wall)"
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                className="glass-field text-foreground"
              />
              <Button variant="champagne" size="sm" onClick={handleAddInclusion}>
                Add
              </Button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {inclusionsList.map((inc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl glass-field text-foreground text-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-500" /> {inc}
                  </span>
                  <button
                    onClick={() => handleRemoveInclusion(i)}
                    className="text-muted-foreground hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="champagne" size="sm" onClick={handleCreatePackage}>
              Save & Publish Package
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
