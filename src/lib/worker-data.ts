// ============================================================================
// VELUXE EVENT MARKETPLACE - PHASE 4: WORKER ROLE DATA LAYER
// Domain models, seeded workforce profiles, job requests, and schedule state
// ============================================================================

export type WorkerCategory = "chef" | "steward" | "scenographer" | "technician" | "helper";

export interface WorkerProfile {
  id: string;
  full_name: string;
  role_title: string;
  primary_category: WorkerCategory;
  bio: string;
  years_experience: number;
  daily_base_rate: number; // Suggested base fee in INR
  currency: string;
  city: string;
  service_areas: string[];
  rating: number;
  review_count: number;
  avatar_url: string;
  phone: string;
  email: string;
  certifications: string[];
  is_verified: boolean;
  is_available: boolean;
  specialties: string[];
  portfolio: WorkerPortfolioItem[];
  reviews: WorkerReviewItem[];
}

export interface WorkerPortfolioItem {
  id: string;
  title: string;
  event_type: string;
  image_url: string;
  description: string;
}

export interface WorkerReviewItem {
  id: string;
  reviewer_name: string;
  reviewer_role: string; // e.g. "Event Organizer" or "Bride's Family"
  event_title: string;
  rating: number;
  date: string;
  comment: string;
}

export interface WorkerJobRequest {
  id: string;
  request_number: string;
  worker_id: string;
  requester_type: "customer" | "organizer";
  requester_id: string;
  requester_name: string;
  requester_phone: string;
  requester_email: string;
  event_title: string;
  event_type: string;
  event_date: string; // YYYY-MM-DD
  reporting_time: string; // e.g. "06:30 AM"
  shift_duration_hours: number;
  venue_name: string;
  venue_city: string;
  scope_of_work: string;
  proposed_fee: number; // Flat fee offered in INR
  counter_fee?: number; // Worker counter offer in INR
  worker_notes?: string;
  status: "pending" | "accepted" | "countered" | "declined" | "completed";
  created_at: string;
}

export interface WorkerAssignment {
  id: string;
  job_request_id: string;
  worker_id: string;
  requester_name: string;
  requester_type: "customer" | "organizer";
  requester_phone: string;
  event_title: string;
  event_date: string;
  reporting_time: string;
  venue_name: string;
  venue_city: string;
  agreed_fee: number;
  status: "confirmed" | "in_progress" | "completed";
  payment_status: "escrow_locked" | "settled";
  uniform_instructions?: string;
}

// ----------------------------------------------------------------------------
// SEEDED WORKERS DATASET
// ----------------------------------------------------------------------------

export const SEEDED_WORKERS_DATA: WorkerProfile[] = [
  {
    id: "wrk-001",
    full_name: "Master Chef K. Ramanathan",
    role_title: "Head Feast Culinary Director & Biryani Specialist",
    primary_category: "chef",
    bio: "Over 19 years orchestrating royal banquet menus for Chettinad, Dum Biryani, and grand Tamil Brahmins weddings across Tamil Nadu and Bangalore. Specialized in authentic firewood copper cauldron cooking.",
    years_experience: 19,
    daily_base_rate: 28000,
    currency: "INR",
    city: "Chennai",
    service_areas: ["Chennai", "Bengaluru", "Mahabalipuram", "Madurai"],
    rating: 4.98,
    review_count: 84,
    avatar_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98401 22849",
    email: "chef.ramanathan@veluxe.in",
    certifications: [
      "FSSAI Level 3 Food Safety Supervisor",
      "All India Master Culinary Guild 2024",
      "Hygiene & Temperature Audit Certified",
    ],
    is_verified: true,
    is_available: true,
    specialties: ["Authentic Dum Biryani", "Chettinad Royal Spread", "Live Appam & Seafood Counters", "7-Course Elai Sapadu"],
    portfolio: [
      {
        id: "port-1",
        title: "1,200 Guest Muhurtham Sadya Feast",
        event_type: "Traditional Muhurtham",
        image_url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
        description: "Seamless hot serving on freshly harvested plantain leaves with 24 heirloom items.",
      },
      {
        id: "port-2",
        title: "Copper Degchi Dum Biryani Counter",
        event_type: "Sangeet Night",
        image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        description: "Live woodfire Dum cauldron with fragrant Seeraga Samba and saffron rice.",
      },
    ],
    reviews: [
      {
        id: "rev-1",
        reviewer_name: "Sundaram Family",
        reviewer_role: "Host at Leela Palace",
        event_title: "Wedding Reception",
        rating: 5,
        date: "October 2026",
        comment: "Chef Ramanathan's mutton biryani and elaneer payasam were the talk of our wedding! Punctual, master of kitchen hygiene, and an absolute gentleman.",
      },
      {
        id: "rev-2",
        reviewer_name: "VKS Royal Weddings",
        reviewer_role: "Lead Event Organizer",
        event_title: "Destination Wedding ITC Grand Chola",
        rating: 5,
        date: "September 2026",
        comment: "Our most trusted culinary partner for grand events. His team of 12 assistant cooks handled 900 guests without a single delay.",
      },
    ],
  },
  {
    id: "wrk-002",
    full_name: "Suresh Varma",
    role_title: "Master Floral Scenographer & Mandap Architect",
    primary_category: "scenographer",
    bio: "Trained in traditional temple woodcarving and contemporary French floral scenography. Specializes in cantilever dome mandaps, Rajnigandha chandelier canopies, and suspended water fountains.",
    years_experience: 14,
    daily_base_rate: 35000,
    currency: "INR",
    city: "Bengaluru",
    service_areas: ["Bengaluru", "Chennai", "Mysuru", "Hyderabad"],
    rating: 4.95,
    review_count: 67,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    phone: "+91 99803 77412",
    email: "suresh.varma@veluxe.in",
    certifications: [
      "Royal Guild Floral Scenographer 2023",
      "Structural Truss & Rigging Safety Certified",
    ],
    is_verified: true,
    is_available: true,
    specialties: ["Lotus Floating Mandaps", "Tanjore Temple Pillars", "Orchid & Tuberose Canopies", "Stage Lighting Optics"],
    portfolio: [
      {
        id: "port-3",
        title: "360-Degree Floating Lotus Mandap",
        event_type: "Grand Wedding",
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        description: "Structural dome with 5,000 imported Thai white orchids and brass temple bells.",
      },
    ],
    reviews: [
      {
        id: "rev-3",
        reviewer_name: "Dr. Alok Verma",
        reviewer_role: "Father of the Bride",
        event_title: "Taj West End Wedding",
        rating: 5,
        date: "August 2026",
        comment: "Suresh transformed the lawn into an enchanted heavenly courtyard. Guests could not stop taking photographs of the mandap.",
      },
    ],
  },
  {
    id: "wrk-003",
    full_name: "Priya Nair",
    role_title: "Head of VIP Hospitality & Banquet Floor Lead",
    primary_category: "steward",
    bio: "Former luxury 5-star hotel banqueting captain. Leads groomed, uniformed hospitality teams trained in royal protocol, discrete bride assistance, welcoming rituals with scented rose mist, and VIP table concierge.",
    years_experience: 9,
    daily_base_rate: 16000,
    currency: "INR",
    city: "Chennai",
    service_areas: ["Chennai", "Bengaluru", "Coimbatore", "Kochi"],
    rating: 4.99,
    review_count: 52,
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    phone: "+91 97910 88321",
    email: "priya.nair@veluxe.in",
    certifications: [
      "Certified Hospitality Floor Captain (AHLEI)",
      "High-Net-Worth Protocol & Etiquette Certification",
    ],
    is_verified: true,
    is_available: true,
    specialties: ["Aarathi Welcome Protocols", "Bridal Personal Steward", "VIP High Table Service", "Crowd Flow Coordination"],
    portfolio: [
      {
        id: "port-4",
        title: "Bespoke Royal Welcome Ritual",
        event_type: "Palace Wedding",
        image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
        description: "Coordinated 18 uniformed hostesses in matching Kanjeevaram silk attire.",
      },
    ],
    reviews: [
      {
        id: "rev-4",
        reviewer_name: "Vikram & Ananya Sundaram",
        reviewer_role: "Host Client",
        event_title: "Sangeet & Reception",
        rating: 5,
        date: "September 2026",
        comment: "Priya ensured the bride and senior elders felt treated like royalty every minute. Flawless timing.",
      },
    ],
  },
  {
    id: "wrk-004",
    full_name: "Arvind Swamy",
    role_title: "Lead Concert Audio Engineer & Dynamic Rigging Specialist",
    primary_category: "technician",
    bio: "Acoustician and sound engineer with 12 years experience in acoustic hall calibration, line-array speaker tuning, feedback suppression, and amber beam theatrical lighting for high-profile Sangeet and live fusion concerts.",
    years_experience: 12,
    daily_base_rate: 22000,
    currency: "INR",
    city: "Hyderabad",
    service_areas: ["Hyderabad", "Chennai", "Bengaluru", "Goa"],
    rating: 4.94,
    review_count: 46,
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    phone: "+91 94441 55092",
    email: "arvind.swamy@veluxe.in",
    certifications: [
      "Dante Audio-over-IP Certified Level 3",
      "Meyer Sound System Design Specialist",
    ],
    is_verified: true,
    is_available: true,
    specialties: ["Live Fusion Band Sound Calibration", "Amber Beam Stage Lighting", "Generator Dual-Redundancy Rigging", "Wireless Mic Management"],
    portfolio: [
      {
        id: "port-5",
        title: "Outdoor Sangeet Concert Stage",
        event_type: "Sangeet Gala",
        image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        description: "Zero acoustic bleed tuning with warm golden ambient light rig.",
      },
    ],
    reviews: [
      {
        id: "rev-5",
        reviewer_name: "Pooja & Rohan Mehra",
        reviewer_role: "Couple",
        event_title: "Taj West End Sangeet",
        rating: 5,
        date: "July 2026",
        comment: "The sound was crisp and punchy without hurting elderly ears. Arvind is a true sound artist.",
      },
    ],
  },
  {
    id: "wrk-005",
    full_name: "Master Halwai Rajesh Kannan",
    role_title: "Traditional South & North Indian Sweet Artisan",
    primary_category: "chef",
    bio: "3rd generation halwai crafting live Jalebi, Badam Halwa, Mysore Pak, and saffron milk kulfi stations using 100% pure organic ghee and imported saffron threads.",
    years_experience: 16,
    daily_base_rate: 24000,
    currency: "INR",
    city: "Chennai",
    service_areas: ["Chennai", "Madurai", "Tirupati", "Bengaluru"],
    rating: 4.97,
    review_count: 59,
    avatar_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98845 11029",
    email: "rajesh.halwai@veluxe.in",
    certifications: ["Heritage Confectionery Master", "FSSAI Dairy Hygiene Certified"],
    is_verified: true,
    is_available: true,
    specialties: ["Hot Pure Ghee Jalebi with Rabri", "Live Badam Halwa Kadai", "Tender Coconut Payasam", "Motichoor Ladoo Stacks"],
    portfolio: [
      {
        id: "port-6",
        title: "Live Saffron Jalebi Tower",
        event_type: "Wedding Reception",
        image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
        description: "Live station catering to 1,500 guests with continuous crispy hot serving.",
      },
    ],
    reviews: [
      {
        id: "rev-6",
        reviewer_name: "Anand Narayanan",
        reviewer_role: "Host",
        event_title: "Daughter's Muhurtham",
        rating: 5,
        date: "September 2026",
        comment: "His Badam Halwa was divine! People queued up three times. Highly recommended.",
      },
    ],
  },
  {
    id: "wrk-006",
    full_name: "Meenakshi Sundaram",
    role_title: "Master Bridal Silk Draping & Trousseau Scenographer",
    primary_category: "helper",
    bio: "Renowned bridal silk sari draper for South Indian royal weddings, celebrity occasions, and grand receptions. Specializes in traditional Madisar draping, contemporary Kanjeevaram pleating, and veil styling.",
    years_experience: 11,
    daily_base_rate: 18000,
    currency: "INR",
    city: "Bengaluru",
    service_areas: ["Bengaluru", "Chennai", "Hyderabad", "Coimbatore"],
    rating: 5.0,
    review_count: 73,
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98450 33918",
    email: "meenakshi.draper@veluxe.in",
    certifications: ["Celebrity Bridal Stylist Guild", "Heritage Silk Preservation Specialist"],
    is_verified: true,
    is_available: true,
    specialties: ["1000-Pleat Kanjeevaram Draping", "Traditional 9-Yard Madisar", "Dupatta & Veil Pinning", "Bridesmaids Fast Trousseau Styling"],
    portfolio: [
      {
        id: "port-7",
        title: "Heritage Muhurtham Kanjeevaram Styling",
        event_type: "Bridal Styling",
        image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        description: "Immaculate knife-edge pleating built to remain pristine through 6 hours of fire rituals.",
      },
    ],
    reviews: [
      {
        id: "rev-7",
        reviewer_name: "Radhika K.",
        reviewer_role: "Bride",
        event_title: "Bangalore Palace Wedding",
        rating: 5,
        date: "October 2026",
        comment: "Meenakshi is magical! My silk sari stayed 100% perfectly in place from 5 AM Muhurtham till lunch. She is calm, fast, and extraordinarily skilled.",
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// SEEDED DIRECT JOB REQUESTS (FLAT FEE OFFERS)
// ----------------------------------------------------------------------------

export const SEEDED_WORKER_REQUESTS: WorkerJobRequest[] = [
  {
    id: "wrk-req-001",
    request_number: "WRK-2026-401",
    worker_id: "wrk-001", // Chef Ramanathan
    requester_type: "organizer",
    requester_id: "org-vks-001",
    requester_name: "VKS Royal Wedding Planners",
    requester_phone: "+91 98840 12345",
    requester_email: "operations@vksroyalweddings.in",
    event_title: "Sundaram Grand Wedding Reception Dinner",
    event_type: "Royal Wedding Reception",
    event_date: "2026-11-28",
    reporting_time: "03:00 PM",
    shift_duration_hours: 8,
    venue_name: "The Leela Palace, Grand Ballroom & Sea Lawn",
    venue_city: "Chennai",
    scope_of_work:
      "Direct supervision of 3 copper cauldron woodfire Dum Biryani stations, live Appam counter, and 8-course South Indian banquet service for 1,200 VIP guests.",
    proposed_fee: 30000,
    status: "pending",
    created_at: "2026-10-23T14:30:00Z",
  },
  {
    id: "wrk-req-002",
    request_number: "WRK-2026-402",
    worker_id: "wrk-001", // Chef Ramanathan
    requester_type: "customer",
    requester_id: "cust-102",
    requester_name: "Pooja & Rohan Mehra",
    requester_phone: "+91 98411 99002",
    requester_email: "rohan.mehra@luxurycorp.com",
    event_title: "Mehra Sangeet Gala & Gourmet Food Fair",
    event_type: "Sangeet Night",
    event_date: "2026-12-15",
    reporting_time: "04:00 PM",
    shift_duration_hours: 7,
    venue_name: "Taj West End, Prince of Wales Lawn",
    venue_city: "Bengaluru",
    scope_of_work:
      "Curate 6 regional live counters (Chettinad, Malabar, Karaikudi snacks) and supervise 8 prep cooks for 650 guests.",
    proposed_fee: 25000,
    counter_fee: 32000,
    worker_notes: "Requires dedicated prep kitchen team of 4 assistants included in revised quote.",
    status: "countered",
    created_at: "2026-10-22T10:15:00Z",
  },
  {
    id: "wrk-req-003",
    request_number: "WRK-2026-403",
    worker_id: "wrk-002", // Suresh Varma
    requester_type: "organizer",
    requester_id: "org-vks-001",
    requester_name: "VKS Royal Wedding Planners",
    requester_phone: "+91 98840 12345",
    requester_email: "operations@vksroyalweddings.in",
    event_title: "Architectural Tanjore Mandap Assembly",
    event_type: "Traditional Muhurtham",
    event_date: "2026-12-05",
    reporting_time: "05:00 AM",
    shift_duration_hours: 10,
    venue_name: "ITC Grand Chola, Rajendra Hall",
    venue_city: "Chennai",
    scope_of_work:
      "Lead 8 structural artisans in building the 4-tier Tanjore wood-dome mandap with fresh Rajnigandha garlands and crystal teardrop pendants.",
    proposed_fee: 40000,
    status: "pending",
    created_at: "2026-10-23T18:00:00Z",
  },
];

// ----------------------------------------------------------------------------
// SEEDED CONFIRMED WORKER ASSIGNMENTS
// ----------------------------------------------------------------------------

export const SEEDED_WORKER_ASSIGNMENTS: WorkerAssignment[] = [
  {
    id: "asg-001",
    job_request_id: "wrk-req-confirmed-1",
    worker_id: "wrk-001", // Chef Ramanathan
    requester_name: "Aditya & Sneha Rao",
    requester_type: "customer",
    requester_phone: "+91 98402 77112",
    event_title: "Rao Royal Muhurtham Feast",
    event_date: "2027-01-18",
    reporting_time: "05:30 AM",
    venue_name: "ITC Grand Chola, Rajendra Hall",
    venue_city: "Chennai",
    agreed_fee: 35000,
    status: "confirmed",
    payment_status: "escrow_locked",
    uniform_instructions: "Traditional crisp white chef coat with gold trim & chef toque hat. Closed-toe kitchen safety shoes.",
  },
  {
    id: "asg-002",
    job_request_id: "wrk-req-confirmed-2",
    worker_id: "wrk-001",
    requester_name: "Sunitha Narayanan",
    requester_type: "customer",
    requester_phone: "+91 98840 33214",
    event_title: "Heritage Seemantham Lunch",
    event_date: "2026-10-14",
    reporting_time: "07:00 AM",
    venue_name: "Mayor Ramanathan Chettiar Hall",
    venue_city: "Chennai",
    agreed_fee: 28000,
    status: "completed",
    payment_status: "settled",
  },
];

// ----------------------------------------------------------------------------
// WORKER BLOCKED / BOOKED DATES CALENDAR STATE
// ----------------------------------------------------------------------------

export const SEEDED_WORKER_BLOCKED_DATES: Record<string, string[]> = {
  "wrk-001": ["2027-01-18", "2026-10-14", "2026-12-25"], // Locked dates
  "wrk-002": ["2026-11-20", "2026-12-10"],
  "wrk-003": ["2026-11-28", "2026-12-15"],
  "wrk-004": ["2026-12-05"],
};

// ----------------------------------------------------------------------------
// INTERACTIVE HELPER FUNCTIONS FOR DEMO AND INTEGRATION
// ----------------------------------------------------------------------------

export function getWorkerById(workerId: string): WorkerProfile | undefined {
  return SEEDED_WORKERS_DATA.find((w) => w.id === workerId);
}

export function getWorkerJobRequests(workerId: string): WorkerJobRequest[] {
  return SEEDED_WORKER_REQUESTS.filter((r) => r.worker_id === workerId);
}

export function getWorkerAssignments(workerId: string): WorkerAssignment[] {
  return SEEDED_WORKER_ASSIGNMENTS.filter((a) => a.worker_id === workerId);
}

export function acceptWorkerJobRequest(requestId: string): { request: WorkerJobRequest; assignment: WorkerAssignment } {
  const reqIndex = SEEDED_WORKER_REQUESTS.findIndex((r) => r.id === requestId);
  if (reqIndex === -1) throw new Error("Request not found");

  const req = SEEDED_WORKER_REQUESTS[reqIndex];
  req.status = "accepted";

  const agreedFee = req.counter_fee || req.proposed_fee;

  const newAssignment: WorkerAssignment = {
    id: `asg-${Date.now()}`,
    job_request_id: req.id,
    worker_id: req.worker_id,
    requester_name: req.requester_name,
    requester_type: req.requester_type,
    requester_phone: req.requester_phone,
    event_title: req.event_title,
    event_date: req.event_date,
    reporting_time: req.reporting_time,
    venue_name: req.venue_name,
    venue_city: req.venue_city,
    agreed_fee: agreedFee,
    status: "confirmed",
    payment_status: "escrow_locked",
    uniform_instructions: "Official Veluxe verified catering / technician badge, clean black trousers & formal collared attire.",
  };

  SEEDED_WORKER_ASSIGNMENTS.unshift(newAssignment);

  // Lock date on worker's calendar to prevent collision
  if (!SEEDED_WORKER_BLOCKED_DATES[req.worker_id]) {
    SEEDED_WORKER_BLOCKED_DATES[req.worker_id] = [];
  }
  if (!SEEDED_WORKER_BLOCKED_DATES[req.worker_id].includes(req.event_date)) {
    SEEDED_WORKER_BLOCKED_DATES[req.worker_id].push(req.event_date);
  }

  return { request: req, assignment: newAssignment };
}

export function counterWorkerJobRequest(requestId: string, counterFee: number, notes: string): WorkerJobRequest {
  const req = SEEDED_WORKER_REQUESTS.find((r) => r.id === requestId);
  if (!req) throw new Error("Request not found");

  req.status = "countered";
  req.counter_fee = counterFee;
  req.worker_notes = notes;
  return req;
}

export function declineWorkerJobRequest(requestId: string, reason?: string): WorkerJobRequest {
  const req = SEEDED_WORKER_REQUESTS.find((r) => r.id === requestId);
  if (!req) throw new Error("Request not found");

  req.status = "declined";
  req.worker_notes = reason;
  return req;
}

export function isWorkerDateBlocked(workerId: string, dateStr: string): boolean {
  return SEEDED_WORKER_BLOCKED_DATES[workerId]?.includes(dateStr) ?? false;
}

export function toggleWorkerDateAvailability(workerId: string, dateStr: string): boolean {
  if (!SEEDED_WORKER_BLOCKED_DATES[workerId]) {
    SEEDED_WORKER_BLOCKED_DATES[workerId] = [];
  }
  const dates = SEEDED_WORKER_BLOCKED_DATES[workerId];
  const index = dates.indexOf(dateStr);
  if (index > -1) {
    dates.splice(index, 1);
    return true; // Now available
  } else {
    dates.push(dateStr);
    return false; // Now blocked
  }
}

export function createWorkerJobRequest(data: Omit<WorkerJobRequest, "id" | "request_number" | "status" | "created_at">): WorkerJobRequest {
  const newReq: WorkerJobRequest = {
    ...data,
    id: `wrk-req-${Date.now()}`,
    request_number: `WRK-2026-${Math.floor(100 + Math.random() * 900)}`,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  SEEDED_WORKER_REQUESTS.unshift(newReq);
  return newReq;
}
