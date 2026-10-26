-- ==============================================================
-- PHASE 6+: LIVE DATABASE SYNC FOR CUSTOMER & ORGANIZER WORKFLOW
-- Allows real and demo customers to create, view, and manage inquiries,
-- proposals, bookings, and rental orders in Supabase.
-- ==============================================================

-- 1. Policies for customer_inquiries
DROP POLICY IF EXISTS "Public can create inquiries" ON public.customer_inquiries;
CREATE POLICY "Public can create inquiries"
  ON public.customer_inquiries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view inquiries" ON public.customer_inquiries;
CREATE POLICY "Users can view inquiries"
  ON public.customer_inquiries FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update inquiries" ON public.customer_inquiries;
CREATE POLICY "Users can update inquiries"
  ON public.customer_inquiries FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 2. Policies for proposals
DROP POLICY IF EXISTS "Organizers and customers can manage proposals" ON public.proposals;
CREATE POLICY "Organizers and customers can manage proposals"
  ON public.proposals FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Policies for organizer_bookings
DROP POLICY IF EXISTS "Users can manage organizer bookings" ON public.organizer_bookings;
CREATE POLICY "Users can manage organizer bookings"
  ON public.organizer_bookings FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Policies for customer_profiles
DROP POLICY IF EXISTS "Public can view customer profiles" ON public.customer_profiles;
CREATE POLICY "Public can view customer profiles"
  ON public.customer_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can insert or update customer profiles" ON public.customer_profiles;
CREATE POLICY "Public can insert or update customer profiles"
  ON public.customer_profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Policies for rental orders and order items
DROP POLICY IF EXISTS "Public can manage rental orders" ON public.rental_orders;
CREATE POLICY "Public can manage rental orders"
  ON public.rental_orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Seed Demo Customer Profile (Sarah Kapoor)
INSERT INTO public.customer_profiles (
  id, full_name, email, phone, city
) VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'Sarah Kapoor',
  'sarah.kapoor@example.com',
  '+91 99402 88123',
  'Udaipur & Mumbai'
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  city = EXCLUDED.city;

-- 7. Seed Demo Inquiry (Sarah Kapoor -> Aura Events)
INSERT INTO public.customer_inquiries (
  id, inquiry_number, organizer_id, customer_name, customer_email,
  customer_phone, event_type, event_date, guest_count, estimated_budget,
  location, notes, package_id, status
) VALUES (
  '77777777-7777-4777-8777-777777777777',
  'INQ-2026-881',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Sarah Kapoor',
  'sarah.kapoor@example.com',
  '+91 99402 88123',
  'Royal Destination Wedding',
  '2026-11-20',
  650,
  3500000.00,
  'Jagmandir Island Palace, Udaipur',
  'Three-day destination wedding with Sangeet night on waterfront and Vedic wedding mandap ceremony.',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
  'proposal_sent'
) ON CONFLICT (inquiry_number) DO NOTHING;

-- 8. Seed Demo Proposal (Aura Events -> Sarah Kapoor)
INSERT INTO public.proposals (
  id, inquiry_id, organizer_id, proposal_number, version,
  customer_name, customer_email, event_type, event_date, venue_location,
  items, subtotal, tax_rate, tax_amount, total_amount, terms,
  status, organizer_accepted, customer_accepted
) VALUES (
  '88888888-8888-4888-8888-888888888888',
  '77777777-7777-4777-8777-777777777777',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'PROP-AURA-2026-004',
  1,
  'Sarah Kapoor',
  'sarah.kapoor@example.com',
  'Royal Destination Wedding',
  '2026-11-20',
  'Jagmandir Island Palace, Udaipur',
  '[
    {"item_id": "1", "name": "Bespoke Floral Mandap & Floating Lotus Stage", "quantity": 1, "unit_price": 1200000, "total": 1200000},
    {"item_id": "2", "name": "Concert-Grade Acoustic Audio Rig & Wireless Tubes", "quantity": 1, "unit_price": 850000, "total": 850000},
    {"item_id": "3", "name": "Turnkey Royal Hospitality & Protocol Management", "quantity": 1, "unit_price": 950000, "total": 950000},
    {"item_id": "4", "name": "Executive VIP Concierge & Guest Logistics Fleet", "quantity": 1, "unit_price": 500000, "total": 500000}
  ]'::jsonb,
  3500000.00,
  0.18,
  630000.00,
  4130000.00,
  '50% advance upon contract signing, 40% 14 days prior, 10% on event morning. Cancellation terms apply per Veluxe Standard Escrow.',
  'sent_to_customer',
  true,
  false
) ON CONFLICT (inquiry_id, version) DO NOTHING;

-- 9. Seed Confirmed Booking
INSERT INTO public.organizer_bookings (
  id, booking_reference, inquiry_id, proposal_id, proposal_version,
  organizer_id, customer_name, customer_phone, event_type, event_date,
  venue_name, total_amount, status
) VALUES (
  '99999999-9999-4999-8999-999999999999',
  'VEL-AURA-2026-001',
  '77777777-7777-4777-8777-777777777777',
  '88888888-8888-4888-8888-888888888888',
  1,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Sarah Kapoor',
  '+91 99402 88123',
  'Royal Destination Wedding',
  '2026-11-20',
  'Jagmandir Island Palace, Udaipur',
  4130000.00,
  'confirmed'
) ON CONFLICT (booking_reference) DO NOTHING;

-- 10. Seed Demo Rental Order (Sarah Kapoor -> AuraSound & Lumina FX)
INSERT INTO public.rental_orders (
  id, order_number, provider_id, requester_role, requester_name,
  requester_email, requester_phone, event_name, venue_name,
  start_date, end_date, rental_days, subtotal, delivery_and_setup_fee,
  total_deposit, grand_total, status
) VALUES (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'RNT-2026-001',
  '11111111-1111-4111-8111-111111111111',
  'customer',
  'Sarah Kapoor',
  'sarah.kapoor@example.com',
  '+91 99402 88123',
  'Sangeet Gala Night Illumination',
  'The Leela Palace, Udaipur',
  '2026-11-19',
  '2026-11-21',
  2,
  36000.00,
  4500.00,
  25000.00,
  65500.00,
  'confirmed'
) ON CONFLICT (order_number) DO NOTHING;
