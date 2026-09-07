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
  CaseStudyDetail,
  Insight,
  InsightDetail,
  Metric,
  Sector,
  SectorDetail,
  ServiceDetail,
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
async function sanityFetch<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!isSanityConfigured) return fallback;
  return sanityClient.fetch<T>(
    query,
    params,
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
    description,
    "slug": slug.current
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
    resultNote,
    "slug": slug.current
  }`;

export const insightsQuery = /* groq */ `
  *[_type == "insight"] | order(order asc) {
    topic,
    title,
    excerpt,
    href,
    "slug": slug.current,
    publishedAt,
    readMinutes
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

// --- Detail (by-slug) queries -----------------------------------------------
// Each resolves its cross-link references in the same query so a detail page
// gets everything in one round trip. `coalesce(refs[]->{...}, [])` guarantees an
// array (a missing field would otherwise project to null).

// Reusable projections for the compact reference shapes (*Ref in types.ts).
const serviceRefProjection = `{
    "slug": slug.current,
    title,
    icon,
    description
  }`;

const caseRefProjection = `{
    "slug": slug.current,
    title,
    tag,
    resultValue,
    resultNote
  }`;

const sectorRefProjection = `{
    "slug": slug.current,
    name,
    finishLabel,
    description
  }`;

export const serviceBySlugQuery = /* groq */ `
  *[_type == "capability" && slug.current == $slug][0]{
    icon,
    title,
    description,
    "slug": slug.current,
    overview,
    whatItCovers,
    whoItsFor,
    "relatedCaseStudies": coalesce(relatedCaseStudies[]->${caseRefProjection}, [])
  }`;

export const sectorBySlugQuery = /* groq */ `
  *[_type == "sector" && slug.current == $slug][0]{
    "slug": slug.current,
    name,
    swatch,
    finishLabel,
    description,
    products,
    "relatedServices": coalesce(relatedServices[]->${serviceRefProjection}, []),
    "relatedWork": coalesce(
      *[_type == "caseStudy" && references(^._id)] | order(order asc) ${caseRefProjection},
      []
    )
  }`;

export const caseStudyBySlugQuery = /* groq */ `
  *[_type == "caseStudy" && slug.current == $slug][0]{
    tag,
    title,
    challenge,
    approach,
    resultValue,
    resultNote,
    "slug": slug.current,
    bodyDetail,
    "sector": sector->${sectorRefProjection},
    "relatedServices": coalesce(relatedServices[]->${serviceRefProjection}, [])
  }`;

export const insightBySlugQuery = /* groq */ `
  *[_type == "insight" && slug.current == $slug][0]{
    topic,
    title,
    excerpt,
    href,
    "slug": slug.current,
    body,
    publishedAt,
    readMinutes
  }`;

// --- Slug-list queries (for generateStaticParams later) ---------------------
export const serviceSlugsQuery = /* groq */ `
  *[_type == "capability" && defined(slug.current)].slug.current`;
export const sectorSlugsQuery = /* groq */ `
  *[_type == "sector" && defined(slug.current)].slug.current`;
export const caseStudySlugsQuery = /* groq */ `
  *[_type == "caseStudy" && defined(slug.current)].slug.current`;
export const insightSlugsQuery = /* groq */ `
  *[_type == "insight" && defined(slug.current)].slug.current`;

// --- Typed detail fetchers --------------------------------------------------
// A missing document (or unconfigured Sanity) yields null.

export const fetchServiceBySlug = (slug: string) =>
  sanityFetch<ServiceDetail | null>(serviceBySlugQuery, null, { slug });

export const fetchSectorBySlug = (slug: string) =>
  sanityFetch<SectorDetail | null>(sectorBySlugQuery, null, { slug });

export const fetchCaseStudyBySlug = (slug: string) =>
  sanityFetch<CaseStudyDetail | null>(caseStudyBySlugQuery, null, { slug });

export const fetchInsightBySlug = (slug: string) =>
  sanityFetch<InsightDetail | null>(insightBySlugQuery, null, { slug });

export const fetchServiceSlugs = () =>
  sanityFetch<string[]>(serviceSlugsQuery, []);
export const fetchSectorSlugs = () =>
  sanityFetch<string[]>(sectorSlugsQuery, []);
export const fetchCaseStudySlugs = () =>
  sanityFetch<string[]>(caseStudySlugsQuery, []);
export const fetchInsightSlugs = () =>
  sanityFetch<string[]>(insightSlugsQuery, []);
