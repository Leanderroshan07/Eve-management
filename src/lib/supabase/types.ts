export type UserRole = "customer" | "organizer" | "worker" | "rental_provider" | "admin";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizerProfile {
  id: string;
  user_id: string;
  business_name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  service_categories: string[];
  service_area: string;
  city: string;
  is_published: boolean;
  is_verified: boolean;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  organizer_id: string;
  name: string;
  description: string;
  event_category: string;
  base_price: number;
  currency: string;
  image_url?: string;
  inclusions: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  reference_no: string;
  customer_id: string;
  organizer_id: string;
  package_id?: string;
  event_date: string;
  total_price: number;
  currency: string;
  status:
    | "draft"
    | "request_submitted"
    | "under_review"
    | "proposal_sent"
    | "changes_requested"
    | "confirmed"
    | "rejected"
    | "cancelled"
    | "completed"
    | "disputed";
  created_at: string;
  updated_at: string;
}
