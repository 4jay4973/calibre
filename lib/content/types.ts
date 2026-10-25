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

// ---------------------------------------------------------------------------
// Site copy — the singleton "Homepage / Site copy" settings document
// (sanity/schemaTypes/siteCopy.ts). All plain text. The getter always returns
// every field (missing strings -> "", missing chips -> []).
// ---------------------------------------------------------------------------

/** Kicker + heading + intro: the standard homepage section header. */
export interface SectionHeadCopy {
  kicker: string;
  heading: string;
  intro: string;
}

export interface HeroCopy {
  eyebrow: string;
  /** Headline text before the highlighted word. */
  headlineStart: string;
  /** Rendered in the accent style (`.q`). Empty = no highlight. */
  highlightedWord: string;
  /** Headline text after the highlighted word. */
  headlineEnd: string;
  lead: string;
  ndaNote: string;
}

export interface ConfidentialityCopy extends SectionHeadCopy {
  secondParagraph: string;
}

export interface AboutCopy {
  kicker: string;
  heading: string;
  role: string;
  leadBio: string;
  secondBio: string;
  standards: string[];
}

/** Contact section: header + the public contact details (also used by the footer). */
export interface ContactCopy extends SectionHeadCopy {
  emailLabel: string;
  /** Public email shown on the site (mailto link). Not the enquiry inbox. */
  email: string;
  phoneLabel: string;
  /** Phone as displayed, e.g. "+91 98765 43210". tel: link uses its digits. */
  phone: string;
  /** WhatsApp number, digits with country code. Empty = use the phone number. */
  whatsapp: string;
  basedInLabel: string;
  basedIn: string;
}

export interface SiteCopy {
  hero: HeroCopy;
  capabilities: SectionHeadCopy;
  sectors: SectionHeadCopy;
  approach: SectionHeadCopy;
  cases: SectionHeadCopy;
  confidentiality: ConfidentialityCopy;
  insights: SectionHeadCopy;
  contact: ContactCopy;
  about: AboutCopy;
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
