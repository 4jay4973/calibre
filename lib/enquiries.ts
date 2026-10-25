// Server-only: stores contact-form enquiries in Sanity.
// ---------------------------------------------------------------------------
// Uses a write token (SANITY_API_WRITE_TOKEN, falling back to SANITY_API_TOKEN)
// that must never reach the browser — only import this from route handlers.
//
// Privacy: ids are "enquiries.<uuid>". Documents whose id contains a dot live in
// a sub-path, which a PUBLIC dataset does not serve to unauthenticated reads, so
// enquiries are visible only in the Studio (signed in) or with a token.
// ---------------------------------------------------------------------------
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

export const isEnquiryStorageConfigured = isSanityConfigured && !!token;

const writeClient = isEnquiryStorageConfigured
  ? createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" })
  : null;

export interface EnquiryInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  emailDelivered: boolean;
}

/** Returns true when the enquiry was stored. Never throws, never logs contents. */
export async function saveEnquiry(input: EnquiryInput): Promise<boolean> {
  if (!writeClient) return false;
  try {
    await writeClient.create({
      _id: `enquiries.${randomUUID()}`,
      _type: "enquiry",
      status: "new",
      submittedAt: new Date().toISOString(),
      ...input,
    });
    return true;
  } catch (err) {
    // Log only the failure type — never the enquiry itself.
    console.error("Enquiry storage failed:", (err as { statusCode?: number }).statusCode ?? "network");
    return false;
  }
}
