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
  CURRENT_CUSTOMER,
  CustomerProfile,
} from "./customer-data";
import {
  RentalProduct,
  RentalOrder,
  RentalProvider,
  CURRENT_RENTAL_PROVIDER,
  getStoredRentalProducts,
  getStoredRentalOrders,
} from "./rental-data";

/**
 * Checks whether the current user is a seeded demo account.
 */
export function isSeededDemoUser(user: AuthUser | null): boolean {
  if (!user) return false;
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
  if (!user || isSeededDemoUser(user)) {
    return {
      id: "demo-cust-001",
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

  if (typeof window !== "undefined") {
    const key = `veluxe_cust_profile_${user.id}`;
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
  const current = getScopedCustomerProfile(user);
  const updated = { ...current, ...updates };
  localStorage.setItem(`veluxe_cust_profile_${user.id}`, JSON.stringify(updated));
}

export function getScopedCustomerInquiries(user: AuthUser | null): CustomerInquiry[] {
  if (!user || isSeededDemoUser(user)) {
    return SEEDED_INQUIRIES;
  }

  if (typeof window !== "undefined") {
    const key = `veluxe_inquiries_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return [];
}

export function addScopedCustomerInquiry(user: AuthUser, inquiry: CustomerInquiry) {
  if (typeof window === "undefined") return;
  const current = getScopedCustomerInquiries(user);
  const updated = [inquiry, ...current];
  localStorage.setItem(`veluxe_inquiries_${user.id}`, JSON.stringify(updated));

  // Also broadcast to target organizer store
  const orgKey = `veluxe_org_inquiries_${inquiry.organizer_id || "general"}`;
  try {
    const existingOrgInquiries = JSON.parse(localStorage.getItem(orgKey) || "[]");
    localStorage.setItem(orgKey, JSON.stringify([inquiry, ...existingOrgInquiries]));
  } catch (e) {
    console.warn(e);
  }
}

export function getScopedCustomerProposals(user: AuthUser | null): Proposal[] {
  if (!user || isSeededDemoUser(user)) {
    return SEEDED_PROPOSALS;
  }
  if (typeof window !== "undefined") {
    const key = `veluxe_proposals_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return [];
}

export function getScopedCustomerBookings(user: AuthUser | null): ConfirmedBooking[] {
  if (!user || isSeededDemoUser(user)) {
    return SEEDED_BOOKINGS;
  }
  if (typeof window !== "undefined") {
    const key = `veluxe_bookings_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return [];
}

// ============================================================================
// ORGANIZER SCOPED DATA
// ============================================================================

export function getScopedOrganizerProfile(user: AuthUser | null): OrganizerBusiness {
  if (!user || isSeededDemoUser(user)) {
    return SEEDED_ORGANIZER;
  }

  if (typeof window !== "undefined") {
    const key = `veluxe_org_profile_${user.id}`;
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
  const current = getScopedOrganizerProfile(user);
  const updated = { ...current, ...updates };
  localStorage.setItem(`veluxe_org_profile_${user.id}`, JSON.stringify(updated));
}

export function getScopedOrganizerPackages(user: AuthUser | null): OrganizerPackage[] {
  if (!user || isSeededDemoUser(user)) {
    return SEEDED_PACKAGES;
  }

  if (typeof window !== "undefined") {
    const key = `veluxe_org_packages_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return [];
}

export function saveScopedOrganizerPackage(user: AuthUser, pkg: OrganizerPackage) {
  if (typeof window === "undefined") return;
  const current = getScopedOrganizerPackages(user);
  const index = current.findIndex((p) => p.id === pkg.id);
  let updated: OrganizerPackage[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = pkg;
  } else {
    updated = [pkg, ...current];
  }
  localStorage.setItem(`veluxe_org_packages_${user.id}`, JSON.stringify(updated));

  // Sync to public marketplace registry
  updateGlobalMarketplacePackages(pkg);
}

export function deleteScopedOrganizerPackage(user: AuthUser, pkgId: string) {
  if (typeof window === "undefined") return;
  const current = getScopedOrganizerPackages(user);
  const updated = current.filter((p) => p.id !== pkgId);
  localStorage.setItem(`veluxe_org_packages_${user.id}`, JSON.stringify(updated));

  // Remove from public marketplace registry
  removeGlobalMarketplacePackage(pkgId);
}

export function getScopedOrganizerInquiries(user: AuthUser | null): CustomerInquiry[] {
  if (!user || isSeededDemoUser(user)) {
    return SEEDED_INQUIRIES;
  }

  if (typeof window !== "undefined") {
    const key = `veluxe_org_inquiries_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return [];
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
  if (!user || isSeededDemoUser(user)) {
    return getStoredRentalProducts();
  }

  if (typeof window !== "undefined") {
    const key = `veluxe_rentals_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return [];
}

export function saveScopedRentalProduct(user: AuthUser, product: RentalProduct) {
  if (typeof window === "undefined") return;
  const current = getScopedRentalProducts(user);
  const index = current.findIndex((p) => p.id === product.id);
  let updated: RentalProduct[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    updated = [product, ...current];
  }
  localStorage.setItem(`veluxe_rentals_${user.id}`, JSON.stringify(updated));

  // Also make available in public rentals storefront
  updateGlobalMarketplaceRental(product);
}

export function deleteScopedRentalProduct(user: AuthUser, productId: string) {
  if (typeof window === "undefined") return;
  const current = getScopedRentalProducts(user);
  const updated = current.filter((p) => p.id !== productId);
  localStorage.setItem(`veluxe_rentals_${user.id}`, JSON.stringify(updated));

  // Remove from public storefront
  removeGlobalMarketplaceRental(productId);
}

export function getScopedRentalOrders(user: AuthUser | null): RentalOrder[] {
  if (!user || isSeededDemoUser(user)) {
    return getStoredRentalOrders();
  }

  if (typeof window !== "undefined") {
    const key = `veluxe_rental_orders_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return [];
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

/**
 * Returns all public packages for the Marketplace:
 * Seeded packages + any newly created packages published by user accounts.
 */
export function getAllPublicPackages(): OrganizerPackage[] {
  if (typeof window === "undefined") return SEEDED_PACKAGES;
  try {
    const custom: OrganizerPackage[] = JSON.parse(localStorage.getItem(GLOBAL_CUSTOM_PACKAGES_KEY) || "[]");
    return [...custom, ...SEEDED_PACKAGES];
  } catch {
    return SEEDED_PACKAGES;
  }
}

/**
 * Returns all public rental equipment for the Rentals Storefront:
 * Seeded rental products + any newly created products cataloged by renter accounts.
 */
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
