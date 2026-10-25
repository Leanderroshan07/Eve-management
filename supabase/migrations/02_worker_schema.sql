-- ============================================================================
-- VELUXE EVENT MARKETPLACE - PHASE 4: WORKER ROLE SCHEMA
-- Independent Catering Workers, Specialized Event Staff & Direct Hiring
-- ============================================================================

-- 1. WORKERS TABLE
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role_title TEXT NOT NULL, -- e.g., 'Master Biryani & Royal South Indian Chef', 'Lead Scenographer'
    primary_category TEXT NOT NULL CHECK (primary_category IN ('chef', 'steward', 'scenographer', 'technician', 'helper')),
    bio TEXT NOT NULL,
    years_experience INTEGER NOT NULL DEFAULT 1,
    daily_base_rate NUMERIC(12, 2) NOT NULL, -- Indicative daily rate in INR
    currency TEXT NOT NULL DEFAULT 'INR',
    city TEXT NOT NULL,
    service_areas TEXT[] NOT NULL DEFAULT '{}',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    certifications TEXT[] NOT NULL DEFAULT '{}', -- e.g., ['FSSAI Food Hygiene Certified', 'Guild Scenography 2024']
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. WORKER PORTFOLIO SHOWCASE
CREATE TABLE IF NOT EXISTS public.worker_portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. DIRECT WORKER JOB REQUESTS (Custom Flat-Fee Offers)
CREATE TABLE IF NOT EXISTS public.worker_job_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT NOT NULL UNIQUE, -- e.g., 'WRK-2026-401'
    worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
    requester_type TEXT NOT NULL CHECK (requester_type IN ('customer', 'organizer')),
    requester_id TEXT NOT NULL,
    requester_name TEXT NOT NULL,
    requester_phone TEXT NOT NULL,
    requester_email TEXT NOT NULL,
    event_title TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date DATE NOT NULL,
    reporting_time TEXT NOT NULL, -- e.g. '06:00 AM'
    shift_duration_hours INTEGER NOT NULL DEFAULT 8,
    venue_name TEXT NOT NULL,
    venue_city TEXT NOT NULL,
    scope_of_work TEXT NOT NULL,
    proposed_fee NUMERIC(12, 2) NOT NULL, -- Proposed flat fee in INR
    counter_fee NUMERIC(12, 2), -- Worker counter-offer in INR
    worker_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'countered', 'declined', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CONFIRMED WORKER ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.worker_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_request_id UUID NOT NULL REFERENCES public.worker_job_requests(id) ON DELETE RESTRICT,
    worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
    requester_id TEXT NOT NULL,
    event_date DATE NOT NULL,
    agreed_fee NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_progress', 'completed', 'dispute')),
    payment_status TEXT NOT NULL DEFAULT 'escrow_locked' CHECK (payment_status IN ('pending', 'escrow_locked', 'settled', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. WORKER AVAILABILITY & COLLISION PREVENTION
CREATE TABLE IF NOT EXISTS public.worker_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    assignment_id UUID REFERENCES public.worker_assignments(id) ON DELETE SET NULL,
    reason TEXT, -- 'confirmed_event', 'personal_leave', etc.
    UNIQUE (worker_id, date)
);

-- INDEXES FOR FAST MARKETPLACE QUERIES
CREATE INDEX IF NOT EXISTS idx_workers_category ON public.workers(primary_category);
CREATE INDEX IF NOT EXISTS idx_workers_city ON public.workers(city);
CREATE INDEX IF NOT EXISTS idx_job_requests_worker_status ON public.worker_job_requests(worker_id, status);
CREATE INDEX IF NOT EXISTS idx_worker_availability_worker_date ON public.worker_availability(worker_id, date);
