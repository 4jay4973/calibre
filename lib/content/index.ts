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
  fetchInsights,
  fetchMetrics,
  fetchSectors,
} from "./sanity";
import type {
  Metric, Capability, Sector, ApproachStep, CaseStudy, Insight,
} from "./types";

export async function getMetrics(): Promise<Metric[]> { return fetchMetrics(); }
export async function getCapabilities(): Promise<Capability[]> { return fetchCapabilities(); }
export async function getSectors(): Promise<Sector[]> { return fetchSectors(); }
export async function getApproach(): Promise<ApproachStep[]> { return fetchApproach(); }
export async function getCaseStudies(): Promise<CaseStudy[]> { return fetchCaseStudies(); }
export async function getInsights(): Promise<Insight[]> { return fetchInsights(); }

export type * from "./types";
