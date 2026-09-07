// Seed / import script.
// ---------------------------------------------------------------------------
// Loads the original placeholder content into a Sanity dataset so the site
// looks identical after switching the data source to Sanity. Idempotent:
// documents use deterministic _ids and createOrReplace, so re-running just
// overwrites them.
//
// Usage:
//   1. Set NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET and a
//      write-enabled SANITY_API_TOKEN (in .env.local or the shell).
//   2. npm run seed
//
// The npm script loads .env.local via `node --env-file`. To pass env another
// way, just run `node scripts/seed.mjs` with the variables exported.
// ---------------------------------------------------------------------------
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
// SANITY_API_TOKEN is the canonical name; SANITY_API_WRITE_TOKEN kept as a fallback.
const token =
  process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || projectId === "your-project-id") {
  console.error(
    "✖ NEXT_PUBLIC_SANITY_PROJECT_ID is not set (or still the placeholder).\n" +
      "  Set your real project id before seeding — see README.",
  );
  process.exit(1);
}
if (!token) {
  console.error(
    "✖ SANITY_API_TOKEN is not set.\n" +
      "  Create an Editor/write token in the Sanity project (API → Tokens).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// --- Placeholder content (was lib/content/data.ts) --------------------------
// `order` added so display order is explicit and deterministic in Sanity.
const metrics = [
  { value: 3, label: "Decades in paint, coating and resin chemistry" },
  { value: 40, suffix: "+", label: "Formulations developed and transferred to production" },
  { value: 8, label: "States where we have commissioned plants" },
  { value: 200, suffix: "+", label: "Batch and QC protocols standardised for clients" },
];

const capabilities = [
  { icon: "flask", title: "Formulation development", description: "Interior and exterior emulsions, textures, enamels, primers, distempers and wall putty — built to defined performance targets." },
  { icon: "resin", title: "Resin & binder technology", description: "Selecting and tuning acrylic, styrene-acrylic, PU, alkyd and epoxy systems for cost, durability and compliance." },
  { icon: "plant", title: "Plant setup & process", description: "End-to-end guidance to launch a manufacturing unit: layout, machinery, process design and first production runs." },
  { icon: "optimise", title: "Process optimisation", description: "Cutting cost per litre, tightening cycle times and stabilising quality on lines that already run." },
  { icon: "diagnose", title: "Failure analysis", description: "Diagnosing cracking, blistering, poor scrub, flocculation and adhesion loss — then eliminating the root cause." },
  { icon: "qc", title: "QC, lab & testing", description: "Setting up test benches and protocols for durability, finish, weathering and eco-safety compliance." },
  { icon: "sourcing", title: "Raw-material sourcing", description: "Qualifying and sourcing binders, pigments, extenders and additives at the right grade and price." },
  { icon: "compliance", title: "Regulatory & VOC", description: "Reformulating for VOC limits and eco-labels without giving up scrub resistance or finish." },
];

const sectors = [
  { slug: "architectural", name: "Architectural & decorative", swatch: "arch", finishLabel: "Typical finish · matte emulsion",
    description: "Interior and exterior emulsions, textures, primers and putty for the building market — where opacity, washability and weathering decide repeat orders.",
    products: ["Interior emulsion", "Exterior emulsion", "Primer", "Wall putty", "Texture finish"] },
  { slug: "industrial", name: "Industrial & protective", swatch: "ind", finishLabel: "Typical finish · anti-corrosive, high-build",
    description: "Anti-corrosive, high-durability and heat-resistant coatings for demanding assets — measured on salt-spray hours, adhesion and film integrity, not shade cards.",
    products: ["Anti-corrosive primer", "Epoxy floor coating", "Heat-resistant enamel", "PU topcoat"] },
  { slug: "wood", name: "Wood & furniture", swatch: "wood", finishLabel: "Typical finish · clear & pigmented, satin",
    description: "Clear and pigmented finishes, sealers and stains with the right feel and clarity — where grain, hand-feel and non-yellowing matter as much as protection.",
    products: ["NC / PU sealer", "Clear lacquer", "Wood stain", "Melamine finish"] },
  { slug: "automotive", name: "Automotive & refinish", swatch: "auto", finishLabel: "Typical finish · high-gloss metallic",
    description: "Basecoats, topcoats and refinish systems where colour and gloss are unforgiving — flake orientation, distinctness-of-image and colour match leave no room to hide.",
    products: ["Metallic basecoat", "Clearcoat", "2K primer surfacer", "Refinish topcoat"] },
  { slug: "construction", name: "Construction chemicals", swatch: "const", finishLabel: "Typical finish · textured, trowel-applied",
    description: "Wall putty, waterproofing and allied products built alongside your paint range — the adjacent SKUs that widen a dealer's basket and your margin.",
    products: ["Wall putty", "Waterproof coating", "Tile adhesive", "Crack filler"] },
];

const approach = [
  { index: "Stage 01", title: "Diagnose", description: "Audit the formulation, process and QC data to find where cost, rejects or failure actually originate." },
  { index: "Stage 02", title: "Formulate", description: "Develop or correct the system against clear, agreed performance and cost targets." },
  { index: "Stage 03", title: "Validate", description: "Bench and pilot testing against relevant standards before a single production batch is made." },
  { index: "Stage 04", title: "Scale-up", description: "Transfer to production with documented protocols, so results hold batch after batch." },
];

const cases = [
  { tag: "Decorative emulsion · Western India", title: "Viscosity drift and heavy rework on a flagship emulsion line",
    challenge: "Batch-to-batch viscosity was swinging out of spec, driving reblends and rejects.",
    approach: "Reworked the thickener and dispersion system and rebuilt the in-process QC checks.",
    resultValue: "12% → <2%", resultNote: "Batch reject rate, within two production cycles" },
  { tag: "Protective enamel · South India", title: "An enamel failing salt-spray after a raw-material substitution",
    challenge: "A cost-driven binder swap had quietly destroyed corrosion performance.",
    approach: "Re-balanced the binder and additive package and re-qualified against ASTM B117.",
    resultValue: "500+ hrs", resultNote: "Salt-spray resistance restored, cost held flat" },
  { tag: "New plant · North India", title: "A putty and paint plant built with no prior formulation",
    challenge: "A new entrant with capital and a site, but no products or process.",
    approach: "Designed the line, developed three launch SKUs and commissioned first production.",
    resultValue: "3 SKUs", resultNote: "In market within the first commissioning phase" },
];

const insights = [
  { topic: "Resin selection", title: "Acrylic vs. styrene-acrylic vs. PU for exterior emulsions", excerpt: "A practical way to choose a binder when durability, cost and weathering all pull in different directions.", href: "#" },
  { topic: "Compliance", title: "Cutting VOC without losing scrub resistance", excerpt: "Where the trade-offs really sit when you reformulate for tighter emission limits and eco-labels.", href: "#" },
  { topic: "Troubleshooting", title: "Why your batch viscosity drifts — five usual causes", excerpt: "A short field guide to the most common reasons a stable formula starts moving out of spec.", href: "#" },
];

// --- Build documents with deterministic ids ---------------------------------
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const docs = [
  ...metrics.map((m, i) => ({ _id: `metric-${i}`, _type: "metric", order: i, ...m })),
  ...capabilities.map((c, i) => ({ _id: `capability-${c.icon}`, _type: "capability", order: i, ...c })),
  ...sectors.map((s, i) => ({
    _id: `sector-${s.slug}`,
    _type: "sector",
    order: i,
    ...s,
    slug: { _type: "slug", current: s.slug },
  })),
  ...approach.map((a, i) => ({ _id: `approach-${i}`, _type: "approachStep", order: i, ...a })),
  ...cases.map((c, i) => ({ _id: `case-${i}`, _type: "caseStudy", order: i, ...c })),
  ...insights.map((n, i) => ({ _id: `insight-${slugify(n.title)}`, _type: "insight", order: i, ...n })),
];

async function run() {
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit();
  console.log(`✔ Seeded ${docs.length} documents into ${projectId}/${dataset}.`);
}

run().catch((err) => {
  console.error("✖ Seed failed:", err.message || err);
  process.exit(1);
});
