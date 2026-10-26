"use client";

import { AuthUser } from "@/lib/supabase/auth-context";
import {
  SEEDED_ORGANIZER,
  SEEDED_PACKAGES,
  SEEDED_INQUIRIES,
  SEEDED_PROPOSALS,
  SEEDED_BOOKINGS,
  OrganizerPackage,
  CustomerInquiry,
  Proposal,
  ConfirmedBooking,
  OrganizerBusiness,
} from "./organizer-data";
import {
  RentalProduct,
  RentalOrder,
  RentalProvider,
  CURRENT_RENTAL_PROVIDER,
  getStoredRentalProducts,
  getStoredRentalOrders,
  saveStoredRentalOrders,
} from "./rental-data";
import {
  createLiveCustomerInquiry,
  fetchLiveCustomerInquiries,
  createLiveProposal,
  fetchLiveProposals,
  acceptLiveProposal,
  fetchLiveBookings,
  createLiveRentalOrder,
  fetchLiveRentalOrders,
} from "./supabase/db-sync";

/**
 * Checks whether the current user is a seeded demo account.
 */
export function isSeededDemoUser(user: AuthUser | null): boolean {
  if (!user) return true; // Default guest acts as demo customer
  if (user.isDemo) return true;

  const demoEmails = [
    "sarah.kapoor@example.com",
    "concierge@auraevents.com",
    "vikram.mehta@staff.veluxe.com",
    "ops@soundlightpro.in",
    "admin@veluxe.luxury",
    "vikram.sundaram@gmail.com",
  ];
  return demoEmails.includes(user.email.toLowerCase());
}

function getUserKey(user: AuthUser | null, fallback = "demo-cust-001"): string {
  if (!user) return fallback;
  return user.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : user.id;
}

// ============================================================================
// CUSTOMER SCOPED DATA
// ============================================================================

export interface CustomerEventProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  eventDate: string;
  eventType: string;
  estimatedBudget: number;
  guestCount: number;
}

export function getScopedCustomerProfile(user: AuthUser | null): CustomerEventProfile {
  const userKey = getUserKey(user, "sarah_kapoor_example_com");
  if (typeof window !== "undefined") {
    const key = `veluxe_cust_profile_${userKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  if (!user || isSeededDemoUser(user)) {
    return {
      id: "d0000000-0000-0000-0000-000000000001",
      name: "Sarah Kapoor",
      email: "sarah.kapoor@example.com",
      phone: "+91 99402 88123",
      city: "Udaipur & Mumbai",
      eventDate: "2026-11-20",
      eventType: "Royal Destination Wedding",
      estimatedBudget: 3500000,
      guestCount: 650,
    };
  }

  return {
    id: user.id,
    name: user.name || "Event Host",
    email: user.email,
    phone: "+91 98000 12345",
    city: "Mumbai",
    eventDate: "2026-12-15",
    eventType: "Luxury Wedding Celebration",
    estimatedBudget: 2000000,
    guestCount: 400,
  };
}

export function saveScopedCustomerProfile(user: AuthUser, updates: Partial<CustomerEventProfile>) {
  if (typeof window === "undefined") return;
  const userKey = getUserKey(user, "sarah_kapoor_example_com");
  const current = getScopedCustomerProfile(user);
  const updated = { ...current, ...updates };
  localStorage.setItem(`veluxe_cust_profile_${userKey}`, JSON.stringify(updated));
}

export function getScopedCustomerInquiries(user: AuthUser | null): CustomerInquiry[] {
  const userKey = getUserKey(user, "sarah_kapoor_example_com");
  if (typeof window !== "undefined") {
    const key = `veluxe_inquiries_${userKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // Initialize with seeded items for demo user and persist
    if (!user || isSeededDemoUser(user)) {
      localStorage.setItem(key, JSON.stringify(SEEDED_INQUIRIES));
      return SEEDED_INQUIRIES;
    }
  }

  return !user || isSeededDemoUser(user) ? SEEDED_INQUIRIES : [];
}

export function addScopedCustomerInquiry(user: AuthUser | null, inquiry: CustomerInquiry) {
  const userKey = getUserKey(user, "sarah_kapoor_example_com");
  if (typeof window !== "undefined") {
    const current = getScopedCustomerInquiries(user);
    // Prevent duplicate entries
    const filtered = current.filter((i) => i.id !== inquiry.id && i.inquiry_number !== inquiry.inquiry_number);
    const updated = [inquiry, ...filtered];
    localStorage.setItem(`veluxe_inquiries_${userKey}`, JSON.stringify(updated));

    // Also broadcast to target organizer store so organizer sees it immediately
    const orgId = inquiry.organizer_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    const orgKey = `veluxe_org_inquiries_${orgId}`;
    try {
      const existingOrgInquiries: CustomerInquiry[] = JSON.parse(localStorage.getItem(orgKey) || "[]");
      const filteredOrg = existingOrgInquiries.filter((i) => i.id !== inquiry.id && i.inquiry_number !== inquiry.inquiry_number);
      localStorage.setItem(orgKey, JSON.stringify([inquiry, ...filteredOrg]));
    } catch (e) {
      console.warn(e);
    }
  }

  // Dual-write to live Supabase backend
  createLiveCustomerInquiry(inquiry).catch((err) => {
    console.warn("Background Supabase inquiry sync error:", err);
  });
}

export function getScopedCustomerProposals(user: AuthUser | null): Proposal[] {
  const userKey = getUserKey(user, "sarah_kapoor_example_com");
  if (typeof window !== "undefined") {
    const key = `veluxe_proposals_${userKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (!user || isSeededDemoUser(user)) {
      localStorage.setItem(key, JSON.stringify(SEEDED_PROPOSALS));
      return SEEDED_PROPOSALS;
    }
  }

  return !user || isSeededDemoUser(user) ? SEEDED_PROPOSALS : [];
}

export function acceptScopedCustomerProposal(
  user: AuthUser | null,
  proposalId: string
): { proposal: Proposal; booking: ConfirmedBooking } {
  const userKey = getUserKey(user, "sarah_kapoor_example_com");
  const currentProposals = getScopedCustomerProposals(user);
  const proposalIndex = currentProposals.findIndex((p) => p.id === proposalId);

  if (proposalIndex < 0) {
    throw new Error("Proposal not found");
  }

  const proposal = { ...currentProposals[proposalIndex] };
  proposal.customer_accepted = true;
  proposal.accepted_version = proposal.version;
  proposal.status = "accepted";
  proposal.updated_at = new Date().toISOString();

  currentProposals[proposalIndex] = proposal;

  // 1. Create confirmed booking
  const booking: ConfirmedBooking = {
    id: `bkg-${Date.now()}`,
    booking_reference: `VEL-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`,
    inquiry_id: proposal.inquiry_id,
    proposal_id: proposal.id,
    proposal_version: proposal.version,
    organizer_id: proposal.organizer_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    customer_name: proposal.customer_name,
    customer_phone: "+91 99402 88123",
    event_type: proposal.event_type,
    event_date: proposal.event_date,
    venue_name: proposal.venue_location,
    total_amount: proposal.total_amount,
    status: "confirmed",
    created_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    // Save updated proposals
    localStorage.setItem(`veluxe_proposals_${userKey}`, JSON.stringify(currentProposals));

    // Save new booking to customer's bookings
    const currentBookings = getScopedCustomerBookings(user);
    const updatedBookings = [booking, ...currentBookings.filter((b) => b.id !== booking.id)];
    localStorage.setItem(`veluxe_bookings_${userKey}`, JSON.stringify(updatedBookings));

    // Also broadcast to organizer's bookings store
    const orgId = proposal.organizer_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    const orgBookingKey = `veluxe_org_bookings_${orgId}`;
    try {
      const existingOrgBookings: ConfirmedBooking[] = JSON.parse(localStorage.getItem(orgBookingKey) || "[]");
      localStorage.setItem(orgBookingKey, JSON.stringify([booking, ...existingOrgBookings.filter((b) => b.id !== booking.id)]));
    } catch (e) {
      console.warn(e);
    }
  }

  // Dual-write to Supabase
  acceptLiveProposal(proposal).catch((err) => {
    console.warn("Background Supabase accept proposal error:", err);
  });

  return { proposal, booking };
}

export function getScopedCustomerBookings(user: AuthUser | null): ConfirmedBooking[] {
  const userKey = getUserKey(user, "sarah_kapoor_example_com");
  if (typeof window !== "undefined") {
    const key = `veluxe_bookings_${userKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (!user || isSeededDemoUser(user)) {
      localStorage.setItem(key, JSON.stringify(SEEDED_BOOKINGS));
      return SEEDED_BOOKINGS;
    }
  }

  return !user || isSeededDemoUser(user) ? SEEDED_BOOKINGS : [];
}

// ============================================================================
// ORGANIZER SCOPED DATA
// ============================================================================

export function getScopedOrganizerProfile(user: AuthUser | null): OrganizerBusiness {
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  if (typeof window !== "undefined") {
    const key = `veluxe_org_profile_${orgId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  if (!user || isSeededDemoUser(user)) {
    return SEEDED_ORGANIZER;
  }

  return {
    id: user.id,
    slug: `org-${user.id}`,
    name: user.businessName || `${user.name} Events & Production`,
    tagline: "Bespoke Palatial Weddings & Executive Gala Producers",
    description: "Welcome to our premier event design studio. We specialize in bespoke floral architectures, sound staging, and luxury hospitality.",
    city: "Mumbai",
    service_areas: ["Mumbai", "Goa", "Udaipur", "Delhi NCR"],
    founded_year: new Date().getFullYear(),
    events_completed: 1,
    rating: 5.0,
    review_count: 1,
    logo_url: user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
    is_published: true,
    contact_email: user.email,
    contact_phone: "+91 98200 44556",
    socials: {
      instagram: "@veluxeproductions",
    },
  };
}

export function saveScopedOrganizerProfile(user: AuthUser, updates: Partial<OrganizerBusiness>) {
  if (typeof window === "undefined") return;
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const current = getScopedOrganizerProfile(user);
  const updated = { ...current, ...updates };
  localStorage.setItem(`veluxe_org_profile_${orgId}`, JSON.stringify(updated));
}

export function getScopedOrganizerPackages(user: AuthUser | null): OrganizerPackage[] {
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  if (typeof window !== "undefined") {
    const key = `veluxe_org_packages_${orgId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (!user || isSeededDemoUser(user)) {
      localStorage.setItem(key, JSON.stringify(SEEDED_PACKAGES));
      return SEEDED_PACKAGES;
    }
  }

  return !user || isSeededDemoUser(user) ? SEEDED_PACKAGES : [];
}

export function saveScopedOrganizerPackage(user: AuthUser, pkg: OrganizerPackage) {
  if (typeof window === "undefined") return;
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const current = getScopedOrganizerPackages(user);
  const index = current.findIndex((p) => p.id === pkg.id);
  let updated: OrganizerPackage[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = pkg;
  } else {
    updated = [pkg, ...current];
  }
  localStorage.setItem(`veluxe_org_packages_${orgId}`, JSON.stringify(updated));

  // Sync to public marketplace registry
  updateGlobalMarketplacePackages(pkg);
}

export function deleteScopedOrganizerPackage(user: AuthUser, pkgId: string) {
  if (typeof window === "undefined") return;
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const current = getScopedOrganizerPackages(user);
  const updated = current.filter((p) => p.id !== pkgId);
  localStorage.setItem(`veluxe_org_packages_${orgId}`, JSON.stringify(updated));

  removeGlobalMarketplacePackage(pkgId);
}

export function getScopedOrganizerInquiries(user: AuthUser | null): CustomerInquiry[] {
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  if (typeof window !== "undefined") {
    const key = `veluxe_org_inquiries_${orgId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // Default to seeded inquiries for organizer
    localStorage.setItem(key, JSON.stringify(SEEDED_INQUIRIES));
  }

  return SEEDED_INQUIRIES;
}

export function getScopedOrganizerProposals(user: AuthUser | null): Proposal[] {
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  if (typeof window !== "undefined") {
    const key = `veluxe_org_proposals_${orgId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    localStorage.setItem(key, JSON.stringify(SEEDED_PROPOSALS));
  }

  return SEEDED_PROPOSALS;
}

export function saveScopedOrganizerProposal(user: AuthUser | null, proposal: Proposal) {
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  if (typeof window !== "undefined") {
    const current = getScopedOrganizerProposals(user);
    const updated = [proposal, ...current.filter((p) => p.id !== proposal.id)];
    localStorage.setItem(`veluxe_org_proposals_${orgId}`, JSON.stringify(updated));

    // Also broadcast to target customer
    const targetCustomerKey = proposal.customer_email.toLowerCase().replace(/[^a-z0-9]/g, "_");
    try {
      const custProposals: Proposal[] = JSON.parse(localStorage.getItem(`veluxe_proposals_${targetCustomerKey}`) || "[]");
      localStorage.setItem(`veluxe_proposals_${targetCustomerKey}`, JSON.stringify([proposal, ...custProposals.filter((p) => p.id !== proposal.id)]));
    } catch (e) {
      console.warn(e);
    }
  }

  // Dual-write to Supabase
  createLiveProposal(proposal).catch((err) => {
    console.warn("Background Supabase proposal sync error:", err);
  });
}

export function getScopedOrganizerBookings(user: AuthUser | null): ConfirmedBooking[] {
  const orgId = user?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  if (typeof window !== "undefined") {
    const key = `veluxe_org_bookings_${orgId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    localStorage.setItem(key, JSON.stringify(SEEDED_BOOKINGS));
  }

  return SEEDED_BOOKINGS;
}

// ============================================================================
// RENTER / RENTAL PROVIDER SCOPED DATA
// ============================================================================

export function getScopedRentalProviderProfile(user: AuthUser | null): RentalProvider {
  if (!user || isSeededDemoUser(user)) {
    return CURRENT_RENTAL_PROVIDER;
  }

  if (typeof window !== "undefined") {
    const key = `veluxe_rental_provider_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  return {
    id: user.id,
    name: user.businessName || `${user.name} Audio-Visual & Staging`,
    slug: `rental-${user.id}`,
    tagline: "White-Glove Production Gear, Staging & Luxury Furnishings",
    description: "Certified rental fleet with on-site technician rigging, white-glove logistics, and digital return inspections.",
    logoUrl: user.avatarUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=160&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewCount: 1,
    location: "Mumbai",
    warehouseAddress: "Plot 44, Industrial Estate, Mumbai",
    fleetCount: 0,
    crewSize: 6,
    contactEmail: user.email,
    contactPhone: "+91 98110 99887",
    specialties: ["Concert Audio", "Architectural Lighting", "Luxury Furniture"],
    verified: true,
  };
}

export function saveScopedRentalProviderProfile(user: AuthUser, updates: Partial<RentalProvider>) {
  if (typeof window === "undefined") return;
  const current = getScopedRentalProviderProfile(user);
  const updated = { ...current, ...updates };
  localStorage.setItem(`veluxe_rental_provider_${user.id}`, JSON.stringify(updated));
}

export function getScopedRentalProducts(user: AuthUser | null): RentalProduct[] {
  if (typeof window !== "undefined") {
    const userKey = user?.id || "11111111-1111-4111-8111-111111111111";
    const key = `veluxe_rentals_${userKey}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return getStoredRentalProducts();
}

export function saveScopedRentalProduct(user: AuthUser, product: RentalProduct) {
  if (typeof window === "undefined") return;
  const userKey = user?.id || "11111111-1111-4111-8111-111111111111";
  const current = getScopedRentalProducts(user);
  const index = current.findIndex((p) => p.id === product.id);
  let updated: RentalProduct[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    updated = [product, ...current];
  }
  localStorage.setItem(`veluxe_rentals_${userKey}`, JSON.stringify(updated));

  updateGlobalMarketplaceRental(product);
}

export function deleteScopedRentalProduct(user: AuthUser, productId: string) {
  if (typeof window === "undefined") return;
  const userKey = user?.id || "11111111-1111-4111-8111-111111111111";
  const current = getScopedRentalProducts(user);
  const updated = current.filter((p) => p.id !== productId);
  localStorage.setItem(`veluxe_rentals_${userKey}`, JSON.stringify(updated));

  removeGlobalMarketplaceRental(productId);
}

export function getScopedRentalOrders(user: AuthUser | null): RentalOrder[] {
  if (typeof window !== "undefined") {
    // If the user is a customer, return their customer orders
    if (user?.role === "customer" || !user?.role) {
      const userKey = getUserKey(user, "sarah_kapoor_example_com");
      const key = `veluxe_cust_rental_orders_${userKey}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.warn(e);
        }
      }
      // Fallback: search main orders list for this email
      const allOrders = getStoredRentalOrders();
      const customerEmail = user?.email || "sarah.kapoor@example.com";
      const matches = allOrders.filter((o) => o.requesterEmail?.toLowerCase() === customerEmail.toLowerCase());
      if (matches.length > 0) {
        localStorage.setItem(key, JSON.stringify(matches));
        return matches;
      }
    } else {
      // Rental provider role
      return getStoredRentalOrders();
    }
  }

  return getStoredRentalOrders();
}

export function addScopedRentalOrder(order: RentalOrder, user?: AuthUser | null) {
  if (typeof window === "undefined") return;
  // 1. Save to central stored rental orders
  const allOrders = getStoredRentalOrders();
  const updatedAll = [order, ...allOrders.filter((o) => o.id !== order.id)];
  saveStoredRentalOrders(updatedAll);

  // 2. Save to customer-scoped store
  const userKey = getUserKey(user || null, order.requesterEmail.toLowerCase().replace(/[^a-z0-9]/g, "_"));
  try {
    const custKey = `veluxe_cust_rental_orders_${userKey}`;
    const existingCust: RentalOrder[] = JSON.parse(localStorage.getItem(custKey) || "[]");
    localStorage.setItem(custKey, JSON.stringify([order, ...existingCust.filter((o) => o.id !== order.id)]));
  } catch (e) {
    console.warn(e);
  }

  // 3. Dual-write to live Supabase backend
  createLiveRentalOrder({
    orderNumber: order.orderNumber,
    providerId: order.providerId || "11111111-1111-4111-8111-111111111111",
    requesterRole: order.requesterRole,
    customerName: order.requesterName,
    customerEmail: order.requesterEmail,
    customerPhone: order.requesterPhone,
    eventName: order.eventName,
    venueName: order.venueName,
    venueAddress: order.venueAddress,
    startDate: order.startDate,
    endDate: order.endDate,
    rentalDays: order.rentalDays,
    subtotal: order.subtotal,
    deliveryAndSetupFee: order.deliveryAndSetupFee,
    totalDeposit: order.totalDeposit,
    grandTotal: order.grandTotal,
    status: order.status,
    notes: order.notes,
  }).catch((err) => {
    console.warn("Background Supabase rental order sync error:", err);
  });
}

// ============================================================================
// GLOBAL PUBLIC REGISTRY HELPERS (SHARED MARKETPLACE & STOREFRONT)
// ============================================================================

const GLOBAL_CUSTOM_PACKAGES_KEY = "veluxe_public_user_packages";
const GLOBAL_CUSTOM_RENTALS_KEY = "veluxe_public_user_rentals";

function updateGlobalMarketplacePackages(pkg: OrganizerPackage) {
  if (typeof window === "undefined") return;
  try {
    const existing: OrganizerPackage[] = JSON.parse(localStorage.getItem(GLOBAL_CUSTOM_PACKAGES_KEY) || "[]");
    const index = existing.findIndex((p) => p.id === pkg.id);
    if (index >= 0) {
      existing[index] = pkg;
    } else {
      existing.unshift(pkg);
    }
    localStorage.setItem(GLOBAL_CUSTOM_PACKAGES_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn(e);
  }
}

function removeGlobalMarketplacePackage(pkgId: string) {
  if (typeof window === "undefined") return;
  try {
    const existing: OrganizerPackage[] = JSON.parse(localStorage.getItem(GLOBAL_CUSTOM_PACKAGES_KEY) || "[]");
    const updated = existing.filter((p) => p.id !== pkgId);
    localStorage.setItem(GLOBAL_CUSTOM_PACKAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn(e);
  }
}

function updateGlobalMarketplaceRental(product: RentalProduct) {
  if (typeof window === "undefined") return;
  try {
    const existing: RentalProduct[] = JSON.parse(localStorage.getItem(GLOBAL_CUSTOM_RENTALS_KEY) || "[]");
    const index = existing.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      existing[index] = product;
    } else {
      existing.unshift(product);
    }
    localStorage.setItem(GLOBAL_CUSTOM_RENTALS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn(e);
  }
}

function removeGlobalMarketplaceRental(productId: string) {
  if (typeof window === "undefined") return;
  try {
    const existing: RentalProduct[] = JSON.parse(localStorage.getItem(GLOBAL_CUSTOM_RENTALS_KEY) || "[]");
    const updated = existing.filter((p) => p.id !== productId);
    localStorage.setItem(GLOBAL_CUSTOM_RENTALS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn(e);
  }
}

export function getAllPublicPackages(): OrganizerPackage[] {
  if (typeof window === "undefined") return SEEDED_PACKAGES;
  try {
    const custom: OrganizerPackage[] = JSON.parse(localStorage.getItem(GLOBAL_CUSTOM_PACKAGES_KEY) || "[]");
    return [...custom, ...SEEDED_PACKAGES];
  } catch {
    return SEEDED_PACKAGES;
  }
}

export function getAllPublicRentals(): RentalProduct[] {
  const base = getStoredRentalProducts();
  if (typeof window === "undefined") return base;
  try {
    const custom: RentalProduct[] = JSON.parse(localStorage.getItem(GLOBAL_CUSTOM_RENTALS_KEY) || "[]");
    return [...custom, ...base];
  } catch {
    return base;
  }
}
