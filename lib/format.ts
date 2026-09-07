// Small presentational formatting helpers shared by the page templates.

/** Format an ISO date (e.g. "2025-05-22") as "22 May 2025". Returns null on
 *  missing/invalid input so callers can conditionally render. */
export function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
