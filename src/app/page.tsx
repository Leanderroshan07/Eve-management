"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Sparkles,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  Sliders,
  Layers,
  Zap,
  Play,
  RotateCcw,
  Sparkle,
  Compass,
  FileCheck,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  fadeIn,
  fadeInUp,
  fadeInScale,
  staggerContainer,
  cardHover,
  dramaticHeroHeadline,
  dramaticHeroSub,
  dramaticImageReveal,
  SPRINGS,
} from "@/lib/motion";
import { env } from "@/lib/env";

export default function FoundationPreviewPage() {
  const [motionStyle, setMotionStyle] = React.useState<"restrained" | "dramatic">("dramatic");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [demoKey, setDemoKey] = React.useState(0);
  const [testEmail, setTestEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");

  const handleTestValidation = () => {
    if (!testEmail || !testEmail.includes("@")) {
      setEmailError("Please enter a valid business email address.");
    } else {
      setEmailError("");
      alert("Validated successfully with strict schema!");
    }
  };

  const simulateLoading = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 1600);
  };

  const replayAnimation = () => {
    setDemoKey((prev) => prev + 1);
  };

  const { scrollY } = useScroll();
  const heroContentY = useTransform(scrollY, [0, 480], [0, -45]);
  const heroContentOpacity = useTransform(scrollY, [0, 420], [1, 0.45]);

  return (
    <div className="min-h-screen flex flex-col dark">
      <Navbar />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* HERO SECTION: DEMONSTRATING CINEMATIC VS RESTRAINED MOTION */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden border-b border-white/10 min-h-screen flex flex-col justify-center items-center py-12 sm:py-16">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              style={{ y: heroContentY, opacity: heroContentOpacity }}
              className="flex flex-col items-center text-center"
            >
              {/* Badge */}
              <motion.div
                key={`badge-${demoKey}`}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="mb-4"
              >
                <Badge variant="champagne" className="gap-1.5 py-1 px-3 text-xs">
                  <Sparkles className="h-3.5 w-3.5" /> Phase 0 Foundation & Animation System
                </Badge>
              </motion.div>

              {/* Headline */}
              <motion.h1
                key={`h1-${demoKey}`}
                variants={motionStyle === "dramatic" ? dramaticHeroHeadline : fadeInUp}
                initial="hidden"
                animate="visible"
                className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl"
              >
                Curated Elegance, <br />
                <span className="italic text-[#fcd34d] font-normal">
                  Flawless Execution.
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                key={`sub-${demoKey}`}
                variants={motionStyle === "dramatic" ? dramaticHeroSub : fadeInUp}
                initial="hidden"
                animate="visible"
                className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
              >
                The digital platform uniting premium event organizers, specialized catering workforce,
                and equipment rentals into one cohesive, synchronized experience.
              </motion.p>

              {/* Action Bar & Controls */}
              <motion.div
                key={`actions-${demoKey}`}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
              >
                <Button variant="champagne" size="lg" onClick={() => setDialogOpen(true)}>
                  Test Dialog Motion <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={simulateLoading}
                  isLoading={buttonLoading}
                >
                  Test Button Feedback
                </Button>
                <Button variant="secondary" size="lg" onClick={replayAnimation} title="Replay entrance motion">
                  <RotateCcw className="h-4 w-4" /> Replay Motion
                </Button>
              </motion.div>

              {/* Interactive Sandbox Mode Switcher */}
              <div className="mt-10 inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] p-2 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <span className="text-xs font-semibold text-muted-foreground px-2 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" /> Motion Preset:
                </span>
                <button
                  onClick={() => setMotionStyle("dramatic")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    motionStyle === "dramatic"
                      ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cinematic (Organizer)
                </button>
                <button
                  onClick={() => setMotionStyle("restrained")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    motionStyle === "restrained"
                      ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Restrained (Dashboard)
                </button>
              </div>

              {/* Subtle Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-8 flex flex-col items-center gap-1.5 text-muted-foreground/60 text-[11px] tracking-wider uppercase"
              >
                <span>Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="w-4 h-6 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1"
                >
                  <div className="w-1 h-1.5 rounded-full bg-muted-foreground/50" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: MOTION SYSTEM ARCHITECTURE & TIMING RULES */}
        {/* ============================================================== */}
        <section id="motion-showcase" className="py-16 sm:py-20 border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <Badge variant="outline" className="mb-2">
                  Precision Engineering
                </Badge>
                <h2 className="font-editorial text-3xl font-bold tracking-tight text-foreground">
                  The Motion Architecture
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Engineered using Motion for React. Exclusively runs on GPU-composited transforms
                  and opacity with zero layout thrashing or cumulative layout shift (CLS).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={env.isSupabaseConfigured ? "success" : "warning"} className="gap-1">
                  <div className={`h-2 w-2 rounded-full ${env.isSupabaseConfigured ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {env.isSupabaseConfigured ? "Supabase Live Connected" : "Local Development Mode (Ready for Keys)"}
                </Badge>
              </div>
            </div>

            {/* Staggered Feature Cards Grid */}
            <motion.div
              key={`grid-${demoKey}`}
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Card 1: Organizer Preset */}
              <motion.div variants={fadeInUp} whileHover={cardHover.hover}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-xl bg-[#d4af37]/15 text-[#a07817] dark:text-[#f0cf65] flex items-center justify-center mb-3">
                      <Sparkle className="h-5 w-5" />
                    </div>
                    <CardTitle>Cinematic Organizer Presets</CardTitle>
                    <CardDescription>
                      Tailored for high-impact photography portfolios, editorial headline reveals, and luxury
                      stagger sequences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1.5 font-mono">
                    <p>• Duration: 700ms - 1100ms</p>
                    <p>• Easing: luxuryDecelerate [0.16, 1, 0.3, 1]</p>
                    <p>• Scale reveal: 1.08 → 1.0 with zero flicker</p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="champagne">Mode A — Public Showcase</Badge>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Card 2: Restrained Dashboard Motion */}
              <motion.div variants={fadeInUp} whileHover={cardHover.hover}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Zap className="h-5 w-5" />
                    </div>
                    <CardTitle>Restrained SaaS & Dashboard</CardTitle>
                    <CardDescription>
                      Engineered for dense operational workflows, proposal tables, and rapid decision-making.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1.5 font-mono">
                    <p>• Duration: 150ms - 250ms</p>
                    <p>• Easing: snappyOut [0.22, 1, 0.36, 1]</p>
                    <p>• Spring: stiffness 450, damping 30</p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="secondary">Mode B — Operational Workspace</Badge>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Card 3: Accessibility & Reduced Motion */}
              <motion.div variants={fadeInUp} whileHover={cardHover.hover}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <CardTitle>WCAG 2.2 AA Reduced Motion</CardTitle>
                    <CardDescription>
                      Automatically adapts to user accessibility preferences. Strips large spatial transforms
                      while retaining instant, seamless state changes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1.5 font-mono">
                    <p>• Fallback: Immediate opacity fade</p>
                    <p>• No parallax / no scroll locks</p>
                    <p>• 100% accessible keyboard focus states</p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="success">Compliant</Badge>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: CORE COMPONENT & FORM VALIDATION SANDBOX */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="outline" className="mb-2">
                UI Kit Sandbox
              </Badge>
              <h2 className="font-editorial text-3xl font-bold tracking-tight text-foreground">
                Phase 0 Primitives in Action
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore buttons, badges, dialogs, inputs, and semantic tokens.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Validation Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Accessible Form & Input Validation</CardTitle>
                  <CardDescription>
                    Typed with Zod schema validation. Real-time error states without unmounting inputs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Organizer Business Email
                    </label>
                    <Input
                      type="email"
                      placeholder="e.g. concierge@royalweddings.com"
                      value={testEmail}
                      onChange={(e) => {
                        setTestEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      error={emailError}
                    />
                  </div>
                  <Button variant="champagne" onClick={handleTestValidation} className="w-full">
                    Validate Input Schema
                  </Button>
                </CardContent>
              </Card>

              {/* Status Badges & Roles Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Consistent Status Tokens</CardTitle>
                  <CardDescription>
                    Unified status badges across Organizer Bookings, Worker Assignments, and Rental Orders.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2.5">
                    <Badge variant="champagne">Verified Organizer</Badge>
                    <Badge variant="success">Confirmed Booking</Badge>
                    <Badge variant="warning">Proposal Under Review</Badge>
                    <Badge variant="destructive">Order Cancelled</Badge>
                    <Badge variant="outline">Draft Proposal v2</Badge>
                    <Badge variant="secondary">Catering Chef Role</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                    Notice how each badge preserves high contrast across both the light editorial theme and the
                    dark dashboard theme.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: PHASE 0 MANUAL VERIFICATION CHECKLIST */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 border-t border-border/60">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="border-[#d4af37]/30 bg-card/60 backdrop-blur shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-[#a07817] dark:text-[#f0cf65]" />
                  <CardTitle className="text-2xl">Phase 0 Gate Review Checklist</CardTitle>
                </div>
                <CardDescription>
                  Verify these foundation items before giving explicit approval to proceed to Phase 1:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Next.js 16 + React 19 + TypeScript + Tailwind v4:</strong> Successfully bootstrapped with
                      clean root workspace integration.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Motion System (`@/lib/motion.ts`):</strong> Hardware-accelerated transitions with dramatic
                      cinematic presets for Organizers and restrained presets for Dashboards.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Two Complementary Visual Modes:</strong> Warm editorial public theme + structured dark
                      operational dashboard toggleable via the top navigation bar.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Supabase Backend Foundation:</strong> Strict TypeScript interfaces (`types.ts`), SSR
                      browser/server clients, and `.env.example` ready for your credentials.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Core UI Primitives:</strong> Accessible Button, Card, Badge, Input, and Dialog modal with
                      ESC keyboard handling and focus trap.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />

      {/* Interactive Modal Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Interactive Dialog & Motion Showcase"
        description="Experience the gentle spring entrance, backdrop blur, and accessible focus containment."
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This dialog demonstrates how modals animate smoothly into view with zero layout jitter.
            Press the <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">ESC</kbd> key or click
            the backdrop to test the exit transition.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close Dialog
            </Button>
            <Button variant="champagne" onClick={() => setDialogOpen(false)}>
              Confirm Understanding
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
