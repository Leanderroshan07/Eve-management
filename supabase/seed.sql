-- ==============================================================
-- VELUXE MASTER SEED DATA: LIVE DATABASE POPULATION
-- ==============================================================

-- 1. Seed Organizer Profiles
INSERT INTO public.organizer_profiles (
  id, slug, business_name, tagline, description, city, service_areas,
  founded_year, events_completed, rating, review_count, logo_url, cover_image_url,
  is_published, is_verified, contact_email, contact_phone, socials
) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'aura-events',
  'Aura Events & Co.',
  'Curators of Grand Royal Destination Weddings & Galas',
  'Specialists in historic palaces, heritage forts, and luxury coastal weddings across Udaipur, Jaipur, and Goa. Full-service production, luxury staging, and royal hospitality.',
  'Udaipur',
  ARRAY['Udaipur', 'Jaipur', 'Jodhpur', 'Goa', 'Mumbai'],
  2014,
  142,
  4.95,
  88,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
  true,
  true,
  'concierge@auraevents.com',
  '+91 98200 11223',
  '{"instagram": "@auraevents", "website": "https://auraevents.com"}'::jsonb
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
  'royal-rajputana',
  'Royal Rajputana Celebrations',
  'Palatial Grandeur & Heritage Fort Nuptials',
  'Bringing Rajasthan''s architectural heritage to life with brass torchlit processions, bespoke floral mandaps, and Michelin-standard royal feasts.',
  'Jaipur',
  ARRAY['Jaipur', 'Udaipur', 'Delhi NCR', 'Agra'],
  2010,
  215,
  4.98,
  124,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=80',
  true,
  true,
  'contact@royalrajputana.in',
  '+91 98110 55443',
  '{"instagram": "@royalrajputanacelebrations"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Seed Organizer Packages
INSERT INTO public.service_packages (
  id, organizer_id, name, tagline, description, event_category,
  base_price, currency, guest_capacity, image_url, inclusions, is_published, featured
) VALUES
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'The Imperial Palace Grandeur',
  'Complete 3-Day Heritage Wedding Experience',
  'Turnkey production encompassing Sangeet night, Vedic wedding mandap ceremony, and grand reception with crystal chandeliers and synchronized live orchestra.',
  'Royal Wedding',
  3500000.00,
  'INR',
  '500 - 1,200 Guests',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
  ARRAY['Full Venue Rigging & 3D Lighting', 'Master Floral Mandap Design', 'Executive Hospitality Concierge', '50-Member Catering Crew Coordination'],
  true,
  true
),
(
  'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Sunset Coastal Nuptials',
  'Exclusive Beachfront Pavilion & Cocktail Soirée',
  'Designed for intimate luxury destination weddings in Goa. Features open-air glass pavilions, floating floral stage, and gourmet coastal seafood banquets.',
  'Beach Wedding',
  2200000.00,
  'INR',
  '200 - 450 Guests',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80',
  ARRAY['Clear Glass Marquee Installation', 'Boutique Mixology Bar Counter', 'Acoustic Beachfront Sound System', 'Custom Bamboo & White Linen Lounges'],
  true,
  false
)
ON CONFLICT DO NOTHING;

-- 3. Seed Worker Profiles (public.workers)
INSERT INTO public.workers (
  id, full_name, role_title, primary_category, city, service_areas,
  years_experience, daily_base_rate, currency, rating, review_count,
  avatar_url, phone, email, certifications, is_verified, is_available, bio
) VALUES
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55',
  'Chef Vikramaditya Roy',
  'Executive Banquet & Awadhi Master Chef',
  'chef',
  'Mumbai',
  ARRAY['Mumbai', 'Goa', 'Udaipur'],
  16,
  28000.00,
  'INR',
  4.98,
  142,
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=160&auto=format&fit=crop&q=80',
  '+91 98200 44332',
  'chef.vikram@roy.in',
  ARRAY['FSSAI Certified', 'Culinary Master Guild 2023'],
  true,
  true,
  'Former luxury palace executive sous-chef specializing in slow-cooked Awadhi dum pukht, royal Mughlai roasts, and modern plated celebratory courses.'
),
(
  'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f66',
  'Farhan Qureshi',
  'Head Banqueting & Protocol Captain',
  'steward',
  'Delhi NCR',
  ARRAY['Delhi NCR', 'Jaipur', 'Udaipur'],
  12,
  14500.00,
  'INR',
  4.92,
  98,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  '+91 98110 99887',
  'farhan.qureshi@service.in',
  ARRAY['Royal Protocol Certified', 'First Aid'],
  true,
  true,
  'Certified luxury hospitality captain managing white-glove floor service for head tables, VIP protocol coordination, and synchronized banquet service.'
)
ON CONFLICT (email) DO NOTHING;

-- 4. Seed Rental Providers
INSERT INTO public.rental_providers (
  id, name, slug, tagline, description, location, warehouse_address,
  fleet_count, crew_size, contact_email, contact_phone, specialties, is_verified
) VALUES
(
  '11111111-1111-4111-8111-111111111111',
  'AuraSound & Lumina FX',
  'aurasound-lumina',
  'Concert-Grade Acoustic Rigs & Architectural Event Illumination',
  'Premier event production supplier providing line array sound, intelligent wireless fixtures, 4K LED video backdrops, and atmospheric FX.',
  'South Mumbai & BKC, Mumbai',
  'Plot 42, Production Park, Lower Parel West, Mumbai 400013',
  8,
  24,
  'production@aurasound.in',
  '+91 98201 44550',
  ARRAY['L-Acoustics K2 Arrays', 'Astera Wireless Tubes', 'Pixel Mapping', 'P3 LED Screens'],
  true
),
(
  '22222222-2222-4222-8222-222222222222',
  'Palais Royale Tableware & Seating',
  'palais-royale-seating',
  'Fine European Banqueting Furniture & Hand-Cut Crystal Dining Collections',
  'Curators of exquisite celebratory dining settings. Offering gilded Louis XVI chairs, custom velvet banquet lounges, Baccarat stemware, and 24k gold chargers.',
  'Vasant Kunj & Aerocity, New Delhi',
  'Complex B, Grand Trunk Design Hub, Chattarpur, New Delhi 110074',
  12,
  36,
  'concierge@palaisroyale.in',
  '+91 98110 33221',
  ARRAY['French Louis Chairs', 'Gold Chafing Sets', 'Cut Glass Chandeliers', 'Hand-Dyed Damask'],
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Seed Rental Products
INSERT INTO public.rental_products (
  id, provider_id, name, slug, category, description,
  daily_rate, security_deposit, white_glove_setup_fee, total_stock,
  dimensions, condition, image_url, min_rental_days, features, tags
) VALUES
(
  '33333333-3333-4333-8333-333333333333',
  '11111111-1111-4111-8111-111111111111',
  'Astera Titan Wireless RGB Tube Set (Pack of 8)',
  'astera-titan-rgb-tube-set',
  'audio_visual_lighting',
  'Wireless battery-powered IP65 LED pixel tubes with high CRI/TLCI for flawless cinematic skin tones, wireless DMX control, and ambient pavilion accent lighting.',
  18000.00,
  25000.00,
  4500.00,
  12,
  '1035mm x Ø42mm per tube',
  'pristine',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
  1,
  ARRAY['Wireless CRMX & Bluetooth App Control', '20-Hour Battery Runtime', 'Tunable White + Full RGB'],
  ARRAY['Astera', 'Wireless', 'Ambient', 'Sangeet']
),
(
  '44444444-4444-4444-8444-444444444444',
  '22222222-2222-4222-8222-222222222222',
  'French Louis XVI Gilded Medallion Chairs (Set of 10)',
  'french-louis-xvi-gilded-chairs',
  'furniture_seating',
  'Hand-carved solid beechwood frames leafed in warm champagne gold, upholstered in ivory Italian damask velvet with double-piped perimeter trim.',
  12000.00,
  15000.00,
  3000.00,
  35,
  '98cm H x 50cm W x 55cm D',
  'pristine',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
  1,
  ARRAY['Authentic Hand-Carved Beechwood', 'High-Density Foam Cushioning', 'Protective Felt Floor Gliders'],
  ARRAY['Chairs', 'Gilded Gold', 'Royal Banqueting', 'Louis XVI']
)
ON CONFLICT DO NOTHING;

-- 6. Seed Platform Admin
INSERT INTO public.admin_users (
  id, email, full_name, role, is_active
) VALUES
(
  '55555555-5555-4555-8555-555555555555',
  'admin@veluxe.events',
  'Platform Operations Lead',
  'super_admin',
  true
)
ON CONFLICT (email) DO NOTHING;
