// Seed / import script.
// ---------------------------------------------------------------------------
// Loads the placeholder content into a Sanity dataset so the site looks
// identical after switching the data source to Sanity, and wires the slugs,
// detail/body copy and cross-links the internal page templates will use.
//
// Idempotent: documents use deterministic _ids and createOrReplace, so
// re-running just overwrites them. References resolve within the single
// transaction (referrers and referees are committed together).
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

// --- Helpers ----------------------------------------------------------------
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
const slug = (current) => ({ _type: "slug", current });
// Single reference (no _key); array-item reference (needs a unique _key).
const sref = (id) => ({ _type: "reference", _ref: id });
const aref = (id) => ({ _type: "reference", _ref: id, _key: id });
// Portable Text: one normal block per paragraph, with deterministic keys.
const pt = (paragraphs) =>
  paragraphs.map((text, i) => ({
    _type: "block",
    _key: `b${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `b${i}s0`, text, marks: [] }],
  }));

// --- Placeholder content (was lib/content/data.ts) --------------------------
// `order` added so display order is explicit and deterministic in Sanity.
// Detail fields (slug, overview, body, cross-links) are optional in the schema
// and only feed the future detail pages — the homepage ignores them.
const metrics = [
  { value: 3, label: "Decades in paint, coating and resin chemistry" },
  { value: 40, suffix: "+", label: "Formulations developed and transferred to production" },
  { value: 8, label: "States where we have commissioned plants" },
  { value: 200, suffix: "+", label: "Batch and QC protocols standardised for clients" },
];

// icon doubles as the stable id suffix (capability-<icon>).
const capabilities = [
  { icon: "flask", title: "Formulation development", description: "Interior and exterior emulsions, textures, enamels, primers, distempers and wall putty — built to defined performance targets.",
    overview: "We develop paint and coating systems from a written performance brief — opacity, scrub, weathering, dry time, cost per litre — and hand back a formula your plant can actually make.",
    whatItCovers: ["Interior & exterior emulsions", "Enamels, primers and putties", "Cost-down reformulation", "Lab-to-line scale-up"],
    whoItsFor: "Manufacturers launching a new range, or fixing one that never quite hit its targets." },
  { icon: "resin", title: "Resin & binder technology", description: "Selecting and tuning acrylic, styrene-acrylic, PU, alkyd and epoxy systems for cost, durability and compliance.",
    overview: "The binder decides most of a coating's cost and durability. We match the resin chemistry to the job and tune the wider system around it.",
    whatItCovers: ["Binder selection & benchmarking", "Acrylic / styrene-acrylic / PU / alkyd / epoxy", "Additive and rheology balancing"],
    whoItsFor: "Teams choosing a binder, or absorbing a supplier's grade change without losing performance." },
  { icon: "plant", title: "Plant setup & process", description: "End-to-end guidance to launch a manufacturing unit: layout, machinery, process design and first production runs.",
    overview: "From an empty shed to a running line: layout, equipment specification, process design and the first commissioning batches.",
    whatItCovers: ["Plant layout & machinery spec", "Process design", "Commissioning & first production runs"],
    whoItsFor: "New entrants and manufacturers adding a second site or product line." },
  { icon: "optimise", title: "Process optimisation", description: "Cutting cost per litre, tightening cycle times and stabilising quality on lines that already run.",
    overview: "For lines already in production, we find where cost, time and rejects leak out — then close the gaps without a capital project.",
    whatItCovers: ["Cost-per-litre reduction", "Cycle-time & throughput", "Batch-to-batch consistency"],
    whoItsFor: "Established plants under margin or capacity pressure." },
  { icon: "diagnose", title: "Failure analysis", description: "Diagnosing cracking, blistering, poor scrub, flocculation and adhesion loss — then eliminating the root cause.",
    overview: "We trace a field or lab failure back to its root cause in the formulation or process, and prove the fix before it reaches production.",
    whatItCovers: ["Cracking, blistering, chalking", "Adhesion loss & flocculation", "Root-cause reformulation"],
    whoItsFor: "Manufacturers facing returns, complaints or a sudden quality drop." },
  { icon: "qc", title: "QC, lab & testing", description: "Setting up test benches and protocols for durability, finish, weathering and eco-safety compliance.",
    overview: "We build the QC function: which tests, on what equipment, at which control points — so quality is measured, not hoped for.",
    whatItCovers: ["Test bench & equipment setup", "In-process & release protocols", "Durability & weathering methods"],
    whoItsFor: "Plants standardising quality, or preparing for audits and larger buyers." },
  { icon: "sourcing", title: "Raw-material sourcing", description: "Qualifying and sourcing binders, pigments, extenders and additives at the right grade and price.",
    overview: "We qualify raw materials against the formula's real requirements and open up alternate, better-priced grades without surprises.",
    whatItCovers: ["Grade qualification", "Alternate-vendor approval", "Pigment, extender & additive selection"],
    whoItsFor: "Buyers and technical teams de-risking supply or chasing input cost." },
  { icon: "compliance", title: "Regulatory & VOC", description: "Reformulating for VOC limits and eco-labels without giving up scrub resistance or finish.",
    overview: "We reformulate to meet VOC limits and eco-label criteria while holding the performance and finish the market expects.",
    whatItCovers: ["VOC reduction", "Eco-label criteria", "Low-emission reformulation"],
    whoItsFor: "Manufacturers meeting tighter emission rules or green-procurement demands." },
];

const sectors = [
  { slug: "architectural", name: "Architectural & decorative", swatch: "arch", finishLabel: "Typical finish · matte emulsion",
    description: "Interior and exterior emulsions, textures, primers and putty for the building market — where opacity, washability and weathering decide repeat orders.",
    products: ["Interior emulsion", "Exterior emulsion", "Primer", "Wall putty", "Texture finish"],
    relatedServices: [aref("capability-flask"), aref("capability-optimise"), aref("capability-qc")] },
  { slug: "industrial", name: "Industrial & protective", swatch: "ind", finishLabel: "Typical finish · anti-corrosive, high-build",
    description: "Anti-corrosive, high-durability and heat-resistant coatings for demanding assets — measured on salt-spray hours, adhesion and film integrity, not shade cards.",
    products: ["Anti-corrosive primer", "Epoxy floor coating", "Heat-resistant enamel", "PU topcoat"],
    relatedServices: [aref("capability-resin"), aref("capability-diagnose"), aref("capability-compliance")] },
  { slug: "wood", name: "Wood & furniture", swatch: "wood", finishLabel: "Typical finish · clear & pigmented, satin",
    description: "Clear and pigmented finishes, sealers and stains with the right feel and clarity — where grain, hand-feel and non-yellowing matter as much as protection.",
    products: ["NC / PU sealer", "Clear lacquer", "Wood stain", "Melamine finish"],
    relatedServices: [aref("capability-flask"), aref("capability-sourcing")] },
  { slug: "automotive", name: "Automotive & refinish", swatch: "auto", finishLabel: "Typical finish · high-gloss metallic",
    description: "Basecoats, topcoats and refinish systems where colour and gloss are unforgiving — flake orientation, distinctness-of-image and colour match leave no room to hide.",
    products: ["Metallic basecoat", "Clearcoat", "2K primer surfacer", "Refinish topcoat"],
    relatedServices: [aref("capability-resin"), aref("capability-qc")] },
  { slug: "construction", name: "Construction chemicals", swatch: "const", finishLabel: "Typical finish · textured, trowel-applied",
    description: "Wall putty, waterproofing and allied products built alongside your paint range — the adjacent SKUs that widen a dealer's basket and your margin.",
    products: ["Wall putty", "Waterproof coating", "Tile adhesive", "Crack filler"],
    relatedServices: [aref("capability-plant"), aref("capability-flask")] },
];

const approach = [
  { index: "Stage 01", title: "Diagnose", description: "Audit the formulation, process and QC data to find where cost, rejects or failure actually originate." },
  { index: "Stage 02", title: "Formulate", description: "Develop or correct the system against clear, agreed performance and cost targets." },
  { index: "Stage 03", title: "Validate", description: "Bench and pilot testing against relevant standards before a single production batch is made." },
  { index: "Stage 04", title: "Scale-up", description: "Transfer to production with documented protocols, so results hold batch after batch." },
];

// Cross-links wired here so linking is testable in both directions:
//   caseStudy -> sector (ref) + relatedServices (refs)
//   capability.relatedCaseStudies (reverse) is wired in the docs map below.
const cases = [
  { slug: "viscosity-drift-emulsion-line", tag: "Decorative emulsion · Western India", title: "Viscosity drift and heavy rework on a flagship emulsion line",
    challenge: "Batch-to-batch viscosity was swinging out of spec, driving reblends and rejects.",
    approach: "Reworked the thickener and dispersion system and rebuilt the in-process QC checks.",
    resultValue: "12% → <2%", resultNote: "Batch reject rate, within two production cycles",
    sector: sref("sector-architectural"),
    relatedServices: [aref("capability-optimise"), aref("capability-qc")],
    bodyDetail: pt([
      "The line ran a well-established interior emulsion, but viscosity was drifting batch to batch — enough that operators were reblending or rejecting a growing share of output.",
      "We audited the associative-thickener package and the dispersion stage first, then rebuilt the in-process QC checks around the two control points that actually moved the number.",
      "Within two production cycles the reject rate fell from around 12% to under 2%, with no change to raw-material cost.",
    ]) },
  { slug: "enamel-salt-spray-recovery", tag: "Protective enamel · South India", title: "An enamel failing salt-spray after a raw-material substitution",
    challenge: "A cost-driven binder swap had quietly destroyed corrosion performance.",
    approach: "Re-balanced the binder and additive package and re-qualified against ASTM B117.",
    resultValue: "500+ hrs", resultNote: "Salt-spray resistance restored, cost held flat",
    sector: sref("sector-industrial"),
    relatedServices: [aref("capability-resin"), aref("capability-diagnose")],
    bodyDetail: pt([
      "A cost-driven binder substitution had passed the usual checks but quietly gutted corrosion performance — the failure only showed up in the field.",
      "We reproduced the failure, re-balanced the binder and additive package, and re-qualified the system against ASTM B117 salt-spray.",
      "Corrosion resistance was restored to 500+ hours while holding the material cost that prompted the original swap.",
    ]) },
  { slug: "greenfield-putty-paint-plant", tag: "New plant · North India", title: "A putty and paint plant built with no prior formulation",
    challenge: "A new entrant with capital and a site, but no products or process.",
    approach: "Designed the line, developed three launch SKUs and commissioned first production.",
    resultValue: "3 SKUs", resultNote: "In market within the first commissioning phase",
    sector: sref("sector-construction"),
    relatedServices: [aref("capability-plant"), aref("capability-flask")],
    bodyDetail: pt([
      "The client had capital and a site but no products, no process and no formulation team — a true greenfield.",
      "We designed the line and equipment, developed three launch SKUs against clear market targets, and ran the commissioning batches.",
      "All three SKUs reached the market within the first commissioning phase.",
    ]) },
];

// reverse links: which case studies each service should list.
const serviceRelatedCases = {
  "capability-optimise": ["case-0"],
  "capability-qc": ["case-0"],
  "capability-resin": ["case-1"],
  "capability-diagnose": ["case-1"],
  "capability-plant": ["case-2"],
  "capability-flask": ["case-2"],
};

const insights = [
  { topic: "Resin selection", title: "Acrylic vs. styrene-acrylic vs. PU for exterior emulsions", excerpt: "A practical way to choose a binder when durability, cost and weathering all pull in different directions.", href: "#",
    publishedAt: "2025-02-11", readMinutes: 6,
    body: pt([
      "Choosing a binder for an exterior emulsion is rarely about a single 'best' chemistry — it is about which trade-offs you can afford to make.",
      "Pure acrylics lead on weathering and alkali resistance; styrene-acrylics trade some UV durability for cost; PU dispersions buy toughness and adhesion at a price. The right answer depends on the film's real service conditions.",
      "This note walks through a simple decision order — service environment, then durability floor, then cost ceiling — that keeps the choice defensible.",
    ]) },
  { topic: "Compliance", title: "Cutting VOC without losing scrub resistance", excerpt: "Where the trade-offs really sit when you reformulate for tighter emission limits and eco-labels.", href: "#",
    publishedAt: "2025-04-03", readMinutes: 5,
    body: pt([
      "Dropping VOC is easy until scrub resistance and open time start to suffer. The interesting work is holding performance while the solvent leaves.",
      "Coalescent choice, binder Tg and the thickener package all move together here — change one and you pay for it somewhere else.",
      "We cover the levers that give the most VOC reduction per unit of performance lost, and the ones that quietly cost far more than they save.",
    ]) },
  { topic: "Troubleshooting", title: "Why your batch viscosity drifts — five usual causes", excerpt: "A short field guide to the most common reasons a stable formula starts moving out of spec.", href: "#",
    publishedAt: "2025-05-22", readMinutes: 4,
    body: pt([
      "A formula that was stable for months can start drifting without any recipe change. Usually the recipe is innocent and the process is not.",
      "The five usual suspects: thickener hydration, dispersion energy, water quality, pigment lot variation, and temperature at let-down.",
      "This field guide gives a quick way to isolate which one is moving before you touch the formulation.",
    ]) },
];

// --- Build documents with deterministic ids ---------------------------------
const docs = [
  ...metrics.map((m, i) => ({ _id: `metric-${i}`, _type: "metric", order: i, ...m })),
  ...capabilities.map((c, i) => {
    const _id = `capability-${c.icon}`;
    const related = serviceRelatedCases[_id];
    return {
      _id,
      _type: "capability",
      order: i,
      ...c,
      slug: slug(slugify(c.title)),
      ...(related ? { relatedCaseStudies: related.map(aref) } : {}),
    };
  }),
  ...sectors.map((s, i) => ({
    _id: `sector-${s.slug}`,
    _type: "sector",
    order: i,
    ...s,
    slug: slug(s.slug),
  })),
  ...approach.map((a, i) => ({ _id: `approach-${i}`, _type: "approachStep", order: i, ...a })),
  ...cases.map((c, i) => ({
    _id: `case-${i}`,
    _type: "caseStudy",
    order: i,
    ...c,
    slug: slug(c.slug),
  })),
  ...insights.map((n, i) => ({
    _id: `insight-${slugify(n.title)}`,
    _type: "insight",
    order: i,
    ...n,
    slug: slug(slugify(n.title)),
  })),
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
