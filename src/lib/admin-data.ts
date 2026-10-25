import {
  SEEDED_ORGANIZER,
  OrganizerBusiness,
} from "./organizer-data";
import {
  CURRENT_CUSTOMER,
  MARKETPLACE_ORGANIZERS,
  SEEDED_WORKERS,
  SEEDED_RENTALS,
} from "./customer-data";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "compliance_officer" | "moderator";
  avatar_url: string;
}

export interface PlatformAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "organizer" | "worker" | "rental_provider";
  city: string;
  status: "active" | "warned" | "suspended";
  verified: boolean;
  joined_date: string;
  metric_summary: string; // e.g. "480 Weddings Completed", "2 Bookings", "16 Inventory Units"
}

export interface ModerationReport {
  id: string;
  report_number: string;
  target_type: "account" | "package" | "booking";
  target_id: string;
  target_name: string;
  reporter_name: string;
  reporter_role: string;
  reason_category: "unresponsive" | "misleading_scope" | "breach_of_terms" | "damaged_equipment" | "pricing_dispute";
  description: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  resolution_notes?: string;
  created_at: string;
}

export interface DisputeCase {
  id: string;
  dispute_number: string;
  booking_reference: string;
  proposal_version: number;
  customer_name: string;
  organizer_name: string;
  disputed_amount: number;
  currency: string;
  customer_claim: string;
  organizer_defense: string;
  status: "open" | "arbitration_in_progress" | "settled" | "closed";
  ruling_summary?: string;
  settlement_amount?: number;
  created_at: string;
}

export interface AdminAuditLogEntry {
  id: string;
  timestamp: string;
  admin_name: string;
  admin_role: string;
  action_type: "issue_warning" | "suspend_account" | "reinstate_account" | "settle_dispute" | "resolve_report";
  target_entity: string;
  justification_notes: string;
}

// Current Admin Identity
export const CURRENT_ADMIN: AdminUser = {
  id: "adm-001",
  name: "Priya Chandrasekhar",
  email: "priya.c@veluxe-platform.gov",
  role: "compliance_officer",
  avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
};

// Seeded Unified Accounts Directory
export const SEEDED_PLATFORM_ACCOUNTS: PlatformAccount[] = [
  {
    id: "org-vks-001",
    name: "VKS Royal Wedding & Luxury Event Planners",
    email: "concierge@vksroyalweddings.com",
    phone: "+91 98401 23456",
    role: "organizer",
    city: "Chennai & Bengaluru",
    status: "active",
    verified: true,
    joined_date: "2024-03-15",
    metric_summary: "480 Weddings • Rating 4.96",
  },
  {
    id: "org-zahra-002",
    name: "Zahra Luxury Palace Weddings",
    email: "concierge@zahrapalaceweddings.com",
    phone: "+91 98290 11223",
    role: "organizer",
    city: "Udaipur",
    status: "active",
    verified: true,
    joined_date: "2024-06-10",
    metric_summary: "310 Weddings • Rating 4.94",
  },
  {
    id: "org-mayura-003",
    name: "Mayura Heritage Decor & Muhurtham",
    email: "hello@mayuraheritage.in",
    phone: "+91 99001 44556",
    role: "organizer",
    city: "Bengaluru",
    status: "active",
    verified: true,
    joined_date: "2024-08-20",
    metric_summary: "240 Weddings • Rating 4.92",
  },
  {
    id: "cust-101",
    name: "Vikram & Ananya Sundaram",
    email: "vikram.sundaram@gmail.com",
    phone: "+91 99402 88123",
    role: "customer",
    city: "Chennai",
    status: "active",
    verified: true,
    joined_date: "2025-01-12",
    metric_summary: "1 Inquiry • 1 Proposal v1 Pending",
  },
  {
    id: "cust-102",
    name: "Aditya & Sneha Rao",
    email: "aditya.rao@techcorp.in",
    phone: "+91 97910 44231",
    role: "customer",
    city: "Chennai",
    status: "active",
    verified: true,
    joined_date: "2024-11-05",
    metric_summary: "1 Confirmed Booking (BK-VKS-2027-018)",
  },
  {
    id: "wrk-01",
    name: "Chef Rajeshwar Swaminathan",
    email: "rajeshwar.chef@veluxeworx.in",
    phone: "+91 98402 33445",
    role: "worker",
    city: "Chennai",
    status: "active",
    verified: true,
    joined_date: "2024-05-18",
    metric_summary: "64 Completed Shifts • Rate ₹18,000/day",
  },
  {
    id: "rent-prov-01",
    name: "Apex Luxury Event Rentals",
    email: "inventory@apexrentals.co.in",
    phone: "+91 98840 77123",
    role: "rental_provider",
    city: "Chennai & Bengaluru",
    status: "active",
    verified: true,
    joined_date: "2024-04-02",
    metric_summary: "40 Listed Units • Zero Stock Conflicts",
  },
  {
    id: "rent-prov-02",
    name: "Shanti Stagecraft & Lighting Hire",
    email: "shanti.rentals@gmail.com",
    phone: "+91 97110 55662",
    role: "rental_provider",
    city: "Bengaluru",
    status: "warned",
    verified: false,
    joined_date: "2025-02-14",
    metric_summary: "1 Active Complaint (Delayed Delivery)",
  },
];

// Seeded Moderation Reports Queue
export const SEEDED_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: "rep-001",
    report_number: "REP-2026-042",
    target_type: "account",
    target_id: "rent-prov-02",
    target_name: "Shanti Stagecraft & Lighting Hire",
    reporter_name: "Vikram Sundaram",
    reporter_role: "Customer",
    reason_category: "unresponsive",
    description:
      "Provider failed to confirm delivery truck schedule for lighting trusses within the agreed 48-hour pre-event window.",
    status: "open",
    created_at: "2026-10-22T08:30:00Z",
  },
  {
    id: "rep-002",
    report_number: "REP-2026-043",
    target_type: "package",
    target_id: "pkg-royal-01",
    target_name: "Imperial Royal Palace Wedding",
    reporter_name: "Pooja Mehra",
    reporter_role: "Customer",
    reason_category: "misleading_scope",
    description:
      "Client inquired whether the 40ft Dome Mandap included imported Dutch Orchids or domestic stems. Clarification requested.",
    status: "investigating",
    created_at: "2026-10-21T14:15:00Z",
  },
];

// Seeded Dispute Arbitrations
export const SEEDED_DISPUTES: DisputeCase[] = [
  {
    id: "dsp-001",
    dispute_number: "DSP-2026-011",
    booking_reference: "BK-VKS-2027-018",
    proposal_version: 2,
    customer_name: "Aditya & Sneha Rao",
    organizer_name: "VKS Royal Wedding Planners",
    disputed_amount: 1003000,
    currency: "INR",
    customer_claim:
      "Due to hall booking constraints at ITC Grand Chola, event shift requested by 3 hours. Organizer requested ₹50,000 overtime steward surcharge. Client requests fee waiver under agreed Version 2 terms.",
    organizer_defense:
      "Overtime shifts for 15 traditional stewards past 11:00 PM require statutory union overtime pay not covered under base day rates in Proposal v2.",
    status: "arbitration_in_progress",
    created_at: "2026-10-22T11:00:00Z",
  },
];

// Seeded Audit Logs
export const SEEDED_AUDIT_LOGS: AdminAuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: "2026-10-21T09:15:00Z",
    admin_name: "Priya Chandrasekhar",
    admin_role: "Compliance Officer",
    action_type: "issue_warning",
    target_entity: "Shanti Stagecraft & Lighting Hire",
    justification_notes: "Formal warning issued regarding unresponsiveness on delivery confirmation.",
  },
  {
    id: "audit-002",
    timestamp: "2026-10-19T14:40:00Z",
    admin_name: "Priya Chandrasekhar",
    admin_role: "Compliance Officer",
    action_type: "resolve_report",
    target_entity: "REP-2026-039 (Mayura Heritage Decor)",
    justification_notes: "Clarification provided to customer. Priest coordination confirmed included in base package.",
  },
];

// Admin Operations / Mutations
export function updateAccountSanction(
  accountId: string,
  newStatus: "active" | "warned" | "suspended",
  justification: string,
  adminName: string
): PlatformAccount {
  const account = SEEDED_PLATFORM_ACCOUNTS.find((a) => a.id === accountId);
  if (!account) throw new Error("Account not found");

  account.status = newStatus;

  const logEntry: AdminAuditLogEntry = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    admin_name: adminName,
    admin_role: "Compliance Officer",
    action_type:
      newStatus === "suspended"
        ? "suspend_account"
        : newStatus === "warned"
        ? "issue_warning"
        : "reinstate_account",
    target_entity: `${account.name} (${account.role})`,
    justification_notes: justification,
  };

  SEEDED_AUDIT_LOGS.unshift(logEntry);
  return account;
}

export function resolveModerationReport(
  reportId: string,
  resolutionNotes: string,
  adminName: string
): ModerationReport {
  const report = SEEDED_MODERATION_REPORTS.find((r) => r.id === reportId);
  if (!report) throw new Error("Report not found");

  report.status = "resolved";
  report.resolution_notes = resolutionNotes;

  const logEntry: AdminAuditLogEntry = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    admin_name: adminName,
    admin_role: "Compliance Officer",
    action_type: "resolve_report",
    target_entity: `${report.report_number}: ${report.target_name}`,
    justification_notes: resolutionNotes,
  };

  SEEDED_AUDIT_LOGS.unshift(logEntry);
  return report;
}

export function settleDisputeCase(
  disputeId: string,
  rulingType: "uphold_contract" | "partial_settlement" | "full_cancellation",
  settlementAmount: number,
  rulingSummary: string,
  adminName: string
): DisputeCase {
  const dispute = SEEDED_DISPUTES.find((d) => d.id === disputeId);
  if (!dispute) throw new Error("Dispute not found");

  dispute.status = "settled";
  dispute.settlement_amount = settlementAmount;
  dispute.ruling_summary = rulingSummary;

  const logEntry: AdminAuditLogEntry = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    admin_name: adminName,
    admin_role: "Compliance Officer",
    action_type: "settle_dispute",
    target_entity: `${dispute.dispute_number} (${dispute.booking_reference})`,
    justification_notes: `Ruling: ${rulingType.toUpperCase()} | ${rulingSummary} | Settlement: ₹${settlementAmount.toLocaleString("en-IN")}`,
  };

  SEEDED_AUDIT_LOGS.unshift(logEntry);
  return dispute;
}
