// Content models. These shapes are what the site renders, and they map
// 1:1 to the fields you'll define in the CMS later (Sanity / WordPress).
// Swap the data source in lib/content/index.ts — these types stay the same.

export type SwatchKind = "arch" | "ind" | "wood" | "auto" | "const";
export type IconKey =
  | "flask" | "resin" | "plant" | "optimise"
  | "diagnose" | "qc" | "sourcing" | "compliance";

export interface Metric {
  value: number;
  suffix?: string;
  label: string;
}

export interface Capability {
  icon: IconKey;
  title: string;
  description: string;
}

export interface Sector {
  slug: string;
  name: string;
  swatch: SwatchKind;
  finishLabel: string;
  description: string;
  products: string[];
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
}

export interface Insight {
  topic: string;
  title: string;
  excerpt: string;
  href: string;
}

export interface SiteContent {
  metrics: Metric[];
  capabilities: Capability[];
  sectors: Sector[];
  approach: ApproachStep[];
  cases: CaseStudy[];
  insights: Insight[];
}
