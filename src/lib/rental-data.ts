/**
 * Veluxe Rental Marketplace & Provider Management Data Layer
 * Handles equipment catalog, date-based availability, white-glove logistics,
 * order lifecycle, and deposit inspection tracking.
 */

export type RentalCategory =
  | "furniture_seating"
  | "audio_visual_lighting"
  | "tableware_catering"
  | "structures_decor";

export type RentalItemCondition = "pristine" | "good" | "fair" | "damaged";

export interface RentalProduct {
  id: string;
  providerId: string;
  name: string;
  slug: string;
  category: RentalCategory;
  description: string;
  dailyRate: number; // In INR ₹
  securityDeposit: number; // Refundable deposit per unit
  whiteGloveSetupFee: number; // Transport, rigging, and installation fee
  totalStock: number;
  dimensions: string;
  condition: RentalItemCondition;
  imageUrl: string;
  minRentalDays: number;
  features: string[];
  tags: string[];
}

export interface RentalProvider {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  warehouseAddress: string;
  fleetCount: number;
  crewSize: number;
  contactEmail: string;
  contactPhone: string;
  specialties: string[];
  verified: boolean;
}

export type RentalOrderStatus =
  | "request_submitted"
  | "awaiting_confirmation"
  | "proposal_sent"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "active_rental"
  | "return_pending"
  | "returned"
  | "completed"
  | "cancelled"
  | "disputed";

export interface RentalOrderItem {
  productId: string;
  productName: string;
  category: RentalCategory;
  dailyRate: number;
  quantity: number;
  securityDepositPerUnit: number;
  returnedCondition?: "pristine" | "damaged" | "missing" | null;
  damagePenalty?: number;
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  providerId: string;
  providerName: string;
  requesterRole: "customer" | "organizer";
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  eventName: string;
  venueName: string;
  venueAddress: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  rentalDays: number;
  items: RentalOrderItem[];
  subtotal: number;
  deliveryAndSetupFee: number;
  totalDeposit: number;
  depositStatus: "pending" | "held" | "partially_refunded" | "refunded" | "forfeited";
  depositDeduction: number;
  depositRefundAmount: number;
  grandTotal: number;
  status: RentalOrderStatus;
  crewLead: string;
  dispatchTime: string;
  retrievalTime: string;
  notes: string;
  inspectionNotes?: string;
  disputeReason?: string;
  createdAt: string;
}

/* =====================================================================
   SEEDED SPECIALIST LUXURY PROVIDERS
   ===================================================================== */

export const SEEDED_RENTAL_PROVIDERS: RentalProvider[] = [
  {
    id: "provider-aura",
    name: "AuraSound & Lumina FX",
    slug: "aurasound-lumina",
    tagline: "Concert-Grade Acoustic Rigs & Architectural Event Illumination",
    description:
      "Premier event production supplier providing line array sound, intelligent wireless fixtures, 4K LED video backdrops, and atmospheric FX for luxury destination celebrations.",
    logoUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=160&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    rating: 4.95,
    reviewCount: 68,
    location: "South Mumbai & BKC, Mumbai",
    warehouseAddress: "Plot 42, Production Park, Lower Parel West, Mumbai 400013",
    fleetCount: 8,
    crewSize: 24,
    contactEmail: "production@aurasound.in",
    contactPhone: "+91 98201 44550",
    specialties: ["L-Acoustics K2 Arrays", "Astera Wireless Tubes", "Pixel Mapping", "P3 LED Screens"],
    verified: true,
  },
  {
    id: "provider-palais",
    name: "Palais Royale Tableware & Seating",
    slug: "palais-royale-seating",
    tagline: "Fine European Banqueting Furniture & Hand-Cut Crystal Dining Collections",
    description:
      "Curators of exquisite celebratory dining settings. Offering gilded Louis XVI chairs, custom velvet banquet lounges, Baccarat stemware, and 24k gold-rim porcelain chargers.",
    logoUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=160&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=80",
    rating: 4.98,
    reviewCount: 92,
    location: "Vasant Kunj & Aerocity, New Delhi",
    warehouseAddress: "Complex B, Grand Trunk Design Hub, Chattarpur, New Delhi 110074",
    fleetCount: 12,
    crewSize: 36,
    contactEmail: "concierge@palaisroyale.in",
    contactPhone: "+91 98110 33221",
    specialties: ["French Louis Chairs", "Gold Chafing Sets", "Cut Glass Chandeliers", "Hand-Dyed Damask"],
    verified: true,
  },
  {
    id: "provider-luxeloom",
    name: "LuxeLoom Structures & Marquees",
    slug: "luxeloom-structures",
    tagline: "Clear-Span Glass Pavilions, Modular Gazebos & Mirrored Staging",
    description:
      "Engineered structural luxury for open-air palaces and beachfronts. We build climate-controlled clear marquees, raised mirrored runways, and bespoke timber gazebos.",
    logoUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=160&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=80",
    rating: 4.92,
    reviewCount: 54,
    location: "Whitefield, Bengaluru & Goa Regional Depot",
    warehouseAddress: "Aero Logistics Zone, Devanahalli, Bengaluru 560300",
    fleetCount: 10,
    crewSize: 45,
    contactEmail: "structures@luxeloom.in",
    contactPhone: "+91 99002 88410",
    specialties: ["Clear Glass Marquees", "Mirrored Dance Floors", "Cantilevered Trusses", "Floral Canopies"],
    verified: true,
  },
];

/* =====================================================================
   SEEDED LUXURY RENTAL EQUIPMENT CATALOG
   ===================================================================== */

export const SEEDED_RENTAL_PRODUCTS: RentalProduct[] = [
  // 1. Audio Visual & Lighting (AuraSound)
  {
    id: "prod-ast-01",
    providerId: "provider-aura",
    name: "Astera Titan Wireless RGB Tube Set (Pack of 8)",
    slug: "astera-titan-rgb-tube-set",
    category: "audio_visual_lighting",
    description:
      "Wireless battery-powered IP65 LED pixel tubes with high CRI/TLCI for flawless cinematic skin tones, wireless DMX control, and ambient pavilion accent lighting.",
    dailyRate: 18000,
    securityDeposit: 25000,
    whiteGloveSetupFee: 4500,
    totalStock: 12,
    dimensions: "1035mm x Ø42mm per tube (Flightcase: 110x35x25cm)",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["Wireless CRMX & Bluetooth App Control", "20-Hour Battery Runtime", "3200K - 6500K Tunable White + Full RGB", "Custom Flight Case with PowerCon Charging"],
    tags: ["Astera", "Wireless", "Ambient", "Sangeet Lighting"],
  },
  {
    id: "prod-lac-02",
    providerId: "provider-aura",
    name: "L-Acoustics Syva Colinear Acoustic Array Rig",
    slug: "l-acoustics-syva-array-rig",
    category: "audio_visual_lighting",
    description:
      "Architectural colinear line-source system designed for acoustically demanding luxury spaces. Ultra-slim profile preserves wedding sightlines with crystal-clear speech and concert bass.",
    dailyRate: 45000,
    securityDeposit: 60000,
    whiteGloveSetupFee: 8500,
    totalStock: 6,
    dimensions: "Syva: 1304 x 144 x 209 mm, Syva Low: 849 x 334 x 350 mm",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["137 dB Peak SPL", "140° Horizontal Dispersion", "White Luxury Enclosure Finish", "LA4X Amplified Controller Included"],
    tags: ["L-Acoustics", "Concert Sound", "Wedding Ceremony", "Acoustics"],
  },
  {
    id: "prod-rob-03",
    providerId: "provider-aura",
    name: "Robe MegaPointe Intelligent Moving Head Fixtures (Pair)",
    slug: "robe-megapointe-moving-heads",
    category: "audio_visual_lighting",
    description:
      "All-in-one beam, spot, and wash light fixtures featuring pinpoint projection gobos, prismatic aerial beam effects, and warm golden color wheels.",
    dailyRate: 22000,
    securityDeposit: 30000,
    whiteGloveSetupFee: 5000,
    totalStock: 8,
    dimensions: "640 x 396 x 230 mm, 22 kg each",
    condition: "good",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["1.8° to 42° Zoom Range", "14 Colors + Warm CTO", "Rotating Prism Wheels", "Pre-Programmed DMX Presets"],
    tags: ["Moving Heads", "Concert Beam", "Sangeet Stage", "Robe"],
  },

  // 2. Furniture & Seating (Palais Royale)
  {
    id: "prod-lou-04",
    providerId: "provider-palais",
    name: "French Louis XVI Gilded Medallion Chairs (Set of 10)",
    slug: "french-louis-xvi-gilded-chairs",
    category: "furniture_seating",
    description:
      "Hand-carved solid beechwood frames leafed in warm champagne gold, upholstered in ivory Italian damask velvet with double-piped perimeter trim.",
    dailyRate: 12000,
    securityDeposit: 15000,
    whiteGloveSetupFee: 3000,
    totalStock: 35,
    dimensions: "98cm H x 50cm W x 55cm D (Seat Height: 48cm)",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["Authentic Hand-Carved Beechwood", "High-Density Foam Cushioning", "Protective Felt Floor Gliders", "Includes Protective Travel Slipcovers"],
    tags: ["Chairs", "Gilded Gold", "Royal Banqueting", "Louis XVI"],
  },
  {
    id: "prod-vel-05",
    providerId: "provider-palais",
    name: "Imperial Chesterfield Velvet Lounge Sofa (Emerald / Champagne)",
    slug: "imperial-chesterfield-lounge-sofa",
    category: "furniture_seating",
    description:
      "Deep button-tufted three-seater chesterfield sofa wrapped in plush emerald velvet with brushed brass tapered feet. Perfect for VIP wedding cabanas.",
    dailyRate: 16500,
    securityDeposit: 20000,
    whiteGloveSetupFee: 3500,
    totalStock: 10,
    dimensions: "225cm L x 95cm D x 78cm H",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["Deep Button-Tufted Tailoring", "Brushed Brass Accents", "Includes 4 Matching Silk Accent Pillows", "Steam Sanitized Pre-Dispatch"],
    tags: ["Chesterfield", "VIP Lounge", "Velvet", "Cabana"],
  },
  {
    id: "prod-mar-06",
    providerId: "provider-palais",
    name: "Calacatta Gold Marble Top Bar Counter & Cocktail Station",
    slug: "calacatta-gold-marble-bar-counter",
    category: "furniture_seating",
    description:
      "Modular luxury bar counter featuring an authentic honed Calacatta gold marble countertop, brushed brass fluted fascia, and stainless steel underbar speed rails.",
    dailyRate: 28000,
    securityDeposit: 35000,
    whiteGloveSetupFee: 6000,
    totalStock: 5,
    dimensions: "240cm W x 80cm D x 105cm H (Modular 2-piece unit)",
    condition: "good",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["Integrated LED Under-Counter Glow", "Dual Speed Rails & Insulated Ice Well", "Waterproof Plumbing Pass-Through", "Brushed Brass Fluted Front"],
    tags: ["Bar Counter", "Marble", "Cocktail Bar", "Hospitality"],
  },

  // 3. Tableware & Catering (Palais Royale)
  {
    id: "prod-cha-07",
    providerId: "provider-palais",
    name: "24k Gold Rim Venetian Charger Plates & Cutlery (Service for 50)",
    slug: "24k-gold-venetian-charger-plates-cutlery",
    category: "tableware_catering",
    description:
      "Exquisite celebratory tablescapes comprising 33cm textured Venetian glass charger plates with 24k gold leaf rim, alongside 5-piece brushed gold stainless steel cutlery.",
    dailyRate: 25000,
    securityDeposit: 30000,
    whiteGloveSetupFee: 4000,
    totalStock: 15,
    dimensions: "Charger: 33cm diameter, Custom Felt Storage Crates",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["Hand-Finished 24k Gold Rim", "Heavy Gauge 18/10 Stainless Cutlery", "Hygienically Sanitized & Sealed in Crates", "White Glove Polishing on Placement"],
    tags: ["Charger Plates", "Gold Cutlery", "Fine Dining", "Royal Feast"],
  },
  {
    id: "prod-bac-08",
    providerId: "provider-palais",
    name: "Hand-Cut Crystal Goblets & Champagne Flutes (Service for 50)",
    slug: "hand-cut-crystal-goblets-flutes",
    category: "tableware_catering",
    description:
      "Lead-free hand-blown Bavarian crystal stemware set with diamond-cut faceted bases. Includes 50 red wine goblets, 50 white wine glasses, and 50 champagne flutes.",
    dailyRate: 21000,
    securityDeposit: 28000,
    whiteGloveSetupFee: 3500,
    totalStock: 12,
    dimensions: "Custom Padded Flight Crates with Thermal Isolation",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["Resonant Crystal Clarity", "Diamond Cut Refraction Facets", "Individually Sleeved Stem Protection", "Immediate Replacement Spares Included"],
    tags: ["Crystal", "Wine Goblets", "Champagne Flutes", "Tabletop"],
  },

  // 4. Structures & Decor (LuxeLoom)
  {
    id: "prod-gla-09",
    providerId: "provider-luxeloom",
    name: "Clear-Span Glass Crystal Marquee Pavilion (15m x 25m)",
    slug: "clear-span-glass-crystal-marquee-pavilion",
    category: "structures_decor",
    description:
      "Monumental climate-controlled glass pavilion featuring an anodized champagne aluminum truss framework, tempered panoramic glass wall panels, and UV-filtering transparent roof.",
    dailyRate: 185000,
    securityDeposit: 250000,
    whiteGloveSetupFee: 35000,
    totalStock: 2,
    dimensions: "15 meters wide x 25 meters long x 5.2 meters ridge height (375 sq meters)",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 2,
    features: ["Engineered Wind Rated to 100 km/h", "HVAC Ducts & Cassette AC Mounting Points", "Heavy-Duty Sub-Floor System Included", "48-Hour Professional Rigging & Strike Crew"],
    tags: ["Marquee", "Glass Pavilion", "Destination Wedding", "Grand Ballroom"],
  },
  {
    id: "prod-mir-10",
    providerId: "provider-luxeloom",
    name: "Golden Mirror Finished Raised Dance Floor (8m x 8m)",
    slug: "golden-mirror-raised-dance-floor",
    category: "structures_decor",
    description:
      "Scratch-resistant tempered safety mirror dance floor elevated on a self-leveling steel subframe with beveled perimeter lighting channels.",
    dailyRate: 48000,
    securityDeposit: 60000,
    whiteGloveSetupFee: 9000,
    totalStock: 4,
    dimensions: "8m x 8m (64 square meters), 15cm elevated height",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["8mm Tempered Safety Mirror Surface", "Sub-Frame Accommodates 1,000kg/sq m", "Integrated Warm Gold Beveled Edge Ramps", "Protective Film Removed 1-Hour Pre-Guest Arrival"],
    tags: ["Dance Floor", "Mirror", "Sangeet Stage", "Party"],
  },
  {
    id: "prod-cha-11",
    providerId: "provider-luxeloom",
    name: "Bespoke Bohemian Floral Mandap / Wedding Chuppah Arch",
    slug: "bespoke-floral-mandap-chuppah-arch",
    category: "structures_decor",
    description:
      "Architectural four-pillar solid brass gazebo with interwoven dried eucalyptus, pampas grass, white garden roses, and brass hanging oil lamps (diyas).",
    dailyRate: 65000,
    securityDeposit: 50000,
    whiteGloveSetupFee: 12000,
    totalStock: 3,
    dimensions: "3.5m x 3.5m footprint x 3.2m height",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["Modular Brass Pillar Anchors", "Fresh/Silk Floral Blend Pre-Conditioned", "Discreet Electrical Wiring for Halogen Spotting", "Dedicated Master Florist on Setup"],
    tags: ["Mandap", "Chuppah", "Wedding Ceremony", "Floral Structure"],
  },
  {
    id: "prod-cha-12",
    providerId: "provider-luxeloom",
    name: "Grand Maria Theresa 36-Arm Crystal Chandelier (Pair)",
    slug: "maria-theresa-crystal-chandelier-pair",
    category: "structures_decor",
    description:
      "Museum-grade Austrian hand-cut crystal chandeliers with gold-finished brass frame, glass rosettes, and faceted crystal pendeloques.",
    dailyRate: 35000,
    securityDeposit: 45000,
    whiteGloveSetupFee: 8000,
    totalStock: 4,
    dimensions: "160cm Diameter x 190cm Height, 65kg each",
    condition: "pristine",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    features: ["36 Dimmable Warm Filament LED Bulbs (2200K)", "Motorized D8+ Rigging Hoist Included", "Austrian Lead Crystal Prisms", "Flight Case with Vibration Isolation"],
    tags: ["Chandelier", "Crystal", "Grand Ballroom", "Luxury Lighting"],
  },
];

/* =====================================================================
   SEEDED RENTAL ORDERS ACROSS LIFECYCLE
   ===================================================================== */

export const SEEDED_RENTAL_ORDERS: RentalOrder[] = [
  {
    id: "ord-9041",
    orderNumber: "VLX-RENT-2026-0941",
    providerId: "provider-aura",
    providerName: "AuraSound & Lumina FX",
    requesterRole: "organizer",
    requesterName: "Aura Events & Co. (Rohan Verma)",
    requesterEmail: "rohan@auraevents.com",
    requesterPhone: "+91 98200 11223",
    eventName: "Kapoor & Singhania Sangeet Gala",
    venueName: "The Taj Mahal Palace, Ballroom",
    venueAddress: "Apollo Bunder, Colaba, Mumbai 400001",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
    rentalDays: 2,
    items: [
      {
        productId: "prod-ast-01",
        productName: "Astera Titan Wireless RGB Tube Set (Pack of 8)",
        category: "audio_visual_lighting",
        dailyRate: 18000,
        quantity: 4,
        securityDepositPerUnit: 25000,
      },
      {
        productId: "prod-lac-02",
        productName: "L-Acoustics Syva Colinear Acoustic Array Rig",
        category: "audio_visual_lighting",
        dailyRate: 45000,
        quantity: 2,
        securityDepositPerUnit: 60000,
      },
    ],
    subtotal: 324000, // (4 * 18000 * 2) + (2 * 45000 * 2) = 144k + 180k
    deliveryAndSetupFee: 25000,
    totalDeposit: 220000, // (4 * 25k) + (2 * 60k)
    depositStatus: "held",
    depositDeduction: 0,
    depositRefundAmount: 0,
    grandTotal: 569000, // 324k + 25k + 220k
    status: "active_rental",
    crewLead: "Vikram Sengupta (Senior Audio-Lighting Engineer)",
    dispatchTime: "14 Nov 2026, 08:30 AM",
    retrievalTime: "16 Nov 2026, 04:00 AM",
    notes: "Requires acoustic calibration for Taj ballroom crystal resonance. Crew passes already issued by hotel security.",
    createdAt: "2026-10-18T10:30:00Z",
  },
  {
    id: "ord-9042",
    orderNumber: "VLX-RENT-2026-0942",
    providerId: "provider-palais",
    providerName: "Palais Royale Tableware & Seating",
    requesterRole: "customer",
    requesterName: "Meera Oberoi",
    requesterEmail: "meera.oberoi@gmail.com",
    requesterPhone: "+91 99100 44321",
    eventName: "Silver Jubilee Anniversary Banquet",
    venueName: "The Leela Palace, Grand Terrace",
    venueAddress: "Diplomatic Enclave, Chanakyapuri, New Delhi 110023",
    startDate: "2026-11-20",
    endDate: "2026-11-21",
    rentalDays: 1,
    items: [
      {
        productId: "prod-lou-04",
        productName: "French Louis XVI Gilded Medallion Chairs (Set of 10)",
        category: "furniture_seating",
        dailyRate: 12000,
        quantity: 8, // 80 chairs
        securityDepositPerUnit: 15000,
      },
      {
        productId: "prod-cha-07",
        productName: "24k Gold Rim Venetian Charger Plates & Cutlery (Service for 50)",
        category: "tableware_catering",
        dailyRate: 25000,
        quantity: 2, // 100 place settings
        securityDepositPerUnit: 30000,
      },
    ],
    subtotal: 146000,
    deliveryAndSetupFee: 14000,
    totalDeposit: 180000,
    depositStatus: "held",
    depositDeduction: 0,
    depositRefundAmount: 0,
    grandTotal: 340000,
    status: "preparing",
    crewLead: "Devansh Nair (Logistics Coordinator)",
    dispatchTime: "20 Nov 2026, 11:00 AM",
    retrievalTime: "21 Nov 2026, 02:00 AM",
    notes: "White glove setting team must glove-polish each glass charger plate at the table.",
    createdAt: "2026-10-20T14:15:00Z",
  },
  {
    id: "ord-9043",
    orderNumber: "VLX-RENT-2026-0943",
    providerId: "provider-luxeloom",
    providerName: "LuxeLoom Structures & Marquees",
    requesterRole: "organizer",
    requesterName: "Veluxe Premier Events (Sarah Jenkins)",
    requesterEmail: "sarah@veluxeevents.com",
    requesterPhone: "+91 98450 77123",
    eventName: "Bespoke Beachfront Vow Renewal",
    venueName: "Alila Diwa Resort, Gonsua Beach Lawn",
    venueAddress: "48/10, Adao Waddo, Majorda, Goa 403713",
    startDate: "2026-12-04",
    endDate: "2026-12-06",
    rentalDays: 2,
    items: [
      {
        productId: "prod-gla-09",
        productName: "Clear-Span Glass Crystal Marquee Pavilion (15m x 25m)",
        category: "structures_decor",
        dailyRate: 185000,
        quantity: 1,
        securityDepositPerUnit: 250000,
      },
      {
        productId: "prod-mir-10",
        productName: "Golden Mirror Finished Raised Dance Floor (8m x 8m)",
        category: "structures_decor",
        dailyRate: 48000,
        quantity: 1,
        securityDepositPerUnit: 60000,
      },
    ],
    subtotal: 466000,
    deliveryAndSetupFee: 44000,
    totalDeposit: 310000,
    depositStatus: "pending",
    depositDeduction: 0,
    depositRefundAmount: 0,
    grandTotal: 820000,
    status: "awaiting_confirmation",
    crewLead: "Anand Kulkarni (Chief Rigging Engineer)",
    dispatchTime: "03 Dec 2026, 06:00 AM",
    retrievalTime: "07 Dec 2026, 06:00 PM",
    notes: "Beach sand ballast anchoring required. Coastal wind sensor telemetry to be monitored continuously.",
    createdAt: "2026-10-24T09:45:00Z",
  },
  {
    id: "ord-9039",
    orderNumber: "VLX-RENT-2026-0939",
    providerId: "provider-aura",
    providerName: "AuraSound & Lumina FX",
    requesterRole: "customer",
    requesterName: "Dr. Ananya Rao",
    requesterEmail: "ananya.rao@hospital.org",
    requesterPhone: "+91 98203 99887",
    eventName: "Medical Foundation Charity Gala",
    venueName: "St. Regis Mumbai, Astor Ballroom",
    venueAddress: "462 Senapati Bapat Marg, Lower Parel, Mumbai 400013",
    startDate: "2026-10-10",
    endDate: "2026-10-11",
    rentalDays: 1,
    items: [
      {
        productId: "prod-rob-03",
        productName: "Robe MegaPointe Intelligent Moving Head Fixtures (Pair)",
        category: "audio_visual_lighting",
        dailyRate: 22000,
        quantity: 4,
        securityDepositPerUnit: 30000,
        returnedCondition: "pristine",
        damagePenalty: 0,
      },
    ],
    subtotal: 88000,
    deliveryAndSetupFee: 12000,
    totalDeposit: 120000,
    depositStatus: "refunded",
    depositDeduction: 0,
    depositRefundAmount: 120000,
    grandTotal: 220000,
    status: "completed",
    crewLead: "Vikram Sengupta",
    dispatchTime: "10 Oct 2026, 10:00 AM",
    retrievalTime: "11 Oct 2026, 01:30 AM",
    notes: "Flawless staging. All 4 pairs returned pristine with clean flight cases.",
    inspectionNotes: "Pre and post diagnostic check completed. Full deposit refunded to client bank account.",
    createdAt: "2026-10-02T11:20:00Z",
  },
  {
    id: "ord-9038",
    orderNumber: "VLX-RENT-2026-0938",
    providerId: "provider-palais",
    providerName: "Palais Royale Tableware & Seating",
    requesterRole: "customer",
    requesterName: "Rajeev Singhal",
    requesterEmail: "rajeev.singhal@corp.in",
    requesterPhone: "+91 97112 00998",
    eventName: "Private Estate Diwali Soirée",
    venueName: "Singhal Farmhouse, Chattarpur",
    venueAddress: "Farm 12, Radhey Mohan Drive, Chattarpur, New Delhi 110074",
    startDate: "2026-10-12",
    endDate: "2026-10-13",
    rentalDays: 1,
    items: [
      {
        productId: "prod-cha-07",
        productName: "24k Gold Rim Venetian Charger Plates & Cutlery (Service for 50)",
        category: "tableware_catering",
        dailyRate: 25000,
        quantity: 3, // 150 place settings
        securityDepositPerUnit: 30000,
        returnedCondition: "damaged",
        damagePenalty: 18000, // 6 broken Venetian charger plates
      },
      {
        productId: "prod-bac-08",
        productName: "Hand-Cut Crystal Goblets & Champagne Flutes (Service for 50)",
        category: "tableware_catering",
        dailyRate: 21000,
        quantity: 3,
        securityDepositPerUnit: 28000,
        returnedCondition: "pristine",
        damagePenalty: 0,
      },
    ],
    subtotal: 138000,
    deliveryAndSetupFee: 16000,
    totalDeposit: 174000,
    depositStatus: "partially_refunded",
    depositDeduction: 18000,
    depositRefundAmount: 156000,
    grandTotal: 328000,
    status: "disputed",
    crewLead: "Devansh Nair",
    dispatchTime: "12 Oct 2026, 12:00 PM",
    retrievalTime: "13 Oct 2026, 04:00 AM",
    notes: "6 Venetian charger plates shattered during fireworks segment.",
    inspectionNotes: "Itemized damage log recorded: 6 charger plates at ₹3,000 replacement value each = ₹18,000. Customer disputes liability claiming catering staff dropped tray.",
    disputeReason: "Customer claims venue catering staff dropped charger plate tray, not private guests. Case escalated to Admin arbitration.",
    createdAt: "2026-10-05T08:10:00Z",
  },
];

/* =====================================================================
   ACTIVE LOGGED-IN RENTAL PROVIDER (For Testing & Operations)
   ===================================================================== */

export const CURRENT_RENTAL_PROVIDER: RentalProvider = SEEDED_RENTAL_PROVIDERS[0]; // AuraSound & Lumina FX

/* =====================================================================
   STATE MANAGEMENT & STORAGE HELPERS
   ===================================================================== */

const STORAGE_KEYS = {
  PROVIDERS: "veluxe_rental_providers_v1",
  PRODUCTS: "veluxe_rental_products_v1",
  ORDERS: "veluxe_rental_orders_v1",
};

export function getStoredRentalProviders(): RentalProvider[] {
  if (typeof window === "undefined") return SEEDED_RENTAL_PROVIDERS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    return data ? JSON.parse(data) : SEEDED_RENTAL_PROVIDERS;
  } catch {
    return SEEDED_RENTAL_PROVIDERS;
  }
}

export function getStoredRentalProducts(): RentalProduct[] {
  if (typeof window === "undefined") return SEEDED_RENTAL_PRODUCTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : SEEDED_RENTAL_PRODUCTS;
  } catch {
    return SEEDED_RENTAL_PRODUCTS;
  }
}

export function getStoredRentalOrders(): RentalOrder[] {
  if (typeof window === "undefined") return SEEDED_RENTAL_ORDERS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : SEEDED_RENTAL_ORDERS;
  } catch {
    return SEEDED_RENTAL_ORDERS;
  }
}

export function saveStoredRentalOrders(orders: RentalOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to save rental orders", err);
  }
}

export function saveStoredRentalProducts(products: RentalProduct[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error("Failed to save rental products", err);
  }
}

/* =====================================================================
   DOMAIN HELPERS & OPERATIONS
   ===================================================================== */

/**
 * Check if a product has sufficient available units between startDate and endDate
 */
export function checkProductAvailability(
  productId: string,
  startDate: string,
  endDate: string,
  requestedQty: number
): { isAvailable: boolean; totalStock: number; bookedUnits: number; remainingUnits: number } {
  const products = getStoredRentalProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return { isAvailable: false, totalStock: 0, bookedUnits: 0, remainingUnits: 0 };
  }

  const orders = getStoredRentalOrders();
  const reqStart = new Date(startDate).getTime();
  const reqEnd = new Date(endDate).getTime();

  // Find overlapping active or confirmed orders
  let maxBookedQty = 0;
  for (const order of orders) {
    if (
      order.status === "cancelled" ||
      order.status === "completed" ||
      order.status === "returned"
    ) {
      continue;
    }

    const orderStart = new Date(order.startDate).getTime();
    const orderEnd = new Date(order.endDate).getTime();

    // Check date collision
    const isOverlapping = reqStart <= orderEnd && reqEnd >= orderStart;
    if (isOverlapping) {
      const item = order.items.find((i) => i.productId === productId);
      if (item) {
        maxBookedQty += item.quantity;
      }
    }
  }

  const remainingUnits = Math.max(0, product.totalStock - maxBookedQty);
  return {
    isAvailable: remainingUnits >= requestedQty,
    totalStock: product.totalStock,
    bookedUnits: maxBookedQty,
    remainingUnits,
  };
}

/**
 * Update the status of an existing rental order
 */
export function updateRentalOrderStatus(
  orderId: string,
  status: RentalOrderStatus,
  additionalUpdates: Partial<RentalOrder> = {}
): RentalOrder[] {
  const orders = getStoredRentalOrders();
  const updated = orders.map((ord) => {
    if (ord.id === orderId) {
      return {
        ...ord,
        status,
        ...additionalUpdates,
      };
    }
    return ord;
  });
  saveStoredRentalOrders(updated);
  return updated;
}

/**
 * Process post-event return inspection and calculate deposit refund/deduction
 */
export function processReturnInspection(
  orderId: string,
  inspections: { productId: string; returnedCondition: "pristine" | "damaged" | "missing"; damagePenalty: number }[],
  inspectionNotes: string
): RentalOrder[] {
  const orders = getStoredRentalOrders();
  const updated = orders.map((ord) => {
    if (ord.id === orderId) {
      let totalDeduction = 0;
      const updatedItems = ord.items.map((item) => {
        const insp = inspections.find((i) => i.productId === item.productId);
        if (insp) {
          totalDeduction += insp.damagePenalty;
          return {
            ...item,
            returnedCondition: insp.returnedCondition,
            damagePenalty: insp.damagePenalty,
          };
        }
        return item;
      });

      const refundAmount = Math.max(0, ord.totalDeposit - totalDeduction);
      const depositStatus: RentalOrder["depositStatus"] =
        totalDeduction === 0
          ? "refunded"
          : refundAmount > 0
          ? "partially_refunded"
          : "forfeited";

      return {
        ...ord,
        status: "returned" as RentalOrderStatus,
        items: updatedItems,
        depositDeduction: totalDeduction,
        depositRefundAmount: refundAmount,
        depositStatus,
        inspectionNotes,
      };
    }
    return ord;
  });

  saveStoredRentalOrders(updated);
  return updated;
}

/**
 * Create a new rental order from customer or organizer
 */
export function createRentalOrder(
  newOrder: Omit<RentalOrder, "id" | "orderNumber" | "createdAt" | "depositDeduction" | "depositRefundAmount">
): RentalOrder {
  const orders = getStoredRentalOrders();
  const count = orders.length + 1;
  const created: RentalOrder = {
    ...newOrder,
    id: `ord-${Date.now()}`,
    orderNumber: `VLX-RENT-2026-${String(count).padStart(4, "0")}`,
    depositDeduction: 0,
    depositRefundAmount: 0,
    createdAt: new Date().toISOString(),
  };

  const updated = [created, ...orders];
  saveStoredRentalOrders(updated);
  return created;
}

/**
 * Add a new rental equipment product
 */
export function addRentalProduct(
  newProduct: Omit<RentalProduct, "id" | "slug">
): RentalProduct {
  const products = getStoredRentalProducts();
  const slug = newProduct.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const created: RentalProduct = {
    ...newProduct,
    id: `prod-custom-${Date.now()}`,
    slug,
  };

  const updated = [created, ...products];
  saveStoredRentalProducts(updated);
  return created;
}
