"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll } from "motion/react";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Star,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Award,
  Crown,
  Calendar,
  Clock,
  Briefcase,
  X,
  FileSignature,
  Check,
  Building2,
  DollarSign,
  UserCheck,
  Grid3X3,
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Heart,
  Eye,
  Utensils,
  Layers,
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Send,
  Link2,
  Tag,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { formatINR } from "@/lib/format";
import {
  getWorkerById,
  SEEDED_WORKERS_DATA,
  WorkerProfile,
  createWorkerJobRequest,
} from "@/lib/worker-data";

export function PublicWorkerView({ id }: { id: string }) {
  const worker = getWorkerById(id) || SEEDED_WORKERS_DATA[0];

  // Active Tab: "posts" | "specialties" | "reviews" | "tagged"
  const [activeTab, setActiveTab] = React.useState<"posts" | "specialties" | "reviews" | "tagged">("posts");

  // Post detail lightbox modal state
  const [selectedPost, setSelectedPost] = React.useState<{
    id: string;
    title: string;
    image_url: string;
    event_type: string;
    description: string;
    likes: number;
    commentsCount: number;
    date: string;
    hasMultiple?: boolean;
    isVideo?: boolean;
  } | null>(null);

  // Story Highlight viewer modal state
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);
  const [storyProgress, setStoryProgress] = React.useState(0);
  const [isStoryPaused, setIsStoryPaused] = React.useState(false);

  // Liked posts & bookmarked posts toggle state
  const [likedPosts, setLikedPosts] = React.useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = React.useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = React.useState("");
  const [postComments, setPostComments] = React.useState<
    Record<string, Array<{ user: string; text: string; time: string }>>
  >({
    "post-0": [
      {
        user: "priya.weddings",
        text: "The Sadya feast for 1,200 guests was executed without a single hitch. Guests are still raving about the Ada Pradhaman! 🌿✨",
        time: "2d",
      },
      {
        user: "suresh.events",
        text: "Impeccable timing and the authentic banana leaf layout was truly royal.",
        time: "1d",
      },
    ],
    "post-1": [
      {
        user: "vikram.sundaram",
        text: "The woodfire Seeraga Samba aroma filled the entire banquet hall. Best biryani in South India!",
        time: "3d",
      },
      {
        user: "ananya.sharma",
        text: "Masterful balance of spices. Everyone asked for chef's contact!",
        time: "2d",
      },
    ],
  });

  // Direct Booking Modal State
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventType, setEventType] = React.useState("Grand Wedding Reception");
  const [eventDate, setEventDate] = React.useState("2026-12-10");
  const [reportingTime, setReportingTime] = React.useState("07:00 AM");
  const [shiftHours, setShiftHours] = React.useState("8");
  const [venueName, setVenueName] = React.useState("The Leela Palace");
  const [venueCity, setVenueCity] = React.useState(worker.city);
  const [scopeOfWork, setScopeOfWork] = React.useState(
    "Supervise authentic South Indian banquet cooking for 800 guests, live counter setups, and kitchen hygiene audit."
  );
  const [proposedFee, setProposedFee] = React.useState(worker.daily_base_rate.toString());
  const [requesterName, setRequesterName] = React.useState("Vikram Sundaram");
  const [requesterPhone, setRequesterPhone] = React.useState("+91 99402 88123");
  const [submittedRef, setSubmittedRef] = React.useState<string | null>(null);

  // Scroll detection for upper bar reveal
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 80);
    }
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 80);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Story highlights mock items
  const highlights = [
    {
      title: "Dum Biryani",
      icon: "🍲",
      img: worker.portfolio[1]?.image_url || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      caption: "Supervising 25kg brass cauldron dum biryani at The Leela Palace for 1,200 VIP guests.",
      tag: "Live Cauldron",
    },
    {
      title: "Sadya Feast",
      icon: "🌿",
      img: worker.portfolio[0]?.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      caption: "Heirloom 24-course Kerala & Tamil Brahmin Sadya served on fresh plantain leaves.",
      tag: "Traditional Muhurtham",
    },
    {
      title: "Royal Leela",
      icon: "👑",
      img: worker.avatar_url,
      caption: "Head Feast Culinary Director briefing 18 banquet sous chefs prior to wedding gala launch.",
      tag: "Banquet Leadership",
    },
    {
      title: "FSSAI Safety",
      icon: "🎖️",
      img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
      caption: "Zero-tolerance temperature audit & kitchen sterile inspection certification.",
      tag: "Safety First",
    },
    {
      title: "Woodfire",
      icon: "🔥",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      caption: "Woodfire slow-roasting heirloom spices for maximum aromatic richness.",
      tag: "Culinary Technique",
    },
    {
      title: "Reviews",
      icon: "⭐",
      img: worker.avatar_url,
      caption: "Over 84 five-star verified client endorsements across Tamil Nadu and Karnataka.",
      tag: "Client Endorsements",
    },
  ];

  // Story progress timer effect
  React.useEffect(() => {
    if (activeStoryIndex === null || isStoryPaused) return;

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story or close
          if (activeStoryIndex < highlights.length - 1) {
            setActiveStoryIndex((idx) => (idx !== null ? idx + 1 : null));
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2.5; // ~4 seconds per story
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, isStoryPaused, highlights.length]);

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
    setIsStoryPaused(false);
  };

  const handleNextStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < highlights.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setStoryProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
    } else {
      setStoryProgress(0);
    }
  };

  // Extended Instagram posts grid
  const postsGrid = [
    {
      id: "post-0",
      title: worker.portfolio[0]?.title || "1,200 Guest Muhurtham Sadya Feast",
      event_type: worker.portfolio[0]?.event_type || "Traditional Muhurtham",
      image_url: worker.portfolio[0]?.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      description: worker.portfolio[0]?.description || "Seamless hot serving on freshly harvested plantain leaves with 24 heirloom items.",
      likes: 184,
      commentsCount: 22,
      date: "3 DAYS AGO",
      hasMultiple: true,
    },
    {
      id: "post-1",
      title: worker.portfolio[1]?.title || "Royal Chettinad Dum Biryani Live Degchi",
      event_type: worker.portfolio[1]?.event_type || "Sangeet Gala",
      image_url: worker.portfolio[1]?.image_url || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      description: worker.portfolio[1]?.description || "Woodfire-cooked Seeraga Samba mutton biryani sealed with wheat dough dam for royal aroma.",
      likes: 247,
      commentsCount: 38,
      date: "1 WEEK AGO",
      hasMultiple: false,
    },
    {
      id: "post-2",
      title: "Woodfire Seeraga Samba Cauldron",
      event_type: "Royal Sangeet",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      description: "Direct supervision of 25kg brass degchi cauldron for 800 guests at The Leela Palace.",
      likes: 139,
      commentsCount: 14,
      date: "2 WEEKS AGO",
      hasMultiple: true,
    },
    {
      id: "post-3",
      title: "Live Saffron Elaneer Payasam Counter",
      event_type: "Muhurtham Lunch",
      image_url: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80",
      description: "Chilled tender coconut cream garnished with roasted cashews, golden raisins and Kashmiri saffron.",
      likes: 195,
      commentsCount: 27,
      date: "OCTOBER 12",
      hasMultiple: false,
    },
    {
      id: "post-4",
      title: "Silver Thali VIP Banquet Spread",
      event_type: "Reception Dinner",
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      description: "Curated 14-course regional banquet served on hand-embossed silver platters for high dignitaries.",
      likes: 312,
      commentsCount: 41,
      date: "SEPTEMBER 28",
      hasMultiple: true,
    },
    {
      id: "post-5",
      title: "Master Chef Plating & Hygiene Audit",
      event_type: "Pre-Event Inspection",
      image_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
      description: "Rigorous temperature verification and sterile serving standards compliance before banquet hall doors open.",
      likes: 168,
      commentsCount: 19,
      date: "SEPTEMBER 15",
      isVideo: true,
    },
  ];

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleToggleSave = (postId: string) => {
    setSavedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    const existing = postComments[postId] || [];
    setPostComments({
      ...postComments,
      [postId]: [
        ...existing,
        {
          user: "vikram.sundaram",
          text: newCommentText.trim(),
          time: "Just now",
        },
      ],
    });
    setNewCommentText("");
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = parseInt(proposedFee.replace(/[^0-9]/g, ""), 10) || worker.daily_base_rate;

    const newReq = createWorkerJobRequest({
      worker_id: worker.id,
      requester_type: "customer",
      requester_id: "cust-101",
      requester_name: requesterName,
      requester_phone: requesterPhone,
      requester_email: "vikram.sundaram@gmail.com",
      event_title: eventTitle || `${worker.role_title} for ${eventType}`,
      event_type: eventType,
      event_date: eventDate,
      reporting_time: reportingTime,
      shift_duration_hours: parseInt(shiftHours, 10) || 8,
      venue_name: venueName,
      venue_city: venueCity,
      scope_of_work: scopeOfWork,
      proposed_fee: fee,
    });

    setSubmittedRef(newReq.request_number);
  };

  return (
    <div className="relative min-h-screen text-foreground selection:bg-amber-500/20 selection:text-amber-500">
      {/* ========================================================
          1. STICKY SCROLL-REVEALED INSTAGRAM HEADER
      ======================================================== */}
      <AnimatePresence>
        {isScrolled && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md shadow-xs"
          >
            <div className="max-w-[935px] mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenStory(0)}
                  className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-[#d4af37] to-amber-200 cursor-pointer"
                  title="View story"
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden border border-background">
                    <Image src={worker.avatar_url} alt={worker.full_name} fill className="object-cover" />
                  </div>
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-foreground">
                    {worker.email.split("@")[0]}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  size="sm"
                  onClick={() => {
                    setSubmittedRef(null);
                    setBookingOpen(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-8 px-3.5 shadow-xs"
                >
                  Hire for Event
                </Button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ========================================================
          2. MAIN INSTAGRAM PROFILE PAGE CONTAINER
      ======================================================== */}
      <main className="max-w-[935px] mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-6 sm:space-y-8">
        {/* Top Control Bar: Directory Breadcrumb, 4-Way Switcher & Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <Link
            href="/marketplace?tab=workers"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Marketplace Staff Directory</span>
          </Link>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* 4-Way Universal Role Switcher Pill */}
            <div className="flex items-center bg-[#240e05]/85 border border-amber-500/25 rounded-full p-1 text-xs">
              <Link href="/customer/dashboard" className="px-2.5 py-0.5 rounded-full text-amber-200/70 hover:text-white">
                Customer
              </Link>
              <Link href="/organizer/dashboard" className="px-2.5 py-0.5 rounded-full text-amber-200/70 hover:text-white">
                Organizer
              </Link>
              <Link href="/worker/dashboard" className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold">
                Worker
              </Link>
              <Link href="/admin/dashboard" className="px-2.5 py-0.5 rounded-full text-amber-200/70 hover:text-white">
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================
            INSTAGRAM PROFILE HEADER BLOCK
        ======================================================== */}
        <div className="bg-[#1c0c05]/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-amber-500/20 p-5 sm:p-9 shadow-[0_8px_32px_0_rgba(18,7,2,0.45)]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-12">
            {/* Avatar with Animated Gold Story Ring */}
            <div className="shrink-0 flex flex-col items-center">
              <button
                onClick={() => handleOpenStory(0)}
                className="relative group p-1 rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-hidden"
                title="Tap to view active story"
              >
                {/* Instagram Gradient Ring */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-[3.5px] bg-gradient-to-tr from-amber-500 via-[#d4af37] to-amber-200 shadow-lg">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-background bg-card">
                    <Image
                      src={worker.avatar_url}
                      alt={worker.full_name}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                </div>

                {/* Verified Shield Badge on Avatar */}
                <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg border-2 border-background">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </button>
              <span className="text-[10px] text-amber-500/90 font-medium mt-2 block sm:hidden">
                Tap to watch story
              </span>
            </div>

            {/* Profile Info & Stats */}
            <div className="flex-1 space-y-4 text-center sm:text-left min-w-0">
              {/* Row 1: Username & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {worker.email.split("@")[0]}
                  </h1>
                  <span title="Veluxe Verified Professional">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-500/20 shrink-0" />
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  {/* Primary CTA: Hire for Event (Like Instagram's Follow button) */}
                  <Button
                    size="sm"
                    onClick={() => {
                      setSubmittedRef(null);
                      setBookingOpen(true);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 h-8 shadow-xs rounded-lg transition-transform active:scale-95"
                  >
                    Hire for Event
                  </Button>

                  {/* Secondary CTA: Inquiry / Message */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmittedRef(null);
                      setBookingOpen(true);
                    }}
                    className="text-xs font-semibold h-8 px-3.5 rounded-lg border-border hover:bg-muted/60"
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1 text-amber-500" />
                    <span>Inquiry</span>
                  </Button>

                  {/* Call worker button */}
                  <a href={`tel:${worker.phone}`} title={`Call ${worker.full_name}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-border hover:bg-muted/60"
                    >
                      <Phone className="w-3.5 h-3.5 text-foreground" />
                    </Button>
                  </a>

                  {/* Share button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-border hover:bg-muted/60"
                    title="Share Profile"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Profile link copied to clipboard!");
                      }
                    }}
                  >
                    <Share2 className="w-3.5 h-3.5 text-foreground" />
                  </Button>

                  {/* More options button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                    title="More Options"
                    onClick={() => {
                      alert(`Worker ID: ${worker.id}\nVerification: Audited FSSAI\nBase Rate: ₹${worker.daily_base_rate.toLocaleString("en-IN")}/day`);
                    }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Row 2: Instagram Stats Row (Posts, Reviews, Rating, Legacy) */}
              <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 text-sm pt-0.5">
                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab("posts")}>
                  <span className="font-bold text-foreground">{postsGrid.length}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">posts</span>
                </div>

                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab("reviews")}>
                  <span className="font-bold text-foreground">{worker.review_count}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">reviews</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-500">{worker.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-muted-foreground text-xs sm:text-sm">rating</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground">{worker.years_experience}+</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">yrs legacy</span>
                </div>
              </div>

              {/* Row 3: Instagram Bio Block */}
              <div className="space-y-1.5 text-xs text-foreground/90 leading-relaxed pt-1">
                <div className="font-bold text-sm text-foreground">
                  {worker.full_name}
                </div>
                <div className="text-muted-foreground font-medium text-xs">
                  {worker.role_title}
                </div>

                <div className="space-y-0.5 pt-1 text-foreground/80">
                  <p>👨‍🍳 Heirloom royal banquet orchestrator for Chettinad, Dum Biryani & Grand Weddings</p>
                  <p>🔥 Authentic firewood copper cauldron dum cooking (up to 5,000 guests)</p>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-muted-foreground pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{worker.city} • Serving {worker.service_areas.join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 pt-0.5 font-semibold text-foreground">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Base Day Rate: {formatINR(worker.daily_base_rate)}/day (Flat fee negotiable)</span>
                  </div>
                </div>

                {/* Profile Link (Like Instagram bio link) */}
                <div className="pt-1.5 flex items-center justify-center sm:justify-start gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <Link2 className="w-3.5 h-3.5" />
                  <a
                    href={`/workers/${worker.id}`}
                    className="hover:underline truncate max-w-xs"
                  >
                    veluxe.vip/workers/{worker.id}
                  </a>
                </div>

                {/* Audited Certification Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
                  {worker.certifications.map((c) => (
                    <Badge
                      key={c}
                      variant="outline"
                      className="text-[10px] bg-muted/40 border-border text-foreground font-medium py-0.5 px-2"
                    >
                      <Award className="w-3 h-3 text-amber-500 mr-1 inline" /> {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              INSTAGRAM STORY HIGHLIGHTS CAROUSEL
          ======================================================== */}
          <div className="mt-8 pt-6 border-t border-border/70">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  onClick={() => handleOpenStory(i)}
                  className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] border border-border group-hover:border-amber-500/80 transition-colors">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-card border border-border/80 flex items-center justify-center">
                      <Image
                        src={h.img}
                        alt={h.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center text-sm">
                        {h.icon}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-foreground tracking-tight truncate max-w-[72px]">
                    {h.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            INSTAGRAM 4-TAB NAVIGATION BAR
        ======================================================== */}
        <div className="border-t border-border/80">
          <div className="flex items-center justify-center gap-6 sm:gap-14 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-3.5 flex items-center gap-1.5 border-t-2 -mt-px transition-all cursor-pointer ${
                activeTab === "posts"
                  ? "border-amber-500 text-amber-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Posts ({postsGrid.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("specialties")}
              className={`py-3.5 flex items-center gap-1.5 border-t-2 -mt-px transition-all cursor-pointer ${
                activeTab === "specialties"
                  ? "border-amber-500 text-amber-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Specialties ({worker.specialties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3.5 flex items-center gap-1.5 border-t-2 -mt-px transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "border-amber-500 text-amber-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reviews ({worker.reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("tagged")}
              className={`py-3.5 flex items-center gap-1.5 border-t-2 -mt-px transition-all cursor-pointer ${
                activeTab === "tagged"
                  ? "border-amber-500 text-amber-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Audit & Tagged ({worker.certifications.length})</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: INSTAGRAM 3-COLUMN SQUARE POSTS GRID
        ======================================================== */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-1 sm:gap-5">
            {postsGrid.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="relative aspect-square rounded-sm sm:rounded-xl overflow-hidden bg-card border border-border group cursor-pointer"
              >
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top-Right Multi-Photo / Video Reel Indicator */}
                <div className="absolute top-2 right-2 z-10 text-white drop-shadow-md">
                  {post.hasMultiple && (
                    <Layers className="w-4 h-4 fill-black/40 text-white" />
                  )}
                  {post.isVideo && (
                    <Play className="w-4 h-4 fill-white text-white" />
                  )}
                </div>

                {/* Instagram Hover Stats Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-white text-center">
                  <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] mb-2 border-none">
                    {post.event_type}
                  </Badge>
                  <h4 className="font-bold text-xs sm:text-sm line-clamp-2 max-w-[85%]">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-3 text-xs text-white font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white text-white" />
                      {likedPosts[post.id] ? post.likes + 1 : post.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 fill-white text-white" />
                      {(postComments[post.id] || []).length + post.commentsCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================
            TAB 2: SPECIALTIES (INSTAGRAM GUIDES FORMAT)
        ======================================================== */}
        {activeTab === "specialties" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {worker.specialties.map((spec, i) => (
              <Card key={spec} className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-mono text-sm font-bold shrink-0">
                    0{i + 1}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-editorial text-lg font-bold text-foreground">
                      {spec}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Crafted using heirloom Chettinad & Tamil royal banquet recipes, copper cauldrons, and certified culinary hygiene workflows.
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                        Audited for 2,000+ Guests
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEventTitle(`${spec} Service`);
                          setScopeOfWork(`Requesting master supervision for: ${spec}.`);
                          setBookingOpen(true);
                        }}
                        className="text-[11px] h-6 px-2 text-amber-400 hover:text-amber-300"
                      >
                        Book this specialty →
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ========================================================
            TAB 3: REVIEWS (INSTAGRAM TESTIMONIALS FORMAT)
        ======================================================== */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {worker.reviews.map((rev) => (
              <Card key={rev.id} className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <span>{rev.reviewer_name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                    </h4>
                    <span className="text-xs text-muted-foreground">{rev.reviewer_role} • {rev.event_title}</span>
                  </div>
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 inline" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed pt-3">
                  "{rev.comment}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 pt-2">
                  <span>Verified Wedding / Banquet Booking</span>
                  <span>{rev.date}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ========================================================
            TAB 4: AUDIT & TAGGED CERTIFICATIONS
        ======================================================== */}
        {activeTab === "tagged" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {worker.certifications.map((cert, i) => (
              <Card key={cert} className="border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(18,7,2,0.45)] p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{cert}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Verified through Veluxe workforce background vetting and physical culinary credential audit.
                  </p>
                </div>
                <Badge variant="outline" className="border-amber-500/40 text-amber-500 text-[10px]">
                  Verified Credential
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* ========================================================
          3. INSTAGRAM POST LIGHTBOX MODAL (TRUE DESKTOP IG UX)
      ======================================================== */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        {selectedPost && (
          <div className="p-0 overflow-hidden rounded-2xl bg-card max-w-4xl w-full border border-border shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
              {/* Left Column: High-Res Square Image */}
              <div className="md:col-span-7 relative h-80 sm:h-auto min-h-[380px] bg-black flex items-center justify-center">
                <Image
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-bold text-xs shadow-md border-none">
                  {selectedPost.event_type}
                </Badge>
              </div>

              {/* Right Column: Instagram Comment Stream & Actions */}
              <div className="md:col-span-5 flex flex-col justify-between bg-card divide-y divide-border">
                {/* Header: Worker Handle & Location */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden relative border border-amber-500/50 shrink-0">
                      <Image src={worker.avatar_url} alt={worker.full_name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-foreground block">
                          {worker.email.split("@")[0]}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                      </div>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-amber-500" />
                        The Leela Palace • {worker.city}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedPost(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Middle: Scrollable Caption & Comments Stream */}
                <div className="p-4 space-y-4 max-h-72 overflow-y-auto text-xs leading-relaxed">
                  {/* Original Caption */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full overflow-hidden relative border border-amber-500/30 shrink-0 mt-0.5">
                      <Image src={worker.avatar_url} alt={worker.full_name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-foreground">
                        <span className="font-bold mr-1.5">{worker.email.split("@")[0]}</span>
                        {selectedPost.description}
                      </p>
                      <div className="text-[10px] text-amber-500 font-semibold mt-1">
                        #{selectedPost.event_type.replace(/\s+/g, "")} #VeluxeWorkforce #ChefMastery #BanquetLuxury
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {selectedPost.date}
                      </span>
                    </div>
                  </div>

                  {/* Comments from verified clients */}
                  {(postComments[selectedPost.id] || []).map((cmt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center font-bold text-[10px] text-foreground shrink-0 mt-0.5">
                        {cmt.user.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground">
                          <span className="font-bold mr-1.5">{cmt.user}</span>
                          {cmt.text}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                          <span>{cmt.time}</span>
                          <button className="hover:text-foreground font-semibold">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom: Instagram Engagement Icons & Direct Hire CTA */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleLike(selectedPost.id)}
                        className="text-foreground hover:text-rose-500 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            likedPosts[selectedPost.id] ? "fill-rose-500 text-rose-500" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          const input = document.getElementById("ig-comment-input");
                          input?.focus();
                        }}
                        className="text-foreground hover:text-amber-500 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Post URL copied to clipboard!");
                          }
                        }}
                        className="text-foreground hover:text-amber-500 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleSave(selectedPost.id)}
                      className="text-foreground hover:text-amber-500 transition-colors"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          savedPosts[selectedPost.id] ? "fill-amber-500 text-amber-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="text-xs">
                    <span className="font-bold text-foreground">
                      {(likedPosts[selectedPost.id] ? selectedPost.likes + 1 : selectedPost.likes).toLocaleString()} likes
                    </span>
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wide mt-0.5">
                      {selectedPost.date}
                    </span>
                  </div>

                  {/* Hire for this Event Scope Button */}
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedPost(null);
                      setEventTitle(`${selectedPost.event_type} — ${selectedPost.title}`);
                      setScopeOfWork(selectedPost.description);
                      setSubmittedRef(null);
                      setBookingOpen(true);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-9 shadow-xs"
                  >
                    Hire for this Event Scope
                  </Button>

                  {/* Simulated Instagram Comment Input */}
                  <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
                    <input
                      id="ig-comment-input"
                      type="text"
                      placeholder="Add a comment..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddComment(selectedPost.id);
                      }}
                      className="w-full glass-field rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-amber-200/40"
                    />
                    {newCommentText.trim() && (
                      <button
                        onClick={() => handleAddComment(selectedPost.id)}
                        className="text-xs font-bold text-amber-500 hover:text-amber-400 shrink-0"
                      >
                        Post
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* ========================================================
          4. INSTAGRAM STORY VIEWER MODAL
      ======================================================== */}
      <Dialog
        open={activeStoryIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveStoryIndex(null);
        }}
      >
        {activeStoryIndex !== null && (
          <div className="p-0 overflow-hidden rounded-2xl bg-black max-w-[380px] w-full mx-auto relative text-white shadow-2xl border border-white/10">
            {/* Top Multi-Segment Progress Bars */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {highlights.map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width:
                        i < activeStoryIndex
                          ? "100%"
                          : i === activeStoryIndex
                          ? `${storyProgress}%`
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/40">
                  <Image src={worker.avatar_url} alt={worker.full_name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-xs drop-shadow-md">
                    <span>{worker.email.split("@")[0]}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                    <span className="text-white/60 font-normal text-[10px] ml-1">2h</span>
                  </div>
                  <span className="text-[10px] text-white/80 block drop-shadow-md">
                    {highlights[activeStoryIndex].tag}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStoryPaused((prev) => !prev)}
                  className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                  title={isStoryPaused ? "Resume" : "Pause"}
                >
                  {isStoryPaused ? <Play className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setActiveStoryIndex(null)}
                  className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Story Media (Vertical Visual) */}
            <div className="relative w-full h-[540px] bg-neutral-900">
              <Image
                src={highlights[activeStoryIndex].img}
                alt={highlights[activeStoryIndex].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50" />

              {/* Story Content & Caption */}
              <div className="absolute bottom-20 left-4 right-4 z-20 space-y-2">
                <Badge className="bg-amber-500 text-slate-950 font-bold text-xs">
                  {highlights[activeStoryIndex].title}
                </Badge>
                <p className="text-sm font-medium text-white drop-shadow-md leading-relaxed">
                  {highlights[activeStoryIndex].caption}
                </p>
              </div>

              {/* Tap Left / Tap Right Navigation Zones */}
              <div
                onClick={handlePrevStory}
                className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
                title="Previous"
              />
              <div
                onClick={handleNextStory}
                className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
                title="Next"
              />
            </div>

            {/* Bottom Action Bar: Quick Message & Hire Button */}
            <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center gap-2">
              <div className="flex-1 bg-white/20 backdrop-blur-md rounded-full px-3.5 py-2 text-xs text-white/90 border border-white/20 truncate">
                Reply to {worker.email.split("@")[0]}...
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setActiveStoryIndex(null);
                  setEventTitle(`${highlights[activeStoryIndex].title} Service`);
                  setScopeOfWork(highlights[activeStoryIndex].caption);
                  setSubmittedRef(null);
                  setBookingOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-full px-4 h-8 shrink-0"
              >
                Hire for Event
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* ========================================================
          5. DIRECT SHIFT BOOKING MODAL (PRESERVED STATE LOGIC)
      ======================================================== */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto max-w-2xl">
          {submittedRef ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-foreground">
                Job Request Dispatched!
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your direct shift proposal <span className="font-mono font-bold text-amber-500">{submittedRef}</span> has been sent to {worker.full_name}.
                You will be notified once the worker confirms or proposes a counter-fee.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link href="/worker/dashboard">
                  <Button variant="champagne" size="sm" className="font-semibold text-xs">
                    View in Worker Portal (Demo)
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setBookingOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="space-y-5">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-foreground">
                  Hire {worker.full_name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Submit your celebration requirements and propose a flat-fee compensation in INR.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-amber-200 block mb-1">
                    Your Name / Organizing Entity *
                  </label>
                  <Input
                    required
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="glass-field text-foreground"
                  />
                </div>

                <div>
                  <label className="font-semibold text-amber-200 block mb-1">
                    Emergency Contact Number *
                  </label>
                  <Input
                    required
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    className="glass-field text-foreground"
                  />
                </div>

                <div>
                  <label className="font-semibold text-amber-200 block mb-1">
                    Celebration Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full rounded-xl glass-field px-3 py-2.5 text-xs text-foreground cursor-pointer"
                  >
                    <option>Grand Wedding Reception</option>
                    <option>Traditional Muhurtham</option>
                    <option>Sangeet & Cocktail Gala</option>
                    <option>Pre-Wedding Puja & Sadya</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-amber-200 block mb-1">
                    Event Date *
                  </label>
                  <Input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="glass-field text-foreground"
                  />
                </div>

                <div>
                  <label className="font-semibold text-amber-200 block mb-1">
                    Reporting Time
                  </label>
                  <Input
                    value={reportingTime}
                    onChange={(e) => setReportingTime(e.target.value)}
                    placeholder="e.g. 06:30 AM"
                    className="glass-field text-foreground"
                  />
                </div>

                <div>
                  <label className="font-semibold text-amber-200 block mb-1">
                    Shift Duration (Hours)
                  </label>
                  <select
                    value={shiftHours}
                    onChange={(e) => setShiftHours(e.target.value)}
                    className="w-full rounded-xl glass-field px-3 py-2.5 text-xs text-foreground cursor-pointer"
                  >
                    <option value="4">Half-Day (4 Hours)</option>
                    <option value="8">Full-Day (8 Hours)</option>
                    <option value="12">Extended Day (12 Hours)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-amber-200 block mb-1">
                    Venue Name
                  </label>
                  <Input
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="glass-field text-foreground"
                  />
                </div>

                <div>
                  <label className="font-semibold text-amber-200 block mb-1">
                    Venue City
                  </label>
                  <Input
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    className="glass-field text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-amber-200 block mb-1 text-xs">
                  Scope of Duties & Special Directives
                </label>
                <textarea
                  value={scopeOfWork}
                  onChange={(e) => setScopeOfWork(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl glass-field p-3 text-xs text-foreground placeholder:text-amber-200/40"
                  placeholder="Detail menu items, dress code, crew size to coordinate..."
                />
              </div>

              <div>
                <label className="font-semibold text-amber-200 block mb-1 text-xs">
                  Proposed Flat-Fee Compensation (₹ INR) *
                </label>
                <Input
                  type="number"
                  required
                  value={proposedFee}
                  onChange={(e) => setProposedFee(e.target.value)}
                  className="glass-field text-foreground font-bold text-base"
                />
                <span className="text-[11px] text-amber-200/60 mt-1 block">
                  Suggested base rate is {formatINR(worker.daily_base_rate)}/day. Worker may accept or propose a counter-fee.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBookingOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Submit Flat-Fee Offer
                </Button>
              </div>
            </form>
          )}
        </div>
      </Dialog>
    </div>
  );
}
