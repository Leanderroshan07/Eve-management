-- ==============================================================
-- PHASE 3: PLATFORM ADMINISTRATOR ROLE DATABASE SCHEMA
-- ==============================================================

-- 1. Admin Users & Permissions
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'compliance_officer', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Moderation Reports Queue
CREATE TABLE IF NOT EXISTS public.moderation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_number TEXT UNIQUE NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('account', 'package', 'booking', 'worker_assignment', 'rental_order')),
  target_id TEXT NOT NULL,
  target_name TEXT NOT NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL,
  reporter_role TEXT NOT NULL,
  reason_category TEXT NOT NULL CHECK (reason_category IN ('unresponsive', 'misleading_scope', 'breach_of_terms', 'damaged_equipment', 'pricing_dispute', 'other')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  resolution_notes TEXT,
  resolved_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Dispute Cases & Contractual Arbitration
CREATE TABLE IF NOT EXISTS public.dispute_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_number TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES public.confirmed_bookings(id) ON DELETE SET NULL,
  booking_reference TEXT NOT NULL,
  proposal_version INTEGER NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  organizer_id UUID REFERENCES public.organizer_profiles(id) ON DELETE SET NULL,
  organizer_name TEXT NOT NULL,
  disputed_amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  customer_claim TEXT NOT NULL,
  organizer_defense TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'arbitration_in_progress', 'settled', 'closed')),
  ruling_summary TEXT,
  settlement_amount NUMERIC(12, 2) DEFAULT 0,
  arbitrated_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Immutable Administrative Audit Trail
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_name TEXT NOT NULL,
  admin_role TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('issue_warning', 'suspend_account', 'reinstate_account', 'settle_dispute', 'resolve_report', 'permission_change')),
  target_entity TEXT NOT NULL,
  justification_notes TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only verified admins can read/write administrative tables
CREATE POLICY "Admins can view and manage admin records"
  ON public.admin_users
  FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

-- Admins can view and action moderation reports
CREATE POLICY "Admins can view and manage moderation reports"
  ON public.moderation_reports
  FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

-- Admins can view and arbitrate disputes
CREATE POLICY "Admins can view and arbitrate dispute cases"
  ON public.dispute_cases
  FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

-- Audit logs are append-only and readable only by admins
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs
  FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_logs
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));
