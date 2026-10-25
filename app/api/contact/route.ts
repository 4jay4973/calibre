import { NextResponse } from "next/server";
import { isEnquiryStorageConfigured, saveEnquiry } from "@/lib/enquiries";

// Contact enquiry endpoint.
// ---------------------------------------------------------------------------
// Flow: honeypot -> Turnstile -> validate -> email via Resend -> save to Sanity.
// Confidential: enquiries go only to the consultant's inbox (Resend) and to the
// private "Enquiries" list in the Studio (lib/enquiries.ts). We never log
// enquiry contents anywhere.
//
// Delivery: the visitor sees success only if the enquiry was emailed OR saved.
//   - Neither channel configured -> production: 503 (never drop an enquiry
//     while telling the visitor it was sent); dev: accept with delivered:false.
//   - Both configured but both failed -> 502, visitor is asked to email instead.
// Turnstile: no secret set -> human check skipped (honeypot still enforced).
// ---------------------------------------------------------------------------

export const runtime = "nodejs";

const PROJECT_TYPES = [
  "Developing a new formulation",
  "Fixing a failing product",
  "Setting up a new plant",
  "Optimising an existing line",
  "Something else",
];

type Payload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  projectType?: unknown;
  message?: unknown;
  // Honeypot — must be empty. Named innocuously so bots fill it.
  companyWebsite?: unknown;
  turnstileToken?: unknown;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured -> skip gracefully (dev)
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function sendEmail(fields: {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}): Promise<{ delivered: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !to || !from) {
    return { delivered: false, reason: "email-not-configured" };
  }
  try {
    const lines = [
      `Name:    ${fields.name}`,
      `Email:   ${fields.email}`,
      fields.company ? `Company: ${fields.company}` : null,
      fields.phone ? `Phone:   ${fields.phone}` : null,
      `Type:    ${fields.projectType}`,
      "",
      fields.message,
    ].filter(Boolean);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: fields.email, // consultant can reply straight to the enquirer
        subject: `New enquiry — ${fields.projectType} — ${fields.name}`,
        text: lines.join("\n"),
      }),
    });

    if (!res.ok) {
      // Surface the failure without logging enquiry contents.
      console.error("Enquiry email failed: resend", res.status);
      return { delivered: false, reason: `resend-${res.status}` };
    }
    return { delivered: true };
  } catch {
    console.error("Enquiry email failed: network");
    return { delivered: false, reason: "resend-network" };
  }
}

const isEmailConfigured = () =>
  !!(process.env.RESEND_API_KEY && process.env.CONTACT_TO && process.env.CONTACT_FROM);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // 1) Honeypot — a filled hidden field means a bot. Silently accept and drop.
  if (str(body.companyWebsite)) {
    return NextResponse.json({ ok: true });
  }

  // 2) Turnstile (skipped in dev when no secret is set).
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const human = await verifyTurnstile(str(body.turnstileToken), ip);
  if (!human) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please retry the challenge." },
      { status: 400 },
    );
  }

  // 3) Server-side validation.
  const name = str(body.name);
  const company = str(body.company);
  const email = str(body.email);
  const phone = str(body.phone);
  const projectType = str(body.projectType);
  const message = str(body.message);

  const errors: Record<string, string> = {};
  if (!name || name.length > 120) errors.name = "Please enter your name.";
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (!PROJECT_TYPES.includes(projectType))
    errors.projectType = "Please choose what you need help with.";
  if (!message || message.length < 10) errors.message = "Please add a few details.";
  if (message.length > 5000) errors.message = "Message is too long.";
  if (company.length > 200) errors.company = "Company name is too long.";
  if (phone.length > 40) errors.phone = "Phone number is too long.";

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const fields = { name, company, email, phone, projectType, message };

  // 4) Nowhere to deliver it: never report success for an enquiry we'd drop.
  if (!isEmailConfigured() && !isEnquiryStorageConfigured) {
    if (process.env.NODE_ENV === "production") {
      console.error("Enquiry rejected: neither email nor storage is configured");
      return NextResponse.json(
        { ok: false, error: "Couldn't send right now. Please email us directly." },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, delivered: false, saved: false }); // dev only
  }

  // 5) Email the consultant, then save to the Studio (recording whether the email went out).
  const { delivered } = await sendEmail(fields);
  const saved = await saveEnquiry({ ...fields, emailDelivered: delivered });

  if (!delivered && !saved) {
    return NextResponse.json(
      { ok: false, error: "Couldn't send right now. Please email us directly." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, delivered, saved });
}
