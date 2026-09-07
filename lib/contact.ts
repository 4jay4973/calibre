// Public contact details shown on the site (footer + contact section).
// Safe to expose — these are the published ways to reach the consultancy.
// One source of truth: override via NEXT_PUBLIC_* env, else the placeholders.
//
// NOTE: this is the *displayed* address. The inbox that enquiries are emailed to
// lives in the server-only CONTACT_TO env var (see app/api/contact/route.ts).

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@calibre-consulting.example";

/** Human-formatted phone for display. */
export const CONTACT_PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 00000 00000";

/** E.164 (with +) for tel: links. */
export const CONTACT_PHONE_TEL =
  process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL ||
  `+${CONTACT_PHONE_DISPLAY.replace(/[^\d]/g, "")}`;

/** Digits only (no +) for wa.me links. */
export const CONTACT_WHATSAPP =
  process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ||
  CONTACT_PHONE_TEL.replace(/[^\d]/g, "");

export const MAILTO = `mailto:${CONTACT_EMAIL}`;
export const TEL = `tel:${CONTACT_PHONE_TEL}`;
export const WHATSAPP_URL = `https://wa.me/${CONTACT_WHATSAPP}`;
