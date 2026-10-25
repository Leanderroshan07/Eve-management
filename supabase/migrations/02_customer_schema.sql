-- ==============================================================
-- PHASE 2: CUSTOMER ROLE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================

-- 1. Customer Profiles
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Customer Saved Organizers / Favorites
CREATE TABLE IF NOT EXISTS public.customer_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES public.organizer_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, organizer_id)
);

-- 3. Proposal Change Requests & Negotiation Audit Log
CREATE TABLE IF NOT EXISTS public.proposal_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  proposal_version INTEGER NOT NULL,
  requested_by UUID REFERENCES auth.users(id),
  change_notes TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Customer Verified Reviews
CREATE TABLE IF NOT EXISTS public.customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.confirmed_bookings(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES public.organizer_profiles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  client_names TEXT NOT NULL,
  event_type TEXT NOT NULL,
  venue TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_date DATE DEFAULT CURRENT_DATE,
  comment TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Customer can read and update their own profile
CREATE POLICY "Customers can manage their own profile"
  ON public.customer_profiles
  FOR ALL
  USING (auth.uid() = user_id);

-- Customer can manage their own favorites
CREATE POLICY "Customers can manage favorites"
  ON public.customer_favorites
  FOR ALL
  USING (customer_id IN (
    SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()
  ));

-- Proposals RLS: Customer can view proposals where their email or customer_id matches
CREATE POLICY "Customers can view their own proposals"
  ON public.proposals
  FOR SELECT
  USING (customer_email = (SELECT email FROM public.customer_profiles WHERE user_id = auth.uid()));

-- Customers can update proposal acceptance (customer_accepted and status)
CREATE POLICY "Customers can accept proposals"
  ON public.proposals
  FOR UPDATE
  USING (customer_email = (SELECT email FROM public.customer_profiles WHERE user_id = auth.uid()))
  WITH CHECK (customer_email = (SELECT email FROM public.customer_profiles WHERE user_id = auth.uid()));

-- Confirmed Bookings: Customers can view their confirmed bookings
CREATE POLICY "Customers can view confirmed bookings"
  ON public.confirmed_bookings
  FOR SELECT
  USING (customer_name = (SELECT full_name FROM public.customer_profiles WHERE user_id = auth.uid()));

-- Public can read verified reviews
CREATE POLICY "Public can view verified reviews"
  ON public.customer_reviews
  FOR SELECT
  USING (is_verified = true);
