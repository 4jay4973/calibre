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
} from "./sanity";
import type {
  Metric, Capability, Sector, ApproachStep, CaseStudy, Insight,
  ServiceDetail, SectorDetail, CaseStudyDetail, InsightDetail,
} from "./types";

// --- Homepage getters (unchanged signatures + return types) -----------------
export async function getMetrics(): Promise<Metric[]> { return fetchMetrics(); }
export async function getCapabilities(): Promise<Capability[]> { return fetchCapabilities(); }
export async function getSectors(): Promise<Sector[]> { return fetchSectors(); }
export async function getApproach(): Promise<ApproachStep[]> { return fetchApproach(); }
export async function getCaseStudies(): Promise<CaseStudy[]> { return fetchCaseStudies(); }
// Insights link to their real article page when they have a slug. Computing the
// href here means the homepage insight cards (which read `href`) point at the
// article with no component edit; slug-less rows keep their stored href.
export async function getInsights(): Promise<Insight[]> {
  const insights = await fetchInsights();
  return insights.map((n) =>
    n.slug ? { ...n, href: `/insights/${n.slug}` } : n,
  );
}

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
