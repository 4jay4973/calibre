// Content models. These shapes are what the site renders, and they map
// 1:1 to the fields defined in Sanity (see sanity/schemaTypes/*).
// Swap the data source in lib/content/index.ts — these types stay the same.
import type { PortableTextBlock } from "@portabletext/react";

export type SwatchKind = "arch" | "ind" | "wood" | "auto" | "const";
export type IconKey =
  | "flask" | "resin" | "plant" | "optimise"
  | "diagnose" | "qc" | "sourcing" | "compliance";

/** Portable Text — the array of blocks Sanity stores for rich body copy. */
export type PortableTextValue = PortableTextBlock[];

export interface Metric {
  value: number;
  suffix?: string;
  label: string;
}

export interface Capability {
  icon: IconKey;
  title: string;
  description: string;
  // --- Detail-page fields (optional; NOT used by the homepage card). ---
  slug?: string;
  /** Computed in the getter: `/services/{slug}` when a slug exists. */
  href?: string;
  overview?: string;
  whatItCovers?: string[];
  whoItsFor?: string;
}

export interface Sector {
  slug: string;
  name: string;
  swatch: SwatchKind;
  finishLabel: string;
  description: string;
  products: string[];
  /** Computed in the getter: `/sectors/{slug}`. */
  href?: string;
}

export interface ApproachStep {
  index: string;
  title: string;
  description: string;
}

export interface CaseStudy {
  tag: string;
  title: string;
  challenge: string;
  approach: string;
  resultValue: string;
  resultNote: string;
  // --- Detail-page fields (optional). Stays blinded — no client-identifying data. ---
  slug?: string;
  /** Computed in the getter: `/work/{slug}` when a slug exists. */
  href?: string;
  bodyDetail?: PortableTextValue;
}

export interface Insight {
  topic: string;
  title: string;
  excerpt: string;
  href: string;
  // --- Detail-page fields (optional; NOT used by the homepage card). ---
  slug?: string;
  body?: PortableTextValue;
  publishedAt?: string; // ISO date, e.g. "2025-03-14"
  readMinutes?: number;
}

export interface SiteContent {
  metrics: Metric[];
  capabilities: Capability[];
  sectors: Sector[];
  approach: ApproachStep[];
  cases: CaseStudy[];
  insights: Insight[];
}

// ---------------------------------------------------------------------------
// Cross-link resolution shapes — returned by the by-slug getters in index.ts.
// A detail page gets its related items resolved in a single query. The *Ref
// shapes are compact projections of a linked document (enough to render a card
// and a link); the *Detail shapes are the full page payloads.
// ---------------------------------------------------------------------------

export interface ServiceRef {
  slug: string;
  title: string;
  icon: IconKey;
  description: string;
}

export interface CaseStudyRef {
  slug: string;
  title: string;
  tag: string;
  resultValue: string;
  resultNote: string;
}

export interface SectorRef {
  slug: string;
  name: string;
  finishLabel: string;
  description: string;
}

/** Service (capability) detail page payload. */
export interface ServiceDetail extends Capability {
  slug: string;
  relatedCaseStudies: CaseStudyRef[];
}

/** Sector detail page payload. */
export interface SectorDetail extends Sector {
  relatedServices: ServiceRef[];
  /** Case studies that reference this sector (reverse lookup). */
  relatedWork: CaseStudyRef[];
}

/** Case-study detail page payload (still blinded). */
export interface CaseStudyDetail extends CaseStudy {
  slug: string;
  sector?: SectorRef;
  relatedServices: ServiceRef[];
}

/** Insight / article detail page payload. */
export interface InsightDetail extends Insight {
  slug: string;
}
