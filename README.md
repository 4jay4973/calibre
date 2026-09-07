# Calibre — Paint, Coating & Resin Technical Consultancy

Marketing site for a technical consultancy, built on **Next.js (App Router) + TypeScript**.
Bespoke CSS design system (no utility framework). Content is served through a
**CMS-ready data layer**, so the CMS can be added later without touching components.

> **Placeholder notice:** "Calibre" is a placeholder brand, and all copy, numbers
> and imagery are realistic placeholders for client presentation. Replace before launch.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Build / run production:

```bash
npm run build && npm start
```

Requirements: Node 18.18+ (Node 20 LTS recommended).

## Project structure

```
app/
  layout.tsx            Root layout, fonts (Archivo + Source Serif 4), metadata
  page.tsx              Homepage — composes the section components
  globals.css           The whole design system: tokens + component styles
components/
  site-header.tsx       Sticky header + mobile menu (client)
  site-footer.tsx
  ui/
    reveal.tsx          Scroll-reveal wrapper (client)
    count-up.tsx        Animated metric counter (client)
  sections/
    hero.tsx            Animated coating cross-section / DFT gauge
    metrics.tsx
    capabilities.tsx
    sector-showcase.tsx Interactive finish showcase (client)
    approach.tsx
    cases.tsx           Blinded case studies
    confidentiality.tsx
    about.tsx
    insights.tsx
    contact.tsx         Contact form (client; not yet wired to a backend)
lib/
  content/
    types.ts            Content models (map 1:1 to future CMS fields)
    data.ts             Placeholder content — realistic, domain-specific
    index.ts            Data-access layer: getSectors(), getCaseStudies(), ...
```

## Design system

All visual decisions live as CSS variables at the top of `app/globals.css`
(`--paper`, `--ink`, `--accent`, etc.) plus component classes. Change the palette
or type in one place. The identity is grounded in coatings **metrology** — layered
films, micron measurement, an ultramarine-pigment accent.

Fonts are loaded with `next/font` (self-hosted at build, no layout shift):
**Archivo** (display + UI, uses the width axis) and **Source Serif 4** (lead copy).

## Content & the CMS

Components never hard-code content — they call async getters in
`lib/content/index.ts`. Today those return local placeholder data from `data.ts`.

**To add the CMS (recommended: a hosted headless CMS such as Sanity):**

1. Model the content types from `types.ts` in the CMS (Sector, CaseStudy,
   Capability, Insight, Metric, ApproachStep). The shapes already match.
2. Add the CMS client (e.g. `lib/content/sanity.ts`).
3. Reimplement each getter in `index.ts` to fetch from the CMS, e.g.

   ```ts
   export async function getSectors(): Promise<Sector[]> {
     return sanityClient.fetch(
       `*[_type == "sector"] | order(order asc){
         "slug": slug.current, name, swatch, finishLabel, description, products
       }`
     );
   }
   ```

4. Delete `data.ts`. **No component changes required.**

If the client insists on WordPress, the same applies — point the getters at
WPGraphQL/REST with ACF fields matching `types.ts`.

## Before launch — checklist

- Replace brand, copy, metrics, case studies and imagery (or move to the CMS).
- Wire the contact form: add `app/api/contact/route.ts`, send via Resend (or
  similar), and add a honeypot + Cloudflare Turnstile for spam.
- Add real photography (lab, coated surfaces, equipment, consultant portrait).
- Generate `sitemap.ts` / `robots.ts`, add JSON-LD (Organization, Service, Article).
- Set canonical domain + Open Graph image, add analytics.
