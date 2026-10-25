// Content data-access layer.
// ---------------------------------------------------------------------------
// Every section imports its content from here — never from a hard-coded source.
// These getters now fetch from Sanity (see ./sanity.ts). Their signatures and
// return types are unchanged, so components do NOT change.
//
// Rendering stays statically generated with ISR: each fetch is tagged with a
// `revalidate` window (sanity/env.ts), so pages regenerate when content changes
// in /studio rather than rendering dynamically on every request.
//
// Until a real Sanity project is configured, the fetchers return empty arrays
// so `next build` succeeds without credentials (see sanity/env.ts and README).
// ---------------------------------------------------------------------------
import { cache } from "react";
import {
  fetchApproach,
  fetchCapabilities,
  fetchCaseStudies,
  fetchCaseStudyBySlug,
  fetchCaseStudySlugs,
  fetchInsightBySlug,
  fetchInsightSlugs,
  fetchInsights,
  fetchMetrics,
  fetchSectorBySlug,
  fetchSectorSlugs,
  fetchSectors,
  fetchServiceBySlug,
  fetchServiceSlugs,
  fetchSiteCopy,
} from "./sanity";
import type { SiteCopyDocument } from "./sanity";
import siteCopyDefaults from "./site-copy.defaults.json";
import siteCopyOptional from "./site-copy.optional.json";
import type {
  Metric, Capability, Sector, ApproachStep, CaseStudy, Insight,
  ServiceDetail, SectorDetail, CaseStudyDetail, InsightDetail, SiteCopy,
} from "./types";

// --- Homepage getters (unchanged signatures + return types) -----------------
// Where an item has a slug we attach a computed `href` to its detail page, so
// any card can deep-link straight from the getter without a component edit.
// Homepage sections that don't render `href` are unaffected.
export async function getMetrics(): Promise<Metric[]> { return fetchMetrics(); }
export async function getCapabilities(): Promise<Capability[]> {
  const caps = await fetchCapabilities();
  return caps.map((c) => (c.slug ? { ...c, href: `/services/${c.slug}` } : c));
}
export async function getSectors(): Promise<Sector[]> {
  const sectors = await fetchSectors();
  return sectors.map((s) => (s.slug ? { ...s, href: `/sectors/${s.slug}` } : s));
}
export async function getApproach(): Promise<ApproachStep[]> { return fetchApproach(); }
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const cases = await fetchCaseStudies();
  return cases.map((c) => (c.slug ? { ...c, href: `/work/${c.slug}` } : c));
}
// Insights link to their real article page when they have a slug. Computing the
// href here means the homepage insight cards (which read `href`) point at the
// article with no component edit; slug-less rows keep their stored href.
export async function getInsights(): Promise<Insight[]> {
  const insights = await fetchInsights();
  return insights.map((n) =>
    n.slug ? { ...n, href: `/insights/${n.slug}` } : n,
  );
}

// --- Site copy (singleton settings document) --------------------------------
// The default copy (site-copy.defaults.json) is the exact text the homepage
// shipped with; scripts/seed.mjs seeds the Sanity document from the same file.
const SITE_COPY_DEFAULTS: SiteCopy = siteCopyDefaults;

// Optional fields (no `required` validation in the schema) — see site-copy.optional.json.
const OPTIONAL_FIELDS = siteCopyOptional as unknown as Record<string, string[]>;

/**
 * Fill every field of the shape once the document exists:
 *  - OPTIONAL fields an editor cleared render empty (e.g. no chips), never the
 *    old placeholder.
 *  - REQUIRED fields can't be published empty, so a missing one means the
 *    document predates that field: use the default so the site never blanks.
 */
function normaliseSiteCopy(doc: SiteCopyDocument): SiteCopy {
  const out = {} as Record<string, Record<string, string | string[]>>;
  for (const [section, fields] of Object.entries(SITE_COPY_DEFAULTS)) {
    const stored = (doc[section as keyof SiteCopy] ?? {}) as Record<string, unknown>;
    const optional = new Set(OPTIONAL_FIELDS[section] ?? []);
    out[section] = {};
    for (const [key, fallback] of Object.entries(fields as Record<string, unknown>)) {
      const v = stored[key];
      if (Array.isArray(fallback)) {
        out[section][key] = Array.isArray(v)
          ? v.filter((x): x is string => typeof x === "string")
          : optional.has(key) ? [] : (fallback as string[]);
      } else {
        out[section][key] = typeof v === "string" && (v.trim() || optional.has(key))
          ? v
          : optional.has(key) ? "" : (fallback as string);
      }
    }
  }
  return out as unknown as SiteCopy;
}

/**
 * Homepage hero + section-heading copy and the About section.
 * Until the singleton exists in Sanity (not seeded yet, or Sanity not
 * configured) this returns the default copy, so the homepage never renders
 * blank. Wrapped in React `cache` so the sections that call it share one fetch
 * per request.
 */
export const getSiteCopy = cache(async (): Promise<SiteCopy> => {
  const doc = await fetchSiteCopy();
  return doc ? normaliseSiteCopy(doc) : SITE_COPY_DEFAULTS;
});

// --- Detail getters (for the internal page templates) -----------------------
// Each resolves cross-link references, so a page gets its related items in one
// call. They return null when the slug doesn't exist (or Sanity isn't set up).
export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> { return fetchServiceBySlug(slug); }
export async function getSectorBySlug(slug: string): Promise<SectorDetail | null> { return fetchSectorBySlug(slug); }
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyDetail | null> { return fetchCaseStudyBySlug(slug); }
export async function getInsightBySlug(slug: string): Promise<InsightDetail | null> { return fetchInsightBySlug(slug); }

// --- Slug lists (for generateStaticParams in the page templates) ------------
export async function getAllServiceSlugs(): Promise<string[]> { return fetchServiceSlugs(); }
export async function getAllSectorSlugs(): Promise<string[]> { return fetchSectorSlugs(); }
export async function getAllCaseStudySlugs(): Promise<string[]> { return fetchCaseStudySlugs(); }
export async function getAllInsightSlugs(): Promise<string[]> { return fetchInsightSlugs(); }

export type * from "./types";
