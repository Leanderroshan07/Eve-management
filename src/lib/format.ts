/**
 * Formats a number as Indian Currency (INR ₹) using Indian numbering system (Lakhs and Crores).
 * Example: 250000 -> ₹2,50,000
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a standard date for event timelines.
 * Example: "2026-11-28" -> "28 Nov 2026"
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}
