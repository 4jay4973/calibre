// Public contact details shown on the site (footer + contact section).
// The values are edited in Sanity ("Homepage / Site copy" → Contact) and come
// from getSiteCopy(); this file only derives the links from them, so the footer
// and the contact section always agree.
//
// NOTE: this is the *displayed* address. The inbox that enquiries are emailed to
// lives in the server-only CONTACT_TO env var (see app/api/contact/route.ts).
import type { ContactCopy } from "@/lib/content/types";

export interface ContactLinks {
  email: string;
  phoneDisplay: string;
  mailto: string;
  /** tel: link, E.164 (+ and digits). */
  tel: string;
  /** wa.me link (digits only); falls back to the phone number. */
  whatsappUrl: string;
}

const digits = (s: string) => s.replace(/[^\d]/g, "");

export function contactLinks(contact: Pick<ContactCopy, "email" | "phone" | "whatsapp">): ContactLinks {
  const phoneTel = `+${digits(contact.phone)}`;
  const whatsapp = digits(contact.whatsapp) || digits(phoneTel);
  return {
    email: contact.email,
    phoneDisplay: contact.phone,
    mailto: `mailto:${contact.email}`,
    tel: `tel:${phoneTel}`,
    whatsappUrl: `https://wa.me/${whatsapp}`,
  };
}
