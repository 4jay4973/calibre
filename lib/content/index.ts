// Content data-access layer.
// ---------------------------------------------------------------------------
// Every section imports its content from here — never from a hard-coded source.
// Today these return local placeholder data. When the CMS is chosen, reimplement
// each function to fetch from Sanity / WordPress. Components do NOT change.
//
// Example (Sanity) later:
//   import { sanityClient } from "./sanity";
//   export async function getSectors() {
//     return sanityClient.fetch(`*[_type == "sector"] | order(order asc){...}`);
//   }
// ---------------------------------------------------------------------------
import { siteContent } from "./data";
import type {
  Metric, Capability, Sector, ApproachStep, CaseStudy, Insight,
} from "./types";

export async function getMetrics(): Promise<Metric[]> { return siteContent.metrics; }
export async function getCapabilities(): Promise<Capability[]> { return siteContent.capabilities; }
export async function getSectors(): Promise<Sector[]> { return siteContent.sectors; }
export async function getApproach(): Promise<ApproachStep[]> { return siteContent.approach; }
export async function getCaseStudies(): Promise<CaseStudy[]> { return siteContent.cases; }
export async function getInsights(): Promise<Insight[]> { return siteContent.insights; }

export type * from "./types";
