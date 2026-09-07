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

The content is served from **Sanity**. Copy `.env.example` to `.env.local` and fill
in your project details (see [Content & the CMS](#content--the-cms)). Until a real
project is configured the getters return empty results, so `npm run build` still
succeeds without an account.

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
  studio/
    [[...tool]]/page.tsx  Embedded Sanity Studio, served at /studio
lib/
  content/
    types.ts            Content models (map 1:1 to CMS fields)
    sanity.ts           Typed Sanity client + GROQ queries
    index.ts            Data-access layer: getSectors(), getCaseStudies(), ...
sanity/
  env.ts                projectId / dataset / apiVersion from env
  schemaTypes/          Document schemas (mirror lib/content/types.ts)
sanity.config.ts        Studio configuration
scripts/
  seed.mjs              One-off import of the original placeholder content
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
`lib/content/index.ts`, which fetch from **Sanity** (`lib/content/sanity.ts`) with
ISR revalidation. The getters keep the exact types in `types.ts`, so the content
source is swappable without touching a single component.

The document schemas in `sanity/schemaTypes/` mirror `types.ts` one-to-one
(Sector, CaseStudy, Capability, Insight, Metric, ApproachStep), including the
`SwatchKind` / `IconKey` union options, plus an `order` field for display order.

### First-time setup

1. **Create a Sanity project** at [sanity.io/manage](https://www.sanity.io/manage)
   (or `npx sanity@latest init`). Note the **Project ID** and create a **dataset**
   (e.g. `production`).
2. **Configure env.** Copy the template and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   ```dotenv
   NEXT_PUBLIC_SANITY_PROJECT_ID="abcd1234"
   NEXT_PUBLIC_SANITY_DATASET="production"
   NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"
   SANITY_API_TOKEN="sk...."   # Editor token, seed script only
   ```

   Create the write token under **API → Tokens** (Editor permission). The
   `NEXT_PUBLIC_*` values are safe to expose; the token is **not** — keep it out of
   version control.
3. **Add CORS origins** for the Studio: in **API → CORS origins**, allow
   `http://localhost:3000` (and your production URL), with credentials.
4. **Seed the content** — imports the original placeholder copy so the site looks
   identical to before the swap:

   ```bash
   npm run seed
   ```

   (Re-runnable; it uses deterministic ids and overwrites.)
5. **Run the app.** Content now comes from Sanity, and the Studio is embedded at
   [http://localhost:3000/studio](http://localhost:3000/studio). Edit a document
   there, hit publish, and the page reflects it within the revalidation window
   (`revalidate`, default 60s — see `sanity/env.ts`).

### Rendering model

Pages stay **statically generated with ISR**: each getter tags its fetch with
`next: { revalidate }`, so the homepage is prerendered and regenerated on demand
rather than rendered dynamically per request.

If the client insists on WordPress instead, the same seam applies — reimplement the
getters in `index.ts` against WPGraphQL/REST with fields matching `types.ts`.

## Before launch — checklist

- Replace brand, copy, metrics, case studies and imagery in Sanity (`/studio`).
- Wire the contact form: add `app/api/contact/route.ts`, send via Resend (or
  similar), and add a honeypot + Cloudflare Turnstile for spam.
- Add real photography (lab, coated surfaces, equipment, consultant portrait).
- Generate `sitemap.ts` / `robots.ts`, add JSON-LD (Organization, Service, Article).
- Set canonical domain + Open Graph image, add analytics.
