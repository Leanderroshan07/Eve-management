export interface OrganizerBusiness {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  city: string;
  service_areas: string[];
  founded_year: number;
  events_completed: number;
  rating: number;
  review_count: number;
  logo_url: string;
  cover_image_url: string;
  is_published: boolean;
  contact_email: string;
  contact_phone: string;
  socials: {
    instagram?: string;
    website?: string;
  };
}

export interface PackageItem {
  id: string;
  name: string;
  category: "decor" | "catering" | "sound_lighting" | "workforce" | "photography";
  quantity: number;
  unit: string;
  unit_price: number;
}

export interface OrganizerPackage {
  id: string;
  organizer_id: string;
  name: string;
  tagline: string;
  description: string;
  event_category: string;
  base_price: number;
  currency: string;
  guest_capacity: string;
  image_url: string;
  inclusions: string[];
  items: PackageItem[];
  is_published: boolean;
  featured: boolean;
}

export interface CustomerInquiry {
  id: string;
  inquiry_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  estimated_budget: number;
  location: string;
  notes: string;
  status: "pending" | "proposal_sent" | "confirmed" | "declined";
  package_id?: string;
  created_at: string;
}

export interface ProposalLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Proposal {
  id: string;
  inquiry_id: string;
  proposal_number: string;
  version: number;
  customer_name: string;
  customer_email: string;
  event_type: string;
  event_date: string;
  venue_location: string;
  items: ProposalLineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  terms: string;
  status: "draft" | "sent_to_customer" | "changes_requested" | "accepted" | "rejected";
  organizer_accepted: boolean;
  customer_accepted: boolean;
  accepted_version?: number;
  created_at: string;
  updated_at: string;
}

export interface ConfirmedBooking {
  id: string;
  booking_reference: string;
  inquiry_id: string;
  proposal_id: string;
  proposal_version: number;
  customer_name: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  venue_name: string;
  total_amount: number;
  status: "confirmed" | "in_preparation" | "staff_assigned" | "completed";
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: "organizer" | "customer";
  sender_name: string;
  text: string;
  proposal_id?: string;
  timestamp: string;
}

// ==========================================
// SEEDED DEMO DATA STORE FOR PHASE 1
// ==========================================

export const SEEDED_ORGANIZER: OrganizerBusiness = {
  id: "org-vks-001",
  slug: "vks-royal-weddings",
  name: "VKS Royal Wedding & Luxury Event Planners",
  tagline: "Crafting Timeless Celebrations, Regal Weddings & Elite Galas",
  description:
    "With over 14 years of bespoke event curation, VKS specializes in grand architectural mandaps, high-concept floral styling, elite catering workforce management, and seamless destination weddings across India and abroad.",
  city: "Chennai & Bangalore",
  service_areas: ["Chennai", "Bangalore", "Hyderabad", "Udaipur", "Goa"],
  founded_year: 2012,
  events_completed: 480,
  rating: 4.96,
  review_count: 142,
  logo_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=180&q=80",
  cover_image_url:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
  is_published: true,
  contact_email: "concierge@vksroyalweddings.com",
  contact_phone: "+91 98401 23456",
  socials: {
    instagram: "@vksroyalweddings",
    website: "https://www.vksweddingevents.in",
  },
};

export const SEEDED_PACKAGES: OrganizerPackage[] = [
  {
    id: "pkg-royal-01",
    organizer_id: "org-vks-001",
    name: "Imperial Royal Palace Wedding",
    tagline: "The quintessential regal wedding experience with opulent floral architecture",
    description:
      "A flagship luxury curation featuring hand-carved floral mandap, entrance boulevard chandeliers, royal welcome procession, symphony acoustic sound, and dedicated bridal concierge.",
    event_category: "Royal Wedding",
    base_price: 1850000,
    currency: "INR",
    guest_capacity: "800 – 1,500 Guests",
    image_url:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    inclusions: [
      "Custom 40ft Dome Floral Mandap with imported Orchids & Rajnigandha",
      "Grand Mirror-Finish Glass Aisle with crystal candelabras",
      "Bespoke Royal Entrance Gateway with ambient amber illumination",
      "High-grade Concert Stage & Truss Lighting with moving heads",
      "Senior Event Director, 6 Supervisors, and 24 Trained Floor Stewards",
      "Bridal & Groom Dedicated VVIP Attendants",
    ],
    items: [
      { id: "item-1", name: "Imperial Floral Mandap Setup", category: "decor", quantity: 1, unit: "Set", unit_price: 650000 },
      { id: "item-2", name: "Stage & Aisle Production", category: "decor", quantity: 1, unit: "Set", unit_price: 450000 },
      { id: "item-3", name: "Concert Sound & Intelligent Lighting", category: "sound_lighting", quantity: 1, unit: "Setup", unit_price: 350000 },
      { id: "item-4", name: "Lead Operations & Floor Staff", category: "workforce", quantity: 30, unit: "Staff", unit_price: 13333 },
    ],
    is_published: true,
    featured: true,
  },
  {
    id: "pkg-sangeet-02",
    organizer_id: "org-vks-001",
    name: "Grand Sangeet & Reception Gala",
    tagline: "Electrifying entertainment stage, kinetic light shows, and plush lounge setups",
    description:
      "Designed for vibrant celebratory evenings. Includes LED video wall backdrop, kinetic ceiling chandeliers, interactive DJ booth, and velvet modular guest lounges.",
    event_category: "Sangeet & Reception",
    base_price: 1200000,
    currency: "INR",
    guest_capacity: "500 – 800 Guests",
    image_url:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
    inclusions: [
      "P3 Ultra-HD Curved LED Wall Stage with custom visual graphics",
      "Sharpy Moving Lights & Atmospheric Haze Production",
      "Luxury Velvet Circular Lounges with gold mirrored coffee tables",
      "Signature Mocktail Bar Counters with ambient underglow",
      "Celebrity Artist Coordination & Stage Production Manager",
    ],
    items: [
      { id: "item-5", name: "Curved LED Wall & Stage Setup", category: "decor", quantity: 1, unit: "Set", unit_price: 450000 },
      { id: "item-6", name: "Kinetic Intelligent Lighting Rig", category: "sound_lighting", quantity: 1, unit: "Set", unit_price: 350000 },
      { id: "item-7", name: "Luxury Velvet Lounge Seating", category: "decor", quantity: 20, unit: "Bays", unit_price: 20000 },
    ],
    is_published: true,
    featured: true,
  },
  {
    id: "pkg-heritage-03",
    organizer_id: "org-vks-001",
    name: "Heritage Mandap & Traditional Muhurtham",
    tagline: "Authentic South Indian temple aesthetic with sacred brass elements",
    description:
      "Rich brass urlis, temple pillars, Marigold cascades, traditional Nadaswaram stage setup, and customized banana tree archways.",
    event_category: "Traditional Wedding",
    base_price: 750000,
    currency: "INR",
    guest_capacity: "300 – 600 Guests",
    image_url:
      "https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=900&q=80",
    inclusions: [
      "Traditional Tanjore Temple Pillar Mandap in Antique Teak finish",
      "Pure Brass Deepams and Diya Pathway Illumination",
      "Fresh Marigold & Jasmine Floral Drapery",
      "Classical Nadaswaram & Thavil Stage Enclosure",
      "Traditional Banana Tree Entrance Toranam",
    ],
    items: [
      { id: "item-8", name: "Temple Mandap & Sacred Setup", category: "decor", quantity: 1, unit: "Set", unit_price: 420000 },
      { id: "item-9", name: "Brass Decor & Diya Lighting", category: "decor", quantity: 1, unit: "Set", unit_price: 180000 },
      { id: "item-10", name: "Traditional Welcome Staff", category: "workforce", quantity: 15, unit: "Staff", unit_price: 10000 },
    ],
    is_published: true,
    featured: false,
  },
  {
    id: "pkg-intimate-04",
    organizer_id: "org-vks-001",
    name: "Luxury Intimate Destination Wedding",
    tagline: "Exclusive boutique gatherings at palace courtyards or beachside lawns",
    description:
      "Understated elegance with fairy-light canopies, rustic wooden banquet tables, coastal floral runners, and bespoke culinary service coordination.",
    event_category: "Destination Wedding",
    base_price: 980000,
    currency: "INR",
    guest_capacity: "100 – 250 Guests",
    image_url:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80",
    inclusions: [
      "Starlight Warm Fairy-Light Canopy over banquet garden",
      "Long Solid Teak Dining Tables with Tuscan Crossback Chairs",
      "Pastel Peony & Eucalyptus Table Runners",
      "Acoustic Live Music Stage with wireless sound relay",
      "Personal Butler Service for Bride, Groom & Family",
    ],
    items: [
      { id: "item-11", name: "Fairy Light Canopy & Lawn Lighting", category: "sound_lighting", quantity: 1, unit: "Lawn", unit_price: 320000 },
      { id: "item-12", name: "Boutique Table Styling & Florals", category: "decor", quantity: 12, unit: "Tables", unit_price: 30000 },
      { id: "item-13", name: "Destination Operations Stewards", category: "workforce", quantity: 20, unit: "Staff", unit_price: 15000 },
    ],
    is_published: true,
    featured: false,
  },
];

export const SEEDED_INQUIRIES: CustomerInquiry[] = [
  {
    id: "inq-101",
    inquiry_number: "INQ-2026-089",
    customer_name: "Vikram & Ananya Sundaram",
    customer_email: "vikram.sundaram@gmail.com",
    customer_phone: "+91 99402 88123",
    event_type: "Grand Wedding & Sangeet",
    event_date: "2026-11-28",
    guest_count: 1200,
    estimated_budget: 2000000,
    location: "Leela Palace, Chennai",
    notes:
      "Looking for a grand dome floral mandap with gold and ivory accents. Need 30 specialized floor staff and sound management.",
    status: "proposal_sent",
    package_id: "pkg-royal-01",
    created_at: "2026-10-21T10:30:00Z",
  },
  {
    id: "inq-102",
    inquiry_number: "INQ-2026-090",
    customer_name: "Pooja & Rohan Mehra",
    customer_email: "rohan.mehra@outlook.com",
    customer_phone: "+91 98840 55412",
    event_type: "Sangeet Gala Celebration",
    event_date: "2026-12-15",
    guest_count: 650,
    estimated_budget: 1300000,
    location: "Taj West End, Bangalore",
    notes:
      "Want heavy emphasis on intelligent lighting, LED backdrop stage, and velvet lounge seating for family.",
    status: "pending",
    package_id: "pkg-sangeet-02",
    created_at: "2026-10-22T14:15:00Z",
  },
  {
    id: "inq-103",
    inquiry_number: "INQ-2026-091",
    customer_name: "Aditya & Sneha Rao",
    customer_email: "aditya.rao@techcorp.in",
    customer_phone: "+91 97910 44231",
    event_type: "Traditional Muhurtham",
    event_date: "2027-01-18",
    guest_count: 450,
    estimated_budget: 800000,
    location: "ITC Grand Chola, Chennai",
    notes: "Authentic temple mandap style with fresh Marigolds and Nadaswaram stage.",
    status: "confirmed",
    package_id: "pkg-heritage-03",
    created_at: "2026-10-18T09:00:00Z",
  },
];

export const SEEDED_PROPOSALS: Proposal[] = [
  {
    id: "prop-301",
    inquiry_id: "inq-101",
    proposal_number: "PROP-2026-089-V1",
    version: 1,
    customer_name: "Vikram & Ananya Sundaram",
    customer_email: "vikram.sundaram@gmail.com",
    event_type: "Grand Wedding & Sangeet",
    event_date: "2026-11-28",
    venue_location: "Leela Palace, Chennai",
    items: [
      { id: "pi-1", description: "Imperial 40ft Dome Floral Mandap (Fresh Orchids & Rajnigandha)", quantity: 1, unit_price: 650000, subtotal: 650000 },
      { id: "pi-2", description: "Mirror-Finish Glass Aisle & Crystal Chandeliers", quantity: 1, unit_price: 450000, subtotal: 450000 },
      { id: "pi-3", description: "Concert Grade Audio & Moving Head Lighting Rig", quantity: 1, unit_price: 350000, subtotal: 350000 },
      { id: "pi-4", description: "Trained Floor Stewards & Operations Supervisors", quantity: 30, unit_price: 15000, subtotal: 450000 },
    ],
    subtotal: 1900000,
    tax_rate: 0.18,
    tax_amount: 342000,
    total_amount: 2242000,
    terms: "50% advance upon contract signing. 40% two weeks prior to event date. 10% on completion.",
    status: "sent_to_customer",
    organizer_accepted: true,
    customer_accepted: false,
    created_at: "2026-10-21T16:00:00Z",
    updated_at: "2026-10-21T16:00:00Z",
  },
  {
    id: "prop-302",
    inquiry_id: "inq-103",
    proposal_number: "PROP-2026-091-V2",
    version: 2,
    customer_name: "Aditya & Sneha Rao",
    customer_email: "aditya.rao@techcorp.in",
    event_type: "Traditional Muhurtham",
    event_date: "2027-01-18",
    venue_location: "ITC Grand Chola, Chennai",
    items: [
      { id: "pi-5", description: "Traditional Teak Temple Pillar Mandap Setup", quantity: 1, unit_price: 420000, subtotal: 420000 },
      { id: "pi-6", description: "Pure Brass Deepams & Diya Pathway Illumination", quantity: 1, unit_price: 180000, subtotal: 180000 },
      { id: "pi-7", description: "Fresh Flower Garlands & Floral Canopy Upgrade", quantity: 1, unit_price: 100000, subtotal: 100000 },
      { id: "pi-8", description: "Hospitality & Traditional Welcome Attendants", quantity: 15, unit_price: 10000, subtotal: 150000 },
    ],
    subtotal: 850000,
    tax_rate: 0.18,
    tax_amount: 153000,
    total_amount: 1003000,
    terms: "Mutually agreed: 50% advance confirmed. Scope finalized under Version 2.",
    status: "accepted",
    organizer_accepted: true,
    customer_accepted: true,
    accepted_version: 2,
    created_at: "2026-10-19T11:00:00Z",
    updated_at: "2026-10-20T14:30:00Z",
  },
];

export const SEEDED_BOOKINGS: ConfirmedBooking[] = [
  {
    id: "book-501",
    booking_reference: "BK-VKS-2027-018",
    inquiry_id: "inq-103",
    proposal_id: "prop-302",
    proposal_version: 2,
    customer_name: "Aditya & Sneha Rao",
    customer_phone: "+91 97910 44231",
    event_type: "Traditional Muhurtham",
    event_date: "2027-01-18",
    venue_name: "ITC Grand Chola, Chennai",
    total_amount: 1003000,
    status: "confirmed",
    created_at: "2026-10-20T14:35:00Z",
  },
];

export const SEEDED_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    conversation_id: "conv-101",
    sender_type: "customer",
    sender_name: "Vikram Sundaram",
    text: "Hello VKS team, we loved your imperial palace portfolio. Could we customize the mandap colors to ivory and royal burgundy?",
    timestamp: "2026-10-21T11:05:00Z",
  },
  {
    id: "msg-2",
    conversation_id: "conv-101",
    sender_type: "organizer",
    sender_name: "VKS Concierge",
    text: "Namaste Vikram! Absolutely, we have prepared an itemized proposal (v1) reflecting ivory and burgundy floral customization with dedicated steward staffing.",
    proposal_id: "prop-301",
    timestamp: "2026-10-21T16:15:00Z",
  },
];

export interface PortfolioItem {
  id: string;
  organizer_id: string;
  title: string;
  category: "mandap" | "sangeet" | "dining" | "floral";
  category_label: string;
  venue: string;
  city: string;
  image_url: string;
  description: string;
  date_formatted: string;
}

export interface OrganizerReview {
  id: string;
  organizer_id: string;
  client_names: string;
  event_type: string;
  venue: string;
  rating: number;
  review_date: string;
  comment: string;
  featured: boolean;
}

export interface PackageAddon {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

export const SEEDED_ADDONS: PackageAddon[] = [
  {
    id: "addon-drone",
    name: "Aerial 4K Drone & Cinematic Film Unit",
    category: "Media",
    price: 75000,
    description: "Dual-drone cinematic 4K aerial recording with licensed operators & raw footage delivery.",
  },
  {
    id: "addon-vintage-car",
    name: "Vintage British Classic Open-Top Entry Car",
    category: "Experience",
    price: 65000,
    description: "Chauffeur-driven 1954 classic convertible for regal groom & bridal royal entrance procession.",
  },
  {
    id: "addon-chandeliers",
    name: "Crystal Chandelier Canopy & Floral Ceiling",
    category: "Decor",
    price: 120000,
    description: "Suspended 30-chandelier crystal grid with cascaded cascading Rajnigandha floral garlands.",
  },
  {
    id: "addon-pyro",
    name: "Cold Pyro Symphony & CO2 Jet FX",
    category: "Effects",
    price: 45000,
    description: "Indoor smoke-safe cold fireworks, low-fog clouds for first dance, and dual CO2 blast columns.",
  },
  {
    id: "addon-vip-butler",
    name: "Dedicated VVIP Attendant & Bridal Concierge Squad",
    category: "Workforce",
    price: 50000,
    description: "6 personal attendants exclusively shadowed to bride, groom, and immediate family members.",
  },
];

export const SEEDED_PORTFOLIO: PortfolioItem[] = [
  {
    id: "port-1",
    organizer_id: "org-vks-001",
    title: "The Golden Mandap Pavilion",
    category: "mandap",
    category_label: "Royal Mandap",
    venue: "The Leela Palace",
    city: "Bengaluru",
    image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    description: "Carved 4-pillar golden mandap flanked by cascading white tuberose, orchids, and amber uplighting.",
    date_formatted: "December 2025",
  },
  {
    id: "port-2",
    organizer_id: "org-vks-001",
    title: "Electrifying Neon Sangeet Arena",
    category: "sangeet",
    category_label: "Sangeet & Staging",
    venue: "Taj West End Lawn",
    city: "Bengaluru",
    image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    description: "Ultra-wide curved LED video wall, automated moving-head beams, and plush circular velvet lounge seating.",
    date_formatted: "January 2026",
  },
  {
    id: "port-3",
    organizer_id: "org-vks-001",
    title: "Crystal Grandeur Banquet Setting",
    category: "dining",
    category_label: "Banquet & Dining",
    venue: "ITC Grand Chola",
    city: "Chennai",
    image_url: "https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80",
    description: "Mirror banquet tables adorned with high crystal candelabras, gold charger plates, and customized menu cards.",
    date_formatted: "November 2025",
  },
  {
    id: "port-4",
    organizer_id: "org-vks-001",
    title: "Heritage South Indian Temple Sanctum",
    category: "mandap",
    category_label: "Royal Mandap",
    venue: "Mayor Ramanathan Chettiar Hall",
    city: "Chennai",
    image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    description: "Authentic Tanjore teakwood pillars with thousands of pure yellow marigolds and antique brass diyas.",
    date_formatted: "February 2026",
  },
  {
    id: "port-5",
    organizer_id: "org-vks-001",
    title: "Starlight Garden Canopy",
    category: "floral",
    category_label: "Floral Architecture",
    venue: "Alila Diwa Courtyard",
    city: "Goa",
    image_url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    description: "Under-the-stars illuminated canopy draped with 10,000 fairy lights, fresh eucalyptus, and blush roses.",
    date_formatted: "February 2026",
  },
  {
    id: "port-6",
    organizer_id: "org-vks-001",
    title: "Royal Maharaja Entrance Boulevard",
    category: "floral",
    category_label: "Floral Architecture",
    venue: "JW Marriott Prestige Golfshire",
    city: "Bengaluru",
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    description: "120-meter royal walkway lined with classical stone urns, fragrant jasmine arches, and royal royal trumpeters.",
    date_formatted: "October 2025",
  },
];

export const SEEDED_REVIEWS: OrganizerReview[] = [
  {
    id: "rev-1",
    organizer_id: "org-vks-001",
    client_names: "Dr. Aishwarya & Siddharth Roy",
    event_type: "Grand 3-Day Wedding & Reception",
    venue: "The Leela Palace, Bengaluru",
    rating: 5,
    review_date: "January 2026",
    comment:
      "VKS transformed our dream wedding into an absolute fairy tale. From the 40-foot floral mandap to the seamless catering stewards, not a single detail was out of place. Our 1,200 guests were completely captivated.",
    featured: true,
  },
  {
    id: "rev-2",
    organizer_id: "org-vks-001",
    client_names: "Meera & Gautam Krishnan",
    event_type: "Heritage Traditional Muhurtham",
    venue: "ITC Grand Chola, Chennai",
    rating: 5,
    review_date: "December 2025",
    comment:
      "The authenticity of the temple mandap decor was breathtaking. Authentic brass deepams, fragrant fresh jasmine, and flawless hospitality coordination. Mr. VKS and his team are true masters of luxury weddings.",
    featured: true,
  },
  {
    id: "rev-3",
    organizer_id: "org-vks-001",
    client_names: "Kavya & Anish Nair",
    event_type: "Destination Palace Celebration",
    venue: "Taj Falaknuma Palace, Hyderabad",
    rating: 5,
    review_date: "November 2025",
    comment:
      "The proposal versioning process was so transparent and professional. Any custom changes were immediately updated with exact pricing and itemized breakdown. Worth every single rupee!",
    featured: true,
  },
];

// Helper functions for retrieval and state updates
export function getOrganizerBySlug(slug: string): OrganizerBusiness | undefined {
  if (slug === SEEDED_ORGANIZER.slug) {
    return SEEDED_ORGANIZER;
  }
  return SEEDED_ORGANIZER; // Fallback to seeded demo organizer for preview
}

export function getPackagesForOrganizer(organizerId: string): OrganizerPackage[] {
  return SEEDED_PACKAGES.filter((p) => p.organizer_id === organizerId && p.is_published);
}

export function getPortfolioForOrganizer(organizerId: string): PortfolioItem[] {
  return SEEDED_PORTFOLIO.filter((p) => p.organizer_id === organizerId);
}

export function getReviewsForOrganizer(organizerId: string): OrganizerReview[] {
  return SEEDED_REVIEWS.filter((r) => r.organizer_id === organizerId);
}
