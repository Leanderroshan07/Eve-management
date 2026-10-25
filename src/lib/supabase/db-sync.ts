import { createClient } from "./client";
import { MARKETPLACE_ORGANIZERS } from "@/lib/customer-data";
import {
  getStoredRentalProducts,
  getStoredRentalProviders,
  RentalProduct,
  RentalProvider,
  RentalOrder,
} from "@/lib/rental-data";
import { SEEDED_WORKERS_DATA, WorkerProfile } from "@/lib/worker-data";

/**
 * Fetches published organizers from Supabase with graceful fallback to mock data.
 */
export async function fetchLiveOrganizers() {
  const supabase = createClient();
  if (!supabase) return MARKETPLACE_ORGANIZERS;

  try {
    const { data, error } = await supabase
      .from("organizer_profiles")
      .select("*")
      .eq("is_published", true)
      .order("rating", { ascending: false });

    if (error || !data || data.length === 0) {
      return MARKETPLACE_ORGANIZERS;
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.business_name,
      tagline: row.tagline,
      description: row.description,
      city: row.city,
      service_areas: row.service_areas || [],
      founded_year: row.founded_year,
      events_completed: row.events_completed,
      rating: Number(row.rating),
      review_count: row.review_count,
      logo_url: row.logo_url,
      cover_image_url: row.cover_image_url,
      is_published: row.is_published,
      contact_email: row.contact_email,
      contact_phone: row.contact_phone,
      socials: row.socials || {},
    }));
  } catch (err) {
    console.warn("Live organizers fetch warning, using fallback:", err);
    return MARKETPLACE_ORGANIZERS;
  }
}

/**
 * Fetches rental equipment inventory from Supabase with graceful fallback to stored data.
 */
export async function fetchLiveRentalEquipment(): Promise<RentalProduct[]> {
  const supabase = createClient();
  const fallback = getStoredRentalProducts();
  if (!supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from("equipment_inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data.map((row) => ({
      id: row.id,
      providerId: row.provider_id,
      name: row.name,
      slug: row.model_number?.toLowerCase() || row.id,
      category: row.category,
      description: row.description || "",
      dailyRate: Number(row.daily_rate),
      securityDeposit: Number(row.security_deposit),
      whiteGloveSetupFee: 1500,
      totalStock: row.quantity_total,
      dimensions: row.dimensions || "Standard",
      condition: row.condition,
      imageUrl: row.image_url,
      minRentalDays: 1,
      features: row.power_requirements ? [row.power_requirements] : [],
      tags: [],
    }));
  } catch (err) {
    console.warn("Live equipment fetch warning, using fallback:", err);
    return fallback;
  }
}

/**
 * Fetches event workers / staffing profiles from Supabase with graceful fallback.
 */
export async function fetchLiveWorkers(): Promise<WorkerProfile[]> {
  const supabase = createClient();
  if (!supabase) return SEEDED_WORKERS_DATA;

  try {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .order("rating", { ascending: false });

    if (error || !data || data.length === 0) {
      return SEEDED_WORKERS_DATA;
    }

    return data.map((row) => ({
      id: row.id,
      full_name: row.full_name,
      role_title: row.primary_role,
      primary_category: "chef",
      bio: row.bio || "",
      years_experience: 8,
      daily_base_rate: Number(row.hourly_rate) * 8,
      currency: row.currency || "INR",
      city: row.city,
      service_areas: [row.city],
      rating: Number(row.rating),
      review_count: row.completed_shifts,
      avatar_url: row.avatar_url,
      phone: row.phone,
      email: row.email,
      certifications: [],
      is_verified: row.is_verified,
      is_available: row.is_available,
      specialties: row.secondary_roles || [],
      portfolio: [],
      reviews: [],
    }));
  } catch (err) {
    console.warn("Live workers fetch warning, using fallback:", err);
    return SEEDED_WORKERS_DATA;
  }
}

/**
 * Creates a rental order in Supabase and returns success status.
 */
export async function createLiveRentalOrder(order: {
  providerId: string;
  customerId?: string;
  eventTitle: string;
  venueName: string;
  venueCity: string;
  dispatchDate: string;
  returnDate: string;
  status: string;
  lineItems: unknown[];
  totalRentalAmount: number;
  securityDepositAmount: number;
  logisticsFee?: number;
  damageFee?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  whiteGloveNotes?: string;
}) {
  const supabase = createClient();
  if (!supabase) return { success: false, isOffline: true };

  try {
    const { data, error } = await supabase
      .from("rental_orders")
      .insert({
        provider_id: order.providerId,
        customer_id: order.customerId || "demo-cust-001",
        event_title: order.eventTitle,
        venue_name: order.venueName,
        venue_city: order.venueCity,
        dispatch_date: order.dispatchDate,
        return_date: order.returnDate,
        status: order.status || "quote_requested",
        line_items: order.lineItems || [],
        total_rental_amount: order.totalRentalAmount,
        security_deposit_amount: order.securityDepositAmount,
        logistics_fee: order.logisticsFee || 0,
        damage_fee: order.damageFee || 0,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        white_glove_notes: order.whiteGloveNotes,
      })
      .select()
      .single();

    if (error) {
      console.warn("Supabase rental order insert warning:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}

/**
 * Updates order dispatch status in Supabase.
 */
export async function updateLiveOrderStatus(orderId: string, status: string) {
  const supabase = createClient();
  if (!supabase) return { success: false, isOffline: true };

  try {
    const { error } = await supabase
      .from("rental_orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}
