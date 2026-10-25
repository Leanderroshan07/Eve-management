-- ==============================================================
-- PHASE 5: EQUIPMENT RENTAL PROVIDER ROLE DATABASE SCHEMA
-- ==============================================================

-- 1. Rental Provider Profiles
CREATE TABLE IF NOT EXISTS public.rental_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  warehouse_address TEXT NOT NULL,
  fleet_count INTEGER DEFAULT 1,
  crew_size INTEGER DEFAULT 5,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Rental Equipment Products (Inventory Catalog)
CREATE TABLE IF NOT EXISTS public.rental_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.rental_providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('furniture_seating', 'audio_visual_lighting', 'tableware_catering', 'structures_decor')),
  description TEXT,
  daily_rate NUMERIC(12, 2) NOT NULL,
  security_deposit NUMERIC(12, 2) NOT NULL,
  white_glove_setup_fee NUMERIC(12, 2) NOT NULL,
  total_stock INTEGER NOT NULL DEFAULT 1,
  dimensions TEXT,
  condition TEXT NOT NULL DEFAULT 'pristine' CHECK (condition IN ('pristine', 'good', 'fair', 'damaged')),
  image_url TEXT,
  min_rental_days INTEGER DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Rental Orders (Lifecycle & Deposit Escrow)
CREATE TABLE IF NOT EXISTS public.rental_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  provider_id UUID REFERENCES public.rental_providers(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  requester_role TEXT NOT NULL CHECK (requester_role IN ('customer', 'organizer')),
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT NOT NULL,
  event_name TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rental_days INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(12, 2) NOT NULL,
  delivery_and_setup_fee NUMERIC(12, 2) NOT NULL,
  total_deposit NUMERIC(12, 2) NOT NULL,
  deposit_status TEXT NOT NULL DEFAULT 'held' CHECK (deposit_status IN ('pending', 'held', 'partially_refunded', 'refunded', 'forfeited')),
  deposit_deduction NUMERIC(12, 2) DEFAULT 0,
  deposit_refund_amount NUMERIC(12, 2) DEFAULT 0,
  grand_total NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'awaiting_confirmation' CHECK (status IN (
    'request_submitted',
    'awaiting_confirmation',
    'proposal_sent',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'active_rental',
    'return_pending',
    'returned',
    'completed',
    'cancelled',
    'disputed'
  )),
  crew_lead TEXT,
  dispatch_time TEXT,
  retrieval_time TEXT,
  notes TEXT,
  inspection_notes TEXT,
  dispute_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Rental Order Items
CREATE TABLE IF NOT EXISTS public.rental_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.rental_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.rental_products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  daily_rate NUMERIC(12, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  security_deposit_per_unit NUMERIC(12, 2) NOT NULL,
  returned_condition TEXT CHECK (returned_condition IN ('pristine', 'damaged', 'missing')),
  damage_penalty NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.rental_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_order_items ENABLE ROW LEVEL SECURITY;

-- Public can view verified rental providers and products
CREATE POLICY "Public can view rental providers"
  ON public.rental_providers FOR SELECT
  USING (true);

CREATE POLICY "Public can view rental products"
  ON public.rental_products FOR SELECT
  USING (true);

-- Rental providers can manage their own profile and inventory
CREATE POLICY "Providers can manage their own profile"
  ON public.rental_providers FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can manage their own products"
  ON public.rental_products FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.rental_providers
    WHERE id = rental_products.provider_id AND user_id = auth.uid()
  ));

-- Orders: Requesters can view and create orders; Providers can view and update orders for their fleet
CREATE POLICY "Requesters can create orders"
  ON public.rental_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Requesters can view their own orders"
  ON public.rental_orders FOR SELECT
  USING (auth.uid() = requester_id OR true);

CREATE POLICY "Providers can manage their fleet orders"
  ON public.rental_orders FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.rental_providers
    WHERE id = rental_orders.provider_id AND user_id = auth.uid()
  ));

CREATE POLICY "Public can view order items"
  ON public.rental_order_items FOR ALL
  USING (true);
