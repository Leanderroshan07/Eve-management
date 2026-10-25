import {
  SEEDED_ORGANIZER,
  SEEDED_PACKAGES,
  SEEDED_INQUIRIES,
  SEEDED_PROPOSALS,
  SEEDED_BOOKINGS,
  SEEDED_MESSAGES,
  OrganizerBusiness,
  OrganizerPackage,
  CustomerInquiry,
  Proposal,
  ConfirmedBooking,
  ChatMessage,
} from "./organizer-data";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar_url: string;
}

export interface WorkerPreviewItem {
  id: string;
  name: string;
  role: string;
  specialty: string;
  daily_rate: number;
  experience_years: number;
  rating: number;
  review_count: number;
  city: string;
  avatar_url: string;
  is_available: boolean;
}

export interface RentalPreviewItem {
  id: string;
  name: string;
  category: "furniture" | "decor" | "audiovisual" | "catering_vessels";
  category_label: string;
  daily_rate: number;
  available_quantity: number;
  minimum_rental_days: number;
  image_url: string;
  provider_name: string;
  city: string;
}

// Current logged in customer fixture for Phase 2
export const CURRENT_CUSTOMER: CustomerProfile = {
  id: "cust-101",
  name: "Vikram & Ananya Sundaram",
  email: "vikram.sundaram@gmail.com",
  phone: "+91 99402 88123",
  city: "Chennai & Bengaluru",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

// Additional Organizers for Marketplace Discovery
export const MARKETPLACE_ORGANIZERS: OrganizerBusiness[] = [
  SEEDED_ORGANIZER,
  {
    id: "org-zahra-002",
    slug: "zahra-palace-weddings",
    name: "Zahra Luxury Palace Weddings",
    tagline: "Destination Regal Celebrations across Rajasthan & Udaipur Palaces",
    description:
      "Specialists in multi-day destination weddings, royal lake palace scenography, elephant and vintage carriage processions, and royal Rajasthani banquet styling.",
    city: "Udaipur",
    service_areas: ["Udaipur", "Jaipur", "Jodhpur", "Goa"],
    founded_year: 2015,
    events_completed: 310,
    rating: 4.94,
    review_count: 98,
    logo_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=180&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    contact_email: "concierge@zahrapalaceweddings.com",
    contact_phone: "+91 98290 11223",
    socials: {
      instagram: "@zahrapalaceweddings",
      website: "https://www.zahrapalaceweddings.in",
    },
  },
  {
    id: "org-mayura-003",
    slug: "mayura-heritage-events",
    name: "Mayura Heritage Decor & Muhurtham",
    tagline: "Sacred Temple Sanctums, Traditional Carnatic Staging & Fragrant Florals",
    description:
      "Dedicated to authentic South Indian ceremonies with antique brass diyas, sacred temple sanctum pillars, certified priest coordination, and traditional banana tree archways.",
    city: "Bengaluru",
    service_areas: ["Bengaluru", "Mysore", "Chennai", "Coimbatore"],
    founded_year: 2018,
    events_completed: 240,
    rating: 4.92,
    review_count: 84,
    logo_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=180&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    contact_email: "hello@mayuraheritage.in",
    contact_phone: "+91 99001 44556",
    socials: {
      instagram: "@mayuraheritage",
      website: "https://www.mayuraheritage.in",
    },
  },
];

// Standalone Worker Hiring Preview Dataset (Workflow B)
export const SEEDED_WORKERS: WorkerPreviewItem[] = [
  {
    id: "wrk-01",
    name: "Chef Rajeshwar Swaminathan",
    role: "Master Royal Chef & Kitchen Director",
    specialty: "Authentic Chettinad, Royal Awadhi & South Indian Brahmin Feasts",
    daily_rate: 18000,
    experience_years: 18,
    rating: 4.98,
    review_count: 64,
    city: "Chennai",
    avatar_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    is_available: true,
  },
  {
    id: "wrk-02",
    name: "Venkatesh Murthy",
    role: "Lead Banquet Operations Supervisor",
    specialty: "Floor Coordination, VIP Dignitary Dining & 50+ Steward Supervision",
    daily_rate: 8500,
    experience_years: 12,
    rating: 4.92,
    review_count: 47,
    city: "Bengaluru",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    is_available: true,
  },
  {
    id: "wrk-03",
    name: "Deepak & Team",
    role: "Traditional Nadaswaram & Thavil Troupe",
    specialty: "Sacred Classical Ragas for Muhurtham & Auspicious Welcomes",
    daily_rate: 25000,
    experience_years: 20,
    rating: 4.97,
    review_count: 82,
    city: "Chennai",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    is_available: true,
  },
  {
    id: "wrk-04",
    name: "Karan Oberoi",
    role: "Senior Beverage & Molecular Mixologist",
    specialty: "Artisanal Mocktail Bar Curation, Smoke Infusions & Flair Bartending",
    daily_rate: 12000,
    experience_years: 8,
    rating: 4.89,
    review_count: 38,
    city: "Goa & Bengaluru",
    avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    is_available: true,
  },
];

// Standalone Rental Products Preview Dataset (Workflow C)
export const SEEDED_RENTALS: RentalPreviewItem[] = [
  {
    id: "rent-01",
    name: "Grand Imperial Crystal Candelabra (6ft)",
    category: "decor",
    category_label: "Luxury Decor",
    daily_rate: 4500,
    available_quantity: 40,
    minimum_rental_days: 1,
    image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
    provider_name: "Apex Luxury Event Rentals",
    city: "Chennai & Bengaluru",
  },
  {
    id: "rent-02",
    name: "Royal Chesterfield Tufted Velvet Lounge Bays",
    category: "furniture",
    category_label: "VIP Furniture",
    daily_rate: 15000,
    available_quantity: 16,
    minimum_rental_days: 1,
    image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
    provider_name: "Sovereign Furniture Hire",
    city: "Bengaluru",
  },
  {
    id: "rent-03",
    name: "Curved 4K P3 Ultra-HD Modular LED Wall (24ft x 12ft)",
    category: "audiovisual",
    category_label: "Concert AV & Stage",
    daily_rate: 85000,
    available_quantity: 3,
    minimum_rental_days: 1,
    image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    provider_name: "SonicPro Audiovisual Systems",
    city: "Chennai & Bengaluru",
  },
  {
    id: "rent-04",
    name: "Heritage Pure Brass Urlis & Hanging Temple Deepams",
    category: "catering_vessels",
    category_label: "Traditional Brass",
    daily_rate: 6500,
    available_quantity: 25,
    minimum_rental_days: 1,
    image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    provider_name: "Tanjore Brass & Vessels Guild",
    city: "Chennai",
  },
];

// Helper methods for customer workflow
export function getCustomerInquiries(customerEmail: string): CustomerInquiry[] {
  return SEEDED_INQUIRIES.filter((inq) => inq.customer_email.toLowerCase() === customerEmail.toLowerCase());
}

export function getCustomerProposals(customerEmail: string): Proposal[] {
  return SEEDED_PROPOSALS.filter((prop) => prop.customer_email.toLowerCase() === customerEmail.toLowerCase());
}

export function getCustomerBookings(customerName: string): ConfirmedBooking[] {
  return SEEDED_BOOKINGS.filter((b) => b.customer_name.toLowerCase().includes(customerName.toLowerCase().split("&")[0].trim().toLowerCase()));
}

// Mutually accept proposal and confirm booking
export function acceptProposalAsCustomer(proposalId: string): { proposal: Proposal; booking: ConfirmedBooking } {
  const proposal = SEEDED_PROPOSALS.find((p) => p.id === proposalId);
  if (!proposal) throw new Error("Proposal not found");

  proposal.customer_accepted = true;
  proposal.accepted_version = proposal.version;
  proposal.status = "accepted";
  proposal.updated_at = new Date().toISOString();

  // Create confirmed booking
  const newBooking: ConfirmedBooking = {
    id: `book-${Date.now()}`,
    booking_reference: `BK-VKS-2026-${Math.floor(100 + Math.random() * 900)}`,
    inquiry_id: proposal.inquiry_id,
    proposal_id: proposal.id,
    proposal_version: proposal.version,
    customer_name: proposal.customer_name,
    customer_phone: "+91 99402 88123",
    event_type: proposal.event_type,
    event_date: proposal.event_date,
    venue_name: proposal.venue_location,
    total_amount: proposal.total_amount,
    status: "confirmed",
    created_at: new Date().toISOString(),
  };

  SEEDED_BOOKINGS.unshift(newBooking);

  // Update inquiry status
  const inquiry = SEEDED_INQUIRIES.find((i) => i.id === proposal.inquiry_id);
  if (inquiry) {
    inquiry.status = "confirmed";
  }

  // Add confirmation message to chat
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    conversation_id: "conv-101",
    sender_type: "customer",
    sender_name: proposal.customer_name,
    text: `We have formally accepted Proposal ${proposal.proposal_number} (Version ${proposal.version}) for ${proposal.venue_location}. Looking forward to the grand celebration!`,
    proposal_id: proposal.id,
    timestamp: new Date().toISOString(),
  };
  SEEDED_MESSAGES.push(newMsg);

  return { proposal, booking: newBooking };
}

// Request changes on proposal
export function requestChangesAsCustomer(proposalId: string, notes: string): Proposal {
  const proposal = SEEDED_PROPOSALS.find((p) => p.id === proposalId);
  if (!proposal) throw new Error("Proposal not found");

  proposal.status = "changes_requested";
  proposal.customer_accepted = false;
  proposal.updated_at = new Date().toISOString();

  // Add change request note to chat
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    conversation_id: "conv-101",
    sender_type: "customer",
    sender_name: proposal.customer_name,
    text: `Scope Revision Requested for ${proposal.proposal_number}: ${notes}`,
    proposal_id: proposal.id,
    timestamp: new Date().toISOString(),
  };
  SEEDED_MESSAGES.push(newMsg);

  return proposal;
}
