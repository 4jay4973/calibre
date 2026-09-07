import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { SANITY_TAG, CONTENT_TYPES } from "@/lib/content/sanity";

// On-demand revalidation webhook, called by Sanity on publish/create/update/delete.
// ---------------------------------------------------------------------------
// 1. Verify the request is genuinely from Sanity via the signed-webhook helper
//    (HMAC of the raw body against SANITY_REVALIDATE_SECRET). Reject otherwise.
// 2. Map the changed document's _type to its cache tag and revalidateTag() it,
//    so only that type's pages (and cross-linked pages tagged with it) refresh.
//    Unknown/absent _type falls back to the broad SANITY_TAG (refresh all).
//
// This is on top of the time-based ISR window in lib/content/sanity.ts, which
// stays as the fallback if the webhook is ever missed.
// ---------------------------------------------------------------------------

export const runtime = "nodejs"; // revalidateTag + signature crypto need Node

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Revalidation is not configured (missing secret)." },
      { status: 500 },
    );
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const body = await request.text(); // raw body — required for signature verification

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }

  let payload: { _type?: unknown };
  try {
    payload = JSON.parse(body) as { _type?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const type = typeof payload._type === "string" ? payload._type : "";
  const revalidated: string[] = [];

  if ((CONTENT_TYPES as readonly string[]).includes(type)) {
    revalidateTag(type); // refresh just this type's pages (+ cross-linked pages tagged with it)
    revalidated.push(type);
  } else {
    revalidateTag(SANITY_TAG); // unknown/absent _type -> refresh all content
    revalidated.push(SANITY_TAG);
  }

  return NextResponse.json({ ok: true, revalidated });
}
