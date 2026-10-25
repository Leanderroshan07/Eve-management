-- ==============================================================
-- PHASE 1: EVENT ORGANIZER ROLE DATABASE SCHEMA
-- ==============================================================

-- 1. Organizer Business Profiles
CREATE TABLE IF NOT EXISTS public.organizer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  city TEXT NOT NULL,
  service_areas TEXT[] DEFAULT '{}',
  founded_year INTEGER,
  events_completed INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  logo_url TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  socials JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Organizer Packages
CREATE TABLE IF NOT EXISTS public.service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES public.organizer_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  event_category TEXT NOT NULL,
  base_price NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  guest_capacity TEXT,
  image_url TEXT,
  inclusions TEXT[] DEFAULT '{}',
  items JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Customer Quote Inquiries
CREATE TABLE IF NOT EXISTS public.customer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_number TEXT UNIQUE NOT NULL,
  organizer_id UUID REFERENCES public.organizer_profiles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  guest_count INTEGER NOT NULL,
  estimated_budget NUMERIC(12, 2),
  location TEXT NOT NULL,
  notes TEXT,
  package_id UUID REFERENCES public.service_packages(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'proposal_sent', 'confirmed', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Proposals & Versioning (Strict Rule: Mutual Acceptance required on the same version)
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES public.customer_inquiries(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES public.organizer_profiles(id) ON DELETE CASCADE,
  proposal_number TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  venue_location TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12, 2) NOT NULL,
  tax_rate NUMERIC(4, 2) DEFAULT 0.18,
  tax_amount NUMERIC(12, 2) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  terms TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent_to_customer', 'changes_requested', 'accepted', 'rejected')),
  organizer_accepted BOOLEAN DEFAULT true,
  customer_accepted BOOLEAN DEFAULT false,
  accepted_version INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (inquiry_id, version)
);

-- 5. Confirmed Organizer Bookings
CREATE TABLE IF NOT EXISTS public.organizer_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  inquiry_id UUID REFERENCES public.customer_inquiries(id) ON DELETE RESTRICT,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE RESTRICT,
  proposal_version INTEGER NOT NULL,
  organizer_id UUID REFERENCES public.organizer_profiles(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  venue_name TEXT NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_preparation', 'staff_assigned', 'completed', 'cancelled', 'disputed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) policies
ALTER TABLE public.organizer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_bookings ENABLE ROW LEVEL SECURITY;
