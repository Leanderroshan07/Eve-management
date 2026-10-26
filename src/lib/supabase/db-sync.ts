import { createClient } from "./client";
import { MARKETPLACE_ORGANIZERS } from "@/lib/customer-data";
import {
  getStoredRentalProducts,
  RentalProduct,
  RentalOrder,
} from "@/lib/rental-data";
import { SEEDED_WORKERS_DATA, WorkerProfile } from "@/lib/worker-data";
import { CustomerInquiry, Proposal, ConfirmedBooking } from "@/lib/organizer-data";

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
      .from("rental_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data.map((row) => ({
      id: row.id,
      providerId: row.provider_id,
      name: row.name,
      slug: row.slug || row.id,
      category: row.category,
      description: row.description || "",
      dailyRate: Number(row.daily_rate),
      securityDeposit: Number(row.security_deposit),
      whiteGloveSetupFee: Number(row.white_glove_setup_fee || 1500),
      totalStock: row.total_stock || 1,
      dimensions: row.dimensions || "Standard",
      condition: row.condition || "pristine",
      imageUrl: row.image_url || "",
      minRentalDays: row.min_rental_days || 1,
      features: row.features || [],
      tags: row.tags || [],
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
      role_title: row.role_title || "Event Professional",
      primary_category: row.primary_category || "chef",
      bio: row.bio || "",
      years_experience: row.years_experience || 8,
      daily_base_rate: Number(row.daily_base_rate || 20000),
      currency: row.currency || "INR",
      city: row.city,
      service_areas: row.service_areas || [row.city],
      rating: Number(row.rating),
      review_count: row.review_count || 1,
      avatar_url: row.avatar_url,
      phone: row.phone,
      email: row.email,
      certifications: row.certifications || [],
      is_verified: row.is_verified ?? true,
      is_available: row.is_available ?? true,
      specialties: [],
      portfolio: [],
      reviews: [],
    }));
  } catch (err) {
    console.warn("Live workers fetch warning, using fallback:", err);
    return SEEDED_WORKERS_DATA;
  }
}

// ============================================================================
// CUSTOMER & ORGANIZER WORKFLOW (INQUIRIES, PROPOSALS, BOOKINGS)
// ============================================================================

/**
 * Creates a customer quote inquiry in Supabase
 */
export async function createLiveCustomerInquiry(inquiry: CustomerInquiry): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Offline" };

  try {
    const { data, error } = await supabase
      .from("customer_inquiries")
      .insert({
        inquiry_number: inquiry.inquiry_number,
        organizer_id: inquiry.organizer_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        customer_name: inquiry.customer_name,
        customer_email: inquiry.customer_email,
        customer_phone: inquiry.customer_phone,
        event_type: inquiry.event_type,
        event_date: inquiry.event_date || new Date().toISOString().slice(0, 10),
        guest_count: inquiry.guest_count,
        estimated_budget: inquiry.estimated_budget,
        location: inquiry.location,
        notes: inquiry.notes,
        package_id: inquiry.package_id || null,
        status: inquiry.status || "pending",
      })
      .select()
      .single();

    if (error) {
      console.warn("Supabase customer_inquiries insert error:", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}

/**
 * Fetches customer inquiries from Supabase
 */
export async function fetchLiveCustomerInquiries(filter?: { customerEmail?: string; organizerId?: string }): Promise<CustomerInquiry[]> {
  const supabase = createClient();
  if (!supabase) return [];

  try {
    let query = supabase.from("customer_inquiries").select("*").order("created_at", { ascending: false });

    if (filter?.customerEmail) {
      query = query.ilike("customer_email", filter.customerEmail);
    } else if (filter?.organizerId) {
      query = query.eq("organizer_id", filter.organizerId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      inquiry_number: row.inquiry_number,
      organizer_id: row.organizer_id,
      customer_name: row.customer_name,
      customer_email: row.customer_email,
      customer_phone: row.customer_phone,
      event_type: row.event_type,
      event_date: row.event_date,
      guest_count: row.guest_count,
      estimated_budget: Number(row.estimated_budget || 0),
      location: row.location,
      notes: row.notes || "",
      status: row.status,
      package_id: row.package_id,
      created_at: row.created_at,
    }));
  } catch (err) {
    console.warn("Supabase fetch inquiries error:", err);
    return [];
  }
}

/**
 * Creates a proposal in Supabase
 */
export async function createLiveProposal(proposal: Proposal): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Offline" };

  try {
    const { data, error } = await supabase
      .from("proposals")
      .insert({
        inquiry_id: proposal.inquiry_id,
        organizer_id: proposal.organizer_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        proposal_number: proposal.proposal_number,
        version: proposal.version || 1,
        customer_name: proposal.customer_name,
        customer_email: proposal.customer_email,
        event_type: proposal.event_type,
        event_date: proposal.event_date || new Date().toISOString().slice(0, 10),
        venue_location: proposal.venue_location,
        items: proposal.items || [],
        subtotal: proposal.subtotal,
        tax_rate: proposal.tax_rate || 0.18,
        tax_amount: proposal.tax_amount,
        total_amount: proposal.total_amount,
        terms: proposal.terms,
        status: proposal.status || "sent_to_customer",
        organizer_accepted: proposal.organizer_accepted ?? true,
        customer_accepted: proposal.customer_accepted ?? false,
      })
      .select()
      .single();

    if (error) {
      console.warn("Supabase proposal insert error:", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}

/**
 * Fetches proposals from Supabase
 */
export async function fetchLiveProposals(filter?: { customerEmail?: string; organizerId?: string }): Promise<Proposal[]> {
  const supabase = createClient();
  if (!supabase) return [];

  try {
    let query = supabase.from("proposals").select("*").order("created_at", { ascending: false });

    if (filter?.customerEmail) {
      query = query.ilike("customer_email", filter.customerEmail);
    } else if (filter?.organizerId) {
      query = query.eq("organizer_id", filter.organizerId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      inquiry_id: row.inquiry_id,
      organizer_id: row.organizer_id,
      proposal_number: row.proposal_number,
      version: row.version,
      customer_name: row.customer_name,
      customer_email: row.customer_email,
      event_type: row.event_type,
      event_date: row.event_date,
      venue_location: row.venue_location,
      items: row.items || [],
      subtotal: Number(row.subtotal),
      tax_rate: Number(row.tax_rate || 0.18),
      tax_amount: Number(row.tax_amount),
      total_amount: Number(row.total_amount),
      terms: row.terms,
      status: row.status,
      organizer_accepted: row.organizer_accepted,
      customer_accepted: row.customer_accepted,
      accepted_version: row.accepted_version,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (err) {
    console.warn("Supabase fetch proposals error:", err);
    return [];
  }
}

/**
 * Accepts a proposal in Supabase and creates the confirmed booking record
 */
export async function acceptLiveProposal(proposal: Proposal): Promise<{ success: boolean; bookingReference?: string; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Offline" };

  try {
    // 1. Update proposal status in Supabase
    const { error: propErr } = await supabase
      .from("proposals")
      .update({
        status: "accepted",
        customer_accepted: true,
        accepted_version: proposal.version,
        updated_at: new Date().toISOString(),
      })
      .eq("id", proposal.id);

    if (propErr) console.warn("Supabase update proposal warning:", propErr);

    // 2. Insert into confirmed bookings
    const bookingRef = `VEL-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
    const { error: bookErr } = await supabase.from("organizer_bookings").insert({
      booking_reference: bookingRef,
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
    });

    if (bookErr) console.warn("Supabase booking insert warning:", bookErr);

    return { success: true, bookingReference: bookingRef };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error accepting proposal";
    return { success: false, error: message };
  }
}

/**
 * Fetches confirmed bookings from Supabase
 */
export async function fetchLiveBookings(filter?: { customerName?: string; organizerId?: string }): Promise<ConfirmedBooking[]> {
  const supabase = createClient();
  if (!supabase) return [];

  try {
    let query = supabase.from("organizer_bookings").select("*").order("created_at", { ascending: false });

    if (filter?.customerName) {
      query = query.ilike("customer_name", `%${filter.customerName}%`);
    } else if (filter?.organizerId) {
      query = query.eq("organizer_id", filter.organizerId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      booking_reference: row.booking_reference,
      inquiry_id: row.inquiry_id,
      proposal_id: row.proposal_id,
      proposal_version: row.proposal_version,
      organizer_id: row.organizer_id,
      customer_name: row.customer_name,
      customer_phone: row.customer_phone,
      event_type: row.event_type,
      event_date: row.event_date,
      venue_name: row.venue_name,
      total_amount: Number(row.total_amount),
      status: row.status,
      created_at: row.created_at,
    }));
  } catch (err) {
    console.warn("Supabase fetch bookings error:", err);
    return [];
  }
}

// ============================================================================
// RENTAL ORDERS WORKFLOW
// ============================================================================

/**
 * Creates a rental order in Supabase with exact database column names
 */
export async function createLiveRentalOrder(order: {
  orderNumber?: string;
  providerId: string;
  requesterRole?: "customer" | "organizer";
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  eventTitle?: string;
  eventName?: string;
  venueName?: string;
  venueCity?: string;
  venueAddress?: string;
  dispatchDate?: string;
  startDate?: string;
  returnDate?: string;
  endDate?: string;
  rentalDays?: number;
  status?: string;
  lineItems?: unknown[];
  totalRentalAmount?: number;
  subtotal?: number;
  securityDepositAmount?: number;
  totalDeposit?: number;
  logisticsFee?: number;
  deliveryAndSetupFee?: number;
  grandTotal?: number;
  whiteGloveNotes?: string;
  notes?: string;
}): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Offline" };

  try {
    const subtotal = order.subtotal ?? order.totalRentalAmount ?? 0;
    const deliveryFee = order.deliveryAndSetupFee ?? order.logisticsFee ?? 0;
    const deposit = order.totalDeposit ?? order.securityDepositAmount ?? 0;
    const grandTotal = order.grandTotal ?? (subtotal + deliveryFee + deposit);

    const { data, error } = await supabase
      .from("rental_orders")
      .insert({
        order_number: order.orderNumber || `RNT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        provider_id: order.providerId || "11111111-1111-4111-8111-111111111111",
        requester_role: order.requesterRole || "customer",
        requester_name: order.customerName || "Sarah Kapoor",
        requester_email: order.customerEmail || "sarah.kapoor@example.com",
        requester_phone: order.customerPhone || "+91 99402 88123",
        event_name: order.eventName || order.eventTitle || "Luxury Celebration",
        venue_name: order.venueName || "Private Luxury Estate",
        venue_address: order.venueAddress || order.venueCity || "Mumbai",
        start_date: order.startDate || order.dispatchDate || new Date().toISOString().slice(0, 10),
        end_date: order.endDate || order.returnDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        rental_days: order.rentalDays || 1,
        subtotal,
        delivery_and_setup_fee: deliveryFee,
        total_deposit: deposit,
        grand_total: grandTotal,
        deposit_status: "held",
        status: order.status || "awaiting_confirmation",
        notes: order.notes || order.whiteGloveNotes || "White-glove delivery requested via platform",
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
 * Fetches rental orders from Supabase
 */
export async function fetchLiveRentalOrders(filter?: { requesterEmail?: string; providerId?: string }): Promise<RentalOrder[]> {
  const supabase = createClient();
  if (!supabase) return [];

  try {
    let query = supabase.from("rental_orders").select("*").order("created_at", { ascending: false });

    if (filter?.requesterEmail) {
      query = query.ilike("requester_email", filter.requesterEmail);
    } else if (filter?.providerId) {
      query = query.eq("provider_id", filter.providerId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      providerId: row.provider_id,
      providerName: "AuraSound & Lumina FX",
      requesterRole: row.requester_role,
      requesterName: row.requester_name,
      requesterEmail: row.requester_email,
      requesterPhone: row.requester_phone,
      eventName: row.event_name,
      venueName: row.venue_name,
      venueAddress: row.venue_address || "",
      startDate: row.start_date,
      endDate: row.end_date,
      rentalDays: row.rental_days,
      items: [],
      subtotal: Number(row.subtotal),
      deliveryAndSetupFee: Number(row.delivery_and_setup_fee),
      totalDeposit: Number(row.total_deposit),
      depositStatus: row.deposit_status,
      depositDeduction: Number(row.deposit_deduction || 0),
      depositRefundAmount: Number(row.deposit_refund_amount || 0),
      grandTotal: Number(row.grand_total),
      status: row.status,
      crewLead: row.crew_lead || "White-Glove Rigging Crew",
      dispatchTime: row.dispatch_time || "08:30 AM",
      retrievalTime: row.retrieval_time || "02:00 AM",
      notes: row.notes || "",
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn("Supabase fetch rental orders error:", err);
    return [];
  }
}

/**
 * Updates order dispatch status in Supabase.
 */
export async function updateLiveOrderStatus(orderId: string, status: string) {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Offline" };

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
