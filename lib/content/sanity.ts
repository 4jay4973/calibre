// Typed Sanity client + GROQ queries.
// ---------------------------------------------------------------------------
// Read-only client reading the *published* perspective. Getters in ./index.ts
// use the `sanityFetch` helper, which:
//   - returns an empty result when Sanity isn't configured yet (so `next build`
//     works without an account — see sanity/env.ts), and
//   - caches per environment: uncached in dev (so published edits show on the
//     next reload, no cache-clearing), ISR in production (so pages stay
//     statically generated and refresh at most once per `revalidate` window).
//
// `useCdn: false` — reads hit the live API, not the cached CDN, so content is
// always current. (CDN can be reconsidered for production separately.)
// ---------------------------------------------------------------------------
import { createClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  revalidate,
} from "@/sanity/env";
import type {
  ApproachStep,
  Capability,
  CaseStudy,
  Insight,
  Metric,
  Sector,
} from "./types";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // always read the live API so published edits are fresh.
  perspective: "published",
});

const isDev = process.env.NODE_ENV === "development";

/**
 * Fetch from Sanity. Returns `fallback` when Sanity is not yet configured so the
 * production build can complete without credentials.
 *
 * Caching is per-environment:
 *   - dev: `no-store` — never cached, so a published edit appears on reload.
 *   - prod: `next: { revalidate }` — ISR, keeping pages statically generated.
 */
async function sanityFetch<T>(query: string, fallback: T): Promise<T> {
  if (!isSanityConfigured) return fallback;
  return sanityClient.fetch<T>(
    query,
    {},
    isDev ? { cache: "no-store" } : { next: { revalidate } },
  );
}

// --- GROQ queries -----------------------------------------------------------
// Each projection returns exactly the fields of the matching type in
// ./types.ts (no _id/_type), ordered by the `order` field.

export const metricsQuery = /* groq */ `
  *[_type == "metric"] | order(order asc) {
    value,
    suffix,
    label
  }`;

export const capabilitiesQuery = /* groq */ `
  *[_type == "capability"] | order(order asc) {
    icon,
    title,
    description
  }`;

export const sectorsQuery = /* groq */ `
  *[_type == "sector"] | order(order asc) {
    "slug": slug.current,
    name,
    swatch,
    finishLabel,
    description,
    products
  }`;

export const approachQuery = /* groq */ `
  *[_type == "approachStep"] | order(order asc) {
    index,
    title,
    description
  }`;

export const caseStudiesQuery = /* groq */ `
  *[_type == "caseStudy"] | order(order asc) {
    tag,
    title,
    challenge,
    approach,
    resultValue,
    resultNote
  }`;

export const insightsQuery = /* groq */ `
  *[_type == "insight"] | order(order asc) {
    topic,
    title,
    excerpt,
    href
  }`;

// --- Typed fetchers ---------------------------------------------------------

export const fetchMetrics = () =>
  sanityFetch<Metric[]>(metricsQuery, []);

export const fetchCapabilities = () =>
  sanityFetch<Capability[]>(capabilitiesQuery, []);

export const fetchSectors = () =>
  sanityFetch<Sector[]>(sectorsQuery, []);

export const fetchApproach = () =>
  sanityFetch<ApproachStep[]>(approachQuery, []);

export const fetchCaseStudies = () =>
  sanityFetch<CaseStudy[]>(caseStudiesQuery, []);

export const fetchInsights = () =>
  sanityFetch<Insight[]>(insightsQuery, []);
